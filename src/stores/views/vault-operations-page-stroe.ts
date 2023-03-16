import {
  userInfoOfVaultStore,
  vaultInfoStore,
  vaultPricePerFullShareStore,
  vaultWithUserInfosStore,
} from '../resources-stores/vaults-store'
import { makeAutoObservable } from 'mobx'
import { networkManager, tokenChainStore } from '../chain-stores'
import { TokenTransactionType, TxChache } from '../chain-stores/types'
import { metaMaskStore } from '../meta-mask-store'
import { vaultInfosFromTetuReaderServer } from '../services/vault-servise'
import { StrategySplitterFetchStore } from '../chain-stores/strategy-splitter'
import { mainPageStore } from './main-page'

class VaultDataPageStore {
  private readonly vaultWithUserInfosStore = vaultWithUserInfosStore
  private readonly vaultInfoStore = vaultInfoStore
  private readonly metaMaskStore = metaMaskStore
  private readonly userInfoOfVaultStore = userInfoOfVaultStore
  private vaultOperationPageStore: null | typeof vaultOperationPageStore = null
  private readonly vaultPricePerFullShareStore = vaultPricePerFullShareStore
  private readonly vaultInfosFromTetuReaderServer = vaultInfosFromTetuReaderServer
  private readonly networkManager = networkManager
  public strategySplitterStore: any = null

  private currentVault: string | null = null

  constructor() {
    makeAutoObservable(this)
    setTimeout(() => {
      this.vaultOperationPageStore = vaultOperationPageStore
    }, 0)
  }

  async fetchData() {
    if (!this.vaultInfosFromTetuReaderServer.isFetched) {
      await this.vaultInfosFromTetuReaderServer.fetch(this.networkManager.network.other.vaultsApi)
    }

    // if (this.data === null) {
    //   await mainPageStore.fetchData()
    // }

    if (this.data === null) {
      if (this.metaMaskStore.walletAddress) {
        if (!this.vaultWithUserInfosStore.isFetched) {
          await this.vaultWithUserInfosStore.fetch(this.metaMaskStore.walletAddress, [
            this.currentVault,
          ])

          if (Array.isArray(this.vaultWithUserInfosStore.value)) {
            const platform = this.vaultWithUserInfosStore.value?.[0]?.vault?.platform

            if (platform === '24') {
              this.strategySplitterStore = new StrategySplitterFetchStore(
                this.vaultWithUserInfosStore.value[0].vault.strategy,
              )

              this.strategySplitterStore.maxCheapWithdrawStore.fetch()
              this.strategySplitterStore.wantToWithdrawStore.fetch()
            }
          }
        }
      } else {
        if (!this.vaultInfoStore.isFetched) {
          await this.vaultInfoStore.fetch(this.currentVault)
        }
      }
    }

    if (this.metaMaskStore.walletAddress && this.data !== null) {
      await this.vaultOperationPageStore!.getCheckIsApproved()
      await userInfoOfVaultStore.fetch(metaMaskStore.walletAddress, this.data.addr)
    }
  }

  get isLoading() {
    const isLoading =
      !this.data
      ||
      this.vaultOperationPageStore?.isCheckingApprove
      ||
      this.resourceStore.isFetching
    ;

    if (this.isConnectedWallet) {
      return (
        isLoading
        ||
        this.userInfoOfVaultStore.isFetching
        // ||
        // this.userInfoOfVaultStore.value === null
      )
    } else {
      return isLoading
    }
  }

  set vault(value: string) {
    this.currentVault = value
  }

  get isConnectedWallet() {
    return this.metaMaskStore.isConnected
  }

  get resourceStore() {
    return this.metaMaskStore.walletAddress ? this.vaultWithUserInfosStore : this.vaultInfoStore
  }

  get data() {
    if (Array.isArray(this.resourceStore.value)) {
      return this.resourceStore.value.find(
        (el: any) => el.vault.addr.toLowerCase() === this.currentVault?.toLowerCase(),
      ).vault
    }
    return this.resourceStore.value
  }

