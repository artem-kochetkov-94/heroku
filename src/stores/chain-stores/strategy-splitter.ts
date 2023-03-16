import React from 'react'
import { makeAutoObservable } from 'mobx'
import { web3Store } from '../web3-store'
import { networkManager } from './network-manager'
import { StrategySplitterAbi } from '../../abi/StrategySplitterAbi'
import { retry } from '../../utils'
import { FetchResource } from '../core/fetch-resource'
import { LocalStorage } from '../core/localStorage'
import { TokenTransactionType, TxChache } from './types'
import { metaMaskStore } from '../meta-mask-store'
import { contractReaderChainStore } from './contact-reader-store'
import { notification } from 'antd'
import { contractUtilsChainStore } from './contract-utils'
import { utils } from 'ethers'

export const transactionStorageStore = new LocalStorage<TxChache>(
  '@tetu-transaction-id/strategy-splitter',
)

class StrategySplitterChainStore {
  private readonly web3Store = web3Store
  private readonly networkManager = networkManager
  private readonly metaMaskStore = metaMaskStore
  public readonly transactionStorage = transactionStorageStore
  private readonly contractReaderChainStore = contractReaderChainStore
  private readonly contractUtilsChainStore = contractUtilsChainStore

  private interval: any = null
  private readonly intervalPeriod = 5000

  constructor(private readonly strategyAddr: string) {
    makeAutoObservable(this)
  }

  private startPoolingCheckPendingTransactions() {
    this.clearInterval()
    this.interval = setInterval(() => {
      this.checkPendingTransactions()
    }, this.intervalPeriod)
  }

  private clearInterval() {
    clearInterval(this.interval)
    this.interval = null
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

  async checkPendingTransactions() {
    let isPending = false
    const transactionsCache = this.transactionStorage.getData()
    const promises = Object.keys(transactionsCache).map((txHash) => this.getTransaction(txHash))
    const transactions = await Promise.allSettled(promises)

    const resolved = transactions
      .filter((el) => el.status === 'fulfilled')
      // @ts-ignore
      .map((promiseResult) => promiseResult.value)

    for (let i = 0; i < resolved.length; i++) {
      const el = resolved[i]

      if (el !== null) {
        const txHash = Object.keys(transactionsCache)[i]
        const transaction = this.transactionStorage.getData()[txHash]

        // @ts-ignore
        const [name] = await this.contractUtilsChainStore.erc20Symbols([transaction.vaultAddress])

        const message = {
          [TokenTransactionType.withdrawProcess]: 'withdraw process',
          [TokenTransactionType.withdrawRequest]: 'withdraw request',
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

  beforeCallChain() {
    if (this.interval === null) {
      this.checkPendingTransactions()
      this.startPoolingCheckPendingTransactions()
    }
  }

  afterCallChain(txHash: string | undefined, txType: TokenTransactionType, vaultAddress: string) {
    if (txHash) {
      this.transactionStorage.setItem(txHash!, {
        txHash,
        txType,
        vaultAddress,
      })
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

  get SSC() {
    return new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      StrategySplitterAbi,
      this.strategyAddr,
    )
  }

  async maxCheapWithdraw() {
    const fn = retry({ fn: this.SSC.methods.maxCheapWithdraw().call, defaultValue: '0' }, 'maxCheapWithdraw')
    return await fn()
  }

  async wantToWithdraw() {
    const fn = retry({ fn: this.SSC.methods.wantToWithdraw().call, defaultValue: '0' }, 'wantToWithdraw')
    return await fn()
  }

  async processWithdrawRequests(vaultAddress: string) {
    this.beforeCallChain()

    const abi = StrategySplitterAbi.find(
      (el) => el.type === 'function' && el.name === 'processWithdrawRequests',
    )
    // @ts-ignore
    const data = this.web3Store.web3.eth.abi.encodeFunctionCall(abi, [])

    const txHash = await this.web3Store.sendTransaction({
      from: this.metaMaskStore.walletAddress!,
      to: this.strategyAddr,
      data,
      // gasPrice,
    })

    if (txHash) {
      this.afterCallChain(txHash, TokenTransactionType.withdrawProcess, vaultAddress)
    }
  }

  async requestWithdraw(vaultAddress: string, amount: string) {
    this.beforeCallChain()

    const abi = StrategySplitterAbi.find(
      (el) => el.type === 'function' && el.name === 'requestWithdraw',
    )

    const decimals = await this.contractReaderChainStore.getVaultDecimals(vaultAddress)
    const amoutBigInt = utils.parseUnits(amount.toString(), decimals).toString()
    // @ts-ignore
    const data = this.web3Store.web3.eth.abi.encodeFunctionCall(abi, [amoutBigInt])

    const txHash = await this.web3Store.sendTransaction({
      from: this.metaMaskStore.walletAddress!,
      to: this.strategyAddr,
      data,
      // gasPrice,
    })

    if (txHash) {
      this.afterCallChain(txHash, TokenTransactionType.withdrawRequest, vaultAddress)
    }
  }
}

class MaxCheapWithdrawStore extends FetchResource<any> {
  constructor(SSAddr: string) {
    super(async () => {
      const store = new StrategySplitterChainStore(SSAddr)
      return await store.maxCheapWithdraw()
    })
  }
}

class WantToWithdrawStore extends FetchResource<any> {
  constructor(SSAddr: string) {
    super(async () => {
      const store = new StrategySplitterChainStore(SSAddr)
      return await store.wantToWithdraw()
    })
  }
}

class ProcessWithdrawRequests extends FetchResource<any> {
  constructor(SSAddr: string) {
    super(async (vaultAddress: string) => {
      const store = new StrategySplitterChainStore(SSAddr)
      return await store.processWithdrawRequests(vaultAddress)
    })
  }
}

class RequestWithdraw extends FetchResource<any> {
  constructor(SSAddr: string) {
    super(async (vaultAddress: string, amount: string) => {
      const store = new StrategySplitterChainStore(SSAddr)
      await store.requestWithdraw(vaultAddress, amount)
    })
  }
}

export class StrategySplitterFetchStore {
  maxCheapWithdrawStore: any = null
  wantToWithdrawStore: any = null
  processWithdrawRequestsStore: any = null
  requestWithdrawStore: any = null
  store: any

  constructor(SSAddr: string) {
    this.store = new StrategySplitterChainStore(SSAddr)

    this.maxCheapWithdrawStore = new MaxCheapWithdrawStore(SSAddr)
    this.wantToWithdrawStore = new WantToWithdrawStore(SSAddr)
    this.processWithdrawRequestsStore = new ProcessWithdrawRequests(SSAddr)
    this.requestWithdrawStore = new RequestWithdraw(SSAddr)
  }
}
