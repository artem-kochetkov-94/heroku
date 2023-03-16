import { makeAutoObservable } from 'mobx'
import { statsBaseStore } from './base-store'
import { TetuUSDCAbi } from '../../../../abi/Tetu-USDC'

export class FundKeeperStore {
  private readonly statsBaseStore = statsBaseStore

  data: any = {
    fundkeeper: {
      usdc: null,
      tetu: null,
      TETULocked: null,
    },
    lp: {
      lpTokenBalance: null,
      lpTotalSupply: null,
      balanceRatio: null,
      lpToken0Bal: null,
      lpToken1Bal: null,
      fundKeeperToken0Balance: null,
      fundKeeperToken1Balance: null,
      token0Symbol: null,
      token1Symbol: null,
      token0Price: null,
      token1Price: null,
    },
  }

  block: undefined | number = undefined

  async fetch() {
    const { addr: fundkeeper, LP } =
      this.statsBaseStore.networkManager?.addresses.statsPage.FundKeeper

    const lpContract = new this.statsBaseStore.web3Store.web3.eth.Contract(
      // @ts-ignore
      TetuUSDCAbi,
      LP,
    )

    const response = await Promise.allSettled([
      this.statsBaseStore.balanceOfUSDC(fundkeeper!, this.block), // 0 // 6 decimals
      this.statsBaseStore.balaceOfTetu(fundkeeper!, this.block), // 1
      this.statsBaseStore.tetuVaultChainStore.getTotalSupply(this.block), // 2
      lpContract.methods.balanceOf(fundkeeper).call({}, this.block), // 3
      lpContract.methods.totalSupply().call({}, this.block), // 4
      this.statsBaseStore.token0BalanceOf(lpContract, LP, this.block), // 5
      this.statsBaseStore.token1BalanceOf(lpContract, LP, this.block), // 6
      this.statsBaseStore.token0SymbolOf(lpContract), // 7
      this.statsBaseStore.token1SymbolOf(lpContract), // 8
      this.statsBaseStore.getPriceToken0(lpContract), // 9
      this.statsBaseStore.getPriceToken1(lpContract), // 10
    ])

    const values = response.map((el: any) => el.value)

    const totalSupply = values[2]
    const balanceRatio = values[3] / values[4]

    this.data.fundkeeper.usdc = values[0]
    this.data.fundkeeper.tetu = values[1]
    this.data.fundkeeper.TETULocked = (values[1] / totalSupply) * 100

    this.data.lp.lpTokenBalance = values[3]
    this.data.lp.lpTotalSupply = values[4]
    this.data.lp.balanceRatio = balanceRatio
    this.data.lp.lpToken0Bal = values[5]
    this.data.lp.lpToken1Bal = values[6]
    this.data.lp.fundKeeperToken0Balance = values[5] * balanceRatio
    this.data.lp.fundKeeperToken1Balance = values[6] * balanceRatio
    this.data.lp.token0Symbol = values[7]
    this.data.lp.token1Symbol = values[8]
    this.data.lp.token0Price = values[9]
    this.data.lp.token1Price = values[10]
  }

  // async fetch() {
  //   const { fundkeeper } = this.statsBaseStore.networkManager?.networkAddresses
  //
  //   const response = await Promise.allSettled([
  //     this.statsBaseStore.balanceOfUSDC(fundkeeper!, this.block), // 0 // 6 decimals
  //     this.statsBaseStore.balaceOfTetu(fundkeeper!, this.block), // 1
  //     this.statsBaseStore.tetuVaultChainStore.getTotalSupply(this.block), // 2
  //     this.statsBaseStore.balanceOfQuickSwapTetuUsdc(fundkeeper!, this.block), // 3
  //     this.statsBaseStore.totalSuplyOfQuickSwapTetuUsdc(this.block), // 4
  //     this.statsBaseStore.token0BalanceOfQuickSwapTetuUsdc(this.block), // 5
  //     this.statsBaseStore.token1BalanceOfQuickSwapTetuUsdc(this.block), // 6
  //     this.statsBaseStore.token0SymbolOfQuickSwapTetuUsdc(), // 7
  //     this.statsBaseStore.token1SymbolOfQuickSwapTetuUsdc(), // 8
  //     this.statsBaseStore.getPriceToken0OffQuickSwapTetuUsdc(this.block), // 9
  //     this.statsBaseStore.getPriceToken1OffQuickSwapTetuUsdc(this.block), // 10
  //   ])
  //
  //   const values = response.map((el: any) => el.value)
  //   const totalSupply = values[2]
  //   const balanceRatio = values[3] / values[4]
  //
  //   this.data.USDC = values[0]
  //   this.data.TETU = values[1]
  //   this.data.TETULocked = (values[1] / totalSupply) * 100
  //   this.data.lpTokenBalance = values[3]
  //   this.data.lpTotalSupply = values[4]
  //   this.data.balanceRatio = balanceRatio
  //   this.data.lpToken0Bal = values[5]
  //   this.data.lpToken1Bal = values[6]
  //   this.data.fundKeeperToken0Balance = values[5] * balanceRatio
  //   this.data.fundKeeperToken1Balance = values[6] * balanceRatio
  //   this.data.token0Symbol = values[7]
  //   this.data.token1Symbol = values[8]
  //   this.data.token0Price = values[9]
  //   this.data.token1Price = values[10]
  // }

  constructor(block?: number) {
    this.block = block

    makeAutoObservable(this)
  }
}
