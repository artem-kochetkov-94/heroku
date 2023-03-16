import { BigNumber } from 'ethers'

export const calcAmount = (amountList: string[]) => {
  const result = amountList
    .filter((el: any) => el !== undefined && el !== '0')
    .reduce((acc: BigNumber, item: string) => {
      return acc.add(BigNumber.from(item))
    }, BigNumber.from('0'))
  return result.toString()
}
