import { statsBaseStore } from './stats-modules'
import {
  FundKeeperStore,
  GovernanceStore,
  LiquidityBalancerStore,
  ProfitSharingPoolStore,
  TETULPsStore,
  VaultStatsStore,
} from './stats-modules'
import { makeAutoObservable } from 'mobx'
import { tetuLockedChartStore, tvlHistoryChartStore } from '../charts'

class TotalStatsStore {
  isFetched = false
  isFetching = false

  data: any = {}
  data24Hour: any = {}

  private readonly statsBaseStore = statsBaseStore
  private readonly tetuLockedChartStore = tetuLockedChartStore
  private readonly tvlHistoryChartStore = tvlHistoryChartStore

  constructor() {
    makeAutoObservable(this)
  }

  private async loadData(block: number) {
    const fundKeeperStore = new FundKeeperStore(block)
    const governanceStore = new GovernanceStore(block)
    const liquidityBalancerStore = new LiquidityBalancerStore(block)
    const profitSharingPoolStore = new ProfitSharingPoolStore(block)
    const tetuLPsStore = new TETULPsStore(block)
    const vaultStatsStore = new VaultStatsStore(block)

    // if (this.statsBaseStore.networkManager.isFantomNetwork) {
    //   await Promise.allSettled([
    //     fundKeeperStore.fetch(),
    //     tetuLPsStore.fetch2(),
    //     profitSharingPoolStore.fetch(),
    //     vaultStatsStore.fetch(),
    //   ])

    //   return {
    //     FundKeeper: fundKeeperStore.data,
    //     TETUUSDCLP: tetuLPsStore.data,
    //     PS: profitSharingPoolStore.data,
    //     VaultStats: vaultStatsStore.data,
    //   }
    // }

    if (this.statsBaseStore.networkManager.isMaticNetwork) {
      await Promise.allSettled([
        fundKeeperStore.fetch(),
        tetuLPsStore.fetch2(),
        profitSharingPoolStore.fetch(),
        vaultStatsStore.fetch(),
        liquidityBalancerStore.fetch(),
        governanceStore.fetch(),
      ])

      return {
        FundKeeper: fundKeeperStore.data,
        TETUUSDCLP: tetuLPsStore.data,
        PS: profitSharingPoolStore.data,
        VaultStats: vaultStatsStore.data,
        LiquidityBalancer: liquidityBalancerStore.data,
        Governance: governanceStore.data,
      }
    }
  }

  async fetch() {
    this.isFetching = true

    if (!this.statsBaseStore.vaultsStore.isFetched) {
      await this.statsBaseStore.vaultsStore.fetch()
    }

    if (!this.statsBaseStore.strategesStore.isFetched) {
      await this.statsBaseStore.strategesStore.fetch()
    }

    const currentBlock = await this.statsBaseStore.chartUtils.getCurentBlock()
    const blockOfLast24Hours =
      currentBlock - this.statsBaseStore.networkManager.blockPeriods.block_at_day_period

    const response: any = await Promise.allSettled([
      this.loadData(currentBlock),
      this.loadData(blockOfLast24Hours),
    ])

    this.data = response[0].value
    this.data24Hour = response[1].value

    this.isFetching = false
    this.isFetched = true
  }

  reset() {
    this.isFetched = false
    this.isFetching = false
    this.data = {}
    this.data24Hour = {}
    this.tetuLockedChartStore.reset()
    this.tvlHistoryChartStore.reset()
  }
}

export const totalStats2Store = new TotalStatsStore()
