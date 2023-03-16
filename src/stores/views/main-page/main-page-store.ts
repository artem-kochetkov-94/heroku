import { networkManager } from '../../chain-stores/network-manager'
import { makeAutoObservable } from 'mobx'
import {
  tetuTokenValuesStore,
  totalTetuBoughBack,
  totalTvlUsdcStore,
  vaultsStore,
} from '../../resources-stores/vaults-store'
import { metaMaskStore } from '../../meta-mask-store'
import { FetchResource } from '../../core'
import { VaultInfo } from '../../chain-stores/types'
import {
  balancerBoostCalculatorChainStore,
  contractReaderChainStore,
  tokenChainStore,
  transactionStorageStore,
} from '../../chain-stores'
import { namesManagerStore } from '../../utils/names-manager-store'
import { BigNumber as BigNumberEth, ethers } from 'ethers'
import { formatUnits } from '@ethersproject/units/lib.esm'
import { calcApr, sum } from '../../../utils'
import { vaultInfosFromTetuReaderServer } from '../../services'
import { userInfosStore } from '../../resources-stores'
import { calcAmount } from '../../../utils/amount'
import { addressesMap } from '../../../networks/Addresses'
import { calcAPY } from '../../../components/AprDetailedView'
import { SortType, VaultsFiltersStore } from './vault-filters-store'
import { tetuServerResources } from '../../../api/tetu-server'
import { vaults } from '../../../networks/Addresses/EthereumAddresses/constants'

class VaultInfosStore extends FetchResource<VaultInfo> {
  constructor() {
    super(
      (vaultAddresses: string[]) => contractReaderChainStore.getVaultInfos(vaultAddresses),
      undefined,
      true,
    )
  }
}
class VaultWithUserInfosStore extends FetchResource<any> {
  constructor() {
    super(
      (walletAddress: string, vaultAddresses: string[]) =>
        contractReaderChainStore.getVaultWithUserInfos(walletAddress, vaultAddresses),
      undefined,
      true,
    )
  }
}

class MainPageStore {
  private readonly vaultWithUserInfosStore = new VaultWithUserInfosStore()
  private readonly vaultInfosStore = new VaultInfosStore()
  private readonly metaMaskStore = metaMaskStore
  private readonly networkManager = networkManager
  private readonly namesManagerStore = namesManagerStore
  private readonly vaultsStore = vaultsStore
  private readonly tetuTokenValuesStore = tetuTokenValuesStore
  private readonly totalTvlUsdcStore = totalTvlUsdcStore
  private readonly totalTetuBoughBack = totalTetuBoughBack
  private readonly tokenChainStore = tokenChainStore
  private readonly transactionStorageStore = transactionStorageStore
  private readonly vaultInfosFromTetuReaderServer = vaultInfosFromTetuReaderServer
  private readonly balancerBoostCalculatorChainStore = balancerBoostCalculatorChainStore
  public readonly userInfosStore = userInfosStore
  public readonly vaultsFiltersStore = new VaultsFiltersStore()

  constructor() {
    makeAutoObservable(this)

    this.metaMaskStore.on('accountsChanged', () => {
      // this.isFetchedAllVaults = false
      // this.vaultWithUserInfosStore.reset()
      // this.vaultInfosStore.reset()
      this.userInfosStore.reset()
      this.fetchUserInfo()
    })

    try {
      //@ts-ignore
      const params = (new URL(document.location)).searchParams;
      const activeTab = params.get('activeTab')
      if (activeTab) {
        this.setActiveTab(activeTab)
      } else {
        this.setActiveTab('All')
      }
    } catch (e) {
      this.setActiveTab('All')
    }
  }

  checkClaimInterval: any = null
  intervalPeriod = 2000

  isFetchedAllVaults = false
  isLoadedTableData = false

  pendingClaimAssets = []
  isClaiming = false
  activeTab: string | null = 'All'
  networks: undefined | string[] = undefined

  get totalDeposits() {
    if (
      this.metaMaskStore.inited &&
      this.networkManager.inited &&
      this.metaMaskStore.walletAddress &&
      this.isLoadedTableData &&
      this.isFetchedAllVaults &&
      this.userInfosStore.isFetched
    ) {
      let list: string[] = []

      if (Object.keys(this.userInfosStore.storeMap).length === 0) {
        return
      }

      this.resourceStore.value?.forEach((item: any) => {
        const { addr, decimals } = item.vault
        // const userInfo: any = this.userInfosStore.storeMap[addr].value

        const userInfo: any = this.userInfosStore.storeMap[addr]?.value

        if (userInfo && userInfo.depositedUnderlyingUsdc !== '0') {
          list.push(userInfo.depositedUnderlyingUsdc)
        }
      })

      return calcAmount(list)
    }

    return null
  }

