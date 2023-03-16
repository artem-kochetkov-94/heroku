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
  disabledWithdraw,
  vaults,
  core,
  bestVaults
} from './constants'
import ethLogo from '../../../static/asset-icons/eth.jpeg'

const network = {
  chainId: '0x1',
  chainName: 'ETH',
  rpcUrls: [process.env.REACT_APP_WEB_3_URL_ETH!],
  blockExplorerUrls: ['https://etherscan.io/'],
  logo: ethLogo,
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  other: {
    networkName: 'ETH',
    urlParam: '?network=ETH',
    vaultsApi: tetuServerResources.reader.vaultInfos + '?network=ETH',
    web3Provider: process.env.REACT_APP_WEB_3_URL_ETH!,
    gasPrise: undefined,
    blockPeriod: 12,
    gasApi: 'https://owlracle.info/eth/gas',
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

const assets = {
  usdc: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
}

const config = {
  network,
  other: {
    mainPage: {
      vaultTabs: [
        {
          name: 'Balancer',
          description: 'Deposit BPT token and have auto-compounded boosted profit',
          platforms: [
            '36',
          ],
          exclude: [
            '0xfe700d523094cc6c673d78f1446ae0743c89586e', // tetubal
          ],
        },
      ],
    },
  },
  addresses: {
    bestVaults,
    vaultSymbolName,
    zapExcludeList,
    hardWorksExclude,
    tetuSwapVaults,
    disabledWithdraw,
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
export const ethereumAddresses = new Addresses(config)
