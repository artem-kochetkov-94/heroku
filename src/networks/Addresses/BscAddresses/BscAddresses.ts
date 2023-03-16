import { Addresses } from '../Addresses'
import { tetuServerResources } from '../../../api/tetu-server'
import {
  blueChips,
  excludeAutocompoundAprAddrs,
  hardWorksExclude,
  stableCoins,
  tetuSwapVaults,
  vaultsWhiteList,
  vaultsWithLabel_new,
  vaultSymbolName,
  zapExcludeList,
  core,
} from './constants'
import bscLogo from '../../../static/images/networks/bsc.jpg'

const network = {
  chainId: '0x38',
  chainName: 'BSC',
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com/'],
  logo: bscLogo,
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  other: {
    networkName: 'BSC',
    urlParam: '?network=BSC',
    vaultsApi: tetuServerResources.reader.vaultInfos + '?network=BSC',
    web3Provider: process.env.REACT_APP_WEB_3_URL_BSC!,
    gasPrise: undefined,
    blockPeriod: 3,
    gasApi: 'https://owlracle.info/bsc/gas',
  },
}

const addresses = {
  TETU_SWAP_USDC_TETU_vault: '0x0000000000000000000000000000000000000001',
  TETU_SWAP_USDC_TETU_LP: '0x0000000000000000000000000000000000000001',
}

const lpsWithTetu: any[] = [
  {
    lp: addresses.TETU_SWAP_USDC_TETU_LP,
    vault: addresses.TETU_SWAP_USDC_TETU_vault,
  },
]

const vaults = {
  some: '',
}

const assets = {
  usdc: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
}

const config = {
  network,
  other: {
    mainPage: {
      vaultTabs: [
        {
          name: 'Cone',
          description:
            'Autocompound your profit with maximum boost',
          platforms: ['41'],
          include: [
            '0x3Fd0A8a975eC101748aE931B2d13711E04231920', // Tetu Vault Cone v-WBNB/CONE
          ],
        },
      ],
    },
  },
  addresses: {
    vaultSymbolName,
    zapExcludeList,
    hardWorksExclude,
    tetuSwapVaults,
    vaultsWhiteList,
    stableCoins,
    blueChips,
    core,
    lpsWithTetu,
    vaults,
    assets,
    excludeAutocompoundAprAddrs,
    vaultsWithLabel_new,
    statsPage: {
      // tetu-holders
      tetuLockedChart: {
        LPs: [addresses.TETU_SWAP_USDC_TETU_LP],
        PS: core.PS,
        items: [
          {
            addr: core.fundkeeper,
            label: 'FundKeeper',
          },
          {
            addr: core.governance,
            label: 'Governance',
          },
          {
            addr: core.controller,
            label: 'Controller',
          },
        ],
      },
      LPs: {
        tetuVaults: [addresses.TETU_SWAP_USDC_TETU_vault],
      },
      FundKeeper: {
        addr: core.fundkeeper,
        LP: '0x0000000000000000000000000000000000000001',
        // 0x371620F53C89d4c97e677506f0cfCf98EFcB1CF8
      },
    },
  },
}

// @ts-ignore
export const bscAddresses = new Addresses(config)
