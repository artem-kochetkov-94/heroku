import * as React from 'react'

import { makeAutoObservable } from 'mobx'
import { MultiSwapAbi } from '../../abi/MultiSwap'
import { LPAbi } from '../../abi/LP'
import { web3Store } from '../web3-store'
import { networkManager } from './network-manager'
import { TokenAbi } from '../../abi/Token'
import { metaMaskStore } from '../meta-mask-store'
import { BigNumber, BigNumberish } from 'ethers'
import { TokenZapTransactionType, TxChache } from './types'
import { LocalStorage } from '../core'
import { notification } from 'antd'
import { contractUtilsChainStore } from './contract-utils'
import { ZapContractAbi } from '../../abi/ZapContract'
import { parseUnits } from 'ethers/lib/utils'
import { retry } from "../../utils";
import { txHistoryStore } from '../tx-history'
import dayjs from 'dayjs'

const exclude = new Set<string>([
  '0x21d97B1adcD2A36756a6E0Aa1BAC3Cf6c0943c0E'.toLowerCase(), // wex pear - has transfer fee
  '0xa281C7B40A9634BCD16B4aAbFcCE84c8F63Aedd0'.toLowerCase(), // frax fxs - too high slippage
])

// 1 запросить ассеты у ваулта
// только если два ассета
// для депозита lps = await multiSwap.findLpsForSwaps(tokenIn, asset);
// для виздрава lps = [...await multiSwap.findLpsForSwaps(tokenOut, asset)].reverse();

// для депозит
// await zapContract.zapIntoLp(
//   vault,
//   tokenIn,
//   tokensOut[0],
//   tokensOutLps[0],
//   tokensOut[1],
//   tokensOutLps[1],
//   amount,
//   slippage
// );

// для виздрав
// await zapContract.zapOutLp(
//   vault,
//   tokenOut,
//   assets[0],
//   assetsLpRoute[0],
//   assets[1],
//   assetsLpRoute[1],
//   amountShare,
//   slippage
// );

const zapTransactionStorageStoreId = '@tetu-zap-test1-transaction-id'
export const zapTransactionStorageStore = new LocalStorage<TxChache>(
  zapTransactionStorageStoreId,
)
class ZapChainStore {
  private readonly web3Store = web3Store
  private readonly networkManager = networkManager
  readonly transactionStorage = zapTransactionStorageStore
  private readonly txHistoryStore = txHistoryStore
  private readonly contractUtilsChainStore = contractUtilsChainStore
  private readonly metaMaskStore = metaMaskStore

  constructor() {
    makeAutoObservable(this)
  }

  vaultAddress: string | null = null

  useZapContract = false
  tokenIn: string | null = null
  balanceOfTokenIn: string | null = null
  decimalsOfTokenIn: number | null = null

  tokenOut: string[] = []
  tokensOutLps: string[] = []
  slippageTolerance: number = 5

  isFetchingRoutes = false
  isFetchedRoutes = false

  routesDeposit: string[][] = []
  routesWithdraw: string[][] = []

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

  private interval: any = null
  private readonly intervalPeriod = 5000

  removeTx(tx: string) {
    this.transactionStorage.deleteItem(tx);
  }

  setDepositValue(value: number) {
    this.depositValue = value
  }

  setWithdrawValue(value: number) {
    this.withdrawValue = value
  }

