import { makeAutoObservable } from 'mobx'
import Web3Modal from 'web3modal'
import Web3 from 'web3'
import { networkManager } from './chain-stores/network-manager'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import { addressesMap } from '../networks/Addresses'
import { parseUnits } from 'ethers/lib/utils'
import { LocalStorage } from './core/localStorage'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'

class Web3Store {
  web3modal: Web3Modal | null = null

  private readonly networkManager = networkManager
  private nativeCurrencyBalance: any = null
  private cache = new LocalStorage('@tetu-gas-price')

  provider = null

  gasPrice: any = undefined

  get web3() {
    const networkName = this.networkManager.network?.chainName

    const map = {
      [addressesMap.aliases.matic.config.network.chainName]: createAlchemyWeb3(
        process.env.REACT_APP_WEB_3_URL_MATIC!,
        { maxRetries: 8 },
      ),
      // [addressesMap.aliases.fantom.config.network.chainName]: new Web3(
      //   process.env.REACT_APP_WEB_3_URL_FANTOM!,
      // ),
      [addressesMap.aliases.bsc.config.network.chainName]: new Web3(
        process.env.REACT_APP_WEB_3_URL_BSC!,
      ),
      [addressesMap.aliases.eth.config.network.chainName]: new Web3(
        process.env.REACT_APP_WEB_3_URL_ETH!,
      ),
    }

    // @ts-ignore
    return map[networkName]
  }

  getNetworkName() {
    return this.networkManager?.network?.chainName ?? '';
  }

  get web3WithProvider() {
    return new Web3(this.provider)
  }

  async getGasPrice() {
    const url = `${this.networkManager.network.other.gasApi}?apikey=${process.env.REACT_APP_OWLRACLE_API_KEY}`
    const postFix = '/getGasPrice'
    const cacheKey = this.networkManager.network.chainId + postFix

    if (this.networkManager.network.chainId == '0x38') {
      this.gasPrice = parseUnits('5', 'gwei').toString();
    } else {
      // try {
      //   const response: any = await axios.get(url)
      //   const gasPrice = parseUnits(response.data.speeds[2].gasPrice + '', 'gwei').toString()
      //   this.gasPrice = gasPrice
      //   // @ts-ignore
      //   this.cache.setItem(cacheKey, gasPrice)
      // } catch (e) {
      //   const defaultValues = {
      //     [maticAddresses.config.network.chainId + postFix]: parseUnits(
      //       '42.680008587',
      //       'gwei',
      //     ).toString(),
      //     // [fantomAddresses.config.network.chainId + postFix]: parseUnits('601.65', 'gwei').toString(),
      //     [bscAddresses.config.network.chainId + postFix]: parseUnits('5', 'gwei').toString(),
      //   }
      //
      //   if (!this.cache.getItem(cacheKey)) {
      //     // @ts-ignore
      //     this.cache.setItem(cacheKey, defaultValues[cacheKey])
      //   }
      //
      //   this.gasPrice = this.cache.getItem(cacheKey)
      if (this.provider) {
        // this.gasPrice = await this.web3WithProvider.eth.getGasPrice()
        // this.gasPrice = parseUnits('44', 9).toString()
      }
    }
    // }
  }

  async sendTransactionStaticCall(args: any): Promise<string> {
    return new Promise(res => {
      this.web3WithProvider.eth
        .call(
          {
            ...args,
          },
          (err) => {
            if (err) {
              return res(err.message)
            }
            res('')
          },
        )
        .then(() => {
          res('')
        })
        .catch((err) => {
          res(err)
        })
    })
  }

  async sendTransaction(args: any): Promise<string> {
    // await this.getGasPrice();
    const gas = await this.web3WithProvider.eth.getGasPrice();
    return new Promise((res, rej) => {
      this.web3WithProvider.eth
        .sendTransaction(
          {
            ...args,
            gasPrice: gas,
          },
          (err, transactionHash) => {
            if (err) {
              return rej(err)
            }
            res(transactionHash)
          },
        )
        .then((transactionReceipt) => {
          this.nativeCurrencyBalance.getBalance()
          res(transactionReceipt.transactionHash)
        })
        .catch((err) => {
          rej(err)
        })
    })
  }

  async connect() {
    const providers = {
      walletlink: {
        package: CoinbaseWalletSDK,
        options: {
          appName: 'Tetu App',
          infuraId: `${process.env.REACT_APP_INFURA_KEY}`,
          rpc: {
            137: `${process.env.REACT_APP_WEB_3_URL_MATIC}`,
            // 250: `${process.env.REACT_APP_WEB_3_URL_FANTOM}`,
            56: `${process.env.REACT_APP_WEB_3_URL_BSC}`,
            1: `${process.env.REACT_APP_WEB_3_URL_ETH}`,
          },
          supportedChainIds: [137, 56, 1],
        },
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: `${process.env.REACT_APP_INFURA_KEY}`,
          rpc: {
            137: `${process.env.REACT_APP_WEB_3_URL_MATIC}`,
            // 250: `${process.env.REACT_APP_WEB_3_URL_FANTOM}`,
            56: `${process.env.REACT_APP_WEB_3_URL_BSC}`,
            1: `${process.env.REACT_APP_WEB_3_URL_ETH}`,
          },
          supportedChainIds: [137, 56, 1],
        },
      },
    };

    if (window.navigator.userAgent.indexOf("OPR") > -1 || window.navigator.userAgent.indexOf("Opera") > -1) {
      // @ts-ignore
      providers['opera'] = {
        package: true,
      }
    }

    this.web3modal = new Web3Modal({
      cacheProvider: true,
      providerOptions: providers,
    })

    import('./views/main-page/main-page-store').then((module) => {
      // module.mainPageStore.setActiveTab('All')
    })

    const provider = await this.web3modal.connect().catch(() => { })
    this.provider = provider

    return provider
  }

  disconnect() {
    if (this.web3modal) {
      this.web3modal.clearCachedProvider()
      this.provider = null
    }
  }

  constructor() {
    import('./views/native-currecncy-balance').then((res) => {
      this.nativeCurrencyBalance = res.nativeCurrencyBalance
    })
    makeAutoObservable(this)
    this.connect()
    // this.getGasPrice()
  }
}

export const web3Store = new Web3Store()
