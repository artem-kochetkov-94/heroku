import React, { useEffect } from 'react'
import { Col, Row } from 'antd'
import { Label } from './Label'
import { observer } from 'mobx-react'
import { useStores } from '../../../stores/hooks'
import { calcMarketCap } from '../utils'
import { circulationSupplyStore, VaultPriceStore } from '../../../stores'
import { useMediaQuery } from 'react-responsive'
import { TetuPrice } from '../../../components/Header/components'
import { formatUnits } from 'ethers/lib/utils'

const tetuPriceStore = new VaultPriceStore()

export const useResetLabels = () => {
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

export const LabelGroup: React.FC = observer(() => {
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

  const isMobile440 = useMediaQuery({ query: '(max-width: 440px)' })

  useEffect(() => {
    metaMaskStore.on('chainChanged', resetLabels)
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

  // useEffect(() => {
  //   if (totalTvlUsdcStore.value === '0' || totalTvlUsdcStore.value === null) {
  //     totalTvlUsdcStore.reset()
  //     vaultsStore.reset()
  //     vaultsStore.fetch()
  //   }
  // }, [totalTvlUsdcStore.value])

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

  const marketCap =
    tetuPriceStore.value !== null && circulationSupplyStore.value !== null
      ? calcMarketCap(tetuPriceStore.value, circulationSupplyStore.value + '')
      : null

  return (
    <div className="card-labels-wrapper">
      <div className="card-labels">
        {/* <Col xs={24} sm={8} lg={8}>
          <Label
            // @ts-ignore
            value={mainPageStore.totalTvl}
            title="TVL"
            amountProps={{ prefix: '$', toFixed: 2 }}
            isLoading={
              vaultsStore.isFetching ||
              totalTvlUsdcStore.isFetching ||
              !mainPageStore.isLoadedTableData
            }
          />
        </Col> */}
        <Label
          value={totalTetuBoughBack.value}
          // @ts-ignore
          title={<span style={{ lineHeight: '16px' }}>Strategies earned TETU</span>}
          isLoading={strategesStore.isFetching || totalTetuBoughBack.isFetching}
          amountProps={{
            address: networkManager.TetuTokenAddr,
            placement: 'topRight',
            toFixed: 2,
          }}
        />
        {/*
          <Col xs={24} sm={12} lg={8}>
            <Label
              // @ts-ignores
              value={tetuTokenValuesStore.value?.[0]}
              // @ts-ignore
              title={<span style={{ lineHeight: '16px' }}>TETU price</span>}
              isLoading={tetuTokenValuesStore.isFetching}
              amountProps={{
                prefix: '$',
                address: networkManager.TetuTokenAddr,
                placement: 'topRight',
                toFixed: 3,
              }}
            />
          </Col>
          */}
        <Label
          // @ts-ignore
          value={marketCap}
          // @ts-ignore
          title={<span>Circulating market cap</span>}
          isLoading={circulationSupplyStore.isFetching}
          amountProps={{
            prefix: '$',
            formated: true,
            address: networkManager.TetuTokenAddr,
            placement: 'topRight',
            toFixed: 2,
          }}
        />
      </div>
    </div>
  )
})
