import { makeAutoObservable } from 'mobx'
import { statsBaseStore } from './base-store'

export class GovernanceStore {
  private readonly statsBaseStore = statsBaseStore

  data = {
    TetuBalance: null,
    PercentOfTetu: null,
  }

  block: undefined | number = undefined

  constructor(block?: number) {
    this.block = block
    makeAutoObservable(this)
  }

  async fetch() {
    const { governance } = this.statsBaseStore.networkManager.addresses.core

    const response = await Promise.allSettled([
      this.statsBaseStore.balaceOfTetu(governance!), // 0
      this.statsBaseStore.tetuVaultChainStore.getTotalSupply(), // 1
    ])

    const values = response.map((el: any) => el.value)
    const totalSupply = values[1]

    this.data.TetuBalance = values[0]
    // @ts-ignore
    this.data.PercentOfTetu = (values[0] / totalSupply) * 100
  }
}
