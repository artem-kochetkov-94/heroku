import { Addresses } from '../Addresses'
import { tetuServerResources } from '../../../api/tetu-server'
import { hexlify, hexStripZeros } from 'ethers/lib/utils'

import {
  zapExcludeList,
  tetuSwapVaults,
  vaultsWhiteList,
  stableCoins,
  blueChips,
  disabledWithdraw,
  hardWorksExclude,
  vaultSymbolName,
  excludeAutocompoundAprAddrs,
  vaultsWithLabel_new,
  vaults,
  core,
  bestVaults,
} from './constants'

import maticLogo from '../../../static/images/networks/matic.jpeg'

const network = {
  chainId: '0x89',
  chainName: 'Polygon (Matic)',
  rpcUrls: ['https://polygon-mainnet.g.alchemy.com/v2/9N7SZel_kSDKC9201zJ8-SDjVrKHC2Y8'],
  blockExplorerUrls: ['https://polygonscan.com/'],
  logo: maticLogo,
  nativeCurrency: {
    name: 'Matic Token',
    symbol: 'MATIC',
    decimals: 18,
  },
  other: {
    networkName: 'MATIC',
    urlParam: '?network=MATIC',
    vaultsApi: tetuServerResources.reader.vaultInfos + '?network=MATIC',
    web3Provider: process.env.REACT_APP_WEB_3_URL_MATIC!,
    gasPrise: undefined, //hexStripZeros(hexlify(35_000_000_000)),
    blockPeriod: 2.25,
    gasApi: 'https://owlracle.info/poly/gas',
  },
}

const addresses = {
  tetuUsdcLP: '0x80fF4e4153883d770204607eb4aF9994739C72DC',
  tetuUsdcLPVault: '0x51b0B58FF704b97E8d5aFf911E2FfC9939E44BFC',

  quickTetuUSDCLP: '0x22E2BDaBEbA9b5ff8924275DbE47aDE5cf7b822B',
  quicktetuUsdcLPVault: '0x301204E50C4295FE38c87F774Cbdf984a1B66e87',

  tetuWmaticSushiLP: '0x34dA30D1f8Ef9799F5Ae3B9989e1dEf926052e78',
  tetuSushiWmaticVault: '0x2fc753522260c2ee6bef62d5800640f0a04c212c',

  xTETU: '0x225084D30cc297F3b177d9f93f5C3Ab8fb6a1454',
}

const lpsWithTetu = [
  {
    lp: addresses.tetuUsdcLP,
    vault: addresses.tetuUsdcLPVault,
  },
  {
    lp: addresses.quickTetuUSDCLP,
    vault: addresses.quicktetuUsdcLPVault,
  },
  {
    lp: addresses.tetuWmaticSushiLP,
    vault: addresses.tetuSushiWmaticVault,
  },
]

const assets = {
  usdc: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  wmatic: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  QI: '0x580A84C73811E1839F75d86d75d88cCa0c241fF4',
  tetuqi: '0x4Cd44ced63d9a6FEF595f6AD3F7CED13fCEAc768',
}

