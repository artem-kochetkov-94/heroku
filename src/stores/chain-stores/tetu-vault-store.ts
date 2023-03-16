import { makeAutoObservable } from 'mobx'
import { networkManager } from './network-manager'
import { tetuVaultAbi } from '../../abi/TetuVault'
import { web3Store } from '../web3-store'
import { BigNumber } from 'ethers'
import {retry} from "../../utils";

class TetuVaultChainStore {
  constructor() {
    makeAutoObservable(this)
  }

  private readonly networkManager = networkManager
  private readonly web3Store = web3Store

  private get TetuContact() {
    const contract = this.networkManager.TetuTokenAddr
      ? new this.web3Store.web3.eth.Contract(
          // @ts-ignore
          tetuVaultAbi,
          this.networkManager.TetuTokenAddr,
        )
      : null
    return contract
  }

  async getTotalSupply(block?: number) {
    const response = retry({fn: this.TetuContact?.methods.totalSupply().call, args: [{block}]}, 'getTotalSupply')()
    return response ?? BigNumber.from(0)
  }
}

export const tetuVaultChainStore = new TetuVaultChainStore()