  get totalRewardsBoostToClaim() {
    if (
      !this.userInfosStore.isFetched ||
      this.userInfosStore.isFetching ||
      this.resourceStore.value === null
    ) {
      return null
    }

    const userInfos = Object.values(this.userInfosStore.storeMap)
    const items: any = {}

    userInfos.forEach((el: any) => {
      if (el.value === null) {
        return
      }

      const { rewardTokens, rewardsBoost, rewardsBoostUsdc } = el.value

      rewardTokens.forEach((token: string, index: number) => {
        if (token in items) {
          // @ts-ignore
          if (rewardsBoost[index] !== '0') {
            items[token].amount = calcAmount([items[token].amount, rewardsBoost[index]])
            items[token].amountUsdc = calcAmount([
              items[token].amountUsdc,
              // @ts-ignore
              rewardsBoostUsdc[index],
            ])
          }
        } else {
          items[token] = {
            token,
            amount: rewardsBoost[index],
            amountUsdc: rewardsBoostUsdc[index],
          }
        }
      })
    })

    return {
      total: sum(userInfos.map((store: any) => sum(store.value?.rewardsBoostUsdc))),
      items: Object.values(items),
    }
  }

  setDefaultActiveTab() {
    this.activeTab = this.networkManager.other.mainPage.vaultTabs[0]?.name
  }

  setActiveTab(tab: string) {
    this.activeTab = tab
  }

  async fetchData(networks?: string[]) {
    if (this.isFetchedAllVaults || this.resourceStore.isFetching) {
      return
    }

    if (!this.vaultsStore.isFetched) {
      await this.vaultsStore.fetch()
    }

    if (networks) {
      await this.vaultInfosFromTetuReaderServer.fetch(networks?.map((networkName: string) => {
        return tetuServerResources.reader.vaultInfos + `?network=${networkName}`;
      }))
    } else {
      await this.vaultInfosFromTetuReaderServer.fetch(this.networkManager.network.other.vaultsApi)
    }

    if (this.vaultInfosFromTetuReaderServer.value === null) {
      return null
    }

    // const whiteList = Object.keys(this.networkManager.addresses.vaultsWhiteList).map((el: string) =>
    //   el.toLowerCase(),
    // )

    await Promise.all(this.vaultInfosFromTetuReaderServer.value.map(async (el: any) => {
      const { rewardsApr, ppfsApr, decimals, underlyingVaults } = el.vault

      let apr = calcApr(rewardsApr ?? [], ppfsApr, decimals).toString()

      const swapFeesApr = parseFloat(el.vault.swapFeesAprDaily)

      const APY = Number(calcAPY(formatUnits(ppfsApr), 365))

      let totalApy = APY

      if (swapFeesApr > 0) {
        totalApy += Number(calcAPY(swapFeesApr, 365))
      }

      underlyingVaults?.forEach((vault: any) => {
        if (vault === null) {
          return
        }

        const { ppfsApr } = vault

        const underlingApr =
          el.vault.addr.toLowerCase() ===
            addressesMap.aliases.matic.config.addresses.vaults.dxTETU.toLowerCase()
            ? ppfsApr
            : BigNumberEth.from(ppfsApr).div(2).toString()

        totalApy += Number(calcAPY(formatUnits(underlingApr), 365))

        apr = calcAmount([apr, underlingApr])
      })

      rewardsApr.forEach((rewardApr: string) => {
        totalApy += Number(calcAPY(formatUnits(rewardApr)))
      })

      el.vault.totalApy = parseFloat(totalApy + '').toFixed(2)
      el.vault.totalApr = Number(formatUnits(apr))

      if (
        el.vault.platform === '24' &&
        (el.vault.network === 'ETH' || el.vault.networkName === 'ETH') &&
        el.vault.addr.toLowerCase() !== vaults.tetuBal.toLowerCase() && !networks
      ) {
        await this.balancerBoostCalculatorChainStore.getBalancerBoostInfo(el.vault.addr, el.vault);
      }

      // el.vault.testData = testData;

      if (swapFeesApr > 0) {
        el.vault.totalApr += swapFeesApr
      }
    }))

    await this.fetchUserInfo()

    this.isLoadedTableData = true
    this.isFetchedAllVaults = true
  }

  async fetchUserInfo() {
    if (!this.vaultsStore.isFetched) {
      await this.vaultsStore.fetch()
    }
    await this.userInfosStore.fetch(this.vaultsStore.value!)
  }

  async refetchUserInfo() {
    if (!this.vaultsStore.isFetched) {
      await this.vaultsStore.fetch()
    }
    if (this.vaultsFiltersStore.isOnlyDeposited) {
      await this.userInfosStore.refetch(this.vaultsStore.value!)
    } else {
      const vaults = this.tableData
        .filter((el: any) => el.vault.active)
        .map((el: any) => el.vault.addr)
      await this.userInfosStore.refetch(vaults)
    }
  }

  private get resourceStore() {
    return this.vaultInfosFromTetuReaderServer
  }

  resetFilters() {
    this.vaultsFiltersStore.resetFilters()
    this.setActiveTab('All')
  }