const config = {
  network,
  other: {
    mainPage: {
      vaultTabs: [
        {
          name: 'Single Tetu Farm',
          namePart1: 'Single',
          namePart2: 'Tetu Farm',
          description:
            'All rewards are paid in xTETU and automatically deposited in the xTETU vault, which compounds TETU as the underlying asset.',
          platforms: ['9', '14', '16', '18', '19', '20', '21', '22', '26'],
          include: [
            '0x225084d30cc297f3b177d9f93f5c3ab8fb6a1454', // xTETU (PS)
            '0xacee7bd17e7b04f7e48b29c0c91af67758394f0f', // dxTETU
            '0x4Cd44ced63d9a6FEF595f6AD3F7CED13fCEAc768', // QI QIDAO
            '0xe2EbFD67ed292BaCE45BF93Bb3D828bBaA5A59dE', // miMATIC IMPERMAX
            '0xDcB8F34a3ceb48782c9f3F98dF6C12119c8d168a', // tetuMESH
            '0x3dd66000a5cd4de6bc74074dc7b776a6afe78295', // link strategy splitter
          ],
          exclude: [],
        },
        {
          name: 'Single Autocompound',
          namePart1: 'Single',
          namePart2: 'Autocompound',
          description: 'These vaults are compounding vaults . The assets will grow every 24 hours.',
          platforms: [],
          includeOnly: [
            '0xdDB5addaFb3EB59Ade1d2688AEfdD91e839c9344', // xWETH vault:
            '0x1CA7Ce76A205b570f6774072cf841897d68eCB6A', // xUSDC vault:
            '0x26e4a0AF991e3b6A5e91e1A3a19fFd1a0d5e898F', // xWBTC vault:
            '0x2Bd82150D6356bc1778560Fc1095C4a8Ff4dfDc2', // xUSDT vault:
            '0xa172BF1858623991B2C392aad6064B1B9e028b5e', // xWMATIC vault:
            '0xf52B3250E026E0307d7d717AE0f331baAA4F83a8', // xDAI vault:
            '0x64c86f9e59cd9de668fb24305831e51ba8d34059', // dino
            '0x8f1505C8F3B45Cb839D09c607939095a4195738e', // xtetuQi
            '0x6c5e2e7df0372f834b7f40d16ff4333cf49af235', // link tetu
          ],
        },
        {
          name: 'Balancer',
          description: 'Deposit BPT token and have auto-compounded profit',
          platforms: [
            '36',
          ],
          exclude: [
            '0x7fc9e0aa043787bfad28e29632ada302c790ce33', // tetubal
          ],
        },
        // {
        //   name: 'Multi Strategies',
        //   description:
        //     'These are complex strategies which deposit assets into Aave in order to create a vault on QiDao to borrow MAI and deposit on Balancer to farm rewards. Qi and BAL rewards are harvested once a week and autocompounded.',
        //   platforms: ['15'],
        // },
        // {
        //   name: 'tetuQi',
        //   description:
        //     'Lock QI tokens permanently, and receive liquid tetuQi in return, which can be swapped back to QI via the dedicated tetuQi-Qi TetuSwap LP. tetuQi holders receive QI airdrop rewards as tetuQi and additional bonus TETU rewards. Voting dxTetu holders direct the eQi held by the Tetu protocol in QiDAO governance.',
        //   platforms: ['12', '21'],
        //   includeOnly: [
        //     '0x2f45a8a14237ca2d965405957f8c2a1082558890',
        //     '0x4cd44ced63d9a6fef595f6ad3f7ced13fceac768',
        //     '0x8f1505C8F3B45Cb839D09c607939095a4195738e', // xtetuQi
        //   ],
        // },
        // {
        //   name: 'TetuSwap',
        //   description:
        //     'TetuSwap strategies deposit each side of the LP into the Tetu autocompounding vaults, earning additional yield for users. When a swap occurs, the strategy withdraws a sufficient amount of assets to execute the swap.',
        //   platforms: ['12'],
        // },
      ],
    },
  },
  addresses: {
    bestVaults,
    excludeAutocompoundAprAddrs,
    vaultSymbolName,
    zapExcludeList,
    hardWorksExclude,
    disabledWithdraw,
    tetuSwapVaults,
    vaultsWhiteList,
    stableCoins,
    blueChips,
    core,
    lpsWithTetu,
    vaults,
    assets,
    vaultsWithLabel_new,
    statsPage: {
      // tetu-holders
      tetuLockedChart: {
        LPs: [addresses.tetuUsdcLP, addresses.quickTetuUSDCLP, addresses.tetuWmaticSushiLP],
        PS: core.PS,
        items: [
          {
            addr: core.fundkeeper,
            label: 'FundKeeper',
          },
          {
            addr: core.liquidityBalancer,
            label: 'Liquidity Balancer',
          },
          {
            addr: core.notifyHelper,
            label: 'Notify Helper',
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
        tetuVaults: [
          '0xca870d6575ef0b872f60e7fa63774258c523027f',
          '0x1d5ea54d75c6d109853540d6614881ef14d0d7d0',
          '0x1565354a7b39daf855e880f049c155983d9dc864',
          '0xbe527f95815f906625f29fc084bfd783f4d00787',
          '0xe554019d6ccf3ccde5bba6f21d0b863b973c03e0',
        ],
      },
      FundKeeper: {
        addr: core.fundkeeper,
        LP: addresses.quickTetuUSDCLP,
      },
      liquidityBalancer: {
        LP: addresses.tetuUsdcLP,
      },
    },
  },
}

export const maticAddresses = new Addresses<{
  dxTETU: string
  IS3USD: string
  aTricrypto3: string
  crvAAVE: string
  // @ts-ignore
}>(config)
