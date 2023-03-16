import { useState, useEffect } from 'react'
import { useStores } from '../../../../stores/hooks'
import { VaultAbi } from '../../../../abi/Vault'

export const useCheckProtectionMode = (vaultAddr: string) => {
  const [hasProtecktionMode, setHasProtecktionMode] = useState(false)
  const { web3Store } = useStores()

  useEffect(() => {
    if (typeof vaultAddr !== 'string') {
      return
    }

    const vaultContact = new web3Store.web3.eth.Contract(VaultAbi, vaultAddr)

    vaultContact.methods
      .protectionMode()
      .call()
      .then((response: boolean) => {
        setHasProtecktionMode(response)
      })

    return () => {
      setHasProtecktionMode(false)
    }
  }, [vaultAddr])

  return hasProtecktionMode
}
