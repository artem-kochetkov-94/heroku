import { formatUnits, parseUnits } from '@ethersproject/units'
import { makeAutoObservable } from 'mobx'
import { otherPlatforms, platformNameMap } from '../../../components/VaultRow'
import { metaMaskStore } from '../../meta-mask-store'
import { userInfosStore } from '../../resources-stores'
import { namesManagerStore } from '../../utils/names-manager-store'
import {
  sortTetuToken,
  sortUserBalance,
  sortUserRewards,
  sortVaultApr,
  sortVaultCreated,
  sortVaultsName,
  sortVaultsTvl,
} from './utils'
import { BigNumber } from 'bignumber.js'
import { BigNumber as BigNumberEth } from 'ethers'
import { compareAmount } from '../../../pages/Vault/components/DepositAndWithdraw/utils'
import compose from 'compose-function'
import { networkManager } from '../../chain-stores'
import { sum } from '../../../utils/vaults'
import { getVaultSymbolName } from '../../../utils'

export enum SortType {
  // defaultSort = 'defaultSort',
  tetuTokenAsc = 'tetuTokenAsc',
  nameAsc = 'nameAsc',
  nameDesc = 'nameDesc',
  tvlAsc = 'tvlAsc',
  tvlDesc = 'tvlDesc',
  aprAsc = 'aprAsc',
  aprDesc = 'aprDesc',
  createdAsc = 'createdAsc',
  createdDesc = 'createdDesc',
  balanceAsc = 'balanceAsc',
  balanceDesc = 'balanceDesc',
  rewardsAsc = 'rewardsAsc',
  rewardsDesc = 'rewardsDesc',
}

export class VaultsFiltersStore {
  private readonly namesManagerStore = namesManagerStore
  private readonly userInfosStore = userInfosStore
  private readonly metaMaskStore = metaMaskStore
  private readonly networkManager = networkManager

  // filters
  searchByName = ''
  selectedPlatform = 'all'
  selectedAsset: string[] = []
  isOnlyDeposited = false
  isOnlyDeactivated = false
  isNewVaultsFirst = false
  isOnlyStablecoins = false
  isOnlyBlueChips = false
  isOnlySingleVault = false
  isOnlyAutocompondVaults = false
  // sort
  selectedSort: SortType = SortType.tetuTokenAsc
  autoClaimValue = ''

  resetFilters() {
    this.autoClaimValue = ''
    this.searchByName = ''
    this.selectedPlatform = 'all'
    this.selectedAsset = []
    this.selectedSort = SortType.tetuTokenAsc
    this.isOnlyDeposited = false
    this.isOnlyDeactivated = false
    this.isNewVaultsFirst = false
    this.isOnlyStablecoins = false
    this.isOnlyBlueChips = false
    this.isOnlySingleVault = false
    this.isOnlyAutocompondVaults = false
  }

  constructor() {
    makeAutoObservable(this)

    try {
      //@ts-ignore
      const params = (new URL(document.location)).searchParams;
      const searchByName = params.get('searchByName')
      const selectedPlatform = params.get('selectedPlatform')
      const selectedAsset = params.get('selectedAsset')
      const isOnlyDeposited = params.get('isOnlyDeposited')
      const isOnlyDeactivated = params.get('isOnlyDeactivated')
      const isNewVaultsFirst = params.get('isNewVaultsFirst')
      const isOnlyStablecoins = params.get('isOnlyStablecoins')
      const isOnlyBlueChips = params.get('isOnlyBlueChips')
      const isOnlySingleVault = params.get('isOnlySingleVault')
      const isOnlyAutocompondVaults = params.get('isOnlyAutocompondVaults')

      const selectedSort = params.get('selectedSort')

      if (searchByName) {
        this.searchByName = searchByName;
      }
      if (selectedPlatform) {
        this.selectedPlatform = selectedPlatform;
      }
      if (isOnlyDeposited === 'true') {
        this.isOnlyDeposited = true;
      }
      if (isOnlyDeactivated === 'true') {
        this.isOnlyDeactivated = true;
      }
      if (isNewVaultsFirst === 'true') {
        this.isNewVaultsFirst = true;
      }
      if (isOnlyStablecoins === 'true') {
        this.isOnlyStablecoins = true;
      }
      if (isOnlyBlueChips === 'true') {
        this.isOnlyBlueChips = true;
      }
      if (isOnlySingleVault === 'true') {
        this.isOnlySingleVault = true;
      }
      if (isOnlyAutocompondVaults === 'true') {
        this.isOnlyAutocompondVaults = true;
      }
      if (selectedAsset) {
        this.selectedAsset = selectedAsset.split(',');
      }
      if (selectedSort) {
        this.selectedSort = selectedSort as SortType;
      }
    } catch (e) {

    }
  }

