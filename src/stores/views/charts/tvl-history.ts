import { makeAutoObservable } from 'mobx'
import { chartUtils } from '../../core'
import { contractReaderChainStore, networkManager } from '../../chain-stores'
import { vaultsStore } from '../../resources-stores'
import { calcAmount } from '../../../utils/amount'
import { formatUnits } from 'ethers/lib/utils'
import { metaMaskStore } from '../../meta-mask-store'
import axios from 'axios'
import { tetuServerResources } from '../../../api/tetu-server'

class TvlHistoryChartStore {
  private readonly chartUtils = chartUtils
  private readonly contractReaderChainStore = contractReaderChainStore
  private readonly vaultsStore = vaultsStore
  private readonly metaMaskStore = metaMaskStore
  private readonly networkManager = networkManager

  private blocks: { block: number; timestamp: Date }[] = []

  isFetching = false
  isFetched = false

  data: any = []

  private async getTvlHistory() {
    const response = await axios.get(
      tetuServerResources.info.tvlAtWorkHistory + this.networkManager.network.other.urlParam,
    )

    return response.data.map(([timestamp, value]: [string, string]) => {
      return [new Date(Number(timestamp) * 1000), value]
    })
  }

  constructor() {
    makeAutoObservable(this)
    this.metaMaskStore.on('init', () => {
      // this.loadData()
    })
  }

  loadData() {
    this.isFetching = true

    this.getTvlHistory().then((data) => {
      this.data = data
      this.isFetching = false
      this.isFetched = true
    })
  }

  async getTvlChanks(blocks: { block: number }[]) {
    if (!this.vaultsStore.isFetched) {
      await this.vaultsStore.fetch()
    }

    const promises = blocks.map(async ({ block }, index) => {
      const promises = []

      const vaults = this.vaultsStore.value!.filter((el: string) => {
        const tetuVault = this.networkManager.addresses.core.PS.toLowerCase()
        const tetuUSDCVaultSushi = '0x51b0B58FF704b97E8d5aFf911E2FfC9939E44BFC'.toLowerCase()
        const tetuUSDCVaultQuick = '0x301204e50c4295fe38c87f774cbdf984a1b66e87'.toLowerCase()

        const dxTetu = '0xacee7bd17e7b04f7e48b29c0c91af67758394f0f'.toLowerCase()
        return ![tetuVault, tetuUSDCVaultSushi, tetuUSDCVaultQuick, dxTetu].includes(
          el.toLowerCase(),
        )
      })

      const len = vaults.length
      const step = Number(process.env.REACT_APP_TVL_HISTORY_CHART_LOAD_VAULT_TVL_USDC_PART_LIMIT)
      const items = Math.trunc(len / step)

      const requestItems: any = []

      for (let i = 0; i <= items; i++) {
        const vaultsPart = vaults.slice(i * step, i * step + step)
        requestItems.push(vaultsPart)
        promises.push(this.contractReaderChainStore.getTotalTvlUsdc(vaultsPart, block))
      }

      const response = await Promise.allSettled(promises)

      const checkAndRetry = async (resp: any, index: number, retryCount: number) => {
        if (retryCount > 4) {
          // @ts-ignore
          response[index].value = '0'
          return
        }

        if (resp === undefined || resp === '0') {
          const data = await this.contractReaderChainStore.getTotalTvlUsdc(
            requestItems[index],
            block - 100 * retryCount,
          )

          if (data) {
            // @ts-ignore
            response[index].value = data
          }

          await checkAndRetry(data, index, retryCount + 1)
        }
      }

      for (let i = 0; i < response.length; i++) {
        // @ts-ignore
        await checkAndRetry(response[i].value, i, 1)
      }

      const list = response.map(({ value }: any) => value)
      const calcTotalTvlUSDC = calcAmount(list)

      return calcTotalTvlUSDC
    })

    const response = await Promise.allSettled(promises)

    return response
  }

  async getTVL() {
    if (!this.vaultsStore.isFetched) {
      await this.vaultsStore.fetch()
    }

    const response = await this.getTvlChanks(this.blocks)

    await new Promise((res) => setTimeout(() => res(response), 50))

    this.data = response
      .filter((el) => el.status === 'fulfilled')
      .map(({ value }: any, index) => [
        this.blocks[index].timestamp,
        parseFloat(formatUnits(value)),
      ])
  }

  reset() {
    this.blocks = []
    this.isFetching = false
    this.isFetched = false
    this.data = []
  }
}

export const tvlHistoryChartStore = new TvlHistoryChartStore()
