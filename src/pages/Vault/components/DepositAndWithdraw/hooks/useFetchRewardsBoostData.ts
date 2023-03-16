import { useState, useEffect } from 'react'
import { VaultControllerAbi } from '../../../../../abi/VaultContorllerAbi'

import { networkManager } from '../../../../../stores/chain-stores/network-manager'
import { web3Store } from '../../../../../stores/web3-store'

export const useFetchRewardsBoostData = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [isFetched, setIsFetched] = useState(false)
  const [data, setData] = useState<any>(null)

  const vaultControllerContract = new web3Store.web3.eth.Contract(
    // @ts-ignore
    VaultControllerAbi,
    networkManager.addresses.core.vaultController,
  )

  const fetch = async () => {
    const rewardRatioWithoutBoost = await vaultControllerContract.methods
      .rewardRatioWithoutBoost()
      .call()
    const rewardBoostDuration = await vaultControllerContract.methods.rewardBoostDuration().call()

    return {
      rewardRatioWithoutBoost: Number(rewardRatioWithoutBoost),
      rewardBoostDuration: Number(rewardBoostDuration),
    }
  }

  useEffect(() => {
    if (networkManager.inited) {
      setIsFetching(true)
      fetch().then(setData)
      setIsFetching(false)
      setIsFetched(true)
    }
  }, [networkManager.inited])

  return {
    isFetching,
    isFetched,
    data,
  }
}
