import { TxHistoryChache } from "./chain-stores/types";
import { LocalStorage } from "./core";
import { makeAutoObservable } from 'mobx';
import { web3Store } from './web3-store';

export const transactionHistoryStoreId = '@tetu-transactions-history'
const transactionHistoryStore = new LocalStorage<TxHistoryChache>(transactionHistoryStoreId)

class TxHistoryStore {
    private readonly web3Store = web3Store;
    private readonly transactionHistoryStore = transactionHistoryStore;
    private interval: any = null
    private readonly intervalPeriod = 15000

    constructor() {
        makeAutoObservable(this)
    }

    get data() {
        const data = this.transactionHistoryStore.getData()
        return data
    }

    clearHistory() {
        this.transactionHistoryStore.reset()
    }

    getTx(tx: string): TxHistoryChache | undefined {
        return this.transactionHistoryStore.getItem(tx)
    }

    setTx(tx: string, data: TxHistoryChache) {
        this.transactionHistoryStore.setItem(tx, data);
    }

    removeTx(tx: string) {
        this.transactionHistoryStore.deleteItem(tx);
    }

    async checkPendingTransactions() {
        let isPending = false
        const transactionsCache = this.data;
        const promises = Object.keys(transactionsCache).map((txHash) => this.getTransaction(txHash))
        const transactions = await Promise.allSettled(promises)

        const resolved = transactions
            .filter((el) => el.status === 'fulfilled')
            // @ts-ignore
            .map((promiseResult) => {
                // @ts-ignore
                if (promiseResult?.value) {
                    // @ts-ignore
                    const storeItem = this.transactionHistoryStore.getItem(promiseResult.value.transactionHash)

                    if (storeItem) {
                        // @ts-ignore
                        this.transactionHistoryStore.setItem(promiseResult.value.transactionHash, {
                            ...JSON.parse(JSON.stringify(storeItem)),
                            // @ts-ignore
                            data: promiseResult.value,
                        })
                    }
                }

                // @ts-ignore
                return promiseResult.value
            })

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

    private clearInterval() {
        clearInterval(this.interval)
        this.interval = null
    }

    stopPoolingCheckPendingTransactions() {
        this.clearInterval();
    }

    startPoolingCheckPendingTransactions() {
        this.clearInterval()
        this.interval = setInterval(() => {
            this.checkPendingTransactions()
        }, this.intervalPeriod)
    }
}

export const txHistoryStore = new TxHistoryStore()