  setAutoClaimValue(value: string) {
    this.autoClaimValue = value
  }

  setSearchByName(value: string) {
    this.searchByName = value
  }

  setIsOnlyDeposited(value: boolean) {
    this.isOnlyDeposited = value
  }

  setIsOnlyDeactivated(value: boolean) {
    this.isOnlyDeactivated = value
  }

  setIsOnlyAutocompondVaults(value: boolean) {
    this.isOnlyAutocompondVaults = value
  }

  setIsOnlySingleVaults(value: boolean) {
    this.isOnlySingleVault = value
  }

  setIsNewVaultsFirst(value: boolean) {
    this.isNewVaultsFirst = value
  }

  setIsOnlyStablecoins(value: boolean) {
    this.isOnlyStablecoins = value
  }

  setIsOnlyBlueChips(value: boolean) {
    this.isOnlyBlueChips = value
  }

  selectPlattform(platform: string) {
    this.selectedPlatform = platform
  }

  clearPlatforrm() {
    this.selectedPlatform = "all"
  }

  selectAsset(assets: string[]) {
    this.selectedAsset = [...assets]
  }

  clearAsset() {
    this.selectedAsset = []
  }

  selectSort(sortType: SortType) {
    this.selectedSort = sortType
  }

  private filterByPlatform(data: any) {
    if (this.selectedPlatform === 'all') {
      return data
    }

    if (this.selectedPlatform === 'other') {
      return data.filter((item: any) => {
        return otherPlatforms.includes(item.vault.platform)
      })
    }
    // @ts-ignore
    const selectedPlatformName = platformNameMap[this.selectedPlatform]

    return data.filter((item: any) => {
      return (
        // @ts-ignore
        platformNameMap[item.vault.platform] === selectedPlatformName ||
        item.vault?.subStrategies
          // @ts-ignore
          ?.map((el: any) => platformNameMap[el.platform])
          .includes(selectedPlatformName)
      )
    })
  }

  private filterByAssets(data: any) {
    if (this.selectedAsset.length === 0) {
      return data
    }

    return data.filter((item: any) => {
      if (item.vault.assets.length < this.selectedAsset.length) {
        return false
      }

      const itemsInclude = item.vault.assets.map((asset: string) => {
        return this.selectedAsset.includes(this.namesManagerStore.getAssetName(asset))
      })

      return !itemsInclude.includes(false)
    })
  }

  private filterByIsOnlyDeposited(data: any) {
    if (this.isOnlyDeposited) {
      return data.filter((item: any) => {
        if (this.metaMaskStore.walletAddress && this.userInfosStore.isFetched) {
          const { addr } = item.vault
          const userInfo = this.userInfosStore.storeMap[addr].value

          if (
            // @ts-ignore
            userInfo?.depositedUnderlyingUsdc !== '0'
          ) {
            return true
          }
        } else {
          return false
        }
      })
    }

    return data
  }

  private filterByIsOnlyDeactivated(data: any) {
    if (this.isOnlyDeactivated) {
      return data.filter((item: any) => {
        return item.vault.active !== true
      })
    }

    return data
  }

  filterByIsOnlyStablecoins(data: any) {
    if (this.isOnlyStablecoins) {
      const list = this.networkManager.addresses.stableCoins.map((el: string) => el.toLowerCase())
      return data.filter((item: any) => {
        const includes = item.vault.assets.map((asset: string) => {
          return list.includes(asset.toLowerCase())
        })
        return !includes.includes(false)
      })
    }

    return data
  }

  filterByIsBlueChips(data: any) {
    if (this.isOnlyBlueChips) {
      const list = [
        ...this.networkManager.addresses.blueChips,
        ...this.networkManager.addresses.stableCoins,
      ].map((el) => el.toLowerCase())

      return data.filter((item: any) => {
        const includes = item.vault.assets.map((asset: string) => {
          return list.includes(asset.toLowerCase())
        })
        return !includes.includes(false)
      })
    }

    return data
  }

  private filterByIsOnlyAutocompondVaults(data: any) {
    if (this.isOnlyAutocompondVaults) {
      return data.filter((el: any) => {
        return el.vault.buyBackRatio === '100'
      })
    }

    return data
  }

  private filterIsOnlySingleVaults(data: any) {
    if (this.isOnlySingleVault) {
      return data.filter((el: any) => {
        return el.vault.assets.length === 1
      })
    }

    return data
  }

