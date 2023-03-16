import { makeAutoObservable } from 'mobx'
import {
  contractReaderChainStore,
  contractUtilsChainStore,
  networkManager,
  tetuVaultChainStore,
} from '../chain-stores'
import { tetuVaultAbi } from '../../abi/TetuVault'
import { LiquidityBalancerAbi } from '../../abi/LiquidityBalancer'
import { web3Store } from '../web3-store'
import { strategesStore, vaultsStore } from '../resources-stores'
import { BigNumber } from 'ethers'
import { chartUtils } from '../core'
import { tvlHistoryChartStore } from './charts'
import { calcAmount } from '../../utils/amount'
import { TetuUSDCAbi } from '../../abi/Tetu-USDC'
import { formatUnits } from 'ethers/lib/utils'
import { retry } from '../../utils'
import { LPAbi } from '../../abi/LP'

class StatsPageStore {
  private readonly contractReaderChainStore = contractReaderChainStore
  private readonly web3Store = web3Store
  private readonly networkManager = networkManager
  private readonly tetuVaultChainStore = tetuVaultChainStore
  private readonly vaultsStore = vaultsStore
  private readonly chartUtils = chartUtils
  private readonly tvlHistoryChartStore = tvlHistoryChartStore
  private readonly strategesStore = strategesStore
  private readonly contractUtilsChainStore = contractUtilsChainStore

  isFetched = false
  isFetching = false

  data: any = {
    FundKeeper: {
      USDC: null,
      TETU: null,
      TETULocked: null,
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
    TETUUSDCLP: {
      USDCBalance: null,
      TETUBalance: null,
      TETULOCKED: null,
      USERS: null,
    },
    PS: {
      TETUTVL: null,
      TVLUSDC: null,
      TETULOCKED: null,
      USERS: null,
    },
    VaultStats: {
      TVLUSDC: null,
      TotalUsers: null,
      UnclaimedTetu: null,
      TetuBoughtBack: null,
      PeRatio: null,
      TotalTvlAtWork: null,
    },
    LiquidityBalancer: {
      TetuBalance: null,
      PercentOfTetu: null,
      LPTETUUSDCBALANCE: null,
      TargetPrice: null,
      TargetTVL: null,
    },
    Governance: {
      TetuBalance: null,
      PercentOfTetu: null,
    },
  }

  data24Hour: any = {
    FundKeeper: {
      USDC: null,
      TETU: null,
      TETULocked: null,

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
    TETUUSDCLP: {
      USDCBalance: null,
      TETUBalance: null,
      TETULOCKED: null,
      USERS: null,
    },
    PS: {
      TETUTVL: null,
      TVLUSDC: null,
      TETULOCKED: null,
      USERS: null,
    },
    VaultStats: {
      TVLUSDC: null,
      TotalUsers: null,
      UnclaimedTetu: null,
      TetuBoughtBack: null,
      PeRatio: null,
      TotalTvlAtWork: null,
    },
    LiquidityBalancer: {
      TetuBalance: null,
      PercentOfTetu: null,
      LPTETUUSDCBALANCE: null,
      TargetPrice: null,
      TargetTVL: null,
    },
    Governance: {
      TetuBalance: null,
      PercentOfTetu: null,
    },
  }

  constructor() {
    makeAutoObservable(this)
  }

  private get tetuContract() {
    // @ts-ignore
    return new this.web3Store.web3.eth.Contract(tetuVaultAbi, this.networkManager.TetuTokenAddr)
  }

  private get tetuUSDCContract() {
    // @ts-ignore
    return new this.web3Store.web3.eth.Contract(tetuVaultAbi, this.networkManager.usdcAddr)
  }

  private get wmaticContract() {
    return new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      tetuVaultAbi,
      this.networkManager.addresses.wmatic,
    )
  }

  private get LPTetuUSDC() {
    return new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      tetuVaultAbi,
      this.networkManager.addresses.tetuUsdcLP,
    )
  }

