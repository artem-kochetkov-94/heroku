import { contractUtilsChainStore } from '../chain-stores'
import { FetchResource } from '../core'
import { observable } from 'mobx'

class ContractNameStore extends FetchResource<string[]> {
  @observable
  private chache = new Map()

  private readonly contractUtilsChainStore = contractUtilsChainStore

  constructor() {
    super(
      (addresses: string[]) => this.fetchWitchChache(addresses),
      // @ts-ignore
      (fetchParams: unknown[], names: string[]) => this.handleResponse(fetchParams, names),
    )
  }

  private async fetchWitchChache(addresses: string[]) {
    const filtred = addresses.filter((addr) => {
      return !this.chache.has(addr)
    })
    const response = null //await this.contractUtilsChainStore.erc20Symbols(filtred)
    return response
  }

  private handleResponse([addresses]: [string[]], names: string[]) {
    addresses.forEach((addr, index) => {
      if (!this.chache.has(addr)) {
        this.chache.set(addr, names[index])
      }
    })
  }

  getName(addr: string) {
    if (this.chache.has(addr)) {
      return this.chache.get(addr)
    } else {
      // this.fetchWitchChache([addr])
      return null
    }
  }
}

export const contractNameStore = new ContractNameStore()