  get multiswapContract() {
    return new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      MultiSwapAbi,
      this.networkManager.addresses.core.multiSwap,
    )
  }

  get zapContract() {
    return new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      ZapContractAbi,
      this.networkManager.addresses.core.zap,
    )
  }

  setVaultAddress(address: string) {
    this.vaultAddress = address
  }

  toggleUseZapContract() {
    this.useZapContract = !this.useZapContract
  }

  setTokenIn(asset: string) {
    this.isFetchedRoutes = false
    this.routesDeposit = []
    this.routesWithdraw = []
    this.tokenIn = asset
  }

  setTokenOut(assets: string[]) {
    this.isFetchedRoutes = false
    this.routesDeposit = []
    this.routesWithdraw = []
    this.tokenOut = assets
  }

  setSlippageTolerance(value: number) {
    this.slippageTolerance = value
  }

  async approve() {
    const tokenAddress = this.tokenIn
    const spender = this.networkManager.addresses.core.zap
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

    const spender = this.networkManager.addresses.core.zap
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
    const spender = this.networkManager.addresses.core.zap
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
    const spender = this.networkManager.addresses.core.zap
    const owner = this.metaMaskStore.walletAddress

    const vaultAddress = this.vaultAddress

    // @ts-ignore
    const tokenContract = new this.web3Store.web3.eth.Contract(TokenAbi, vaultAddress)
    const response = await tokenContract.methods.allowance(owner, spender).call()

    return response !== '0'
  }

  async fetchData() {
    this.isShowLoader = true
    this.tokenIn = this.tokenList[0].address!
    await Promise.allSettled([
      this.getCheckIsApproved(),
      this.getCheckIsApprovedWithdraw(),
      this.getBalanceOfTokenIn(),
      this.fetchRoutes(),
    ])
    this.isShowLoader = false
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
      },
      // {
      //   caption: 'WMATIC',
      //   address: this.networkManager.addresses.WMATIC,
      // },
      // {
      //   caption: 'WETH',
      //   address: '',
      // },
      // {
      //   caption: 'WBTC',
      //   address: '',
      // },
    ]
  }

  async fetchRoutes() {
    if (this.tokenIn === null || this.tokenOut.length === 0) {
      return
    }

    this.isFetchingRoutes = true

    const response = await Promise.allSettled(
      this.tokenOut.map((tokenOut: string) => {
        if (tokenOut === this.tokenIn) {
          return Promise.resolve([])
        }
        return this.getRoutesForDeposit(this.tokenIn!, tokenOut)
      }),
    )

    this.tokensOutLps = response.map((el: any) => el.value)

    const removeItems = (routes: string[][]) => {
      return routes?.reduce(
        (acc, item) => {
          const [a, b] = item
          if (a && !acc.includes(a)) {
            acc.push(a)
          }
          if (b && !acc.includes(b)) {
            acc.push(b)
          }
          return acc
        },
        [this.tokenIn],
      )
    }

    const routesResponse = await Promise.allSettled(
      response
        .map((el: any) => el.value)
        .map(async (lpAddresses: string[]) => {
          return await Promise.allSettled(
            lpAddresses.map(async (lpAddress: string) => {
              // @ts-ignore
              const LPContract = new this.web3Store.web3.eth.Contract(LPAbi, lpAddress)
              const token0 = await LPContract.methods.token0().call()
              const token1 = await LPContract.methods.token1().call()
              return [token0, token1]
            }),
          )
        }),
    )

    const lpRoutes = routesResponse?.map((el: any) => el.value?.map((el: any) => el.value))

    const routesDeposit = this.tokenOut
      .filter((tokenOut: string) => tokenOut !== this.tokenIn)
      .map((tokenOut: string, index: number) => {
        return removeItems(lpRoutes[index])
      })

    // @ts-ignore
    this.routesDeposit = routesDeposit
    // @ts-ignore
    this.routesWithdraw = routesDeposit.map((route: string[]) => [...route].reverse())

    this.isFetchingRoutes = false
    this.isFetchedRoutes = true
  }

  async getRoutesForDeposit(tokenIn: string, tokenOut: string) {
    const lps = await this.multiswapContract.methods.findLpsForSwaps(tokenIn, tokenOut).call()
    return lps
  }

  async deposit() {
    const {
      vaultAddress: vault,
      tokenIn,
      tokenOut,
      tokensOutLps,
      depositValue,
      decimalsOfTokenIn,
      slippageTolerance: slippage,
    } = this

    let data = null

    const amount = parseUnits(
      parseFloat(depositValue + '').toFixed(decimalsOfTokenIn!) + '',
      decimalsOfTokenIn as BigNumberish,
    ).toString()

    if (tokenOut.length === 1) {
      const zapIntoAbi = ZapContractAbi.find(
        (el) => el.type === 'function' && el.name === 'zapInto',
      )
      // @ts-ignore
      data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapIntoAbi, [
        vault,
        tokenIn,
        tokenOut[0],
        tokensOutLps[0],
        amount,
        slippage,
      ])
    }

    if (tokenOut.length === 2) {
      const zapIntoLpAbi = ZapContractAbi.find(
        (el) => el.type === 'function' && el.name === 'zapIntoLp',
      )
      //@ts-ignore
      data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapIntoLpAbi, [
        vault,
        tokenIn,
        tokenOut[0],
        tokensOutLps[0],
        tokenOut[1],
        tokensOutLps[1],
        amount,
        slippage,
      ])
    }

    if (data !== null) {
      this.isFetchingDeposit = true

      this.beforeCallChain()

      const transactionHash = await this.web3Store
        .sendTransaction({
          from: this.metaMaskStore.walletAddress!,
          to: this.networkManager.addresses.core.zap,
          data,
          // gasPrice,
        })
        .catch(console.log)
      this.isFetchingDeposit = false

      if (transactionHash) {
        // return transactionReceipt.transactionHash
        this.afterCallChain(transactionHash, TokenZapTransactionType.depositZap, vault!)
      }

      // const txHash = await window.ethereum
      // .request({
      // method: 'eth_sendTransaction',
      // params: [
      // {
      // from: this.metaMaskStore.walletAddress,
      // to: this.networkManager.addresses.zapContract,
      // data,
      // gasPrice,
      // },
      // ],
      // })
      // .catch(console.log)

      // this.isFetchingDeposit = false

      // this.afterCallChain(txHash, TokenZapTransactionType.depositZap, vault!)
    }
  }

  async withdraw() {
    const {
      vaultAddress: vault,
      tokenIn,
      tokenOut,
      tokensOutLps,
      withdrawValue,
      slippageTolerance: slippage,
    } = this

    let data = null

    const amount = parseUnits(withdrawValue + '').toString()

    if (tokenOut.length === 1) {
      const zapIntoAbi = ZapContractAbi.find((el) => el.type === 'function' && el.name === 'zapOut')

      //@ts-ignore
      data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapIntoAbi, [
        vault,
        tokenIn,
        tokenOut[0],
        // @ts-ignore
        [...(tokensOutLps[0] || [])].reverse(),
        amount,
        slippage,
      ])
    }

    if (tokenOut.length === 2) {
      const zapIntoLpAbi = ZapContractAbi.find(
        (el) => el.type === 'function' && el.name === 'zapOutLp',
      )

      //@ts-ignore
      data = this.web3Store.web3.eth.abi.encodeFunctionCall(zapIntoLpAbi, [
        vault,
        tokenIn,
        tokenOut[0],
        // @ts-ignore
        [...(tokensOutLps[0] || [])].reverse(),
        tokenOut[1],
        // @ts-ignore
        [...(tokensOutLps[1] || [])].reverse(),
        amount,
        slippage,
      ])
    }

    if (data !== null) {
      this.isFetchingWithdraw = true

      this.beforeCallChain()

      const transactionHash = await this.web3Store
        .sendTransaction({
          from: this.metaMaskStore.walletAddress!,
          to: this.networkManager.addresses.core.zap,
          data,
          // gasPrice,
        })
        .catch(console.log)

      if (transactionHash) {
        this.afterCallChain(transactionHash, TokenZapTransactionType.withdrawZap, vault!)
      }

      this.isFetchingWithdraw = false

      // const txHash = await window.ethereum
      // .request({
      // method: 'eth_sendTransaction',
      // params: [
      // {
      // from: this.metaMaskStore.walletAddress,
      // to: this.networkManager.addresses.zapContract,
      // data,
      // gasPrice,
      // },
      // ],
      // })
      // .catch(console.log)

      // this.isFetchingWithdraw = false

      // this.afterCallChain(txHash, TokenZapTransactionType.withdrawZap, vault!)
    }
  }

  reset() {
    this.tokenIn = this.tokenList[0].address!
    this.vaultAddress = null
    this.useZapContract = false
    this.balanceOfTokenIn = null
    this.decimalsOfTokenIn = null
    this.tokenOut = []
    this.tokensOutLps = []
    this.slippageTolerance = 5
    this.isFetchingRoutes = false
    this.isFetchedRoutes = false
    this.routesDeposit = []
    this.routesWithdraw = []
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
        this.isShowLoader = true
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
}

export const zapChainStore = new ZapChainStore()
