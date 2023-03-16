import { web3Store } from './../web3-store'
import { makeAutoObservable } from 'mobx'
import { ContractUtilsAbi } from '../../abi/ContractUtils'
import { networkManager } from '../chain-stores/network-manager'
import * as Sentry from '@sentry/react'
import { retry } from '../../utils'

class ContractUtilsChainStore {
  constructor() {
    makeAutoObservable(this)
  }

  private readonly web3Store = web3Store
  private readonly networkManager = networkManager

  private get contractUtilsProxy() {
    const utilsAddr = this.networkManager.utilsAddr
    return utilsAddr
  }

  private get CU() {
    const CU = new this.web3Store.web3.eth.Contract(
      //@ts-ignore
      ContractUtilsAbi,
      this.contractUtilsProxy,
    )
    return CU
  }

  // private readonly contractUtilsProxy = this.networkManager.utilsAddr

  // private readonly CU = new this.web3Store.web3.eth.Contract(
  //   //@ts-ignore
  //   ContractUtilsAbi,
  //   this.contractUtilsProxy,
  // )

  async erc20Balances(tokens: string[], address: string) {
    const fn = retry({
      fn: this.CU.methods.erc20Balances(tokens, address).call,
    }, 'erc20Balances')

    const response = await fn().catch(Sentry.captureException)
    return response
  }

  async erc20Decimals(addresses: string[]) {
    const fn = retry({
      fn: this.CU.methods.erc20Decimals(addresses).call,
    }, 'erc20Decimals')
    const response = await fn().catch(Sentry.captureException)
    return response
  }

  async erc20Names(addresses: string[]) {
    const fn = retry({
      fn: this.CU.methods.erc20Names(addresses).call,
    }, 'erc20Names')
    const response = await fn().catch(Sentry.captureException)
    return response
  }

  // одинаковый для всех lp
  async erc20Symbols(addresses: string[]) {
    const fn = retry({
      fn: this.CU.methods.erc20Symbols(addresses).call,
    }, 'erc20Symbols')
    const response = await fn().catch(Sentry.captureException)
    return response
  }

  async erc20TotalSupply(addresses: string[]) {
    const fn = retry({
      fn: this.CU.methods.erc20TotalSupply(addresses).call,
    }, 'erc20TotalSupply')
    const response = await fn().catch(Sentry.captureException)
    return response
  }
}

export const contractUtilsChainStore = new ContractUtilsChainStore()
