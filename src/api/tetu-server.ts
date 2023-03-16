// export const TETU_SERVER_BASE_URL = process.env.REACT_APP_TETU_SERVER_BASE_URL_PROD
export const TETU_SERVER_BASE_URL = process.env.REACT_APP_TETU_SERVER_BASE_URL
export const TETU_STAG_SERVER_BASE_URL = process.env.REACT_APP_TETU_SERVER_BASE_URL_STAG

export const TETU_SERVER_READER = TETU_SERVER_BASE_URL + '/reader'
export const TETU_SERVER_INFO = TETU_SERVER_BASE_URL + '/info'

export const tetuServerResources = {
  reader: {
    vaultInfos: TETU_SERVER_READER + '/vaultInfos', // ?network=MATIC
  },

  info: {
    tvlAtWorkHistory: TETU_SERVER_INFO + '/tvlAtWorkHistory',
  },

  earned: TETU_SERVER_BASE_URL + '/earned', // ?network=FANTOM & vault=0x13e87ac36981e417a6519f29d1bb7b925337b527
}

export const tetuStatsApi = 'https://stats.tetu.io/tvl'
export const tetuSharePriceApi = 'https://stats.tetu.io/share-price'
