import { maticAddresses } from './MaticAddresses/MaticAddresses'
import { fantomAddresses } from './FantomAddresses/FantomAddresses'
import { bscAddresses } from './BscAddresses/BscAddresses'
import { ethereumAddresses } from './EthereumAddresses/EthereumAddresses'

export const addressesMap = {
  [maticAddresses.config.network.chainId]: maticAddresses,
  // [fantomAddresses.config.network.chainId]: fantomAddresses,
  [bscAddresses.config.network.chainId]: bscAddresses,
  [ethereumAddresses.config.network.chainId]: ethereumAddresses,
  aliases: {
    matic: maticAddresses,
    // fantom: fantomAddresses,
    bsc: bscAddresses,
    eth: ethereumAddresses,
  },
}
