import { action, computed, makeObservable, observable } from 'mobx'
import { metaMaskStore } from '../meta-mask-store'
import { UserInfoOfVaultStore } from './vaults-store'

class UserInfosStore {
  private readonly metaMaskStore = metaMaskStore

  @observable.deep
  storeMap: { [key: string]: UserInfoOfVaultStore } = {}

  constructor() {
    makeObservable(this)
  }

  @computed
  get isFetched() {
    const stores = Object.values(this.storeMap)
    const items = stores.map((el) => el.isFetched)
    return !items.includes(false)
  }

  @computed
  get isFetching() {
    const stores = Object.values(this.storeMap)
    const items = stores.map((el) => el.isFetching)
    return items.includes(true)
  }

  @action
  refetch(vaultsAdressess: string[] | null) {
    if (vaultsAdressess === null) {
      return
    }

    const { walletAddress } = this.metaMaskStore

    if (!walletAddress) {
      return
    }

    const storeMap = this.storeMap

    vaultsAdressess.forEach(async (vaultAdress: string) => {
      const store = new UserInfoOfVaultStore()
      await store.fetch(walletAddress, vaultAdress)
      storeMap[vaultAdress.toLowerCase()] = store
    })
  }

  @action
  fetch(vaultsAdressess: string[] | null) {
    if (vaultsAdressess === null) {
      return
    }

    const { walletAddress } = this.metaMaskStore

    if (!walletAddress) {
      return
    }

    const storeMap = this.storeMap

    vaultsAdressess.forEach((vaultAdress: string) => {
      if (!storeMap[vaultAdress.toLowerCase()]) {
        const store = new UserInfoOfVaultStore()
        store.fetch(walletAddress, vaultAdress)
        storeMap[vaultAdress.toLowerCase()] = store
      }
    })
  }

  @action
  async update(vaultAdress: string) {
    const { walletAddress } = this.metaMaskStore

    const storeMap = this.storeMap

    if (storeMap[vaultAdress.toLowerCase()]) {
      await storeMap[vaultAdress.toLowerCase()].fetch(walletAddress, vaultAdress)
    } else {
      const store = new UserInfoOfVaultStore()
      await store.fetch(walletAddress, vaultAdress)
      storeMap[vaultAdress.toLowerCase()] = store
    }
  }

  @action
  reset() {
    this.storeMap = {}
  }
}

export const userInfosStore = new UserInfosStore()