  private get tetuUsdcQuickContract() {
    return new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      TetuUSDCAbi,
      this.networkManager.addresses.quickTetuUSDCLP,
    )
  }

  private get LiquidityBalancerContract() {
    return new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      LiquidityBalancerAbi,
      this.networkManager.addresses.liquidityBalancer,
    )
  }

  private async balanceOfUSDC(address: string, block?: number) {
    const fn = retry({
      fn: async () => {
        return await this.tetuUSDCContract.methods.balanceOf(address).call({}, block)
      },
    }, 'balanceOfUSDC')
    const response = await fn()

    return BigNumber.from(response).mul(1e9).mul(1e9).div(1e6).toString()
  }

  private async balanceOfWmatic(address: string, block?: number) {
    const fn = retry({
      fn: async () => {
        return await this.wmaticContract.methods.balanceOf(address).call({}, block)
      },
    }, 'balanceOfWmatic')
    const response = await fn()
    return BigNumber.from(response).toString()
  }

  private async getWmaticPrice(block?: number) {
    const fn = retry({
      fn: async () => {
        return await this.contractReaderChainStore.getPrice(
          this.networkManager.addresses.wmatic!,
          block,
        )
      },
    }, 'getWmaticPrice')

    return await fn()
  }

  private wmaticUsdc(amount: string, price: string) {
    return BigNumber.from(amount).mul(price).div(1e9).div(1e9).toString()
  }

  private async balaceOfTetu(address: string, block?: number) {
    const response = await this.tetuContract.methods.balanceOf(address).call({}, block)
    return response
  }

  private async balanceOfQuickSwapTetuUsdc(address: string, block?: number) {
    const response = await this.tetuUsdcQuickContract.methods.balanceOf(address).call({}, block)
    return response
  }

  private async totalSuplyOfQuickSwapTetuUsdc(block?: number) {
    const response = await this.tetuUsdcQuickContract.methods.totalSupply().call({}, block)
    return response ?? BigNumber.from(0)
  }

  private async token0BalanceOfQuickSwapTetuUsdc(block?: number) {
    const addr = await this.tetuUsdcQuickContract.methods.token0().call()
    const fn1 = retry({
      fn: async () => {
        return await this.contractUtilsChainStore.erc20Decimals([addr])
      },
    }, 'token0BalanceOfQuickSwapTetuUsdc')
    const [decimals] = await fn1()

    const contract = new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      TetuUSDCAbi,
      addr,
    )

    const fn2 = retry({
      fn: async () => {
        return await contract.methods
          .balanceOf(this.networkManager.addresses.quickTetuUSDCLP)
          .call({}, block)
      },
    }, 'token0BalanceOfQuickSwapTetuUsdc')

    const response = await fn2()

    return formatUnits(response, decimals)
  }

  private async token1BalanceOfQuickSwapTetuUsdc(block?: number) {
    const fn1 = retry({
      fn: this.tetuUsdcQuickContract.methods.token1().call,
    }, 'token1BalanceOfQuickSwapTetuUsdc')
    const addr = await fn1()
    const [decimals] = await this.contractUtilsChainStore.erc20Decimals([addr])
    const contract = new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      TetuUSDCAbi,
      addr,
    )

    const fn2 = retry({
      fn: async () => {
        return await contract.methods
          .balanceOf(this.networkManager.addresses.quickTetuUSDCLP)
          .call({}, block)
      },
    }, 'token1BalanceOfQuickSwapTetuUsdc')

    const response = await fn2()

    return formatUnits(response, decimals)
  }

  private async token0SymbolOfQuickSwapTetuUsdc() {
    const fn = retry({
      fn: this.tetuUsdcQuickContract.methods.token0().call,
    }, 'token0SymbolOfQuickSwapTetuUsdc')
    const addr = await fn()
    const contract = new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      TetuUSDCAbi,
      addr,
    )

    return await contract.methods.symbol().call()
  }

  private async token1SymbolOfQuickSwapTetuUsdc() {
    const addr = await this.tetuUsdcQuickContract.methods.token1().call()
    const contract = new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      TetuUSDCAbi,
      addr,
    )
    return await contract.methods.symbol().call()
  }

  private async getPriceToken0OffQuickSwapTetuUsdc(block?: number) {
    const fn = retry({
      fn: async () => {
        return await this.tetuUsdcQuickContract.methods.token0().call({}, block)
      },
    }, 'getPriceToken0OffQuickSwapTetuUsdc')
    const addr = await fn()
    return await this.contractReaderChainStore.getPrice(addr)
  }

  private async getPriceToken1OffQuickSwapTetuUsdc(block?: number) {
    const fn = retry({
      fn: async () => {
        return await this.tetuUsdcQuickContract.methods.token1().call({}, block)
      },
    }, 'getPriceToken1OffQuickSwapTetuUsdc')
    const addr = await fn()
    return await this.contractReaderChainStore.getPrice(addr)
  }

  async getBalaceOfTetuVaults(block?: number) {
    const [tetuUsdcPrice] = await this.contractReaderChainStore.getTetuTokenValues()

    const underlyings = await Promise.allSettled(
      this.networkManager.addresses.statsPage.LPs.tetuVaults.map((v: string) =>
        this.contractReaderChainStore.getUnderlying(v),
      ),
    )

    const response = await Promise.allSettled(
      // @ts-ignore
      underlyings.map((el: any) => {
        // @ts-ignore
        const contract = new this.web3Store.web3.eth.Contract(LPAbi, el.value)

        return Promise.allSettled([
          contract.methods.getReserves().call({}, block),
          contract.methods.token0().call({}),
          contract.methods.token1().call({}),
        ])
      }),
    )

    const values = response.map((el: any) => {
      const [getReserves, token0, token1] = el.value

      if (token0.value.toLowerCase() === this.networkManager.TetuTokenAddr.toLowerCase()) {
        return getReserves.value[0]
      }
      if (token1.value.toLowerCase() === this.networkManager.TetuTokenAddr.toLowerCase()) {
        return getReserves.value[1]
      }
    })

    // const methods = ['getReserves', 'token0', 'token1']
    // const abi = LPAbi.filter((el) => {
    //   return el.type === 'function' && methods.includes(el.name)
    // })
    // const context = underlyings.map((it: any) => {
    //   return {
    //     reference: it.value,
    //     contractAddress: it.value,
    //     abi,
    //     calls: methods.map((method) => ({
    //       reference: method,
    //       methodName: method,
    //       methodParameters: [],
    //     })),
    //   }
    // })
    // const response: any = await multicall.call(context).catch(console.log)
    // const values = underlyings.map((el: any) => {
    //   const [getReserves, token0, token1] = response.results[el.value].callsReturnContext
    //   if (
    //     token0.returnValues[0].toLowerCase() === this.networkManager.TetuTokenAddr.toLowerCase()
    //   ) {
    //     return getReserves.returnValues[0].hex
    //   }
    //   if (
    //     token1.returnValues[0].toLowerCase() === this.networkManager.TetuTokenAddr.toLowerCase()
    //   ) {
    //     return getReserves.returnValues[1].hex
    //   }
    // })

    const usdc = BigNumber.from(calcAmount(values))
      .mul(BigNumber.from(tetuUsdcPrice))
      .div(1e9)
      .div(1e9)
      .toString()

    return {
      tetu: calcAmount(values),
      usdc,
    }
  }

  async getUsersOfTetuVaults(block?: number) {
    const response = await Promise.all(
      this.networkManager.addresses.statsPage.LPs.tetuVaults.map((address: string) =>
        this.contractReaderChainStore.getVaultUsers(address, block),
      ),
    )

    return response.reduce((a, b) => Number(a) + Number(b), 0)
  }

  async loadCurrentValues() {
    const {
      fundkeeper,
      tetuUsdcLP,
      PS,
      tetuUsdcLPVault,
      liquidityBalancer,
      TetuToken,
      governance,
      quickTetuUSDC,
      quicktetuUsdcLPVault,
      tetuWmaticSushi,
      tetuSushiWmaticVault,
    } = this.networkManager.networkAddresses

    if (!this.vaultsStore.isFetched) {
      await this.vaultsStore.fetch()
    }

    if (!this.strategesStore.isFetched) {
      await this.strategesStore.fetch()
    }

    const currentBlock = await this.chartUtils.getCurentBlock()

    const response = await Promise.allSettled([
      this.balanceOfUSDC(fundkeeper!), // 0 // 6 decimals
      this.balaceOfTetu(fundkeeper!), // 1
      this.balanceOfUSDC(tetuUsdcLP!), // 2 // 6 decimals
      this.balaceOfTetu(tetuUsdcLP!), // 3

      this.tetuVaultChainStore.getTotalSupply(), // 4
      this.contractReaderChainStore.getVaultTvlUsdc(PS!), // 5
      this.contractReaderChainStore.getVaultUsers(PS!), // 6
      this.contractReaderChainStore.getVaultUsers(tetuUsdcLPVault!), // 7

      this.balaceOfTetu(liquidityBalancer!), // 8
      this.LPTetuUSDC.methods.balanceOf(liquidityBalancer).call(), // 9
      this.LiquidityBalancerContract.methods.priceTargets(TetuToken).call(), // 10
      this.LiquidityBalancerContract.methods.lpTvlTargets(tetuUsdcLP).call(), // 11
      this.balaceOfTetu(governance!), // 12

      this.contractReaderChainStore.getVaultTvl(PS!), // 13
      this.contractReaderChainStore.getPrice(tetuUsdcLP!), // 14
      this.contractReaderChainStore.getTotalTvlUsdc(this.vaultsStore.value as string[]), // 15
      this.contractReaderChainStore.getTotalTetuBoughBack(this.strategesStore.value as string[]), // 16
      this.tvlHistoryChartStore.getTvlChanks([{ block: currentBlock }]), // 17
      this.balanceOfUSDC(quickTetuUSDC!), //18
      this.balaceOfTetu(quickTetuUSDC!), // 19
      this.contractReaderChainStore.getVaultUsers(quicktetuUsdcLPVault!), // 20

      this.balanceOfWmatic(tetuWmaticSushi!), // 21
      this.getWmaticPrice(), // 22
      this.balaceOfTetu(tetuWmaticSushi!), // 23

      this.balanceOfQuickSwapTetuUsdc(fundkeeper!), // 24
      this.totalSuplyOfQuickSwapTetuUsdc(), // 25
      this.token0BalanceOfQuickSwapTetuUsdc(), // 26
      this.token1BalanceOfQuickSwapTetuUsdc(), // 27
      this.token0SymbolOfQuickSwapTetuUsdc(), // 28
      this.token1SymbolOfQuickSwapTetuUsdc(), // 29
      this.getPriceToken0OffQuickSwapTetuUsdc(), // 30
      this.getPriceToken1OffQuickSwapTetuUsdc(), // 31
      this.contractReaderChainStore.getVaultUsers(tetuSushiWmaticVault!), // 32
      this.getBalaceOfTetuVaults(), // 33
      this.getUsersOfTetuVaults(), // 34
    ])

    const values = response.map((el: any) => el.value)

    const totalSupply = values[4]

    this.data.FundKeeper.USDC = values[0]
    this.data.FundKeeper.TETU = values[1]
    this.data.FundKeeper.TETULocked = (values[1] / totalSupply) * 100

    const balanceRatio = values[24] / values[25]

    this.data.FundKeeper.lpTokenBalance = values[24]
    this.data.FundKeeper.lpTotalSupply = values[25]
    this.data.FundKeeper.balanceRatio = balanceRatio

    this.data.FundKeeper.lpToken0Bal = values[26]
    this.data.FundKeeper.lpToken1Bal = values[27]
    this.data.FundKeeper.fundKeeperToken0Balance = values[26] * balanceRatio
    this.data.FundKeeper.fundKeeperToken1Balance = values[27] * balanceRatio
    this.data.FundKeeper.token0Symbol = values[28]
    this.data.FundKeeper.token1Symbol = values[29]
    this.data.FundKeeper.token0Price = values[30]
    this.data.FundKeeper.token1Price = values[31]

    this.data.TETUUSDCLP.USDCBalance = calcAmount([
      values[2],
      values[18],
      this.wmaticUsdc(values[21], values[22]),
      values[33].usdc,
    ])

    this.data.TETUUSDCLP.TETUBalance = calcAmount([
      values[3],
      values[19],
      values[23],
      values[33].tetu,
    ])
    // @ts-ignore
    this.data.TETUUSDCLP.TETULOCKED =
      // @ts-ignore
      (calcAmount([values[3], values[19], values[23], values[33].tetu]) / totalSupply) * 100
    this.data.TETUUSDCLP.USERS = calcAmount([values[7], values[20], values[32], values[34]])

    this.data.PS.TETUTVL = values[13]
    this.data.PS.TVLUSDC = values[5]
    this.data.PS.TETULOCKED = (values[13] / totalSupply) * 100
    this.data.PS.USERS = values[6]

    this.data.VaultStats.TVLUSDC = values[15]
    this.data.VaultStats.TotalUsers = null
    this.data.VaultStats.UnclaimedTetu = null
    this.data.VaultStats.TetuBoughtBack = values[16]
    this.data.VaultStats.PEratio = null
    this.data.VaultStats.TotalTvlAtWork = values[17][0].value

    this.data.LiquidityBalancer.TetuBalance = values[8]
    this.data.LiquidityBalancer.PercentOfTetu = (values[8] / totalSupply) * 100
    this.data.LiquidityBalancer.LPTETUUSDCBALANCE = BigNumber.from(values[9])
      .mul(BigNumber.from(values[14]))
      .div(1e9)
      .div(1e9)
      .toString()

    this.data.LiquidityBalancer.TargetPrice = values[10]
    this.data.LiquidityBalancer.TargetTVL = values[11]

    this.data.Governance.TetuBalance = values[12]
    // @ts-ignore
    this.data.Governance.PercentOfTetu = (values[12] / totalSupply) * 100
  }

  async loadData24HourAgo() {
    const currentBlock = await this.chartUtils.getCurentBlock()
    const blockOfLast24Hours = currentBlock - this.networkManager.blockPeriods.block_at_day_period

    const {
      fundkeeper,
      tetuUsdcLP,
      PS,
      tetuUsdcLPVault,
      liquidityBalancer,
      TetuToken,
      governance,
      quickTetuUSDC,
      quicktetuUsdcLPVault,
      tetuWmaticSushi,
      tetuSushiWmaticVault,
    } = this.networkManager.networkAddresses

    if (!this.strategesStore.isFetched) {
      await this.strategesStore.fetch()
    }

    if (!this.vaultsStore.isFetched) {
      await this.vaultsStore.fetch()
    }

    const response = await Promise.allSettled([
      this.balanceOfUSDC(fundkeeper!, blockOfLast24Hours), // 0
      this.balaceOfTetu(fundkeeper!, blockOfLast24Hours), // 1
      this.balanceOfUSDC(tetuUsdcLP!, blockOfLast24Hours), // 2
      this.balaceOfTetu(tetuUsdcLP!, blockOfLast24Hours), // 3

      this.tetuVaultChainStore.getTotalSupply(blockOfLast24Hours), // 4
      this.contractReaderChainStore.getVaultTvlUsdc(PS!, blockOfLast24Hours), // 5
      this.contractReaderChainStore.getVaultUsers(PS!, blockOfLast24Hours), // 6
      this.contractReaderChainStore.getVaultUsers(tetuUsdcLPVault!, blockOfLast24Hours), // 7

      this.balaceOfTetu(liquidityBalancer!, blockOfLast24Hours), // 8
      this.LPTetuUSDC.methods.balanceOf(liquidityBalancer).call({}, blockOfLast24Hours), // 9
      this.LiquidityBalancerContract.methods.priceTargets(TetuToken).call({}, blockOfLast24Hours), // 10
      this.LiquidityBalancerContract.methods.lpTvlTargets(tetuUsdcLP).call({}, blockOfLast24Hours), // 11
      this.balaceOfTetu(governance!, blockOfLast24Hours), // 12

      this.contractReaderChainStore.getVaultTvl(PS!, blockOfLast24Hours), // 13
      this.contractReaderChainStore.getPrice(tetuUsdcLP!, blockOfLast24Hours), // 14
      // Promise.resolve(), //
      this.contractReaderChainStore.getTotalTvlUsdc(
        this.vaultsStore.value as string[],
        blockOfLast24Hours,
      ), // 15

      this.contractReaderChainStore.getTotalTetuBoughBack(
        // @ts-ignore
        this.strategesStore.value as string[],
        blockOfLast24Hours,
      ), // 16
      this.tvlHistoryChartStore.getTvlChanks([{ block: blockOfLast24Hours }]), // 17
      // Promise.resolve(),
      this.balanceOfUSDC(quickTetuUSDC!, blockOfLast24Hours), //18
      this.balaceOfTetu(quickTetuUSDC!, blockOfLast24Hours), // 19
      this.contractReaderChainStore.getVaultUsers(quicktetuUsdcLPVault!), // 20
      //
      this.balanceOfWmatic(tetuWmaticSushi!, blockOfLast24Hours), // 21
      this.getWmaticPrice(blockOfLast24Hours), // 22
      this.balaceOfTetu(tetuWmaticSushi!, blockOfLast24Hours), // 23
      //
      this.balanceOfQuickSwapTetuUsdc(fundkeeper!, blockOfLast24Hours), // 24
      this.totalSuplyOfQuickSwapTetuUsdc(blockOfLast24Hours), // 25
      this.token0BalanceOfQuickSwapTetuUsdc(blockOfLast24Hours), // 26
      this.token1BalanceOfQuickSwapTetuUsdc(blockOfLast24Hours), // 27
      this.token0SymbolOfQuickSwapTetuUsdc(), // 28
      this.token1SymbolOfQuickSwapTetuUsdc(), // 29
      this.getPriceToken0OffQuickSwapTetuUsdc(blockOfLast24Hours), // 30
      this.getPriceToken1OffQuickSwapTetuUsdc(blockOfLast24Hours), // 31
      this.contractReaderChainStore.getVaultUsers(tetuSushiWmaticVault!, blockOfLast24Hours), // 32
      this.getBalaceOfTetuVaults(blockOfLast24Hours), // 33
      this.getUsersOfTetuVaults(blockOfLast24Hours), // 34
    ])

    const values = response.map((el: any) => el.value)

    const totalSupply = values[4]

    const balanceRatio = values[24] / values[25]

    this.data24Hour.FundKeeper.USDC = values[0]
    this.data24Hour.FundKeeper.TETU = values[1]
    this.data24Hour.FundKeeper.TETULocked = (values[1] / totalSupply) * 100

    this.data24Hour.FundKeeper.balanceRatio = balanceRatio

    this.data24Hour.FundKeeper.lpToken0Bal = values[26]
    this.data24Hour.FundKeeper.lpToken1Bal = values[27]
    this.data24Hour.FundKeeper.fundKeeperToken0Balance = values[26] * balanceRatio
    this.data24Hour.FundKeeper.fundKeeperToken1Balance = values[27] * balanceRatio
    this.data24Hour.FundKeeper.token0Symbol = values[28]
    this.data24Hour.FundKeeper.token1Symbol = values[29]
    this.data24Hour.FundKeeper.token0Price = values[30]
    this.data24Hour.FundKeeper.token1Price = values[31]

    this.data24Hour.TETUUSDCLP.USDCBalance = calcAmount([
      values[2],
      values[18],
      this.wmaticUsdc(values[21], values[22]),
      values[33].usdc,
    ])

    this.data24Hour.TETUUSDCLP.TETUBalance = calcAmount([
      values[3],
      values[19],
      values[23],
      values[33].tetu,
    ])

    this.data24Hour.TETUUSDCLP.TETULOCKED =
      // @ts-ignore
      (calcAmount([values[3], values[19], values[23], values[33].tetu]) / totalSupply) * 100
    this.data24Hour.TETUUSDCLP.USERS = calcAmount([values[7], values[20], values[32], values[34]])

    this.data24Hour.PS.TETUTVL = values[13]
    this.data24Hour.PS.TVLUSDC = values[5]
    this.data24Hour.PS.TETULOCKED = (values[13] / totalSupply) * 100
    this.data24Hour.PS.USERS = values[6]

    this.data24Hour.VaultStats.TVLUSDC = values[15]
    this.data24Hour.VaultStats.TotalUsers = null
    this.data24Hour.VaultStats.UnclaimedTetu = null
    this.data24Hour.VaultStats.TetuBoughtBack = values[16]
    this.data24Hour.VaultStats.PEratio = null
    this.data24Hour.VaultStats.TotalTvlAtWork = values[17][0].value

    this.data24Hour.LiquidityBalancer.TetuBalance = values[8]
    this.data24Hour.LiquidityBalancer.PercentOfTetu = (values[8] / totalSupply) * 100
    this.data24Hour.LiquidityBalancer.LPTETUUSDCBALANCE = BigNumber.from(values[9])
      .mul(BigNumber.from(values[14]))
      .div(1e9)
      .div(1e9)
      .toString()

    this.data24Hour.LiquidityBalancer.TargetPrice = values[10]
    this.data24Hour.LiquidityBalancer.TargetTVL = values[11]

    this.data24Hour.Governance.TetuBalance = values[12]
    // @ts-ignore
    this.data24Hour.Governance.PercentOfTetu = (values[12] / totalSupply) * 100
  }

  async loadData() {
    this.isFetching = true

    await Promise.allSettled([this.loadData24HourAgo(), this.loadCurrentValues()])

    this.isFetching = false
    this.isFetched = true
  }

  reset() {
    this.isFetched = false
    this.isFetching = false

    this.data = {
      FundKeeper: {
        USDC: null,
        TETU: null,
        TETULocked: null,
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
      TETUUSDCLP: {
        USDCBalance: null,
        TETUBalance: null,
        TETULOCKED: null,
        USERS: null,
      },
      PS: {
        TETUTVL: null,
        TVLUSDC: null,
        TETULOCKED: null,
        USERS: null,
      },
      VaultStats: {
        TVLUSDC: null,
        TotalUsers: null,
        UnclaimedTetu: null,
        TetuBoughtBack: null,
        PeRatio: null,
        TotalTvlAtWork: null,
      },
      LiquidityBalancer: {
        TetuBalance: null,
        PercentOfTetu: null,
        LPTETUUSDCBALANCE: null,
        TargetPrice: null,
        TargetTVL: null,
      },
      Governance: {
        TetuBalance: null,
        PercentOfTetu: null,
      },
    }

    this.data24Hour = {
      FundKeeper: {
        USDC: null,
        TETU: null,
        TETULocked: null,
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
      TETUUSDCLP: {
        USDCBalance: null,
        TETUBalance: null,
        TETULOCKED: null,
        USERS: null,
      },
      PS: {
        TETUTVL: null,
        TVLUSDC: null,
        TETULOCKED: null,
        USERS: null,
      },
      VaultStats: {
        TVLUSDC: null,
        TotalUsers: null,
        UnclaimedTetu: null,
        TetuBoughtBack: null,
        PeRatio: null,
        TotalTvlAtWork: null,
      },
      LiquidityBalancer: {
        TetuBalance: null,
        PercentOfTetu: null,
        LPTETUUSDCBALANCE: null,
        TargetPrice: null,
        TargetTVL: null,
      },
      Governance: {
        TetuBalance: null,
        PercentOfTetu: null,
      },
    }
  }
}

export const statsPageStore = new StatsPageStore()
