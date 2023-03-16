import { makeAutoObservable } from 'mobx'
import { statsBaseStore } from './base-store'

export class VaultStatsStore {
  private readonly statsBaseStore = statsBaseStore

  data: any = {
    TVLUSDC: null,
    TetuBoughtBack: null,
    TotalTvlAtWork: null,
  }

  block: undefined | number = undefined

  constructor(block?: number) {
    this.block = block
    makeAutoObservable(this)
  }

  async fetch() {
    if (!this.statsBaseStore.vaultsStore.isFetched) {
      await this.statsBaseStore.vaultsStore.fetch()
    }

    const currentBlock = await this.statsBaseStore.chartUtils.getCurentBlock()

    const response = await Promise.allSettled([
      this.statsBaseStore.contractReaderChainStore.getTotalTvlUsdc(
        this.statsBaseStore.vaultsStore.value as string[],
        this.block,
      ), // 15
      this.statsBaseStore.contractReaderChainStore.getTotalTetuBoughBack(
        this.statsBaseStore.strategesStore.value as string[],
        this.block,
      ), // 16
      this.statsBaseStore.tvlHistoryChartStore.getTvlChanks([
        { block: this.block || currentBlock },
      ]), // 17
    ])

    const values = response.map((el: any) => el.value)

    this.data.TVLUSDC = values[0]
    this.data.TetuBoughtBack = values[1]
    this.data.TotalTvlAtWork = values[2][0].value
  }
}
