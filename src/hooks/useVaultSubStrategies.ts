import { useStores } from '../stores/hooks'

export const useVaultSubStrategies = (vault: any) => {
  const { vaultInfosFromTetuReaderServer } = useStores()

  if (!vault) {
    return null
  }

  const { addr } = vault

  const item = vaultInfosFromTetuReaderServer.value.find((el: any) => {
    return el.vault.addr.toLowerCase() === addr.toLowerCase()
  })

  if (item?.vault?.subStrategies) {
    const result = item.vault.subStrategies.reduce((acc: any, item: any) => {
      const index = acc.findIndex((el: any) => el.platform === item.platform)
      if (index === -1) {
        acc.push(item)
      } else {
        acc[index] = {
          ...acc[index],
          ratio: String(Number(acc[index].ratio) + Number(item.ratio)),
        }
      }
      return acc
    }, [])
    return result
  }

  return null
}
