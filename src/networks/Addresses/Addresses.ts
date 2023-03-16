export type Network = {
  chainId: string
  chainName: string
  rpcUrls: string[]
  blockExplorerUrls: string[]
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
    address: string
  }
  other: {
    networkName: string;
    vaultsApi: string
    web3Provider: string
  }
}

export type CoreAddresses = {
  fundkeeper: string // for stats
  controller: string // for stats
  governance: string
  utils: string // helper
  contractReader: string // helper
  TetuToken: string // tetu reward token
  PS: string // profit share pool
  zap: string // swap router from USDT to assets
  multiSwap: string // for swap
  pawnshop: string
}

export type AddressConfig<V = {}, A = {}, O = {}> = {
  network: Network
  addresses: {
    vaultsWhiteList: { [key: string]: string }
    vaultSymbolName: { [key: string]: string }
    core: CoreAddresses
    lpsWithTetu: { lp: string; vault: string }[]
    vaults: V & {}
    assets: A & {
      usdc: string
    }
    other: O & {}
  }
}

export class Addresses<V = {}, A = {}, O = {}> {
  constructor(private _config: AddressConfig<V, A, O>) { }

  get config() {
    return this._config
  }

  setOtherAddress(name: string, value: string) {
    if (typeof value === 'string') {
      // @ts-ignore
      this._config.addresses.other[name] = value
    }
  }
}
