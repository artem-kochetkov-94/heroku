import * as React from 'react'

import { makeAutoObservable } from 'mobx'
import { web3Store } from '../web3-store'
import { networkManager } from './network-manager'
import { TokenAbi } from '../../abi/Token'
import { metaMaskStore } from '../meta-mask-store'
import { BigNumber, BigNumberish } from 'ethers'
import { TokenZapTransactionType, TxChache } from './types'
import { LocalStorage } from '../core'
import { notification } from 'antd'
import { contractUtilsChainStore } from './contract-utils'
import { contractReaderChainStore } from './contact-reader-store'
import { parseUnits } from 'ethers/lib/utils'
import UsdcLogo from '../../static/USDC.webp'
import MaticLogo from '../../static/asset-icons/matic.webp'
import WBTCLogo from '../../static/asset-icons/WBTC.png'
import USDTLogo from '../../static/asset-icons/USDT.png'
import DAILogo from '../../static/asset-icons/DAI.png'
import WETHLogo from '../../static/asset-icons/WETH.png'
import BALLogo from '../../static/asset-icons/BAL.svg'
import TETULogo from '../../static/tetu-token/token-dark.svg'
import { ZapTetuBalABI, ZapV2ABI } from "../../abi/ZapV2";
import { formatUnits } from "@ethersproject/units";
import { namesManagerStore } from "../utils/names-manager-store";
import { userInfoOfVaultStore, vaultInfoStore } from "../resources-stores";
import { txHistoryStore } from '../tx-history'
import dayjs from 'dayjs'

export const zapV2TransactionStorageStore = new LocalStorage<TxChache>(
  '@tetu-zap-test2-transaction-id',
)

export enum zapV2Methods {
  Single = 'Single',
  UniswapV2 = 'UniswapV2',
  Balancer = 'Balancer',
  BalancerAaveBoostedStablePool = 'BalancerAaveBoostedStablePool',
  BalancerTetuBal = 'BalancerTetuBal',
  BalancerWethBalTetuBal = 'BalancerWethBalTetuBal',
  BalancerTetuQiQi = 'BalancerTetuQiQi',
}

type Route = {
  fromTokenAddress: string
  name: string
  part: number
  toTokenAddress: string
}

export type Routes = Array<Route | Routes>

const zapV2MethodByVaultAddress: { [addr: string]: zapV2Methods } = {
  '0xf2fB1979C4bed7E71E6ac829801E0A8a4eFa8513': zapV2Methods.BalancerAaveBoostedStablePool,
  '0x7fC9E0Aa043787BFad28e29632AdA302C790Ce33': zapV2Methods.BalancerTetuBal,
  '0x190cA39f86ea92eaaF19cB2acCA17F8B2718ed58': zapV2Methods.BalancerTetuQiQi,
  '0xBD06685a0e7eBd7c92fc84274b297791F3997ed3': zapV2Methods.BalancerWethBalTetuBal,
}

const zapV2MethodByPlatform: { [platform: string]: zapV2Methods } = {
  '24': zapV2Methods.Single, // STRATEGY_SPLITTER
  '21': zapV2Methods.Single, // QIDAO
  '29': zapV2Methods.Single, // TETU
  '40': zapV2Methods.UniswapV2, // DYSTOPIA
  '36': zapV2Methods.Balancer, // BALANCER
}

const zapV2Gaps: { [addr: string]: number } = {
  '0x1AB27A11A5A932e415067f6f20a65245Bd47E4D1': 100, // xBAL
}

