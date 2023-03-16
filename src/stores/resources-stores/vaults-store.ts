import { FetchResource } from '../core/fetch-resource'
import { contractReaderChainStore } from '../chain-stores/contact-reader-store'
import { UserInfo, VaultInfo } from '../chain-stores/types'
import { tetuVaultChainStore } from '../chain-stores/tetu-vault-store'
import { vaultChainStore } from '../chain-stores'
import { CollectionStore } from '../core'

export class UserInfoOfVaultStore extends FetchResource<UserInfo> {
  constructor() {
    super((walletAddress: string, vaultAddress: string) =>
      contractReaderChainStore.getUserInfo(walletAddress, vaultAddress),
    )
  }
}

export const userInfoOfVaultStore = new UserInfoOfVaultStore()

class VaultInfoStore extends FetchResource<VaultInfo> {
  constructor() {
    super((vaultAddress: string) => contractReaderChainStore.getVaultInfo(vaultAddress))
  }
}

export const vaultInfoStore = new VaultInfoStore()

class VaultPricePerFullShareStore extends FetchResource<string> {
  constructor() {
    super((vaultAddress: string) => vaultChainStore.getPricePerFullShare(vaultAddress))
  }
}

export const vaultPricePerFullShareStore = new VaultPricePerFullShareStore()

class VaultInfosStore extends FetchResource<VaultInfo> {
  constructor() {
    super((vaultAddresses: string[]) => contractReaderChainStore.getVaultInfos(vaultAddresses))
  }
}

export const vaultInfosStore = new VaultInfosStore()

class VaultWithUserInfosStore extends FetchResource<any> {
  constructor() {
    super((walletAddress: string, vaultAddresses: string[]) =>
      contractReaderChainStore.getVaultWithUserInfos(walletAddress, vaultAddresses),
    )
  }
}

export const vaultWithUserInfosStore = new VaultWithUserInfosStore()

export class VaultPriceStore extends FetchResource<string> {
  constructor() {
    super((vaultAddress: string) => contractReaderChainStore.getPrice(vaultAddress))
  }
}

class VaultsStore extends FetchResource<string[]> {
  constructor() {
    super(() => contractReaderChainStore.getVaults())
  }
}

export const vaultsStore = new VaultsStore()

export class TetuTokenValuesStore extends FetchResource<string[]> {
  constructor() {
    super((block?: number) => contractReaderChainStore.getTetuTokenValues(block))
  }
}

export const tetuTokenValuesStore = new TetuTokenValuesStore()

class StrategesStore extends FetchResource<string[]> {
  constructor() {
    super(() => contractReaderChainStore.getStrateges())
  }
}

export const strategesStore = new StrategesStore()

class TotalTvlUsdcStore extends FetchResource<string> {
  constructor() {
    super((addresses: string[], block?: number) =>
      contractReaderChainStore.getTotalTvlUsdc(addresses, block),
    )
  }
}

export const totalTvlUsdcStore = new TotalTvlUsdcStore()

class TotalTetuBoughBack extends FetchResource<string> {
  constructor() {
    super((addresses: string[], block?: number) =>
      contractReaderChainStore.getTotalTetuBoughBack(addresses, block),
    )
  }
}

export const totalTetuBoughBack = new TotalTetuBoughBack()

class TetuTotalSupplyStore extends FetchResource<string> {
  constructor() {
    super(() => tetuVaultChainStore.getTotalSupply())
  }
}

export const tetuTotalSupplyStore = new TetuTotalSupplyStore()

export class VaultUserLockTSStore extends FetchResource<string> {
  constructor() {
    super((vault: string, user: string) => vaultChainStore.getUserLockTs(vault, user))
  }
}

export const vaultUserLockTSStore = new VaultUserLockTSStore()

// @ts-ignore
export const vaultUserLockTSCollectionStore = new CollectionStore(VaultUserLockTSStore)

class PeriodFinishForTokenStore extends FetchResource<string[]> {
  constructor() {
    super((vaultAddr: string, tokens: string[]) =>
      vaultChainStore.getPeriodFinishForToken(vaultAddr, tokens),
    )
  }
}

export const periodFinishForTokenStore = new PeriodFinishForTokenStore()

class TotalUsersStore extends FetchResource<string> {
  constructor() {
    super((vaults: string[], block?: number) =>
      contractReaderChainStore.getTotalUsers(vaults, block),
    )
  }
}

export const totalUsersStore = new TotalUsersStore()
