import axios from 'axios'

export const getContractInfo = async (platform: string, address: string) => {
  console.log('GET CG INFO! getContractInfo')
  const url = `https://api.coingecko.com/api/v3/coins/${platform}/contract/${address}`
  const response = await axios.get(url)

  if (response.status === 200) {
    return response.data
  }

  return response
}
