import { web3Store } from '../web3-store'
import { makeAutoObservable } from 'mobx'
import { TokenAbi } from '../../abi/Token'
import { contractReaderChainStore } from './contact-reader-store'
import { metaMaskStore } from '../meta-mask-store'
import { LocalStorage } from '../core/localStorage'
import { TokenTransactionType, TxChache } from './types'
import { vaultChainStore } from './vault-store'
import { BigNumber } from 'ethers'
import { notification } from 'antd'
import { contractUtilsChainStore } from './contract-utils'
import * as React from 'react'
import { networkManager } from './network-manager'
import dayjs from 'dayjs'
import { txHistoryStore } from '../tx-history'

const transactionStorageStoreId = '@tetu-transaction-id'
export const transactionStorageStore = new LocalStorage<TxChache>(transactionStorageStoreId)

class TokenChainStore {
  private readonly web3Store = web3Store
  private readonly contractReaderChainStore = contractReaderChainStore
  private readonly metaMaskStore = metaMaskStore
  private readonly transactionStorage = transactionStorageStore
  private readonly txHistoryStore = txHistoryStore
  private readonly vaultChainStore = vaultChainStore
  private readonly contractUtilsChainStore = contractUtilsChainStore
  private readonly networkManager = networkManager

  private interval: any = null
  private readonly intervalPeriod = 5000

  constructor() {
    makeAutoObservable(this)
    this.transactionStorage.reset()
  }

  removeTx(tx: string) {
    this.transactionStorage.deleteItem(tx);
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
          [TokenTransactionType.approveDeposit]: 'approve deposit',
          [TokenTransactionType.claim]: 'claim',
          [TokenTransactionType.deposit]: 'deposit',
          [TokenTransactionType.withdraw]: 'withdraw',
          [TokenTransactionType.withdrawAllAndClaim]: 'withdraw all and claim',
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

        // set item
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

  private async getTransaction(txHash: string) {
    const response = await this.web3Store.web3.eth.getTransactionReceipt(txHash)
    return response
  }

  async checkIsApproved(vaultAddress: string) {
    const owner = this.metaMaskStore.walletAddress
    const tokenAddress = await this.contractReaderChainStore.getUnderlying(vaultAddress)
    // @ts-ignore
    const tokenContract = new this.web3Store.web3.eth.Contract(TokenAbi, tokenAddress)
    const response = await tokenContract.methods.allowance(owner, vaultAddress).call()
    return response !== '0'
  }

  async approve(vaultAddress: string) {
    // const [account] = await window?.ethereum?.request({ method: 'eth_requestAccounts' });
    const tokenAddress = await this.contractReaderChainStore.getUnderlying(vaultAddress)
    const unlimitedAmount = BigNumber.from(2).pow(256).sub(1).toString()

    const TokenApproveAbi = TokenAbi.find((el) => el.type === 'function' && el.name === 'approve') // allowance
    // @ts-ignore
    const data = this.web3Store.web3.eth.abi.encodeFunctionCall(TokenApproveAbi, [
      vaultAddress,
      unlimitedAmount,
    ])

    const transactionHash = await this.web3Store
      .sendTransaction({
        from: this.metaMaskStore.walletAddress!,
        to: tokenAddress,
        data,
        // gasPrice,
      })
      .catch(console.log)

    if (transactionHash) {
      this.afterCallChain(transactionHash, TokenTransactionType.approveDeposit, vaultAddress)
      // { transactionHash: txHash }
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

    // this.afterCallChain(txHash, TokenTransactionType.approveDeposit, vaultAddress)
  }

  async depositAndInvestToVault(vaultAddress: string, amount: number) {
    this.beforeCallChain()
    const txHash = await this.vaultChainStore.depositAndInvest(vaultAddress, amount)
    if (txHash) {
      this.afterCallChain(txHash, TokenTransactionType.deposit, vaultAddress)
    }
  }

  async withdrawToVault(vaultAddress: string, amount: number) {
    this.beforeCallChain()
    const txHash = await this.vaultChainStore.withdraw(vaultAddress, amount)
    if (txHash) {
      this.afterCallChain(txHash, TokenTransactionType.withdraw, vaultAddress)
    }
  }

  async getAllRewardsToVault(vaultAddress: string) {
    this.beforeCallChain()
    const txHash = await this.vaultChainStore.getAllRewards(vaultAddress)
    if (txHash) {
      this.afterCallChain(txHash, TokenTransactionType.claim, vaultAddress)
    }
  }

  async exitToVault(vaultAddress: string) {
    this.beforeCallChain()
    const txHash = await this.vaultChainStore.exit(vaultAddress)
    if (txHash) {
      this.afterCallChain(txHash, TokenTransactionType.withdrawAllAndClaim, vaultAddress)
    }
  }

  beforeCallChain() {
    if (this.interval === null) {
      this.checkPendingTransactions()
      this.startPoolingCheckPendingTransactions()
    }
  }

  afterCallChain(txHash: string | undefined, txType: TokenTransactionType, vaultAddress: string) {
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
}

export const tokenChainStore = new TokenChainStore()
