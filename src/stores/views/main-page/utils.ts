import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import {HIGHLIGHTED_VAULTS} from "../../../networks/Addresses/MaticAddresses/constants";

export const sortVaultsName = (array: Array<any>) => {
  return [...array].sort((a: any, b: any) => a.vault.name - b.vault.name)
}

export const sortVaultsTvl = (array: Array<any>) => {
  // @ts-ignore
  return [...array].sort((a: any, b: any) =>
    BigNumber.from(a.vault.tvlUsdc).sub(BigNumber.from(b.vault.tvlUsdc)),
  )
}

export const sortVaultApr = (array: Array<any>) => {
  // @ts-ignore
  return [...array].sort((a: any, b: any) => a.vault.totalApy - b.vault.totalApy)
}

export const sortVaultCreated = (array: Array<any>) => {
  return [...array].sort((a: any, b: any) => {
    return new Date(b.vault.created * 1000).getTime() - new Date(a.vault.created * 1000).getTime()
  })
}

export const sortTetuToken = (array: Array<any>) => {
  return [
    ...sortVaultsTvl(array.filter((el: any) =>HIGHLIGHTED_VAULTS.includes(el.vault?.addr))).reverse(),
    ...sortVaultsTvl(array.filter((el: any) => !HIGHLIGHTED_VAULTS.includes(el.vault?.addr))).reverse(),
  ]
}

export const sortUserBalance = (array: Array<any>, userInfos: any | null) => {
  if (userInfos === null) {
    return array
  }

  return [...array].sort((a: any, b: any) => {
    // @ts-ignore
    return (
      parseFloat(formatUnits(userInfos[a.vault.addr].value?.depositedUnderlyingUsdc ?? 0)) -
      parseFloat(formatUnits(userInfos[b.vault.addr].value?.depositedUnderlyingUsdc ?? 0))
    )
  })
}

export const sortUserRewards = (array: Array<any>, userInfos: any | null) => {
  if (userInfos === null) {
    return array
  }

  return [...array].sort((a: any, b: any) => {
    const aRewards = userInfos[a.vault.addr].value.rewardsUsdc.reduce(
      (acc: number, item: string) => {
        return acc + parseFloat(formatUnits(item))
      },
      0,
    )
    const bRewards = userInfos[b.vault.addr].value.rewardsUsdc.reduce(
      (acc: number, item: string) => {
        return acc + parseFloat(formatUnits(item))
      },
      0,
    )
    return aRewards - bRewards
  })
}