  resetData() {
    this.isFetchedAllVaults = false
    this.isLoadedTableData = false
    this.userInfosStore.reset()
    this.vaultWithUserInfosStore.reset()
    this.vaultInfosStore.reset()
    this.vaultsStore.reset()
    this.tetuTokenValuesStore.reset()
    this.totalTvlUsdcStore.reset()
    this.totalTetuBoughBack.reset()
    this.resourceStore.reset()
    this.vaultInfosFromTetuReaderServer.reset()
    // this.setDefaultActiveTab()
  }

  get currentNetworkData() {
    if (Array.isArray(this.resourceStore.value)) {
      const map = Object.keys(this.networkManager.addresses.vaultsWhiteList)
        .map((addr) => {
          return addr.toLowerCase()
        })
        .reduce((acc: any, item) => {
          acc[item] = item
          return acc
        }, {})

      return this.resourceStore.value
        .filter(el => el.vault.network === networkManager.network.other.networkName || el.vault.networkName === networkManager.network.other.networkName)
        .filter((el) => {
          return el.vault.addr.toLowerCase() in map
        })
    }
    return this.resourceStore.value || []
  }


  get data() {
    if (Array.isArray(this.resourceStore.value)) {
      const map = Object.keys(this.networkManager.globalWhiteListAddresses).map((addr) => {
        return addr.toLowerCase()
      })
        .reduce((acc: any, item) => {
          acc[item] = item
          return acc
        }, {})

      return this.resourceStore.value
        .filter((el) => {
          return el.vault.addr.toLowerCase() in map
        })
    }
    return this.resourceStore.value || []
  }

  get totalTvl() {
    return this.resourceStore.value?.reduce((a: any, b: any) => ethers.BigNumber.from(a).add(b.vault.tvlUsdc), ethers.BigNumber.from(0)) || ethers.BigNumber.from(0)
  }

  getVaultByAddress = (address: string) => {
    if (Array.isArray(this.resourceStore.value)) {
      return this.resourceStore.value.find((el) => {
        return el.vault.addr.toLowerCase() === address.toLowerCase()
      })
    }

    return null
  }

  get tableData() {
    return this.vaultsFiltersStore.applyFilterAndSort(this.currentNetworkData)
  };

  get totalCountOfVauts() {
    return this.vaultsStore.value?.length
  }

  handleChangeTable(pagination: any, filters: any, sorter: any, extra: any) {
    if (sorter.column === undefined) {
      this.vaultsFiltersStore.selectSort(SortType.tetuTokenAsc)
      return
    }

    const {
      column: { columnKey },
      order,
    } = sorter

    let postfix = 'Asc'

    if (order === 'ascend') {
      postfix = 'Asc'
    }

    if (order === 'descend') {
      postfix = 'Desc'
    }

    const sortType = columnKey + postfix
    this.vaultsFiltersStore.selectSort(sortType as SortType)
  }

  // deprecated
  // async claimAll() {
  //   if (this.isClaiming) {
  //     return
  //   }
  //
  //   this.isClaiming = true
  //
  //   if (this.autoClaimValue === '' || parseFloat(this.autoClaimValue) < 1) {
  //     const filtred = this.tableData.filter((el: any) => {
  //       const sumOfRewards = el.user.rewardsBoostUsdc.reduce((acc: string, item: string) => {
  //         return BigNumber.sum(acc, item).toString()
  //       }, '0')
  //       return parseFloat(formatUnits(sumOfRewards)) > 1
  //     })
  //     // @ts-ignore
  //     this.pendingClaimAssets = filtred.map((el: any) => el.vault.addr)
  //
  //     await Promise.allSettled(
  //       filtred.map((el: any) => this.tokenChainStore.getAllRewardsToVault(el.vault.addr)),
  //     )
  //
  //     this.startCheckPooling()
  //   } else {
  //     // @ts-ignore
  //     this.pendingClaimAssets = this.tableData.map((el: any) => el.vault.addr)
  //
  //     await Promise.allSettled(
  //       this.tableData.map((el: any) => this.tokenChainStore.getAllRewardsToVault(el.vault.addr)),
  //     )
  //     this.startCheckPooling()
  //   }
  // }

  checkPendingClaim() {
    const allTxAdresses = Object.values(this.transactionStorageStore.getData()).map(
      (el: any) => el.vaultAddress,
    )

    this.pendingClaimAssets = this.pendingClaimAssets.filter((asset: any) => {
      return allTxAdresses.includes(asset)
    })

    if (this.pendingClaimAssets.length === 0) {
      this.endCheckPooling()
      this.vaultsFiltersStore.autoClaimValue = ''
      this.isClaiming = false
      this.isFetchedAllVaults = false
      this.vaultWithUserInfosStore.reset()
      this.fetchData()
    }
  }

  startCheckPooling() {
    this.checkClaimInterval = setInterval(() => this.checkPendingClaim(), this.intervalPeriod)
  }

  endCheckPooling() {
    clearInterval(this.checkClaimInterval)
    this.checkClaimInterval = null
  }
}

export const mainPageStore = new MainPageStore()
