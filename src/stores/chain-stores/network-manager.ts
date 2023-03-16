import { makeAutoObservable } from 'mobx'
import { addressesMap } from '../../networks/Addresses'
import { metaMaskStore } from '../meta-mask-store'

const errorMessage = 'We do not support the network ${name}\nPlease, connect to: rinkeby, matic'

class NetworkManager {
  private metaMaskStore: typeof metaMaskStore | null = null
  private readonly defaultChainId = addressesMap.aliases.matic.config.network.chainId
  private addressesMap = addressesMap
  private mainPageStore: any = null

  error: string | null = null
  networkId: string | null = this.defaultChainId
  inited = false

  async importMainPageStore() {
    const module = await import('../../stores/views/main-page/main-page-store')
    this.mainPageStore = module.mainPageStore
  }

  constructor() {
    makeAutoObservable(this)

    setTimeout(async () => {
      this.metaMaskStore = metaMaskStore
      await this.importMainPageStore()

      if (window?.ethereum) {
        window?.ethereum
          ?.request({ method: 'eth_chainId' })
          .then((chainId: string) => {
            if (chainId in this.addressesMap) {
              this.networkId = chainId
            } else {
              if (metaMaskStore.walletAddress) {
                metaMaskStore.openSwitchNetworkModal()
              }
              this.networkId = this.defaultChainId
            }
            this.inited = true
          })
          .catch((err: string) => {
            console.log('err', err)
          })
      } else {
        this.networkId = this.defaultChainId
        this.inited = true
      }
    }, 0)
  }

  async setNetworkId(chainId: string, cb?: Function) {
    // setTimeout(async () => {
    const map = { [addressesMap.aliases.matic.config.network.chainId]: addressesMap.aliases.matic }

    if (
      Object.keys(addressesMap)
        .map((el) => el.toLowerCase())
        .includes(chainId)
    ) {
      const changeNetwork = async () => {
        this.error = null
        this.networkId = chainId
        if (this.mainPageStore === null) {
          await this.importMainPageStore()
        }
        // @ts-ignore
        // this.mainPageStore.setActiveTab(this.other.mainPage.vaultTabs[0].name)
        // this.mainPageStore.setActiveTab('All')

        if (cb) cb()
      }

      if (this.metaMaskStore?.walletAddress) {
        await this.metaMaskStore!.changeNetwork(chainId)
        changeNetwork()
      } else {
        changeNetwork()
      }
    } else {
      const changeNetwork = async () => {
        this.networkId = this.defaultChainId
        if (this.mainPageStore === null) {
          await this.importMainPageStore()
        }
        // this.error = errorMessage
        // @ts-ignore
        // this.mainPageStore.setActiveTab(this.other.mainPage.vaultTabs[0].name)
        // this.mainPageStore.setActiveTab('All')
      }

      if (this.metaMaskStore?.walletAddress) {
        this.metaMaskStore!.changeNetwork(this.defaultChainId)
          .then(() => changeNetwork())
          .catch(() => { })
      } else {
        changeNetwork()
      }
    }
    // }, 0)
  }

  get network() {
    // @ts-ignore
    return this.addressesMap[this.networkId]?.config?.network
  }

  get networkAddresses() {
    // @ts-ignore
    return this.addressesMap[this.networkId]?.config?.addresses
  }

  get addresses() {
    // @ts-ignore
    return this.addressesMap[this.networkId]?.config?.addresses
  }

  getAddressesByNetworkName(networkName: string) {
    switch (networkName) {
      case addressesMap.aliases.bsc.config.network.other.networkName: {
        return addressesMap.aliases.bsc.config?.addresses;
      }
      case addressesMap.aliases.eth.config.network.other.networkName: {
        return addressesMap.aliases.eth.config?.addresses;
      }
      // case addressesMap.aliases.fantom.config.network.other.networkName: {
      //   return addressesMap.aliases.fantom.config?.addresses;
      // }
      case addressesMap.aliases.matic.config.network.other.networkName: {
        return addressesMap.aliases.matic.config?.addresses;
      }
    }
  }

  get globalWhiteListAddresses() {
    return Object.assign(
      addressesMap.aliases.bsc.config.addresses.vaultsWhiteList,
      addressesMap.aliases.eth.config.addresses.vaultsWhiteList,
      // addressesMap.aliases.fantom.config.addresses.vaultsWhiteList,
      addressesMap.aliases.matic.config.addresses.vaultsWhiteList,
    )
  }

  getVaultSymbolNameAddressesByNetworkName(networkName: string) {
    const addresess = this.getAddressesByNetworkName(networkName);

    return addresess?.vaultSymbolName!;
  }

  get contractReaderAddr() {
    return this.addresses?.core.contractReader
  }

  get utilsAddr() {
    return this.addresses?.core.utils
  }

  get TetuTokenAddr() {
    return this.addresses?.core.TetuToken
  }

  get web3providerAddr() {
    return this.addresses?.network?.other?.web3Provider
  }

  get usdcAddr() {
    return this.addresses?.assets?.usdc
  }

  get buyTetu() {
    if (this.networkId === '0x38') {
      return 'https://www.cone.exchange/swap';
    }
    const inputCurrency = this.usdcAddr
    const outputCurrency = this.TetuTokenAddr
    return 'https://app.openocean.finance/CLASSIC#/POLYGON/USDC/TETU'
  }

  // get isFantomNetwork() {
  //   return this.networkId === addressesMap.aliases.fantom.config.network.chainId
  // }

  get isMaticNetwork() {
    return this.networkId === addressesMap.aliases.matic.config.network.chainId
  }

  get blockPeriods() {
    const { blockPeriod: block_period } = this.network.other
    const block_at_min_period = 60 / block_period
    const block_at_hour_period = 60 * block_at_min_period
    const block_at_day_period = 24 * block_at_hour_period

    return {
      block_period,
      block_at_min_period,
      block_at_hour_period,
      block_at_day_period,
    }
  }

  get other() {
    // @ts-ignore
    return this.addressesMap[this.networkId]?.config?.other
  }
}

export const networkManager = new NetworkManager()