const zapV2Assets: { [addr: string]: string[] } = {
  // TETU-USD+ [DYSTOPIA]
  '0x984ED0DAe53947A209A877841Cbe6138cA7A7a5f': ['0x236eeC6359fb44CCe8f97E99387aa7F8cd5cdE1f', '0x255707B70BF90aa112006E1b07B9AeA6De021424',], // usd+ tetu

  // stMATIC-WMATIC BPT [BALANCER]
  '0xA8Fab27B7d41fF354f0034addC2d6a53b5E31356': ['0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', '0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4',],

  // MATICX-WMATIC BPT [BALANCER]
  '0x1e8a077d43A963504260281E73EfCA6292d48A2f': ['0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', '0xfa68FB4628DFF1028CFEc22b4162FCcd0d45efb6',],

  // wUSDR-USDC BPT [BALANCER]
  '0x08D88Dd2BBA2898C72A180bD8023FEC9f0Cb9799': ['0xAF0D9D65fC54de245cdA37af3d18cbEc860A4D4b', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',],

  // SPHERE-WMATIC BPT [BALANCER]
  '0x873B46600f660dddd81B84aeA655919717AFb81b': ['0x62F594339830b90AE4C084aE7D223fFAFd9658A7', '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',],

  // amUSD BPT [BALANCER]
  '0xf2fB1979C4bed7E71E6ac829801E0A8a4eFa8513': ['0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',],

  // tetuBAL [BALANCER]
  '0x7fC9E0Aa043787BFad28e29632AdA302C790Ce33': ['0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', '0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3',],

  // tetuQI-QI BPT [BALANCER]
  '0x190cA39f86ea92eaaF19cB2acCA17F8B2718ed58': ['0x580A84C73811E1839F75d86d75d88cCa0c241fF4',],
}

const zapV2PoolWeights: { [vaultAddr: string]: number[] } = {
  '0x873B46600f660dddd81B84aeA655919717AFb81b': [20, 80,],
}

class ZapV2ChainStore {
  private readonly web3Store = web3Store
  private readonly networkManager = networkManager
  readonly transactionStorage = zapV2TransactionStorageStore
  private readonly txHistoryStore = txHistoryStore
  private readonly contractUtilsChainStore = contractUtilsChainStore
  private readonly metaMaskStore = metaMaskStore
  private readonly contractReaderChainStore = contractReaderChainStore

  constructor() {
    makeAutoObservable(this)
    this.tokenIn = this.tokenList[0].address!
  }

  initialized: boolean = false
  method?: zapV2Methods

  vaultAddress: string | null = null
  vaultUnderlying: string | null = null
  zapContractAddress: string | null = null
  tokenIn: string | null = null
  assets?: string[]
  assetsDecimals?: number[]

  swapTransactionAsset0?: { data: string, to: string, }
  swapTransactionAsset1?: { data: string, to: string, }
  swapTransactionAssets: { data: string, to: string, }[] = []
  quoteDepositShare?: string
  amountsOut: string[] = []
  priceimpactDeposit?: string

  swapExitTransactionAsset0?: { data: string, to: string, }
  swapExitTransactionAsset1?: { data: string, to: string, }
  swapExitTransactionAssets: { data: string, to: string, }[] = []
  quoteExitAmount?: string
  priceimpactExit?: string

  balanceOfTokenIn: string | null = null
  decimalsOfTokenIn: number | null = null
  decimalsOfVaultShare: number | null = null

  priceOfTokenIn?: string
  priceOfVaultShare?: string

  useZapContract = false
  slippageTolerance: number = 5

  isCheckingApprove = false
  isApprovedDeposit = false

  isCheckingApproveWithdraw = false
  isApprovedWithdraw = false

  isFetchingDeposit = false
  isFetchingWithdraw = false
  isFetchingWithdrawAllAndClaim = false
  isFetchingClaim = false

  isShowLoader = false
  isPendingApproveDeposit = false
  isPendingApproveWithdraw = false
  isPendingDeposit = false
  isPendingWithdraw = false
  isPendingWithdrawAndClaim = false
  isPendingClaim = false

  depositValue = 0
  withdrawValue = 0

  buildedTx: {
    [key: string]: any
  } = {};

  private interval: any = null
  private readonly intervalPeriod = 5000

  clearBuildedTx() {
    this.buildedTx = {};
  }

  getZapV2Method(vault?: { addr: string, platform: string, }): zapV2Methods | undefined {
    // console.log('getZapV2Method vault', vault)

    if (vault) {
      if (zapV2MethodByVaultAddress[vault.addr]) {
        return zapV2MethodByVaultAddress[vault.addr]
      }
      if (zapV2MethodByPlatform[vault.platform] && !networkManager.addresses.zapExcludeList.includes(vault.addr)) {
        return zapV2MethodByPlatform[vault.platform]
      }
    }

    return undefined
  }

  getZapV2Assets(vault?: { addr: string, platform: string, underlying: string, }, method?: zapV2Methods): string[] {
    if (vault && method) {
      if (method === zapV2Methods.Single) {
        return [vault.underlying,]
      }
      if (method === zapV2Methods.BalancerWethBalTetuBal) {
        return ['0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', '0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3']
      }
      if (zapV2Assets[vault.addr]) {
        return zapV2Assets[vault.addr]
      }
    }

    return []
  }

  getZapV2ContractAddress(method: zapV2Methods): string {
    if (method === zapV2Methods.BalancerWethBalTetuBal) {
      return '0x3aA67B2Ae7316C9a158CD63772e2E7074125C8DC'; // ZapTetuBal
    }

    return '0x9D48848c863d2eAEa7901f01E3AcCF777375071f'; // ZapV2
  }

  getZapV2Contract() {
    if (this.method === zapV2Methods.BalancerWethBalTetuBal) {
      return new this.web3Store.web3.eth.Contract(
        // @ts-ignore
        ZapTetuBalABI,
        this.zapContractAddress
      )
    }
    return new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      ZapV2ABI,
      this.zapContractAddress
    )
  }

  getZapV2Descriptions() {
    if (this.method === zapV2Methods.Single) {
      return [
        "The selected token will be exchanged for the underlying token through 1inch DeX aggregator and deposited into the vault.",
        "Your share will be pulled out of Tetu vault and exchanged for the selected token through 1inch DeX aggregator.",
      ]
    }

    if (this.method === zapV2Methods.UniswapV2 && this.assets) {
      const asset0 = namesManagerStore.getAssetName(this.assets[0])
      const asset1 = namesManagerStore.getAssetName(this.assets[1])
      return [
        `The selected token will be exchanged for ${asset0} and ${asset1} through 1inch DeX aggregator in equal shares. The received tokens will be contributed to the liquidity pool, and LP token will be deposited to the Tetu vault.`,
        `Your share will be pulled out of Tetu vault. After leaving the liquidity pool, the received ${asset0} and ${asset1} will be exchanged for the token of your choice at the best price through the 1inch DeX aggregator.`,
      ]
    }

    if (this.method === zapV2Methods.Balancer && this.assets) {
      const asset0 = namesManagerStore.getAssetName(this.assets[0])
      const asset1 = namesManagerStore.getAssetName(this.assets[1])
      return [
        `The selected token will be exchanged for ${asset0} and ${asset1} through 1inch DeX aggregator in proportional of Balancer pool reserves shares. The received tokens will be contributed to the liquidity pool, and BPT will be deposited to the Tetu vault.`,
        `Your share will be pulled out of Tetu vault. After leaving the liquidity pool, the received ${asset0} and ${asset1} will be exchanged for the token of your choice at the best price through the 1inch DeX aggregator.`,
      ]
    }

    if (this.method === zapV2Methods.BalancerAaveBoostedStablePool) {
      return [
        "The process of converting your assets to DAI, USDC and USDT through 1inch DeX aggregator will be carried out to create bb-am-usd BPT tokens. BPT will be deposited to the Tetu vault.",
        "Your share will be pulled out of Tetu vault. After leaving the liquidity pool, the received DAI, USDC and USDT will be exchanged for the token of your choice at the best price through the 1inch DeX aggregator.",
      ]
    }

    if (this.method === zapV2Methods.BalancerTetuBal) {
      return [
        "The process of converting your assets to WETH and BAL through 1inch DeX aggregator will be carried out to create BAL80-ETH20 BPT tokens. These tokens will be utilized to gain access to the tetuBAL position, which allows for the purchase of tetuBAL on the market or the minting of new tetuBAL.",
        "Your tetuBAL will be swapped to BAL80-ETH20 BPT. After leaving the liquidity pool, the received BAL and WETH will be exchanged for the token of your choice at the best price through the 1inch DeX aggregator.",
      ]
    }

    if (this.method === zapV2Methods.BalancerTetuQiQi && this.assets) {
      return [
        `The selected token will be exchanged for Qi through 1inch DeX aggregator. Qi will be utilized to gain access to the tetuQi position, which allows for the purchase of tetuQi on the market or the minting of new tetuQi. The received tokens will be contributed to the liquidity pool, and BPT will be deposited to the Tetu vault.`,
        `Your share will be pulled out of Tetu vault. After leaving the liquidity pool, received tetuQi will be swapped to Qi and all your Qi will be swapped for the token of your choice at the best price through the 1inch DeX aggregator..`,
      ]
    }

    if (this.method === zapV2Methods.BalancerWethBalTetuBal) {
      return [
        "The process of converting your assets to WETH and BAL through 1inch DeX aggregator will be carried out to create BAL80-ETH20 BPT tokens. These tokens will be utilized to gain access to the tetuBAL position, which allows for the purchase of tetuBAL on the market or the minting of new tetuBAL. Both tetuBAL and any remaining BAL80-ETH20 BPT will be turned into liquidity and deposited in the Tetu vault to earn auto compound income.",
        "Your share will be pulled out of Tetu vault. BPT tokens will be burned and received tetuBAL will be swapped to BAL80-ETH20 BPT. After leaving the liquidity pool, the received BAL and WETH will be exchanged for the token of your choice at the best price through the 1inch DeX aggregator.",
      ]
    }

    return ["", "",]
  }

  init(
    vaultAddress: string,
    assets?: string[],
    decimalsOfVaultShare: number = 18,
    method: zapV2Methods = zapV2Methods.BalancerWethBalTetuBal,
    underlying: string = ''
  ) {
    this.vaultAddress = vaultAddress
    this.zapContractAddress = this.getZapV2ContractAddress(method)
    this.assets = assets
    this.decimalsOfVaultShare = decimalsOfVaultShare
    this.initialized = true
    this.method = method
    this.vaultUnderlying = underlying
  }

  setDepositValue(value: number) {
    this.depositValue = value
  }

  setDepositValueAndQuote(value: number) {
    // console.log('zapv2store setDepositValueAndQuote')
    this.buildedTx = {};
    this.depositValue = value
    this.quoteDepositShare = undefined
    this.swapTransactionAsset0 = undefined
    this.swapTransactionAsset1 = undefined
    this.swapTransactionAssets = []
    this.quoteDeposit()
  }

  async quoteDeposit() {
    if (
      this.tokenIn
      && this.decimalsOfTokenIn
      && this.depositValue
      && this.method
      && this.priceOfTokenIn
    ) {
      // console.log('zapv2store quoteDeposit() started')
      const amount = parseUnits(
        this.depositValue + '',
        this.decimalsOfTokenIn as BigNumberish,
      );

      this.isFetchingDeposit = true

      if (this.assets && !this.assetsDecimals?.length) {
        this.assetsDecimals = (await this.contractUtilsChainStore.erc20Decimals(this.assets)).map((d: string) => parseInt(d))
      }

      const quote = await this.quoteDepositOutput(amount, true)

      if (!amount.eq(parseUnits(
        this.depositValue + '',
        this.decimalsOfTokenIn as BigNumberish,
      ))) {
        console.log('quote result of old depositValue')
        return
      }

      this.swapTransactionAsset0 = quote.swapQuoteAsset0?.tx;
      this.swapTransactionAsset1 = quote.swapQuoteAsset1?.tx;
      this.swapTransactionAssets = quote.swapQuoteAssets.map(s => s.tx);
      this.quoteDepositShare = quote.quoteDepositShare

      // quote for calc price impact between $0.01 and amount
      const amountSmall = parseUnits('1', 18 as BigNumberish).mul(parseUnits('1', 18 as BigNumberish)).div(BigNumber.from(this.priceOfTokenIn)).div(100).div(10 ** (18 - this.decimalsOfTokenIn))
      const quoteSmall = await this.quoteDepositOutput(amountSmall)
      if (quoteSmall?.quoteDepositShare) {
        const priceQuote = parseFloat(formatUnits(BigNumber.from(quote.quoteDepositShare))) / parseFloat(formatUnits(amount, this.decimalsOfTokenIn as BigNumberish))
        const priceQuoteSmall = parseFloat(formatUnits(BigNumber.from(quoteSmall.quoteDepositShare))) / parseFloat(formatUnits(amountSmall, this.decimalsOfTokenIn as BigNumberish))
        this.priceimpactDeposit = - priceQuoteSmall / priceQuote * 100 + 100 + ''
      }

      this.isFetchingDeposit = false
    }


  }

  async quoteDepositOutput(amount: BigNumber, shoudSaveTx?: boolean) {
    // console.log('zapv2store quoteDepositOutput')
    const ret: {
      quoteDepositShare?: string,
      swapQuoteAsset0?: {
        tx: { data: string, to: string, },
        toTokenAmount: string,
      },
      swapQuoteAsset1?: {
        tx: { data: string, to: string, },
        toTokenAmount: string,
      },
      swapQuoteAssets: {
        tx: { data: string, to: string, },
        toTokenAmount: string,
      }[],
    } = {
      swapQuoteAssets: [],
    }

    const zapContract = this.getZapV2Contract()

    if (
      this.method === zapV2Methods.Single
      && this.assets?.length === 1
    ) {
      ret.swapQuoteAsset0 = await this.getSwapQuoteAsset(this.tokenIn, this.assets[0], amount.toString(), shoudSaveTx)
      ret.quoteDepositShare = (await zapContract.methods.quoteIntoSingle(this.vaultAddress, ret.swapQuoteAsset0?.toTokenAmount).call()).toString()
    }

    if (
      this.method === zapV2Methods.UniswapV2
      && this.assets?.length === 2
    ) {
      ret.swapQuoteAsset0 = await this.getSwapQuoteAsset(this.tokenIn, this.assets[0], amount.div(2).toString(), shoudSaveTx)
      ret.swapQuoteAsset1 = await this.getSwapQuoteAsset(this.tokenIn, this.assets[1], amount.div(2).toString(), shoudSaveTx)
      ret.quoteDepositShare = (await zapContract.methods.quoteIntoUniswapV2(
        this.vaultAddress,
        ret.swapQuoteAsset0?.toTokenAmount,
        ret.swapQuoteAsset1?.toTokenAmount
      ).call()).toString()
    }

    if (
      this.method === zapV2Methods.Balancer
      && this.assets
      && this.assets.length > 1
      && this.vaultUnderlying
      // @ts-ignore
      && this.assetsDecimals
      && this.assetsDecimals.length > 1
      && this.vaultAddress
    ) {
      const poolTokens = await this.getBalancerAssetsBalances(this.vaultUnderlying)
      const quoteAssets = []
      const quoteAmounts = []

      const weightedPool = !!zapV2PoolWeights[this.vaultAddress]

      if (!weightedPool) {
        let totalRealAssetsBalanceDecimalsIndependent = BigNumber.from(0);
        for (let i = 0, k = 0; i < poolTokens[0].length; i++) {
          if (poolTokens[0][i] !== this.vaultUnderlying) {
            const poolTokenAmountDecimalsIndependent = BigNumber.from(poolTokens[1][i]).mul(parseUnits('1', this.assetsDecimals[k]))
            totalRealAssetsBalanceDecimalsIndependent = totalRealAssetsBalanceDecimalsIndependent.add(poolTokenAmountDecimalsIndependent)
            k++;
          }
        }

        let swapQuoteAsset;
        for (let i = 0, k = 0; i < poolTokens[0].length; i++) {
          quoteAssets.push(poolTokens[0][i])
          if (poolTokens[0][i] !== this.vaultUnderlying) {
            swapQuoteAsset = await this.getSwapQuoteAsset(this.tokenIn, poolTokens[0][i], amount.mul(poolTokens[1][i]).mul(parseUnits('1', this.assetsDecimals[k])).div(totalRealAssetsBalanceDecimalsIndependent).toString(), shoudSaveTx)
            k++;
          } else {
            swapQuoteAsset = {
              tx: { data: '0x00', },
              toTokenAmount: '0',
            }
          }

          quoteAmounts.push(swapQuoteAsset.toTokenAmount)
          ret.swapQuoteAssets.push(swapQuoteAsset)
        }
      } else {
        for (let i = 0; i < poolTokens[0].length; i++) {
          quoteAssets.push(poolTokens[0][i])
          const swapQuoteAsset = await this.getSwapQuoteAsset(this.tokenIn, poolTokens[0][i], amount.mul(zapV2PoolWeights[this.vaultAddress][i]).div(100).toString(), shoudSaveTx)
          quoteAmounts.push(swapQuoteAsset.toTokenAmount)
          ret.swapQuoteAssets.push(swapQuoteAsset)
        }
      }

      ret.quoteDepositShare = (await zapContract.methods.quoteIntoBalancer(
        this.vaultAddress,
        quoteAssets,
        quoteAmounts
      ).call()).toString()
    }

    if (
      this.method === zapV2Methods.BalancerAaveBoostedStablePool
      // @ts-ignore
      && this.assets
      && this.assets.length === 3
      && this.vaultUnderlying
    ) {
      const poolTokens = await this.getBalancerAssetsBalances(this.vaultUnderlying)
      const quoteAmounts = []
      let totalRealAssetsBalance = BigNumber.from(0);
      for (let i = 0; i < poolTokens[0].length; i++) {
        if (poolTokens[0][i] !== this.vaultUnderlying) {
          totalRealAssetsBalance = totalRealAssetsBalance.add(BigNumber.from(poolTokens[1][i]))
        }
      }

      let swapQuoteAsset;
      for (let i = 0, k = 0; i < poolTokens[0].length; i++) {
        if (poolTokens[0][i] !== this.vaultUnderlying) {
          swapQuoteAsset = await this.getSwapQuoteAsset(this.tokenIn, this.assets[k], amount.mul(poolTokens[1][i]).div(totalRealAssetsBalance).toString(), shoudSaveTx)
          quoteAmounts.push(swapQuoteAsset.toTokenAmount)
          k++;
          ret.swapQuoteAssets.push(swapQuoteAsset)
        }
      }
      ret.quoteDepositShare = (await zapContract.methods.quoteIntoBalancerAaveBoostedStablePool(
        quoteAmounts
      ).call()).toString()
    }

    if (
      this.method === zapV2Methods.BalancerTetuBal
      && this.assets?.length === 2
    ) {
      ret.swapQuoteAsset0 = await this.getSwapQuoteAsset(this.tokenIn, this.assets[0], amount.mul(2).div(10).toString(), shoudSaveTx)
      ret.swapQuoteAsset1 = await this.getSwapQuoteAsset(this.tokenIn, this.assets[1], amount.mul(8).div(10).toString(), shoudSaveTx)
      ret.quoteDepositShare = (await zapContract.methods.quoteIntoBalancerTetuBal(ret.swapQuoteAsset0?.toTokenAmount, ret.swapQuoteAsset1?.toTokenAmount).call()).toString()
    }

    if (
      this.method === zapV2Methods.BalancerTetuQiQi
      && this.assets?.length === 1
    ) {
      ret.swapQuoteAsset0 = await this.getSwapQuoteAsset(this.tokenIn, this.assets[0], amount.toString(), shoudSaveTx)
      ret.quoteDepositShare = (await zapContract.methods.quoteIntoBalancerTetuQiQi(ret.swapQuoteAsset0?.toTokenAmount).call()).toString()
    }

    if (
      this.method === zapV2Methods.BalancerWethBalTetuBal
      && this.assets?.length === 2
    ) {
      ret.swapQuoteAsset0 = await this.getSwapQuoteAsset(this.tokenIn, this.assets[0], amount.mul(2).div(10).toString(), shoudSaveTx)
      ret.swapQuoteAsset1 = await this.getSwapQuoteAsset(this.tokenIn, this.assets[1], amount.mul(8).div(10).toString(), shoudSaveTx)
      ret.quoteDepositShare = (await zapContract.methods.quoteInSharedAmount(ret.swapQuoteAsset0?.toTokenAmount, ret.swapQuoteAsset1?.toTokenAmount).call()).toString()
    }

    return ret;
  }

  async getBalancerAssetsBalances(bpt: string) {
    const zapContract = this.getZapV2Contract()
    return await zapContract.methods.getBalancerPoolTokens(bpt).call()
  }

  setWithdrawValue(value: number) {
    this.withdrawValue = value
  }

  setWithdrawValueAndQuote(value: number) {
    this.buildedTx = {};
    this.withdrawValue = value
    this.quoteExitAmount = undefined
    this.swapExitTransactionAsset0 = undefined
    this.swapExitTransactionAsset1 = undefined
    this.swapExitTransactionAssets = []
    this.amountsOut = []
    this.quoteExit()
  }

  async quoteExit() {
    if (
      this.tokenIn
      && this.decimalsOfTokenIn
      && parseFloat(this.withdrawValue + '') > 0
    ) {
      // console.log('quoteExit start')
      this.isFetchingWithdraw = true

      const amount = parseUnits(this.withdrawValue + '', this.decimalsOfVaultShare as BigNumberish)

      const quote = await this.quoteExitOutput(amount, true)

      if (!amount.eq(parseUnits(this.withdrawValue + '', this.decimalsOfVaultShare as BigNumberish))) {
        console.log('quote result of old withdrawValue')
        return
      }

      this.swapExitTransactionAsset0 = quote.swapQuoteAsset0?.tx;
      this.swapExitTransactionAsset1 = quote.swapQuoteAsset1?.tx;
      this.swapExitTransactionAssets = quote.swapQuoteAssets.map(s => s.tx)
      this.quoteExitAmount = quote.quoteExitAmount
      this.amountsOut = quote.quoteOutAmounts

      // quote for calc price impact between $0.01 and amount
      const amountSmall = parseUnits('1', this.decimalsOfVaultShare as BigNumberish).mul(parseUnits('1', 18 as BigNumberish)).div(BigNumber.from(this.priceOfVaultShare)).div(100)
      // const amountSmall = parseUnits('1', 18 as BigNumberish).mul(parseUnits('1', 18 as BigNumberish)).div(BigNumber.from(this.priceOfTokenIn)).div(100).div(10**(18 - this.decimalsOfTokenIn))

      const quoteSmall = await this.quoteExitOutput(amountSmall)
      if (quoteSmall?.quoteExitAmount) {
        const priceQuote = parseFloat(formatUnits(BigNumber.from(quote.quoteExitAmount), this.decimalsOfTokenIn as BigNumberish)) / parseFloat(formatUnits(amount))
        const priceQuoteSmall = parseFloat(formatUnits(BigNumber.from(quoteSmall.quoteExitAmount), this.decimalsOfTokenIn as BigNumberish)) / parseFloat(formatUnits(amountSmall))
        this.priceimpactExit = - priceQuoteSmall / priceQuote * 100 + 100 + ''
      }

      this.isFetchingWithdraw = false
    }
  }

  async quoteExitOutput(amount: BigNumber, shoudSaveTx?: boolean) {
    const ret: {
      quoteExitAmount?: string,
      swapQuoteAsset0?: {
        tx: { data: string, to: string, },
        toTokenAmount: string,
      },
      swapQuoteAsset1?: {
        tx: { data: string, to: string, },
        toTokenAmount: string,
      },
      swapQuoteAssets: {
        tx: { data: string, to: string, },
        toTokenAmount: string,
      }[],
      quoteOutAmounts: string[],
    } = { swapQuoteAssets: [], quoteOutAmounts: [], }

    if (
      this.tokenIn
      && this.decimalsOfTokenIn
      && this.withdrawValue
      && this.vaultAddress
    ) {
      const zapContract = this.getZapV2Contract()

      if (
        this.method === zapV2Methods.Single
        && this.assets?.length === 1
      ) {
        const quoteOutAmount = await zapContract.methods.quoteOutSingle(this.vaultAddress, amount, zapV2Gaps[this.vaultAddress] || 0).call()
        ret.swapQuoteAsset0 = await this.getSwapQuoteAsset(this.assets[0], this.tokenIn, quoteOutAmount, shoudSaveTx)
        ret.quoteExitAmount = BigNumber.from(ret.swapQuoteAsset0?.toTokenAmount).toString()
      }

      if (
        this.method === zapV2Methods.UniswapV2
        && this.assets?.length === 2
      ) {
        const quoteOutAmounts = await zapContract.methods.quoteOutUniswapV2(this.vaultAddress, amount).call()
        ret.swapQuoteAsset0 = await this.getSwapQuoteAsset(this.assets[0], this.tokenIn, quoteOutAmounts[0], shoudSaveTx)
        ret.swapQuoteAsset1 = await this.getSwapQuoteAsset(this.assets[1], this.tokenIn, quoteOutAmounts[1], shoudSaveTx)
        ret.quoteExitAmount = BigNumber.from(ret.swapQuoteAsset0?.toTokenAmount).add(BigNumber.from(ret.swapQuoteAsset1?.toTokenAmount)).toString()
      }

      if (
        this.method === zapV2Methods.Balancer
        && this.vaultUnderlying
      ) {
        const poolTokens = await this.getBalancerAssetsBalances(this.vaultUnderlying)
        const assets = []
        for (let i = 0; i < poolTokens[0].length; i++) {
          assets[i] = poolTokens[0][i]
        }

        const quoteOutAmounts = await zapContract.methods.quoteOutBalancer(this.vaultAddress, assets, amount).call()

        ret.quoteOutAmounts = quoteOutAmounts

        ret.quoteExitAmount = '0'
        let swapQuoute
        for (let i = 0; i < poolTokens[0].length; i++) {
          if (assets[i] !== this.vaultUnderlying) {
            swapQuoute = await this.getSwapQuoteAsset(assets[i], this.tokenIn, BigNumber.from(quoteOutAmounts[i]).sub(1).toString(), shoudSaveTx)
          } else {
            swapQuoute = {
              tx: { data: '0x00', },
              toTokenAmount: '0',
            }
          }

          ret.swapQuoteAssets.push(swapQuoute)
          ret.quoteExitAmount = BigNumber.from(ret.quoteExitAmount).add(BigNumber.from(swapQuoute.toTokenAmount)).toString()
        }
      }

      if (
        this.method === zapV2Methods.BalancerAaveBoostedStablePool
        && this.assets
        && this.vaultUnderlying
      ) {
        const poolTokens = await this.getBalancerAssetsBalances(this.vaultUnderlying)

        const quoteOutAmounts = await zapContract.methods.quoteOutBalancerAaveBoostedStablePool(amount).call()

        ret.quoteOutAmounts = quoteOutAmounts

        ret.quoteExitAmount = '0'
        let swapQuoute
        for (let i = 0, k = 0; i < poolTokens[0].length; i++) {
          if (poolTokens[0][i] !== this.vaultUnderlying) {
            swapQuoute = await this.getSwapQuoteAsset(this.assets[k], this.tokenIn, quoteOutAmounts[k], shoudSaveTx)
            k++;
            ret.swapQuoteAssets.push(swapQuoute)
            ret.quoteExitAmount = BigNumber.from(ret.quoteExitAmount).add(BigNumber.from(swapQuoute.toTokenAmount)).toString()
          }
        }
      }

      if (
        this.method === zapV2Methods.BalancerTetuBal
        && this.assets?.length === 2
      ) {
        const quoteOutAmounts = await zapContract.methods.quoteOutBalancerTetuBal(amount).call()
        ret.swapQuoteAsset0 = await this.getSwapQuoteAsset(this.assets[0], this.tokenIn, quoteOutAmounts[0], shoudSaveTx)
        ret.swapQuoteAsset1 = await this.getSwapQuoteAsset(this.assets[1], this.tokenIn, quoteOutAmounts[1], shoudSaveTx)
        ret.quoteExitAmount = BigNumber.from(ret.swapQuoteAsset0?.toTokenAmount).add(BigNumber.from(ret.swapQuoteAsset1?.toTokenAmount)).toString()
      }

      if (
        this.method === zapV2Methods.BalancerTetuQiQi
        && this.assets?.length === 1
      ) {
        const quoteOutAmount = await zapContract.methods.quoteOutBalancerTetuQiQi(amount).call()
        ret.swapQuoteAsset0 = await this.getSwapQuoteAsset(this.assets[0], this.tokenIn, quoteOutAmount, shoudSaveTx)
        ret.quoteExitAmount = ret.swapQuoteAsset0?.toTokenAmount
      }

      if (
        this.method === zapV2Methods.BalancerWethBalTetuBal
        && this.assets?.length === 2
      ) {
        const quoteOutAmounts = await zapContract.methods.quoteOutAssets(amount).call()
        ret.swapQuoteAsset0 = await this.getSwapQuoteAsset(this.assets[0], this.tokenIn, quoteOutAmounts[0], shoudSaveTx)
        ret.swapQuoteAsset1 = await this.getSwapQuoteAsset(this.assets[1], this.tokenIn, quoteOutAmounts[1], shoudSaveTx)
        ret.quoteExitAmount = BigNumber.from(ret.swapQuoteAsset0?.toTokenAmount).add(BigNumber.from(ret.swapQuoteAsset1?.toTokenAmount)).toString()
      }
    }

    return ret
  }

  async getSwapQuoteAsset(tokenIn: string | null, tokenOut: string, amount: string, shoudSaveTx?: boolean) {
    if (tokenIn !== tokenOut) {
      const txForSwap = await this.buildTxForSwap(JSON.stringify({
        fromTokenAddress: tokenIn,
        toTokenAddress: tokenOut,
        amount,
        fromAddress: this.zapContractAddress,
        slippage: this.slippageTolerance,
        disableEstimate: true,
        allowPartialFill: false,
      }));

      if (shoudSaveTx) {
        this.buildedTx[tokenOut] = txForSwap;
      }

      return txForSwap;
    }

    return {
      tx: { data: '0x00', },
      toTokenAmount: amount,
    };

    // return tokenIn !== tokenOut ? await this.buildTxForSwap(JSON.stringify({
    //   fromTokenAddress: tokenIn,
    //   toTokenAddress: tokenOut,
    //   amount,
    //   fromAddress: this.zapContractAddress,
    //   slippage: this.slippageTolerance,
    //   disableEstimate: true,
    //   allowPartialFill: false,
    // })) : {
    //   tx: { data: '0x00', },
    //   toTokenAmount: amount,
    // };
  }

  setVaultAddress(address: string) {
    this.vaultAddress = address
  }

  toggleUseZapContract() {
    this.useZapContract = !this.useZapContract
  }

  setTokenIn(asset: string) {
    // console.log('setTokenIn', asset)
    this.tokenIn = asset
    this.decimalsOfTokenIn = null
    this.depositValue = 0
    this.withdrawValue = 0
    this.quoteDepositShare = undefined
    this.quoteExitAmount = undefined
    this.priceimpactDeposit = undefined
    this.priceimpactExit = undefined
    this.fetchData()
  }

  setSlippageTolerance(value: number) {
    this.slippageTolerance = value
  }

  async approve() {
    const tokenAddress = this.tokenIn
    const spender = this.zapContractAddress
    const unlimitedAmount = BigNumber.from(2).pow(256).sub(1).toString()

    const TokenApproveAbi = TokenAbi.find((el) => el.type === 'function' && el.name === 'approve') // allowance
    // @ts-ignore
    const data = this.web3Store.web3.eth.abi.encodeFunctionCall(TokenApproveAbi, [
      spender,
      unlimitedAmount,
    ])

    const transactionHash = await this.web3Store
      .sendTransaction({
        from: this.metaMaskStore.walletAddress!,
        to: tokenAddress!,
        data,
        // gasPrice,
      })
      .catch(console.log)

    if (transactionHash) {
      this.afterCallChain(
        transactionHash,
        TokenZapTransactionType.approveDepositZap,
        this.vaultAddress!,
      )
    }

    // const txHash = await window.ethereum
    // .request({
    // method: 'eth_sendTransaction',
    // params: [
    // {
    // from: this.metaMaskStore.walletAddress,
    // to: tokenAddress,
    // data,
    // gasPrice,
    // },
    // ],
    // })
    // .catch(console.log)

    // this.afterCallChain(txHash, TokenZapTransactionType.approveDepositZap, this.vaultAddress!)
  }

  async approveWithdraw() {
    const vaultAddress = this.vaultAddress

    const spender = this.zapContractAddress
    const unlimitedAmount = BigNumber.from(2).pow(256).sub(1).toString()

    const TokenApproveAbi = TokenAbi.find((el) => el.type === 'function' && el.name === 'approve') // allowance
    // @ts-ignore
    const data = this.web3Store.web3.eth.abi.encodeFunctionCall(TokenApproveAbi, [
      spender,
      unlimitedAmount,
    ])

    const transactionHash = await this.web3Store
      .sendTransaction({
        from: this.metaMaskStore.walletAddress!,
        to: vaultAddress!,
        data,
        // gasPrice,
      })
      .catch(console.log)

    if (transactionHash) {
      this.afterCallChain(
        transactionHash,
        TokenZapTransactionType.approveWithdrawZap,
        this.vaultAddress!,
      )
    }

    // const txHash = await window.ethereum
    // .request({
    // method: 'eth_sendTransaction',
    // params: [
    // {
    // from: this.metaMaskStore.walletAddress,
    // to: vaultAddress,
    // data,
    // gasPrice,
    // },
    // ],
    // })
    // .catch(console.log)

    // this.afterCallChain(txHash, TokenZapTransactionType.approveWithdrawZap, this.vaultAddress!)
  }

  async checkIsApproved() {
    this.isCheckingApprove = true
    // апрув токена из списка на зап
    const spender = this.zapContractAddress
    const owner = this.metaMaskStore.walletAddress
    const tokenAddress = this.tokenIn

    // @ts-ignore
    const tokenContract = new this.web3Store.web3.eth.Contract(TokenAbi, tokenAddress)
    const response = await tokenContract.methods.allowance(owner, spender).call()

    return response !== '0'
  }

  async checkIsApprovedWithdraw() {
    this.isCheckingApproveWithdraw = true
    // апрув токена из списка на зап
    const spender = this.zapContractAddress
    const owner = this.metaMaskStore.walletAddress

    const vaultAddress = this.vaultAddress

    // @ts-ignore
    const tokenContract = new this.web3Store.web3.eth.Contract(TokenAbi, vaultAddress)
    // console.log(tokenContract)
    // console.log(spender)
    const response = await tokenContract.methods.allowance(owner, spender).call()

    return response !== '0'
  }

  async fetchData() {
    if (!this.initialized) {
      console.error('ZapV2ChainStore not initialized')
      return
    }
    this.isShowLoader = true
    // noinspection JSVoidFunctionReturnValueUsed
    await Promise.allSettled([
      this.getCheckIsApproved(),
      this.getCheckIsApprovedWithdraw(),
      this.getBalanceOfTokenIn(),
      this.getTokenInPrice(),
      this.getSharePrice()
    ])
    this.isShowLoader = false
  }

  async getTokenInPrice() {
    if (this.tokenIn) {
      this.priceOfTokenIn = await this.contractReaderChainStore.getPrice(this.tokenIn)
    }
  }

  async getSharePrice() {
    if (this.vaultAddress) {
      this.priceOfVaultShare = await this.contractReaderChainStore.getPrice(this.vaultAddress)
    }
  }

  getTokenInAmountUsd(value: string) {
    if (this.priceOfTokenIn && this.decimalsOfTokenIn) {
      const amount = parseUnits(
        value + '',
        this.decimalsOfTokenIn as BigNumberish,
      );

      return parseInt(formatUnits(amount.mul(BigNumber.from(this.priceOfTokenIn)).div('' + 10 ** this.decimalsOfTokenIn).mul(100), 18 as BigNumberish)) / 100
    }
    return ''
  }

  getVaultShareAmountUsd(value: string) {
    // console.log('getVaultShareAmountUsd value', value)
    // console.log('getVaultShareAmountUsd this.priceOfVaultShare', this.priceOfVaultShare)
    // console.log('getVaultShareAmountUsd this.decimalsOfVaultShare', this.decimalsOfVaultShare)
    if (this.priceOfVaultShare && this.decimalsOfVaultShare) {
      const amount = parseUnits(
        value + '',
        this.decimalsOfVaultShare as BigNumberish,
      );

      return parseInt(formatUnits(amount.mul(BigNumber.from(this.priceOfVaultShare)).div('' + 10 ** this.decimalsOfVaultShare).mul(100), 18)) / 100
    }
    return ''
  }

  async getBalanceOfTokenIn() {
    // @ts-ignore
    const tokenContract = new this.web3Store.web3.eth.Contract(TokenAbi, this.tokenIn)
    const response = await tokenContract.methods.balanceOf(this.metaMaskStore.walletAddress).call()
    const [decimals] = await this.contractUtilsChainStore.erc20Decimals([this.tokenIn!])
    this.decimalsOfTokenIn = Number(decimals)
    this.balanceOfTokenIn = response
  }

  getCheckIsApproved() {
    this.checkIsApproved().then((isApproved: boolean) => {
      this.isCheckingApprove = false
      this.isApprovedDeposit = isApproved
      this.checkPending()
    })
  }

  getCheckIsApprovedWithdraw() {
    this.checkIsApprovedWithdraw().then((isApproved: boolean) => {
      this.isCheckingApproveWithdraw = false
      this.isApprovedWithdraw = isApproved
      this.checkPending()
    })
  }

  get tokenList() {
    return [
      {
        caption: 'USDC',
        address: this.networkManager.addresses.assets.usdc,
        logo: UsdcLogo,
      },
      {
        caption: 'USDT',
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        logo: USDTLogo,
      },
      {
        caption: 'DAI',
        address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        logo: DAILogo,
      },
      {
        caption: 'WMATIC',
        address: this.networkManager.addresses.assets?.wmatic,
        logo: MaticLogo,
      },
      {
        caption: 'WBTC',
        address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
        logo: WBTCLogo,
      },
      {
        caption: 'WETH',
        address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        logo: WETHLogo,
      },
      {
        caption: 'BAL',
        address: '0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3',
        logo: BALLogo,
      },
      {
        caption: 'TETU',
        address: '0x255707B70BF90aa112006E1b07B9AeA6De021424',
        logo: TETULogo,
      },
    ]
  }

  async deposit() {
    const {
      vaultAddress: vault,
      tokenIn,
      depositValue,
      decimalsOfTokenIn,
      swapTransactionAsset0,
      swapTransactionAsset1,
      swapTransactionAssets,
    } = this

    let data = null

    if (depositValue) {
      const amount = parseUnits(
        depositValue + '',
        decimalsOfTokenIn as BigNumberish,
      )

      if (
        this.method === zapV2Methods.Single
        && swapTransactionAsset0?.data
      ) {
        const zapIntoAbi = ZapV2ABI.find(
          (el) => el.type === 'function' && el.name === 'zapIntoSingle',
        )
        // @ts-ignore
        data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapIntoAbi, [
          this.vaultAddress,
          tokenIn,
          swapTransactionAsset0.data,
          amount,
        ])
      }

      if (
        this.method === zapV2Methods.UniswapV2
        && swapTransactionAsset0?.data
        && swapTransactionAsset1?.data
      ) {
        const zapIntoAbi = ZapV2ABI.find(
          (el) => el.type === 'function' && el.name === 'zapIntoUniswapV2',
        )
        // @ts-ignore
        data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapIntoAbi, [
          this.vaultAddress,
          tokenIn,
          swapTransactionAsset0.data,
          swapTransactionAsset1.data,
          amount,
        ])
      }

      if (
        this.method === zapV2Methods.Balancer
        && swapTransactionAssets.length > 1
        && this.vaultUnderlying
        && this.assetsDecimals
        && this.vaultAddress
      ) {
        const poolTokens = await this.getBalancerAssetsBalances(this.vaultUnderlying)
        const assets = []
        const amounts = []

        const weightedPool = !!zapV2PoolWeights[this.vaultAddress]
        if (!weightedPool) {
          let totalRealAssetsBalanceDecimalsIndependent = BigNumber.from(0);
          for (let i = 0, k = 0; i < poolTokens[0].length; i++) {
            if (poolTokens[0][i] !== this.vaultUnderlying) {
              const poolTokenAmountDecimalsIndependent = BigNumber.from(poolTokens[1][i]).mul(parseUnits('1', this.assetsDecimals[k]))
              totalRealAssetsBalanceDecimalsIndependent = totalRealAssetsBalanceDecimalsIndependent.add(poolTokenAmountDecimalsIndependent)
              k++;
            }
          }
          for (let i = 0, k = 0; i < poolTokens[0].length; i++) {
            assets.push(poolTokens[0][i])
            if (poolTokens[0][i] !== this.vaultUnderlying) {
              amounts.push(amount.mul(poolTokens[1][i]).mul(parseUnits('1', this.assetsDecimals[k])).div(totalRealAssetsBalanceDecimalsIndependent).toString())
              k++;
            } else {
              amounts.push('0')
            }
          }
        } else {
          for (let i = 0; i < poolTokens[0].length; i++) {
            assets.push(poolTokens[0][i])
            amounts.push(amount.mul(zapV2PoolWeights[this.vaultAddress][i]).div(100).toString())
          }
        }

        const zapIntoAbi = ZapV2ABI.find(
          (el) => el.type === 'function' && el.name === 'zapIntoBalancer',
        )
        // @ts-ignore
        data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapIntoAbi, [
          this.vaultAddress,
          tokenIn,
          assets,
          swapTransactionAssets.map(a => a.data),
          amounts,
        ])
      }

      if (
        this.method === zapV2Methods.BalancerAaveBoostedStablePool
        && swapTransactionAssets.length === 3
        && this.vaultUnderlying
      ) {
        const poolTokens = await this.getBalancerAssetsBalances(this.vaultUnderlying)
        const assets = []
        const amounts = []
        let totalRealAssetsBalance = BigNumber.from(0)
        for (let i = 0; i < poolTokens[0].length; i++) {
          if (poolTokens[0][i] !== this.vaultUnderlying) {
            totalRealAssetsBalance = totalRealAssetsBalance.add(BigNumber.from(poolTokens[1][i]))
          }
        }
        for (let i = 0; i < poolTokens[0].length; i++) {
          assets.push(poolTokens[0][i])
          if (poolTokens[0][i] !== this.vaultUnderlying) {
            amounts.push(amount.mul(poolTokens[1][i]).div(totalRealAssetsBalance).toString())
          }
        }

        const zapIntoAbi = ZapV2ABI.find(
          (el) => el.type === 'function' && el.name === 'zapIntoBalancerAaveBoostedStablePool',
        )
        // @ts-ignore
        data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapIntoAbi, [
          tokenIn,
          swapTransactionAssets.map(a => a.data),
          amounts,
        ])
      }

      if (
        this.method === zapV2Methods.BalancerTetuBal
        && swapTransactionAsset0?.data
        && swapTransactionAsset1?.data
      ) {
        const zapIntoAbi = ZapV2ABI.find(
          (el) => el.type === 'function' && el.name === 'zapIntoBalancerTetuBal',
        )
        // @ts-ignore
        data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapIntoAbi, [
          tokenIn,
          swapTransactionAsset0.data,
          swapTransactionAsset1.data,
          amount,
        ])
      }

      if (
        this.method === zapV2Methods.BalancerTetuQiQi
        && swapTransactionAsset0?.data
      ) {
        const zapIntoAbi = ZapV2ABI.find(
          (el) => el.type === 'function' && el.name === 'zapIntoBalancerTetuQiQi',
        )
        // @ts-ignore
        data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapIntoAbi, [
          tokenIn,
          swapTransactionAsset0.data,
          amount,
        ])
      }

      if (
        this.method === zapV2Methods.BalancerWethBalTetuBal
        && swapTransactionAsset0?.data
        && swapTransactionAsset1?.data
      ) {
        const zapIntoAbi = ZapTetuBalABI.find(
          (el) => el.type === 'function' && el.name === 'zapInto',
        )
        // @ts-ignore
        data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapIntoAbi, [
          tokenIn,
          swapTransactionAsset0.data,
          swapTransactionAsset1.data,
          amount,
        ])
      }
    }

    if (data !== null) {
      this.isFetchingDeposit = true

      this.beforeCallChain()

      const txError = await this.web3Store
        .sendTransactionStaticCall({
          from: this.metaMaskStore.walletAddress!,
          to: this.zapContractAddress,
          data,
        })

      if (txError) {
        notification['error']({
          // @ts-ignore
          message: 'Deposit error. Try again later.',
          description: React.createElement(
            'div',
            { style: { color: "red", }, },
            txError,
          ),
          duration: 10,
        })

        this.isFetchingDeposit = false
      } else {
        const transactionHash = await this.web3Store
          .sendTransaction({
            from: this.metaMaskStore.walletAddress!,
            to: this.zapContractAddress,
            data,
            // gasPrice,
          })
          .catch(console.log)
        this.isFetchingDeposit = false

        if (transactionHash) {
          // return transactionReceipt.transactionHash
          this.afterCallChain(transactionHash, TokenZapTransactionType.depositZap, vault!)
        }
      }
    }
  }

  async withdraw() {
    const {
      vaultAddress: vault,
      tokenIn,
      swapExitTransactionAsset0,
      swapExitTransactionAsset1,
      swapExitTransactionAssets,
      withdrawValue,
    } = this

    let data = null

    if (withdrawValue) {
      const amount = parseUnits(withdrawValue + '', this.decimalsOfVaultShare as BigNumberish).toString()

      if (
        this.method === zapV2Methods.Single
        && swapExitTransactionAsset0?.data
      ) {
        const zapOutAbi = ZapV2ABI.find(
          (el) => el.type === 'function' && el.name === 'zapOutSingle',
        )
        // @ts-ignore
        data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapOutAbi, [
          this.vaultAddress,
          tokenIn,
          swapExitTransactionAsset0.data,
          amount,
        ])
      }

      if (
        this.method === zapV2Methods.UniswapV2
        && swapExitTransactionAsset0?.data
        && swapExitTransactionAsset1?.data
      ) {
        const zapOutAbi = ZapV2ABI.find(
          (el) => el.type === 'function' && el.name === 'zapOutUniswapV2',
        )
        // @ts-ignore
        data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapOutAbi, [
          this.vaultAddress,
          tokenIn,
          swapExitTransactionAsset0.data,
          swapExitTransactionAsset1.data,
          amount,
        ])
      }

      if (
        this.method === zapV2Methods.Balancer
        && swapExitTransactionAssets
        && this.vaultUnderlying
        && this.assets
      ) {
        const poolTokens = await this.getBalancerAssetsBalances(this.vaultUnderlying)
        const assets = []
        for (let i = 0; i < poolTokens[0].length; i++) {
          assets.push(poolTokens[0][i])
        }
        const poolHavePhantomBpt = assets.length > this.assets.length

        const zapOutAbi = ZapV2ABI.find(
          (el) => el.type === 'function' && el.name === 'zapOutBalancer',
        )

        // @ts-ignore
        data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapOutAbi, [
          this.vaultAddress,
          tokenIn,
          assets,
          poolHavePhantomBpt ? this.amountsOut.filter(a => BigNumber.from(a).gt(0)) : this.amountsOut.map(() => BigNumber.from(0)),
          swapExitTransactionAssets.map(s => s.data),
          amount,
        ])
      }

      if (
        this.method === zapV2Methods.BalancerAaveBoostedStablePool
        && swapExitTransactionAssets
        && this.vaultUnderlying
      ) {
        const zapOutAbi = ZapV2ABI.find(
          (el) => el.type === 'function' && el.name === 'zapOutBalancerAaveBoostedStablePool',
        )

        // @ts-ignore
        data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapOutAbi, [
          tokenIn,
          swapExitTransactionAssets.map(s => s.data),
          amount,
        ])
      }

      if (
        this.method === zapV2Methods.BalancerTetuBal
        && swapExitTransactionAsset0?.data
        && swapExitTransactionAsset1?.data
      ) {
        const zapOutAbi = ZapV2ABI.find(
          (el) => el.type === 'function' && el.name === 'zapOutBalancerTetuBal',
        )
        // @ts-ignore
        data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapOutAbi, [
          tokenIn,
          swapExitTransactionAsset0.data,
          swapExitTransactionAsset1.data,
          amount,
        ])
      }

      if (
        this.method === zapV2Methods.BalancerTetuQiQi
        && swapExitTransactionAsset0?.data
      ) {
        const zapOutAbi = ZapV2ABI.find(
          (el) => el.type === 'function' && el.name === 'zapOutBalancerTetuQiQi',
        )
        // @ts-ignore
        data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapOutAbi, [
          tokenIn,
          swapExitTransactionAsset0.data,
          amount,
        ])
      }

      if (
        this.method === zapV2Methods.BalancerWethBalTetuBal
        && swapExitTransactionAsset0?.data
        && swapExitTransactionAsset1?.data
      ) {
        const zapOutAbi = ZapTetuBalABI.find(
          (el) => el.type === 'function' && el.name === 'zapOut',
        )
        // @ts-ignore
        data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapOutAbi, [
          tokenIn,
          swapExitTransactionAsset0.data,
          swapExitTransactionAsset1.data,
          amount,
        ])
      }
    }

    if (data !== null) {
      this.isFetchingWithdraw = true

      this.beforeCallChain()

      const txError = await this.web3Store
        .sendTransactionStaticCall({
          from: this.metaMaskStore.walletAddress!,
          to: this.zapContractAddress,
          data,
        })

      if (txError) {
        notification['error']({
          // @ts-ignore
          message: 'Withdraw error. Try again later.',
          description: React.createElement(
            'div',
            { style: { color: "red", }, },
            txError,
          ),
          duration: 10,
        })

        this.isFetchingWithdraw = false
      } else {
        const transactionHash = await this.web3Store
          .sendTransaction({
            from: this.metaMaskStore.walletAddress!,
            to: this.zapContractAddress,
            data,
            // gasPrice,
          })
          .catch(console.log)

        if (transactionHash) {
          this.afterCallChain(transactionHash, TokenZapTransactionType.withdrawZap, vault!)
        }

        this.isFetchingWithdraw = false
      }
    }
  }

  reset() {
    this.initialized = false
    this.method = undefined
    this.tokenIn = this.tokenList[0].address!
    this.vaultAddress = null
    this.useZapContract = false
    this.balanceOfTokenIn = null
    this.decimalsOfTokenIn = null
    this.slippageTolerance = 5
    this.isCheckingApprove = false
    this.isApprovedDeposit = false
    this.isCheckingApproveWithdraw = false
    this.isApprovedWithdraw = false
    this.isFetchingDeposit = false
    this.isFetchingWithdraw = false
    this.isFetchingWithdrawAllAndClaim = false
    this.isFetchingClaim = false
    this.isShowLoader = false
    this.isPendingApproveDeposit = false
    this.isPendingApproveWithdraw = false
    this.isPendingDeposit = false
    this.isPendingWithdraw = false
    this.isPendingWithdrawAndClaim = false
    this.isPendingClaim = false
    this.depositValue = 0
    this.withdrawValue = 0
  }

  async checkPendingTransactions() {
    let isPending = false
    const transactionsCache = this.transactionStorage.getData()

    const promises = Object.keys(transactionsCache).map((txHash) => this.getTransaction(txHash))
    const transactions = await Promise.allSettled(promises)

    const resolved = transactions
      .filter((el) => el.status === 'fulfilled')
      // @ts-ignore
      .map((promiseResult) => {
        // @ts-ignore
        if (promiseResult?.value) {
          // @ts-ignore
          const storeItem = this.txHistoryStore.getTx(promiseResult.value.transactionHash)

          if (storeItem) {
            // @ts-ignore
            this.txHistoryStore.setTx(promiseResult.value.transactionHash, {
              ...JSON.parse(JSON.stringify(storeItem)),
              // @ts-ignore
              data: promiseResult.value,
            })
          }
        }

        // @ts-ignore
        return promiseResult.value
      })

    for (let i = 0; i < resolved.length; i++) {
      const el = resolved[i]

      if (el !== null) {
        const txHash = Object.keys(transactionsCache)[i]
        const transaction = this.transactionStorage.getData()[txHash]

        const [name] = await this.contractUtilsChainStore.erc20Symbols([transaction.vaultAddress])

        const message = {
          [TokenZapTransactionType.approveDepositZap]: 'approve zap deposit',
          [TokenZapTransactionType.approveWithdrawZap]: 'approve zap withdraw',
          [TokenZapTransactionType.claimZap]: 'claim',
          [TokenZapTransactionType.depositZap]: 'zap deposit',
          [TokenZapTransactionType.withdrawZap]: 'zap withdraw',
          [TokenZapTransactionType.withdrawAllAndClaimZap]: 'withdraw all and claim',
        }

        const notificationType = el.status ? 'success' : 'error'

        notification[notificationType]({
          // @ts-ignore
          message: name + ' ' + message[transaction.txType],
          description: React.createElement(
            'a',
            {
              href: `${this.networkManager.network.blockExplorerUrls?.[0]}/tx/${el.transactionHash}`,
              target: '_blank',
            },
            'view on network explorer',
          ),
          duration: 10,
        })

        this.transactionStorage.deleteItem(txHash)

        // @ts-ignore
        if (notificationType === 'success' && (transaction.txType === TokenZapTransactionType.depositZap || transaction.txType === TokenZapTransactionType.withdrawZap)) {
          // console.log('need to update balances')
          await vaultInfoStore.fetch(this.vaultAddress)
          await userInfoOfVaultStore.fetch(metaMaskStore.walletAddress, this.vaultAddress)
        }
      }
    }

    resolved.forEach((el: object | null, index) => { })

    isPending = resolved.filter((value) => value === null).length > 0

    if (!isPending) {
      this.clearInterval()
    }

    return isPending
  }

  private checkPending() {
    this.checkPendingTransactions().then((isPending: boolean) => {
      if (isPending) {
        // this.isShowLoader = true
      }
    })
  }

  checkShowLoaders() {
    const transactions: any = new Set(
      Object.values(this.pendingTranscations)
        .filter((el) => (el as TxChache).vaultAddress === this.vaultAddress)
        .map((el) => (el as TxChache).txType),
    )
    if (!this.isCheckingApprove) {
      this.isPendingApproveDeposit = transactions.has(TokenZapTransactionType.approveDepositZap)
    }
    if (!this.isCheckingApproveWithdraw) {
      this.isPendingApproveWithdraw = transactions.has(TokenZapTransactionType.approveWithdrawZap)
    }
    this.isPendingDeposit = transactions.has(TokenZapTransactionType.depositZap)
    this.isPendingWithdraw = transactions.has(TokenZapTransactionType.withdrawZap)
    this.isPendingClaim = transactions.has(TokenZapTransactionType.claimZap)
    this.isPendingWithdrawAndClaim = transactions.has(
      TokenZapTransactionType.withdrawAllAndClaimZap,
    )
  }

  beforeCallChain() {
    if (this.interval === null) {
      this.checkPendingTransactions()
      this.startPoolingCheckPendingTransactions()
    }
  }

  afterCallChain(
    txHash: string | undefined,
    txType: TokenZapTransactionType,
    vaultAddress: string,
  ) {
    if (txHash) {
      const data = {
        txHash,
        txType,
        vaultAddress,
      };

      this.transactionStorage.setItem(txHash!, data);
      this.txHistoryStore.setTx(txHash!, {
        ...data,
        date: dayjs().format('DD.MM.YYYY HH:mm:ss')
      });
    } else {
      const txHash = Math.random().toString()
      this.transactionStorage.setItem(txHash, {
        txHash,
        txType,
        vaultAddress,
      })
      setTimeout(() => {
        this.transactionStorage.deleteItem(txHash)
      }, 100)
    }

    if (this.interval === null) {
      this.checkPendingTransactions()
      this.startPoolingCheckPendingTransactions()
    }
  }

  get pendingTranscations() {
    const data = this.transactionStorage.getData()
    return data
  }

  clearPendingTranscations() {
    this.transactionStorage.reset()
  }

  private async getTransaction(txHash: string) {
    const response = await this.web3Store.web3.eth.getTransactionReceipt(txHash)
    return response
  }

  private clearInterval() {
    clearInterval(this.interval)
    this.interval = null
  }

  private startPoolingCheckPendingTransactions() {
    this.clearInterval()
    this.interval = setInterval(() => {
      this.checkPendingTransactions()
    }, this.intervalPeriod)
  }

  private apiRequestUrl(methodName: string, queryParams: string) {
    const chainId = 137;
    const apiBaseUrl = 'https://api.1inch.io/v4.0/' + chainId;
    const r = (new URLSearchParams(JSON.parse(queryParams))).toString();
    return apiBaseUrl + methodName + '?' + r;
  }

  private async buildTxForSwap(params: string) {
    const url = this.apiRequestUrl('/swap', params);
    // console.log('url', url)
    return fetch(url).then(res => {
      // console.log('res', res)
      return res.json();
    })/*.then(res => res.tx)*/;
  }
}

export const zapV2ChainStore = new ZapV2ChainStore()
