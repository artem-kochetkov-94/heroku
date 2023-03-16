export const core = {
  fundkeeper: '0x2e75658b77D61a399c7E990b4b43f7b7EE21D9C3', // for stats
  controller: '0xe926a29f531AC36A0D635a5494Fd8474b9a663aD', // for stats
  // liquidityBalancer: '',
  // notifyHelper: '',
  governance: '0xbbbbb8C4364eC2ce52c59D2Ed3E56F307E529a94',
  utils: '0xAe8F54cA54D43473cfaB2da7331067614558E3b6', // helper
  contractReader: '0xE8210A2d1a7B56115a47B8C06a72356773f6838E', // helper
  TetuToken: '0x1f681b1c4065057e07b95a1e5e504fb2c85f4625', // tetu reward token
  PS: '0x0000000000000000000000000000000000000000', // profit share pool
  zap: '0x0000000000000000000000000000000000000000', // swap router from USDT to assets
  multiSwap: '0x0000000000000000000000000000000000000000', // for swap
  pawnshop: '',
  vaultController: '0x873A168844524DBb078a6Be8e9b56e06630ce2de',
}

export const zapExcludeList = []

export const hardWorksExclude = ['0xf239f89992688ce2539cf637614cc3f8866ea433']

export const tetuSwapVaults = []

export const excludeAutocompoundAprAddrs = []

export const vaultsWhiteList = {
  '0x3Fd0A8a975eC101748aE931B2d13711E04231920': 'Tetu Vault Cone v-WBNB/CONE',
  '0xc58D1d090E996F3A907eBd73f25249b25f81d401': 'Tetu Vault Cone s-USD+/BUSD',
  '0x34AB461fE2B3E0fd8Ba6249b0611732b0F8BA447': 'Tetu Vault Cone v-ETH/USDC',
  '0x750bA01724f1D7b08D021bB05E7d543B2eC01d05': 'Tetu Vault Cone v-TETU/USD+',
  '0xb15BBa331F4deA01Aa8479fc55544Dc8f0Ff3f36': 'Tetu Vault Cone v-VALAS/WBNB',
  '0xfD5EB3a77B0263271713758AD88A43022E04afEA': 'Tetu Vault Cone v-WBNB/BIFI',
  '0x5E427A2BD4Da38234C6EBAD7A64d7d0007D02382': 'Tetu Vault Cone v-WBNB/BUSD',
  '0x6eaCC32119e988d0C1d16A1Dc493D01319998F94': 'Tetu Vault Cone v-WBNB/UNKWN',
  '0xCE0575DE6953A1a8C740B221d62086fB289236CC': 'Tetu Vault Cone v-WBNB/USD+',
  '0x9aD3Bd13A8919DE524Aae39362464aB6Ca421c0D': 'Tetu Vault Cone s-MAI/BUSD',
  '0x3651465aa43AfC9bd45613cF3cD8D4439E60123C': 'Tetu Vault Cone s-MDB+/USD+',
  '0x47011A7bdCbf5C82aC7F492DC3a07d0C53c8A471': 'Tetu Vault Cone s-TUSD/BUSD',
  '0x4C8a0Ba0cB03CedbcAA24A46C9a347FCbD97Af09': 'Tetu Vault Cone s-USDC/BUSD',
  '0x287f108BEea5b951dD8246Da2D366F91b67f2A01': 'Tetu Vault Cone s-USDT/USDC',
  '0x49ed924c67De54362bD7683D502eb4BC99ED8b2D': 'Tetu Vault Cone v-MAI/WBNB',
  '0x8A12335d417F5aa82D803769b34c5b9d990a623B': 'Tetu Vault Cone v-WBNB/QI',
}

export const stableCoins = [
  '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC_TOKEN
  '0x90c97f71e18723b0cf0dfa30ee176ab653e89f40', // FRAX_TOKEN
  '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', // DAI_TOKEN
  '0x55d398326f99059ff775485246999027b3197955', // USDT_TOKEN
  '0x3f56e0c36d275367b8c502090edf38289b3dea0d', // MAI_TOKEN
  '0xe9e7cea3dedca5984780bafc599bd69add087d56', // BUSD_TOKEN
  '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65', // USD+
]

export const blueChips = [
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB_TOKEN
  '0x2170ed0880ac9a755fd29b2688956bd959f933f8', // WETH_TOKEN
  '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC_TOKEN
  '0x90c97f71e18723b0cf0dfa30ee176ab653e89f40', // FRAX_TOKEN
  '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', // DAI_TOKEN
  '0x55d398326f99059ff775485246999027b3197955', // USDT_TOKEN
  '0x3f56e0c36d275367b8c502090edf38289b3dea0d', // MAI_TOKEN
  '0xe9e7cea3dedca5984780bafc599bd69add087d56', // BUSD_TOKEN
]

// this.networkManager.addresses.core

export const vaultSymbolName = {
  [core.PS]: 'xTETU (PS)',
}

export const vaultsWithLabel_new = []
