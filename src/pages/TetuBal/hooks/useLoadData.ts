import { useEffect, useState } from 'react'
import { tetuBalVault } from '..'
import { useStores } from '../../../stores/hooks'
import { BalancerLpData, TetuBalLpData, Ways } from '../types'
import { useFetchTetuBalLpData } from './useFetchTetuBalLpData'
import { useGetWay } from './useGetWay'
import { TETU_SERVER_BASE_URL } from "../../../api/tetu-server";

type UseLoadData = () => {
  way: Ways | null
  balancerLpData: BalancerLpData | null
  tetuBalLpData: TetuBalLpData | null
  loaded: boolean;
  loading: boolean;
}

export const useLoadData: UseLoadData = () => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { mainPageStore } = useStores()
  const { getWay } = useGetWay()
  const { fetchTetuBalLpData } = useFetchTetuBalLpData()

  const vault = mainPageStore.getVaultByAddress(tetuBalVault)

  const [way, setWay] = useState<Ways | null>(null)
  const [balancerLpData, setBalancerLpData] = useState<BalancerLpData | null>(null)
  const [tetuBalLpData, setTetuBalLpData] = useState<TetuBalLpData | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch(TETU_SERVER_BASE_URL + '/pool/info',)
        const result = await response.json()
        setBalancerLpData(result)

        const tetuBalLpData = await fetchTetuBalLpData()
        console.log('tetuBalLpData:', tetuBalLpData)
        setTetuBalLpData(tetuBalLpData)

        setWay(getWay(result, vault?.vault, tetuBalLpData))

        setLoaded(true);
      } catch (e) {
        console.log('e', e)
        setLoaded(false);
      } finally {
        setLoading(false);
      }
    }

    if (!vault) {
      return
    }

    loadData()
  }, [vault])

  return {
    way,
    balancerLpData,
    tetuBalLpData,

    loading,
    loaded,
  }
}
