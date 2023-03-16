import { observer } from 'mobx-react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import { VaultPriceStore } from '../../../stores'
import { useStores } from '../../../stores/hooks'
import { millifyValue } from '../../../utils'
import styles from './TVL.module.scss'
const antIcon = <LoadingOutlined style={{ fontSize: 18, marginLeft: 15 }} spin />

const tetuPriceStore = new VaultPriceStore()

export const useResetLabels = () => {
  const {
    networkManager,
    tetuTokenValuesStore,
    totalTvlUsdcStore,
    totalTetuBoughBack,
    vaultsStore,
    tetuTotalSupplyStore,
    strategesStore,
    circulationSupplyStore,
  } = useStores()

  return () => {
    if (networkManager.inited) {
      tetuTokenValuesStore.reset()
      circulationSupplyStore.reset()
      totalTvlUsdcStore.reset()
      totalTetuBoughBack.reset()
      tetuTotalSupplyStore.reset()
      strategesStore.reset()
      vaultsStore.reset()
    }
  }
}

export const TVL: React.FC = observer(() => {
  const {
    networkManager,
    tetuTokenValuesStore,
    totalTvlUsdcStore,
    totalTetuBoughBack,
    vaultsStore,
    tetuTotalSupplyStore,
    tetuLockedChartStore,
    metaMaskStore,
    strategesStore,
    circulationSupplyStore,
    mainPageStore,
  } = useStores()

  const resetLabels = useResetLabels()

  useEffect(() => {
    // mainPageStore.fetchData()
    // metaMaskStore.on('chainChanged', () => {
    //   mainPageStore.fetchData()
    //   resetLabels()
    // })
  }, [])

  useEffect(() => {
    if (!metaMaskStore.inited || !networkManager.inited) {
      return
    }

    if (!circulationSupplyStore.isFetched && !circulationSupplyStore.isFetching) {
      circulationSupplyStore.fetch()
    }

    if (!tetuTokenValuesStore.isFetched && !tetuTokenValuesStore.isFetching) {
      tetuTokenValuesStore.fetch()
    }

    if (!strategesStore.isFetched && !strategesStore.isFetching) {
      strategesStore.fetch()
    }

    if (vaultsStore.isFetched && mainPageStore.isLoadedTableData) {
      if (!totalTvlUsdcStore.isFetched && !totalTvlUsdcStore.isFetching) {
        totalTvlUsdcStore.fetch(vaultsStore.value)
      }
    }

    if (strategesStore.isFetched) {
      if (!totalTetuBoughBack.isFetched && !totalTetuBoughBack.isFetching) {
        totalTetuBoughBack.fetch(strategesStore.value)
      }
    }
  }, [
    mainPageStore.isLoadedTableData,
    vaultsStore.isFetched,
    strategesStore.isFetched,
    vaultsStore.value,
    strategesStore.value,
    networkManager.networkId,
    metaMaskStore.networkName,
  ])

  useEffect(() => {
    if (totalTvlUsdcStore.value === '0' || totalTvlUsdcStore.value === null) {
      totalTvlUsdcStore.reset()
      vaultsStore.reset()
      vaultsStore.fetch()
    }
  }, [totalTvlUsdcStore.value])

  useEffect(() => {
    if (!metaMaskStore.inited || !networkManager.inited) {
      return
    }

    tetuPriceStore.fetch(networkManager.TetuTokenAddr)
    tetuTotalSupplyStore.fetch()
    tetuLockedChartStore.loadData()
  }, [
    metaMaskStore.inited,
    networkManager.inited,
    networkManager.networkId,
    tetuTotalSupplyStore.TetuTokenAddr,
    metaMaskStore.networkName,
  ])

  const isLoadnig =
    vaultsStore.isFetching || totalTvlUsdcStore.isFetching || !mainPageStore.isLoadedTableData

  if (isLoadnig) {
    return (
      <span>
        TVL: $ <Spin indicator={antIcon} />
      </span>
    )
  }

  return (
    <div className={styles.tvl}>
      TVL: ${mainPageStore.totalTvl && millifyValue(mainPageStore.totalTvl, false, 2)}
      {/* TVL: $ {totalTvlUsdcStore.value && millifyValue(totalTvlUsdcStore.value, false, 2)} */}
    </div>
  )
})
