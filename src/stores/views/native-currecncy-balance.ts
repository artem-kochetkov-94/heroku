import { makeAutoObservable, action } from 'mobx'
import { networkManager } from '../chain-stores'
import { metaMaskStore } from '../meta-mask-store'
import { web3Store } from '../web3-store'

class NativeCurrencyBalance {
  private readonly networkManager = networkManager
  private readonly web3Store = web3Store
  private readonly metaMaskStore = metaMaskStore

  constructor() {
    makeAutoObservable(this, {
      getBalance: action.bound,
    })
  }

  nativeCurrencyBalance: any = null
  private subscription: any = null

  getBalance() {
    if (metaMaskStore.walletAddress) {
      this.web3Store.web3.eth.getBalance(
        metaMaskStore.walletAddress,
        // @ts-ignore
        (err: string, balance: string) => {
          if (balance) {
            this.nativeCurrencyBalance = balance
          }
        },
      )
    }
  }

  // subscribe() {
  //   if (this.networkManager.isMaticNetwork) {
  //     // @ts-ignore
  //     this.web3Store.web3.setWriteProvider(this.networkManager.network.other.ws)
  //   } else {
  //     this.web3Store.web3.setProvider(this.networkManager.network.other.ws)
  //   }
  //
  //   this.subscription = this.web3Store.web3.eth
  //     // @ts-ignore
  //     .subscribe('newBlockHeaders', this.getBalance)
  //     .on('data', this.getBalance)
  // }
  //
  // unsubscribe() {
  //   if (this.subscription) {
  //     this.subscription.unsubscribe()
  //   }
  //   this.nativeCurrencyBalance = null
  // }

  reset() {
    // this.unsubscribe()
  }
}

export const nativeCurrencyBalance = new NativeCurrencyBalance()
