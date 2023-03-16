import {makeAutoObservable} from 'mobx'
import {ethers, Contract, providers} from 'ethers'
import {web3Store} from './web3-store'
import {appStore} from './app-store'
import {networkManager} from './chain-stores/network-manager'
import {addressesMap} from '../networks/Addresses'
import Web3Analytics from "analytics-web3";

const checkForToken = async (token: any) => {
  // The minimum ABI to get ERC20 Token balance
  const minABI = [
    // balanceOf
    {
      constant: true,
      inputs: [{name: '_owner', type: 'address'}],
      name: 'balanceOf',
      outputs: [{name: 'balance', type: 'uint256'}],
      type: 'function',
    },
    // decimals
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [{name: '', type: 'uint8'}],
      type: 'function',
    },
  ]
  // Get ERC20 Token contract instance
  const contract = new Contract(token.address, minABI, providers.getDefaultProvider())
  // calculate a balance
  const balance = await contract.balanceOf(appStore.address)
  return parseInt(balance, 16)
}

enum MetamaskEvents {
  chainChanged = 'chainChanged',
  accountsChanged = 'accountsChanged',
  init = 'init',
  connect = 'connect',
}

class MetaMaskStore {
  private readonly web3Store = web3Store
  private readonly appStore = appStore
  private readonly networkManager = networkManager

  isUserOnPage = true
  inited = false

  walletAddress: string | null = null
  networkName = ''

  isConnecting = false
  tokenAddedMessage = ''

  provider: any = null
  ethersProvider: any = null
  isShowModalSwitchNetwork = false

  get isConnected() {
    return this.provider !== null
  }

  constructor() {
    makeAutoObservable(this)

    if (this.web3Store.web3modal?.cachedProvider) {
      this.connectMetaMask().then(() => {
        this.inited = true
      })
    } else {
      this.inited = true
    }
  }

  private subscribeProvider(provider: any) {
    window.ethereum.on('accountsChanged', async (accounts: any) => {
      await this.connectMetaMask()
      this.callHandlers(MetamaskEvents.accountsChanged)
    })
    // provider.on('accountsChanpged', async (accounts: any) => {
    //   await this.connectMetaMask()
    //   this.callHandlers(MetamaskEvents.accountsChanged)
    // })
    // provider.on('chainChanged', this.getNetwork.bind(this))
    provider.on('chainChanged', async (chainId: string) => {
      await this.connectMetaMask()
      // if (this.isUserOnPage) {
      //   this.networkManager.setNetworkId(chainId)
      // }
    })
  }

  private readonly handlers: any = {
    accountsChanged: [],
    init: [],
  }

  on(event: keyof typeof MetamaskEvents, handler: Function) {
    if (!Array.isArray(this.handlers[event])) {
      this.handlers[event] = []
    }
    this.handlers[event].push(handler)
  }

  callHandlers(event: MetamaskEvents) {
    this.handlers[event]?.forEach((handler: Function) => {
      handler({chainId: this.provider?.chainId})
    })
  }

  disconnect() {
    if (this.ethersProvider?.provider?.close) {
      this.ethersProvider.provider.close()
    }
    this.web3Store.web3modal?.clearCachedProvider()
    this.ethersProvider = null
    this.provider = null
    this.appStore.setAddress(null)
    this.setWalletAddress(null)
  }

  setTokenAddedMessage(message: string) {
    this.tokenAddedMessage = message
  }

  setWalletAddress(address: string | null) {
    this.walletAddress = address
  }

  getBalance() {
    this.web3Store.web3.eth
      // @ts-ignore
      .getBalance(this.walletAddress!, (err, balance) => {
        // this.balance = this.web3.fromWei(balance, "ether") + " ETH"
      })
      .catch(console.log)
  }

  async getNetwork() {
    const provider = await this.web3Store.provider!
    // this.ethersProvider = new ethers.providers.Web3Provider(provider)
    const network = await this.ethersProvider.getNetwork()
    this.networkName = network.name
    return network.name
  }

  async setProvider(provider: any) {
    this.ethersProvider = new ethers.providers.Web3Provider(provider)
    const signer = this.ethersProvider.getSigner()
    this.provider = provider

    try {
      const address = await signer.getAddress()
      this.setWalletAddress(address)
      await this.getNetwork()
    } catch (error) {
      console.log(error)
    }
  }

  async changeNetwork(chainId: string, cb?: Function) {
    if (this.walletAddress) {
      try {
        await window?.ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId}],
        })
        if (cb) cb()
      } catch (switchError: any) {
        console.log('switchError', switchError)
        if (switchError.code === 4902) {
          try {
            await window?.ethereum?.request({
              method: 'wallet_addEthereumChain',
              params: [
                // @ts-ignore
                addressesMap[chainId].config.network,
              ],
            })
          } catch (addError) {
            console.log('addError', addError)
          }
        }

        if (switchError.code === 4001 || switchError.message === 'User rejected the request.') {
          this.disconnect()
          // this.openSwitchNetworkModal()
        }
      }
    }
  }

  async connectMetaMask() {
    this.isConnecting = true
    const provider = await this.web3Store.connect()
    const chainId = provider?.chainId

    if (this.isUserOnPage) {
      handlePageFocus(chainId)
      this.networkManager.setNetworkId(chainId)
      this.callHandlers(MetamaskEvents.connect)
    }

    if (!provider) {
      // this.errorModalStore.open(
      //     'No provider, please install a supported Web3 wallet.',
      //     'error',
      // )
    } else {
      this.subscribeProvider(provider)
      this.ethersProvider = new ethers.providers.Web3Provider(provider)

      try {
        await window.ethereum.enable()
        await this.setProvider(provider)
        this.callHandlers(MetamaskEvents.init)
      } catch (error) {
        console.log(error)
      }
    }
    this.getBalance()
    // if (this.isUserOnPage) {
    //   handlePageFocus()
    // }
    this.isConnecting = false

    const apiKey = process.env.REACT_APP_SPOCK_API_KEY;
    if (apiKey) {
      Web3Analytics.init({appKey: apiKey});
      Web3Analytics.walletProvider(window.ethereum);
    }
  }

  async addTokenToWallet(token: any) {
    const response = await window.ethereum
      .request({
        method: 'metamask_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
            image: token.tokenImage,
          },
        },
        // id: Math.round(Math.random() * 100000),
      })
      .catch(console.log)

    if ((await checkForToken(token)) > 0 && response) {
      this.setTokenAddedMessage(`${token.name} is already in your wallet.`)
    } else if (response) {
      this.setTokenAddedMessage(`${token.name} was added to your wallet.`)
    } else {
      this.setTokenAddedMessage(`${token.name} was not added to your wallet.`)
    }
  }

  openSwitchNetworkModal() {
    this.isShowModalSwitchNetwork = true
  }

  closeSwitchNetworkModal() {
    this.isShowModalSwitchNetwork = false
  }
}

export const metaMaskStore = new MetaMaskStore()

export const handlePageFocus = async (from?: string) => {
  if (networkManager.inited && metaMaskStore.walletAddress) {
    window?.ethereum?.request({method: 'eth_chainId'}).then((chainId: string) => {
      if (chainId !== networkManager.networkId) {
        metaMaskStore.openSwitchNetworkModal()
      }
    })
  }
}

window.onfocus = async () => {
  metaMaskStore.isUserOnPage = true
  handlePageFocus()
}

window.onblur = () => {
  metaMaskStore.isUserOnPage = false
}