  reset() {
    this.vaultWithUserInfosStore.reset()
    this.vaultInfoStore.reset()
    this.userInfoOfVaultStore.reset()
    this.vaultOperationPageStore?.reset()
    this.vaultPricePerFullShareStore.reset()
  }
}

export const vaultDataPageStore = new VaultDataPageStore()

class VaultOperationPageStore {
  private readonly vaultDataPageStore = vaultDataPageStore
  private readonly tokenChainStore = tokenChainStore
  private readonly userInfoOfVaultStore = userInfoOfVaultStore

  isApprovedDeposit = false
  isCheckingApprove = false

  isFetchingDeposit = false
  isFetchingWithdraw = false
  isFetchingWithdrawAllAndClaim = false
  isFetchingClaim = false

  isShowLoader = false
  isPendingApproveDeposit = false
  isPendingDeposit = false
  isPendingWithdraw = false
  isPendingWithdrawAndClaim = false
  isPendingClaim = false

  isFetchingWithdrawRequest = false
  isFetchingWithdrawProcess = false
  isPendingWithdrawRequest = false
  isPendingWithdrawProcess = false

  depositValue = 0
  withdrawValue = 0

  setDepositValue(value: number) {
    this.depositValue = value
  }

  setWithdrawValue(value: number) {
    this.withdrawValue = value
  }

  constructor() {
    makeAutoObservable(this)
  }

  private checkPending() {
    this.tokenChainStore.checkPendingTransactions().then((isPending: boolean) => {
      if (isPending) {
        this.isShowLoader = true
      }
    })
  }

  getCheckIsApproved() {
    this.tokenChainStore
      .checkIsApproved(this.vaultDataPageStore.data.addr)
      .then((isApproved: boolean) => {
        this.isCheckingApprove = false
        this.isApprovedDeposit = isApproved
        this.checkPending()
      })
  }

  checkShowLoaders() {
    {
      const transactions: any = new Set(
        Object.values(tokenChainStore.pendingTranscations)
          .filter((el) => (el as TxChache).vaultAddress === this.vaultDataPageStore.data?.addr)
          .map((el) => (el as TxChache).txType),
      )
      if (!this.isCheckingApprove) {
        this.isPendingApproveDeposit = transactions.has(TokenTransactionType.approveDeposit)
      }
      this.isPendingDeposit = transactions.has(TokenTransactionType.deposit)
      this.isPendingWithdraw = transactions.has(TokenTransactionType.withdraw)
      this.isPendingClaim = transactions.has(TokenTransactionType.claim)
      this.isPendingWithdrawAndClaim = transactions.has(TokenTransactionType.withdrawAllAndClaim)
    }

    {
      const transactions: any = this.strategySplitterTransactions
      this.isPendingWithdrawRequest = transactions.has(TokenTransactionType.withdrawRequest)
      this.isPendingWithdrawProcess = transactions.has(TokenTransactionType.withdrawRequest)
    }
  }

  checkPendingTransactions() {
    if (this.vaultDataPageStore.data) {
      const transactions: any = new Set(
        Object.values(tokenChainStore.pendingTranscations)
          .filter((el) => (el as TxChache).vaultAddress === this.vaultDataPageStore.data?.addr)
          .map((el) => (el as TxChache).txType),
      )
      if (this.isFetchingDeposit && !transactions.has(TokenTransactionType.deposit)) {
        this.updateChainData(() => {
          this.isFetchingDeposit = false
        })
      }

      if (this.isFetchingWithdraw && !transactions.has(TokenTransactionType.withdraw)) {
        this.updateChainData(() => {
          this.isFetchingWithdraw = false
        })
      }

      if (
        this.isFetchingWithdrawAllAndClaim &&
        !transactions.has(TokenTransactionType.withdrawAllAndClaim)
      ) {
        this.updateChainData(() => {
          this.isFetchingWithdrawAllAndClaim = false
        })
      }

      if (this.isFetchingClaim && !transactions.has(TokenTransactionType.claim)) {
        this.updateChainData(() => {
          this.isFetchingClaim = false
        })
      }

      if (this.vaultDataPageStore?.strategySplitterStore?.requestWithdrawStore) {
        const transactions: any = this.strategySplitterTransactions

        this.vaultDataPageStore.strategySplitterStore.store.checkPendingTransactions()

        if (
          this.isFetchingWithdrawRequest &&
          !transactions.has(TokenTransactionType.withdrawRequest)
        ) {
          this.vaultDataPageStore.strategySplitterStore.wantToWithdrawStore.fetch()
          this.updateChainData(() => {
            this.isFetchingWithdrawRequest = false
          })
        }

        if (
          this.isFetchingWithdrawProcess &&
          !transactions.has(TokenTransactionType.withdrawProcess)
        ) {
          this.updateChainData(() => {
            this.isFetchingWithdrawProcess = false
          })
        }
      }
    }
  }

