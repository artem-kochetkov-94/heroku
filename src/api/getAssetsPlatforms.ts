import axios from 'axios'

export const getPlatformAssets = async () => {
  console.log('GET CG INFO! getPlatformAssets')
  const url = 'https://api.coingecko.com/api/v3/asset_platforms'
  const response = await axios.get(url)

  if (response.status === 200) {
    return response.data
  }
  return []
}
