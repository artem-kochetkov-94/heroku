import { Multicall } from 'ethereum-multicall'
import { web3Store } from '../../stores'

export const multicall = new Multicall({ web3Instance: web3Store.web3, tryAggregate: true })