  get strategySplitterTransactions() {
    if (this.vaultDataPageStore?.strategySplitterStore === null) {
      return new Set()
    }

    const transactions: any = new Set(
      Object.values(this.vaultDataPageStore?.strategySplitterStore.store.pendingTranscations)
        .filter((el) => (el as TxChache).vaultAddress === this.vaultDataPageStore.data?.addr)
        .map((el) => (el as TxChache).txType),
    )

    return transactions
  }

  updateChainData(cb: Function) {
    this.userInfoOfVaultStore
      .fetch(metaMaskStore.walletAddress, this.vaultDataPageStore.data?.addr)
      .then(() => {
        cb()
        this.depositValue = 0
        this.withdrawValue = 0
      })
  }

  approve() {
    this.tokenChainStore.approve(this.vaultDataPageStore.data.addr)
  }

  async deposit() {
    this.isFetchingDeposit = true

    this.tokenChainStore
      .depositAndInvestToVault(this.vaultDataPageStore.data.addr, this.depositValue)
      .catch(() => {
        this.isFetchingDeposit = false
      })
  }

  withdraw() {
    this.isFetchingWithdraw = true
    this.tokenChainStore
      .withdrawToVault(this.vaultDataPageStore.data.addr, this.withdrawValue)
      .catch(() => {
        this.isFetchingWithdraw = false
      })
  }

  withdrawAllAndClaim() {
    this.isFetchingWithdrawAllAndClaim = true
    this.tokenChainStore.exitToVault(this.vaultDataPageStore.data.addr).catch(() => {
      this.isFetchingWithdrawAllAndClaim = false
    })
  }

  claim(addr?: string) {
    this.isFetchingClaim = true
    tokenChainStore.getAllRewardsToVault(addr ?? this.vaultDataPageStore.data.addr).catch(() => {
      this.isFetchingClaim = false
    })
  }

  async withdrawRequest(amount: string) {
    this.isFetchingWithdrawRequest = true

    if (this.vaultDataPageStore?.strategySplitterStore) {
      await this.vaultDataPageStore?.strategySplitterStore.requestWithdrawStore
        .fetch(this.vaultDataPageStore.data.addr, amount)
        .catch(() => {
          this.isFetchingWithdrawRequest = false
        })
    }
  }

  withdrawProcess() {
    this.isFetchingWithdrawProcess = true
    if (this.vaultDataPageStore?.strategySplitterStore) {
      this.vaultDataPageStore?.strategySplitterStore.processWithdrawRequestsStore
        .fetch(this.vaultDataPageStore.data.addr)
        .catch(() => {
          this.isFetchingWithdrawProcess = false
        })
    }
  }

  reset() {
    this.isApprovedDeposit = false
    this.isCheckingApprove = false
    this.isFetchingDeposit = false
    this.isFetchingWithdraw = false
    this.isFetchingWithdrawAllAndClaim = false
    this.isFetchingClaim = false

    this.isShowLoader = false
    this.isPendingApproveDeposit = false
    this.isPendingDeposit = false
    this.isPendingWithdraw = false
    this.isPendingWithdrawAndClaim = false
    this.isPendingClaim = false

    this.isFetchingWithdrawRequest = false
    this.isFetchingWithdrawProcess = false
    this.isPendingWithdrawRequest = false
    this.isPendingWithdrawProcess = false

    this.depositValue = 0
    this.withdrawValue = 0
  }
}

export const vaultOperationPageStore = new VaultOperationPageStore()
