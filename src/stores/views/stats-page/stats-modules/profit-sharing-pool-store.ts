import { makeAutoObservable } from 'mobx'
import { statsBaseStore } from './base-store'

export class ProfitSharingPoolStore {
  private readonly statsBaseStore = statsBaseStore

  data: any = {
    TETUTVL: null,
    TVLUSDC: null,
    TETULOCKED: null,
    USERS: null,
  }

  block: undefined | number = undefined

  constructor(block?: number) {
    this.block = block
    makeAutoObservable(this)
  }

  async fetch() {
    const PS = this.statsBaseStore.networkManager.addresses.core.PS

    const response = await Promise.allSettled([
      this.statsBaseStore.tetuVaultChainStore.getTotalSupply(this.block), // 0
      this.statsBaseStore.contractReaderChainStore.getVaultTvlUsdc(PS!, this.block), // 1
      this.statsBaseStore.contractReaderChainStore.getVaultUsers(PS!, this.block), // 2
      this.statsBaseStore.contractReaderChainStore.getVaultTvl(PS!, this.block), // 3
    ])

    const values = response.map((el: any) => el.value)

    const totalSupply = values[0]

    this.data.TETUTVL = values[3]
    this.data.TVLUSDC = values[1]
    this.data.TETULOCKED = (values[3] / totalSupply) * 100
    this.data.USERS = values[2]
  }
}
