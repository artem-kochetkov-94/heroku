import { makeAutoObservable } from 'mobx'
import { statsBaseStore } from './base-store'
import { BigNumber } from 'ethers'
import { tetuVaultAbi } from '../../../../abi/TetuVault'
import { LiquidityBalancerAbi } from '../../../../abi/LiquidityBalancer'

export class LiquidityBalancerStore {
  private readonly statsBaseStore = statsBaseStore

  data: any = {
    TetuBalance: null,
    PercentOfTetu: null,
    LPTETUUSDCBALANCE: null,
    TargetPrice: null,
    TargetTVL: null,
  }

  block: undefined | number = undefined

  constructor(block?: number) {
    this.block = block
    makeAutoObservable(this)
  }

  async fetch() {
    const {
      core: { liquidityBalancer, TetuToken },
      statsPage: {
        liquidityBalancer: { LP },
      },
    } = this.statsBaseStore.networkManager.networkAddresses

    const lpContract = new this.statsBaseStore.web3Store.web3.eth.Contract(
      // @ts-ignore
      tetuVaultAbi,
      LP,
    )

    const LiquidityBalancerContract = new this.statsBaseStore.web3Store.web3.eth.Contract(
      // @ts-ignore
      LiquidityBalancerAbi,
      liquidityBalancer,
    )

    const response = await Promise.allSettled([
      this.statsBaseStore.tetuVaultChainStore.getTotalSupply(this.block), // 0
      this.statsBaseStore.balaceOfTetu(liquidityBalancer!, this.block), // 1
      lpContract.methods.balanceOf(liquidityBalancer!).call({}, this.block), // 2
      LiquidityBalancerContract.methods.priceTargets(TetuToken).call({}, this.block), // 3
      LiquidityBalancerContract.methods.lpTvlTargets(LP).call({}, this.block), // 4
      this.statsBaseStore.contractReaderChainStore.getPrice(LP!, this.block), // 5
    ])

    const values = response.map((el: any) => el.value)

    const totalSupply = values[0]

    this.data.TetuBalance = values[1]
    this.data.PercentOfTetu = (values[1] / totalSupply) * 100
    this.data.LPTETUUSDCBALANCE = BigNumber.from(values[2])
      .mul(BigNumber.from(values[5]))
      .div(1e9)
      .div(1e9)
      .toString()

    this.data.TargetPrice = values[3]
    this.data.TargetTVL = values[4]
  }
}