  private sort(data: any) {
    const userInfos = this.userInfosStore.isFetched ? this.userInfosStore.storeMap : null

    if (this.isNewVaultsFirst) {
      return sortVaultCreated(data)
    }

    switch (this.selectedSort) {
      case SortType.tetuTokenAsc:
        return sortTetuToken(data)
      case SortType.nameAsc:
        return sortVaultsName(data)
      case SortType.nameDesc:
        return sortVaultsName(data).reverse()

      case SortType.tvlAsc:
        return sortVaultsTvl(data)
      case SortType.tvlDesc:
        return sortVaultsTvl(data).reverse()

      case SortType.aprAsc:
        return sortVaultApr(data)
      case SortType.aprDesc:
        return sortVaultApr(data).reverse()

      case SortType.createdAsc:
        return sortVaultCreated(data)
      case SortType.createdDesc:
        return sortVaultCreated(data).reverse()

      case SortType.balanceAsc:
        return sortUserBalance(data, userInfos)
      case SortType.balanceDesc:
        return sortUserBalance(data, userInfos).reverse()

      case SortType.rewardsAsc:
        return sortUserRewards(data, userInfos)
      case SortType.rewardsDesc:
        return sortUserRewards(data, userInfos).reverse()
    }
  }

  private filterUserRewardsUsdc(data: any) {
    if (this.autoClaimValue === '') {
      return data
    }

    const autoClaimValue = parseUnits(this.autoClaimValue).toString()

    return data.filter((el: any) => {
      if (this.metaMaskStore.walletAddress && this.userInfosStore.isFetched) {
        const { addr } = el.vault
        if (this.userInfosStore.storeMap[addr] === undefined) {
          return false
        }

        const userInfo = this.userInfosStore.storeMap[addr].value

        // @ts-ignore
        const sumOfRewards = userInfo.rewardsBoostUsdc.reduce((acc: string, item: string) => {
          return BigNumber.sum(acc, item).toString()
        }, '0')

        return compareAmount(sumOfRewards, autoClaimValue)
      } else {
        return false
      }
    })
  }

  private filterDeactivated(data: any) {
    if (this.isOnlyDeactivated) {
      return data
    }

    return data.filter((el: any) => {
      if (el.vault?.active) {
        return true
      }

      if (
        this.metaMaskStore.walletAddress &&
        this.userInfosStore.isFetched &&
        el.vault?.active === false
      ) {
        const { addr } = el.vault

        // @ts-ignore
        if (this.userInfosStore.storeMap[addr] === undefined) {
          return false
        }

        const userInfo = this.userInfosStore.storeMap[addr].value

        if (
          // @ts-ignore
          userInfo?.depositedUnderlyingUsdc !== '0' ||
          // @ts-ignore
          Number(parseFloat(formatUnits(sum(userInfo.rewardsBoostUsdc))).toFixed(2)) > 0.01
        ) {
          return true
        }
      }
    })
  }

  private filterByName(data: any) {
    if (this.searchByName === '') {
      return data
    }

    return data.filter((item: any) => {
      let isIncluded = false

      const getName = () => {
        // const formatedName = formatVaultName(item.vault.addr!)
        // const isSymbolName = this.networkManager.addresses.vaultSymbolName
        //   .map((el: any) => el.toLowerCase())
        //   .includes(item.vault?.addr?.toLowerCase())

        let vaultName = getVaultSymbolName(item.vault?.addr);

        if (!vaultName) {
          vaultName = item.vault.assets
            .map((asset: any) => this.namesManagerStore.getAssetName(asset))
            .join('-')
        }
        return vaultName
      }

      if (getName().toLowerCase().includes(this.searchByName.toLowerCase())) {
        isIncluded = true
      }

      return isIncluded
    })
  }

  applyFilterAndSort(data: any) {
    if (data === null) {
      return data
    }

    return compose(
      this.sort.bind(this),
      // this.filterByExcluded.bind(this),
      this.filterByPlatform.bind(this),
      this.filterByAssets.bind(this),
      this.filterByName.bind(this),
      this.filterByIsOnlyDeposited.bind(this),
      this.filterByIsOnlyDeactivated.bind(this),
      this.filterDeactivated.bind(this),
      this.filterUserRewardsUsdc.bind(this),
      this.filterByIsOnlyStablecoins.bind(this),
      this.filterByIsBlueChips.bind(this),
      this.filterByIsOnlyAutocompondVaults.bind(this),
      this.filterIsOnlySingleVaults.bind(this),
    )(data)
  }
}
