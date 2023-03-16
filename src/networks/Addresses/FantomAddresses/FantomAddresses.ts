import { Addresses } from '../Addresses'
import { tetuServerResources } from '../../../api/tetu-server'
import {
  zapExcludeList,
  hardWorksExclude,
  tetuSwapVaults,
  vaultsWhiteList,
  stableCoins,
  blueChips,
  vaultSymbolName,
  excludeAutocompoundAprAddrs,
  vaultsWithLabel_new,
  vaults,
  core,
} from './constants'
import { hexlify, hexStripZeros } from 'ethers/lib/utils'
import fantomLogo from '../../../static/images/networks/fantom-ftm-logo.jpeg'

const network = {
  chainId: '0xfa',
  chainName: 'Fantom',
  rpcUrls: ['https://rpc.ftm.tools/'],
  blockExplorerUrls: ['https://ftmscan.com/'],
  logo: fantomLogo,
  nativeCurrency: {
    name: 'Fantom Token',
    symbol: 'FTM',
    decimals: 18,
  },
  other: {
    networkName: 'FANTOM',
    urlParam: '?network=FANTOM',
    vaultsApi: tetuServerResources.reader.vaultInfos + '?network=FANTOM',
    web3Provider: process.env.REACT_APP_WEB_3_URL_FANTOM!,
    gasPrise: undefined,
    blockPeriod: 2.25 / 2.6,
    gasApi: 'https://owlracle.info/ftm/gas',
  },
}

const addresses = {
  TETU_SWAP_USDC_TETU_vault: '0x38a246704f1cF9346A2e85aaad8B874cA1787900',
  TETU_SWAP_USDC_TETU_LP: '0x371620F53C89d4c97e677506f0cfCf98EFcB1CF8',
}

const lpsWithTetu: any[] = [
  {
    lp: addresses.TETU_SWAP_USDC_TETU_LP,
    vault: addresses.TETU_SWAP_USDC_TETU_vault,
  },
]

const assets = {
  usdc: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
}

const config = {
  network,
  other: {
    mainPage: {
      vaultTabs: [
        {
          name: 'Single Tetu Farm',
          description:
            'All rewards are paid in xTETU and automatically deposited in the xTETU Profit Share (PS) pool, which compounds TETU as the underlying asset.',
          platforms: ['9', '14', '16', '18', '19', '20', '21', '22', '26'],
          include: [
            '0xf239f89992688ce2539cf637614cc3f8866ea433', // xTETU (PS)
            '0x572749cd713cbfeaccf06f0c83b68e8c1c10a248', // FUSD Tetu
            '0x27c616838b8935c8a34011d0e88ba335040ac7b1', // miMATIC MARKET
          ],
        },
        {
          name: 'LPs',
          description: 'These vaults are compounding vaults . the assets will grow every 24 hours.',
          platforms: [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '10',
            '11',
            '13',
            '17',
            '23',
            '24',
            '25',
            '27',
          ],
          exclude: [
            '0xf239f89992688ce2539cf637614cc3f8866ea433', // xTETU (PS)
            '0x572749cd713cbfeaccf06f0c83b68e8c1c10a248', // FUSD Tetu
          ],
        },
        {
          name: 'TetuSwap',
          description:
            'TetuSwap strategies deposit each side of the LP into the Tetu autocompounding vaults, earning additional yield for users. When a swap occurs, the strategy withdraws a sufficient amount of assets to execute the swap.',
          platforms: ['12'],
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
        LP: '0x1b989bDE3aA642831596000e985b7D5EAeF2503e',
        // 0x371620F53C89d4c97e677506f0cfCf98EFcB1CF8
      },
    },
  },
}

// @ts-ignore
export const fantomAddresses = new Addresses(config)
