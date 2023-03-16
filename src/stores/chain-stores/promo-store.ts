import { promoAbi } from './../../abi/Promo'
import { makeAutoObservable } from 'mobx'
import { web3Store } from '../web3-store'
import { networkManager } from './network-manager'
import { metaMaskStore } from '../meta-mask-store'

class PromoChainStore {
  private readonly web3Store = web3Store
  private readonly networkManager = networkManager
  private readonly metaMaskStore = metaMaskStore

  constructor() {
    makeAutoObservable(this)
  }

  private get contract() {
    const addr = this.networkManager.networkAddresses?.faucet

    if (addr) {
      const contact = new this.web3Store.web3.eth.Contract(
        // @ts-ignore
        promoAbi,
        addr,
      )
      return contact
    } else {
      return null
    }
  }

  async claim() {
    // rinkeby
    if (this.contract === null) {
      return
    }

    const addr = this.networkManager.networkAddresses?.faucet
    const claimAbi = promoAbi.find((el) => el.type === 'function' && el.name === 'claim')

    // @ts-ignore
    const data = this.web3Store.web3.eth.abi.encodeFunctionCall(claimAbi, [])

    const transactionHash = await this.web3Store
      .sendTransaction({
        from: this.metaMaskStore.walletAddress!,
        to: addr,
        data,
        // gasPrice,
      })
      .catch(console.log)

    if (transactionHash) {
      return transactionHash
    }

    // const txHash = await window?.ethereum?.request({
    // method: 'eth_sendTransaction',
    // params: [
    // {
    // from: this.metaMaskStore.walletAddress,
    // to: addr,
    // data,
    // gasPrice,
    // },
    // ],
    // })
    // return txHash
  }
}

export const promoChainStore = new PromoChainStore()
