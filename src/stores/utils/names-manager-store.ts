import { makeObservable, observable, action, computed } from 'mobx'
import AssetNames from '../../generated/asset-name.json'
import VaultNames from '../../generated/vault-name.json'
import { contractUtilsChainStore } from '../chain-stores/contract-utils'

class NamesManagerStore {
  private readonly vaultStorageKey = '@tetu_vault_name_storage'
  private readonly assetsStorageKey = '@tetu_asset_name_storage'

  private readonly contractUtilsChainStore = contractUtilsChainStore

  @observable.deep
  cacheVaults = {}
  @observable
  cacheAssets = {}
  @observable
  cacheVaultLoadingList: { [key: string]: boolean } = {}
  @observable
  cacheAssetsLoadingList: { [key: string]: boolean } = {}

  constructor() {
    makeObservable(this)
    this.readCache()
  }

  private readCache() {
    // @ts-ignore
    const vaults = JSON.parse(window.localStorage.getItem(this.vaultStorageKey))
    // @ts-ignore
    const assets = JSON.parse(window.localStorage.getItem(this.assetsStorageKey))

    this.cacheVaults = { ...(vaults ?? {}), ...VaultNames }
    this.cacheAssets = { ...(assets ?? {}), ...AssetNames }
  }

  @action
  private setVaultCache(addr: string, value: string) {
    this.cacheVaults = {
      ...this.cacheVaults,
      [addr.toLowerCase()]: value,
    }
    window.localStorage.setItem(this.vaultStorageKey, JSON.stringify(this.cacheVaults))
  }

  @action
  private setAssetCache(addr: string, value: string) {
    this.cacheAssets = {
      ...this.cacheAssets,
      [addr.toLowerCase()]: value,
    }
    window.localStorage.setItem(this.assetsStorageKey, JSON.stringify(this.cacheAssets))
  }

  @action
  private setVaultCacheLoadingItem(addr: string) {
    this.cacheVaultLoadingList = {
      ...this.cacheVaultLoadingList,
      [addr.toLowerCase()]: true,
    }
  }

  @action
  private setAssetCacheLoadingItem(addr: string) {
    this.cacheAssetsLoadingList = {
      ...this.cacheAssetsLoadingList,
      [addr.toLowerCase()]: true,
    }
  }

  @action
  private removeVaultCacheLoadingItem(addr: string) {
    delete this.cacheVaultLoadingList[addr];
  }

  @action
  private removeAssetCacheLoadingItem(addr: string) {
    delete this.cacheAssetsLoadingList[addr];
  }

  @action.bound
  getVaultName(address: string) {
    const addr = address.toLowerCase()
    if (addr in this.cacheVaults) {
      //@ts-ignore
      return this.cacheVaults[addr]
    } else {
      this.fetchName(addr, 'vaults')
      return null
    }
  }

  @action.bound
  getAssetName(address: string) {
    if (typeof address !== 'string') {
      return
    }
    const addr = address.toLowerCase()
    // @ts-ignore
    if (addr in this.cacheAssets && this.cacheAssets[addr]) {
      //@ts-ignore
      return this.cacheAssets[addr]
    } else {
      // @ts-ignore
      if (this.cacheAssets[addr] !== null) {
        this.fetchName(addr, 'assets')
      }
      // @ts-ignore
      this.cacheAssets[addr] = null
      // @ts-ignore
      return this.cacheAssets[addr]
    }
  }

  @action
  private async fetchName(address: string, store: 'vaults' | 'assets'): Promise<void> {
    try {
      if (store === 'vaults') {
        this.setVaultCacheLoadingItem(address)
      }
      if (store === 'assets') {
        this.setAssetCacheLoadingItem(address)
      }

      const response = await this.contractUtilsChainStore.erc20Symbols([address])
      let [name] = response
      name = name.replace('+', 'Plus');

      if (store === 'vaults') {
        this.setVaultCache(address, name)
      }
      if (store === 'assets') {
        this.setAssetCache(address, name)
      }
    } catch { }
    finally {
      if (store === 'vaults') {
        this.removeVaultCacheLoadingItem(address)
      }
      if (store === 'assets') {
        this.removeAssetCacheLoadingItem(address)
      }
    }
  }
}

export const namesManagerStore = new NamesManagerStore()
