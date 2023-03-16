import { makeAutoObservable } from 'mobx'
import { tetuVaultAbi } from '../../../abi/TetuVault'
import { web3Store } from '../../web3-store'
import { contractReaderChainStore, networkManager, tetuVaultChainStore } from '../../chain-stores'
import { metaMaskStore } from '../../meta-mask-store'
import { retry } from '../../../utils'

class TetuLockedChartStore {
  private readonly web3Store = web3Store
  private readonly networkManager = networkManager
  private readonly tetuVaultChainStore = tetuVaultChainStore
  private readonly contractReaderChainStore = contractReaderChainStore
  private readonly metaMaskStore = metaMaskStore

  data: any = {
    PS: null,
    LPs: [],
    items: [],
  }

  values = {}

  isFetched = false

  constructor() {
    makeAutoObservable(this)
  }

  private get tetuContract() {
    // @ts-ignore
    return new this.web3Store.web3.eth.Contract(tetuVaultAbi, this.networkManager.TetuTokenAddr)
  }

  private async balaceOfTetu(address: string) {
    const fn = retry({
      fn: this.tetuContract.methods.balanceOf(address).call,
    }, 'balaceOfTetu')
    const response = await fn()
    return response
  }

  async loadData() {
    const { LPs, PS, items } = this.networkManager.addresses.statsPage.tetuLockedChart

    const response = await Promise.allSettled([
      this.tetuVaultChainStore.getTotalSupply(), // 0
      this.contractReaderChainStore.getVaultTvl(PS!), // 1
    ])

    const LPsResponse = await Promise.allSettled(LPs.map((addr: string) => this.balaceOfTetu(addr)))

    const itemsResponse = await Promise.allSettled(
      items.map((el: { addr: string }) => this.balaceOfTetu(el.addr)),
    )

    const values = response.map((el: any) => el.value)

    this.data.PS = (values[1] / values[0]) * 100

    // @ts-ignore
    this.data.LPs = LPsResponse.map((el: any) => {
      return (el.value / values[0]) * 100
    })

    this.data.items = items.map((el: any, index: number) => {
      return {
        // @ts-ignore
        value: (itemsResponse[index].value / values[0]) * 100,
        name: el.label,
      }
    })

    this.isFetched = true
  }

  reset() {
    this.data = {
      PS: null,
      LPs: [],
      items: [],
    }
    this.values = {}
    this.isFetched = false
  }
}

export const tetuLockedChartStore = new TetuLockedChartStore()
