import { contractReaderChainStore, networkManager, web3Store } from '../stores'
import { TetuSwapLPAbi } from '../abi/TetuSwapLP'
import { BigNumber } from 'ethers'
import { addressesMap } from '../networks/Addresses'

const format = (v: string) => {
  return BigNumber.from(v).div(2).toString()
}

export const getVaultUnderlingApr = async (vaultAddr: string) => {
  const underlying = await contractReaderChainStore.getUnderlying(vaultAddr)

  const contract = new web3Store.web3.eth.Contract(
    // @ts-ignore
    TetuSwapLPAbi,
    underlying,
  )

  if (
    vaultAddr.toLowerCase() ===
    addressesMap.aliases.matic.config.addresses.vaults.dxTETU.toLowerCase()
  ) {
    return []
  }

  // if (vaultAddr === dxTetuVaultAddr) {
  //   const vault0 = networkManager.addresses.PS!
  //   const response = await Promise.allSettled([
  //     contractReaderChainStore.getVaultPpfsApr(vault0),
  //     contractReaderChainStore.getVaultName(vault0),
  //   ])
  //   const values = response.map((el: any) => el.value)
  //   const [vault0PpfsApr, vault0name] = values
  //   return [
  //     {
  //       addr: vault0,
  //       name: vault0name,
  //       ppfsApr: format(vault0PpfsApr),
  //     },
  //   ]
  // }

  const underlineVaultsResponse = await Promise.allSettled([
    contract.methods.vault0().call(),
    contract.methods.vault1().call(),
  ])

  const underlineVaults = underlineVaultsResponse.map((el: any) => el.value)

  const [vault0, vault1] = underlineVaults

  const response = await Promise.allSettled([
    contractReaderChainStore.getVaultPpfsApr(vault0),
    contractReaderChainStore.getVaultPpfsApr(vault1),
    contractReaderChainStore.getVaultName(vault0),
    contractReaderChainStore.getVaultName(vault1),
  ])

  const values = response.map((el: any) => el.value)

  const [vault0PpfsApr, vault1PpfsApr, vault0name, vault1name] = values

  return [
    {
      addr: vault0,
      name: vault0name,
      ppfsApr: format(vault0PpfsApr),
    },
    {
      addr: vault1,
      name: vault1name,
      ppfsApr: format(vault1PpfsApr),
    },
  ]
}
