import {
  contractReaderChainStore,
  contractUtilsChainStore,
  networkManager,
  tetuVaultChainStore,
} from '../../../chain-stores'
import { web3Store } from '../../../web3-store'
import { strategesStore, vaultsStore } from '../../../resources-stores'
import { chartUtils } from '../../../core'
import { tvlHistoryChartStore } from '../../charts'
import { makeAutoObservable } from 'mobx'
import { tetuVaultAbi } from '../../../../abi/TetuVault'
import { TetuUSDCAbi } from '../../../../abi/Tetu-USDC'
import { LiquidityBalancerAbi } from '../../../../abi/LiquidityBalancer'
import { calcAmount, retry } from '../../../../utils'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { LPAbi } from '../../../../abi/LP'

class StatsBaseStore {
  readonly contractReaderChainStore = contractReaderChainStore
  readonly web3Store = web3Store
  readonly networkManager = networkManager
  readonly tetuVaultChainStore = tetuVaultChainStore
  readonly vaultsStore = vaultsStore
  readonly chartUtils = chartUtils
  readonly tvlHistoryChartStore = tvlHistoryChartStore
  readonly strategesStore = strategesStore
  readonly contractUtilsChainStore = contractUtilsChainStore

  constructor() {
    makeAutoObservable(this)
  }

  get tetuContract() {
    // @ts-ignore
    return new this.web3Store.web3.eth.Contract(tetuVaultAbi, this.networkManager.TetuTokenAddr)
  }

  get tetuUSDCContract() {
    // @ts-ignore
    return new this.web3Store.web3.eth.Contract(tetuVaultAbi, this.networkManager.usdcAddr)
  }

