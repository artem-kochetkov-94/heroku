export const vaults = {
  tetuBal: '0xFE700D523094Cc6C673d78F1446AE0743C89586E',
}

export const core = {
  fundkeeper: '0xeFBc16b8c973DecA383aAAbAB07153D2EB676556', // for stats
  controller: '0x6B2e0fACD2F2A8f407aC591067Ac06b5d29247E4', // for stats
  // liquidityBalancer: '',
  // notifyHelper: '',
  governance: '0x4bE13bf2B983C31414b358C634bbb61230c332A7',
  utils: '0xa281C7B40A9634BCD16B4aAbFcCE84c8F63Aedd0', // helper
  contractReader: '0x6E4D8CAc827B52E7E67Ae8f68531fafa36eaEf0B', // helper
  TetuToken: '0x1f681b1c4065057e07b95a1e5e504fb2c85f4625', // tetu reward token
  PS: '0x0000000000000000000000000000000000000000', // profit share pool
  zap: '0x0000000000000000000000000000000000000000', // swap router from USDT to assets
  multiSwap: '0x0000000000000000000000000000000000000000', // for swap
  pawnshop: '',
  vaultController: '0x2A3df2a428EB74B241Cf1d3374Fb07983c7059F3',
}

export const zapExcludeList = [
  '0xFE700D523094Cc6C673d78F1446AE0743C89586E', // tetuBAL
  '0x8A571137DA0d66c2528DA3A83F097fbA10D28540', // wstETH-bb-a-USD
  '0x7f52D49C8A9779E93613Fb14cF07be1500ab9C3A', // wstETH-eth
  '0x46e8E75484eE655C374B608842ACd41B2eC3f11C', // balancer_50BADGER-50rETH
  '0xC6f6e9772361A75988C6CC248a3945a870FB1272', // balancer_B-rETH-STABLE
  '0x5Dc1c173587aA562179b03dB9d643fF5fF2e4660', // balancer_bb-a-USD
  '0x65Be5bd1745A9871a5f042385dB869e78e9A1693', // balancer_usdc-wusdr
]

export const hardWorksExclude = []

export const tetuSwapVaults = []

export const excludeAutocompoundAprAddrs = []

export const vaultsWhiteList = {
  '0xFE700D523094Cc6C673d78F1446AE0743C89586E': 'tetuBAL',
  '0x8A571137DA0d66c2528DA3A83F097fbA10D28540': 'wstETH-bb-a-USD',
  '0x7f52D49C8A9779E93613Fb14cF07be1500ab9C3A': 'wstETH-WETH',
  '0x46e8E75484eE655C374B608842ACd41B2eC3f11C': '50BADGER-50rETH',
  '0xC6f6e9772361A75988C6CC248a3945a870FB1272': 'B-rETH-STABLE',
  '0x5Dc1c173587aA562179b03dB9d643fF5fF2e4660': 'bb-a-USD',
  '0x65Be5bd1745A9871a5f042385dB869e78e9A1693': 'bpt usdc-wusdr',
}

export const disabledWithdraw = [
  '0xFE700D523094Cc6C673d78F1446AE0743C89586E'.toLowerCase(), // tetuBAL
]

export const stableCoins = [
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC_TOKEN
  '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI_TOKEN
  '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT_TOKEN
]

export const blueChips = [
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH_TOKEN
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC_TOKEN
  '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI_TOKEN
  '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT_TOKEN
]

// this.networkManager.addresses.core

export const vaultSymbolName = {
  [vaults.tetuBal]: 'tetuBAL',
  [core.PS]: 'xTETU (PS)',
  ['0x7f52D49C8A9779E93613Fb14cF07be1500ab9C3A']: 'wstETH-WETH',
  ['0x8A571137DA0d66c2528DA3A83F097fbA10D28540']: 'wstETH-bbaUSD',
  ['0x46e8E75484eE655C374B608842ACd41B2eC3f11C']: 'BADGER-rETH',
  ['0xC6f6e9772361A75988C6CC248a3945a870FB1272']: 'rETH-WETH',
  ['0x5Dc1c173587aA562179b03dB9d643fF5fF2e4660']: 'bbaUSD',
  ['0x65Be5bd1745A9871a5f042385dB869e78e9A1693']: 'wUSDR-USDC',
}

export const vaultsWithLabel_new = []


export const bestVaults = [
  // '0x8A571137DA0d66c2528DA3A83F097fbA10D28540', // wstETH-bb-a-USD
  '0x7f52D49C8A9779E93613Fb14cF07be1500ab9C3A', // wstETH-eth
  // '0x46e8E75484eE655C374B608842ACd41B2eC3f11C', // balancer_50BADGER-50rETH
  // '0xC6f6e9772361A75988C6CC248a3945a870FB1272', // balancer_B-rETH-STABLE
  '0x5Dc1c173587aA562179b03dB9d643fF5fF2e4660', // balancer_bb-a-USD
]
