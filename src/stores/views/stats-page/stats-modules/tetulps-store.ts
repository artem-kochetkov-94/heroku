import { makeAutoObservable } from 'mobx'
import { statsBaseStore } from './base-store'
import { calcAmount } from '../../../../utils'
import { TetuUSDCAbi as LPAbi } from '../../../../abi/Tetu-USDC'
import { tetuVaultAbi } from '../../../../abi/TetuVault'
import { formatUnits, parseUnits } from '@ethersproject/units'

export class TETULPsStore {
  private readonly statsBaseStore = statsBaseStore

  data: any = {
    USDCBalance: null,
    TETUBalance: null,
    TETULOCKED: null,
    USERS: null,
  }

  block: undefined | number = undefined

  constructor(block?: number) {
    this.block = block
    makeAutoObservable(this)
  }

  async fetchLPs() {
    const lps = []
  }

  async fetch2() {
    const { lpsWithTetu } = this.statsBaseStore.networkManager.networkAddresses

    const checkIsTetuToken = (addr: string) => {
      return addr.toLowerCase() === this.statsBaseStore.networkManager.TetuTokenAddr.toLowerCase()
    }

    const checkIsUSDCToken = (addr: string) => {
      return addr.toLowerCase() === this.statsBaseStore.networkManager.usdcAddr.toLowerCase()
    }

    const balance = {
      tetu: '0',
      usdc: '0',
    }

    let users = 0

    // return token balance in usdc
    const getTokenBalance = async (tokenAddr: string, lpAddr: string) => {
      const tokenContract = new this.statsBaseStore.web3Store.web3.eth.Contract(
        // @ts-ignore
        tetuVaultAbi,
        tokenAddr,
      )
      const amount = await tokenContract.methods.balanceOf(lpAddr).call({}, this.block)
      const [decimals] = await this.statsBaseStore.contractUtilsChainStore.erc20Decimals([
        tokenAddr,
      ])
      const price = await this.statsBaseStore.contractReaderChainStore.getPrice(tokenAddr)

      return parseUnits(
        Number(formatUnits(amount, decimals)) * Number(formatUnits(price)) + '',
      ).toString()
    }

    for (const { lp, vault } of lpsWithTetu) {
      const LPContract = new this.statsBaseStore.web3Store.web3.eth.Contract(
        // @ts-ignore
        LPAbi,
        lp,
      )
      const token0 = await LPContract.methods.token0().call()
      const token1 = await LPContract.methods.token1().call()

      const vaultUsers = await this.statsBaseStore.contractReaderChainStore.getVaultUsers(vault)
      users += Number(vaultUsers)

      if (checkIsTetuToken(token0)) {
        const amount1 = await this.statsBaseStore.balaceOfTetu(lp, this.block)
        balance.tetu = calcAmount([balance.tetu, amount1])
      } else {
        if (checkIsUSDCToken(token0)) {
          const amount2 = await this.statsBaseStore.balanceOfUSDC(lp, this.block)
          balance.usdc = calcAmount([balance.usdc, amount2])
        } else {
          const amount3 = await getTokenBalance(token0, lp)
          balance.usdc = calcAmount([balance.usdc, amount3])
        }
      }

      if (checkIsTetuToken(token1)) {
        const amount4 = await this.statsBaseStore.balaceOfTetu(lp, this.block)
        balance.tetu = calcAmount([balance.tetu, amount4])
      } else {
        if (checkIsUSDCToken(token1)) {
          const amount5 = await this.statsBaseStore.balanceOfUSDC(lp, this.block)
          balance.usdc = calcAmount([balance.usdc, amount5])
        } else {
          const amount6 = await getTokenBalance(token1, lp)
          balance.usdc = calcAmount([balance.usdc, amount6])
        }
      }
    }

    const { usdc, tetu } = await this.statsBaseStore.getBalaceOfTetuVaults(this.block)
    const vaultsUsers = await this.statsBaseStore.getUsersOfTetuVaults(this.block)
    users += Number(vaultsUsers)

    balance.tetu = calcAmount([balance.tetu, tetu])
    balance.usdc = calcAmount([balance.usdc, usdc])

    const totalSupply = await this.statsBaseStore.tetuVaultChainStore.getTotalSupply(this.block)
    // @ts-ignore
    const tetuLocked = (balance.tetu / totalSupply) * 100

    this.data = {
      USDCBalance: balance.usdc,
      TETUBalance: balance.tetu,
      TETULOCKED: tetuLocked,
      USERS: users,
    }
  }

  // deprecated
  // async fetch() {
  //   const {
  //     tetuUsdcLP,
  //     quickTetuUSDC,
  //     tetuWmaticSushi,
  //     tetuSushiWmaticVault,
  //     tetuUsdcLPVault,
  //     quicktetuUsdcLPVault,
  //   } = this.statsBaseStore.networkManager.networkAddresses
  //
  //   const response = await Promise.allSettled([
  //     this.statsBaseStore.balanceOfUSDC(tetuUsdcLP!, this.block), // 0 // 6 decimals
  //     this.statsBaseStore.balaceOfTetu(tetuUsdcLP!, this.block), // 1
  //     this.statsBaseStore.contractReaderChainStore.getVaultUsers(tetuUsdcLPVault!, this.block), // 2
  //     this.statsBaseStore.balanceOfUSDC(quickTetuUSDC!, this.block), // 3
  //     this.statsBaseStore.balaceOfTetu(quickTetuUSDC!, this.block), // 4
  //     this.statsBaseStore.contractReaderChainStore.getVaultUsers(quicktetuUsdcLPVault!, this.block), // 5
  //     this.statsBaseStore.balanceOfWmatic(tetuWmaticSushi!, this.block), // 6
  //     this.statsBaseStore.getWmaticPrice(this.block), // 7
  //     this.statsBaseStore.balaceOfTetu(tetuWmaticSushi!, this.block), // 8
  //     this.statsBaseStore.contractReaderChainStore.getVaultUsers(tetuSushiWmaticVault!, this.block), // 9
  //     this.statsBaseStore.getBalaceOfTetuVaults(this.block), // 10
  //     this.statsBaseStore.getUsersOfTetuVaults(this.block), // 11
  //     this.statsBaseStore.tetuVaultChainStore.getTotalSupply(), // 12
  //   ])
  //
  //   // @ts-ignore
  //   const values = response.map((el) => el.value)
  //
  //   const totalSupply = values[12]
  //
  //   this.data.USDCBalance = calcAmount([
  //     values[0],
  //     values[3],
  //     this.statsBaseStore.wmaticUsdc(values[6], values[7]),
  //     values[10].usdc,
  //   ])
  //
  //   this.data.TETUBalance = calcAmount([values[1], values[4], values[8], values[10].tetu])
  //   // @ts-ignore
  //   this.data.TETULOCKED =
  //     // @ts-ignore
  //     (calcAmount([values[1], values[4], values[8], values[10].tetu]) / totalSupply) * 100
  //
  //   this.data.USERS = calcAmount([values[2], values[5], values[9], values[11]])
  // }
}