  get wmaticContract() {
    return new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      tetuVaultAbi,
      this.networkManager.addresses.wmatic,
    )
  }

  get LPTetuUSDC() {
    return new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      tetuVaultAbi,
      this.networkManager.addresses.tetuUsdcLP,
    )
  }

  get tetuUsdcQuickContract() {
    return new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      TetuUSDCAbi,
      this.networkManager.addresses.quickTetuUSDC,
    )
  }

  get LiquidityBalancerContract() {
    return new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      LiquidityBalancerAbi,
      this.networkManager.addresses.liquidityBalancer,
    )
  }

  async balanceOfUSDC(address: string, block?: number) {
    const fn = retry({
      fn: async () => {
        return await this.tetuUSDCContract.methods.balanceOf(address).call({}, block)
      },
    }, 'balanceOfUSDC')
    const response = await fn()

    return BigNumber.from(response).mul(1e9).mul(1e9).div(1e6).toString()
  }

  async balanceOfWmatic(address: string, block?: number) {
    const fn = retry({
      fn: async () => {
        return await this.wmaticContract.methods.balanceOf(address).call({}, block)
      },
    }, 'balanceOfWmatic')
    const response = await fn()
    return BigNumber.from(response).toString()
  }

  async getWmaticPrice(block?: number) {
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

  wmaticUsdc(amount: string, price: string) {
    return BigNumber.from(amount).mul(price).div(1e9).div(1e9).toString()
  }

  async balaceOfTetu(address: string, block?: number) {
    const response = await this.tetuContract.methods.balanceOf(address).call({}, block)
    return response
  }

  async balanceOfQuickSwapTetuUsdc(address: string, block?: number) {
    const response = await this.tetuUsdcQuickContract.methods.balanceOf(address).call({}, block)
    return response
  }

  async totalSuplyOfQuickSwapTetuUsdc(block?: number) {
    const response = await this.tetuUsdcQuickContract.methods.totalSupply().call({}, block)
    return response ?? BigNumber.from(0)
  }

  async token0BalanceOfQuickSwapTetuUsdc(block?: number) {
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
          .balanceOf(this.networkManager.addresses.quickTetuUSDC)
          .call({}, block)
      },
    }, 'token0BalanceOfQuickSwapTetuUsdc')

    const response = await fn2()

    return formatUnits(response, decimals)
  }

  async token1BalanceOfQuickSwapTetuUsdc(block?: number) {
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
          .balanceOf(this.networkManager.addresses.quickTetuUSDC)
          .call({}, block)
      },
    }, 'token1BalanceOfQuickSwapTetuUsdc')

    const response = await fn2()

    return formatUnits(response, decimals)
  }

  async token0BalanceOf(vaultContract: any, lp: string, block?: number) {
    const addr = await vaultContract.methods.token0().call()
    const fn1 = retry({
      fn: async () => {
        return await this.contractUtilsChainStore.erc20Decimals([addr])
      },
    }, 'token0BalanceOf')
    const [decimals] = await fn1()
    const contract = new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      TetuUSDCAbi,
      addr,
    )
    const fn2 = retry({
      fn: async () => {
        return await contract.methods.balanceOf(lp).call({}, block)
      },
    }, 'token0BalanceOf')
    const response = await fn2()
    return formatUnits(response, decimals)
  }

  async token1BalanceOf(vaultContract: any, lp: string, block?: number) {
    const fn1 = retry({
      fn: vaultContract.methods.token1().call,
    }, 'token1BalanceOf')
    const addr = await fn1()
    const [decimals] = await this.contractUtilsChainStore.erc20Decimals([addr])
    const contract = new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      TetuUSDCAbi,
      addr,
    )
    const fn2 = retry({
      fn: async () => {
        return await contract.methods.balanceOf(lp).call({}, block)
      },
    }, 'token1BalanceOf')
    const response = await fn2()
    return formatUnits(response, decimals)
  }

  async token0SymbolOfQuickSwapTetuUsdc() {
    const fn = retry({
      fn: this.tetuUsdcQuickContract.methods.token0().call,
    }, 'token1BalanceOf')
    const addr = await fn()
    const contract = new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      TetuUSDCAbi,
      addr,
    )

    return await contract.methods.symbol().call()
  }

  async token1SymbolOfQuickSwapTetuUsdc() {
    const addr = await this.tetuUsdcQuickContract.methods.token1().call()
    const contract = new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      TetuUSDCAbi,
      addr,
    )
    return await contract.methods.symbol().call()
  }

  async token0SymbolOf(vaultContract: any) {
    const fn = retry({
      fn: vaultContract.methods.token0().call,
    }, 'token0SymbolOf')
    const addr = await fn()
    const contract = new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      TetuUSDCAbi,
      addr,
    )

    return await contract.methods.symbol().call()
  }

  async token1SymbolOf(vaultContract: any) {
    const addr = await vaultContract.methods.token1().call()
    const contract = new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      TetuUSDCAbi,
      addr,
    )
    return await contract.methods.symbol().call()
  }

  async getPriceToken0OffQuickSwapTetuUsdc(block?: number) {
    const fn = retry({
      fn: async () => {
        return await this.tetuUsdcQuickContract.methods.token0().call({}, block)
      },
    }, 'getPriceToken0OffQuickSwapTetuUsdc')
    const addr = await fn()
    return await this.contractReaderChainStore.getPrice(addr)
  }

  async getPriceToken1OffQuickSwapTetuUsdc(block?: number) {
    const fn = retry({
      fn: async () => {
        return await this.tetuUsdcQuickContract.methods.token1().call({}, block)
      },
    }, 'getPriceToken1OffQuickSwapTetuUsdc')
    const addr = await fn()
    return await this.contractReaderChainStore.getPrice(addr)
  }

  async getPriceToken0(vaultContact: any, block?: number) {
    const fn = retry({
      fn: async () => {
        return await vaultContact.methods.token0().call({}, block)
      },
    }, 'getPriceToken0')
    const addr = await fn()
    const response = await this.contractReaderChainStore.getPrice(addr)
    return response
  }

  async getPriceToken1(vaultContact: any, block?: number) {
    const fn = retry({
      fn: async () => {
        return await vaultContact.methods.token1().call({}, block)
      },
    }, 'getPriceToken1')
    const addr = await fn()
    const response = await this.contractReaderChainStore.getPrice(addr)
    return response
  }

  async getBalaceOfTetuVaults(block?: number) {
    const [tetuUsdcPrice] = await this.contractReaderChainStore.getTetuTokenValues()
    const tetuVaults: string[] = this.networkManager.addresses.statsPage.LPs.tetuVaults

    const underlyings = await Promise.allSettled(
      tetuVaults.map((v) => this.contractReaderChainStore.getUnderlying(v)),
    )

    const response = await Promise.allSettled(
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
    const tetuVaults = this.networkManager.addresses.statsPage.LPs.tetuVaults
    const response = await Promise.all(
      tetuVaults.map((address: string) =>
        this.contractReaderChainStore.getVaultUsers(address, block),
      ),
    )

    return response.reduce((a, b) => Number(a) + Number(b), 0)
  }
}

export const statsBaseStore = new StatsBaseStore()
