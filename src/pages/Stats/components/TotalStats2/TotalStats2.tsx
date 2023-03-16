import React, { useEffect } from 'react'
import { Row, Col } from 'antd'
import { observer } from 'mobx-react'
import { useStores } from '../../../../stores/hooks'
import { Loader } from '../../../../components/Loader'
import { TotalStatsTVLHistory, TetuLocked } from '../../../../components/Charts'

import * as Stats from './components'

import './styles.css'
import { networkManager } from '../../../../stores'

export const TotalStats2 = observer(() => {
  const { totalStats2Store, metaMaskStore, networkManager } = useStores()

  useEffect(() => {
    if (!metaMaskStore.inited || !networkManager.inited) {
      return
    }

    if (!totalStats2Store.isFetched && !totalStats2Store.isFetching) {
      totalStats2Store.fetch()
    }
  }, [metaMaskStore.inited, networkManager.inited])

  const isShowTetuLocked = true
  // const isShowTetuLocked = !networkManager.isFantomNetwork

  return (
    <div className="page stats container">
      <div className="title">Project Statistics</div>
      {!totalStats2Store.isFetched ? (
        <Loader />
      ) : (
        <Row gutter={[20, 20]}>
          {isShowTetuLocked && (
            <Col span={24} lg={12}>
              <div className="app-paper app-paper-min">
                <TetuLocked />
              </div>
            </Col>
          )}
          <Col span={24} lg={12}>
            <div className="app-paper app-paper-min">
              <TotalStatsTVLHistory />
            </div>
          </Col>

          <Col span={24}>
            <Stats.VaultsStats />
          </Col>

          <Col span={24}>
            <Stats.ProfitSharingPool />
          </Col>

          <Col span={24}>
            <Stats.TETULPs />
          </Col>

          <Col span={24}>
            <Stats.FundKeeper />
          </Col>

          <Col span={24}>
            <Stats.LiquidityBalancer />
          </Col>

          <Col span={24}>
            <Stats.Governance />
          </Col>
        </Row>
      )}
    </div>
  )
})
