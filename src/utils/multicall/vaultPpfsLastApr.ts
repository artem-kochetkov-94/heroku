import { multicall } from './multicallInstance'
import { ContractReaderAbi } from '../../abi/ContractReader'
import { networkManager } from '../../stores'

export const vaultPpfsLastAprMulticall = async (vaults: string[]) => {
  const abi = ContractReaderAbi.filter((el: any) => {
    return el.type === 'function' && el.name === 'vaultPpfsLastApr'
  })

  const context = vaults.map((vaultAddr: string) => {
    return {
      reference: vaultAddr,
      contractAddress: networkManager.contractReaderAddr,
      abi,
      calls: [
        {
          reference: 'vaultPpfsLastApr',
          methodName: 'vaultPpfsLastApr',
          methodParameters: [vaultAddr],
        },
      ],
    }
  })

  const response = await multicall.call(context)

  const result = Object.keys(response.results).reduce((acc: any, key) => {
    acc[key.toLowerCase()] = response.results[key].callsReturnContext[0].returnValues[0].hex
    return acc
  }, {})

  return result
}
