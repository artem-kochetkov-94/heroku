import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { useStores } from './../../../../../../stores/hooks'
import { Loader } from './../../../../../../components/Loader'
import { Col, Row } from 'antd'
import { getAssetsIconMap } from '../../../../../../static/tokens'
import unknownIcon from '../../../../../../static/UNKNOWN.png'

import './styles.css'
import { Icon } from '../../../../../../components/ui-kit'

type ZapRoutesProps = {
  operation: 'deposit' | 'withdraw'
}

export const ZapRoutes: React.FC<ZapRoutesProps> = observer((props) => {
  const { operation } = props
  const { zapChainStore, namesManagerStore } = useStores()

  useEffect(() => {
    if (!zapChainStore.isFetchedRoutes) {
      zapChainStore.fetchRoutes()
    }
  }, [zapChainStore.tokenOut.legth, zapChainStore.tokenIn])

  if (!zapChainStore.useZapContract) {
    return null
  }

  const routesMap = {
    deposit: zapChainStore.routesDeposit,
    withdraw: zapChainStore.routesWithdraw,
  }

  return (
    <div className="app-paper zap-routes">
      <div className="title">
        <Row gutter={4}>
          <Col>Routes</Col>
          <Col>
            <Icon name="info" width={12} height={12} />
          </Col>
        </Row>
      </div>
      {zapChainStore.isFetchingRoutes ? (
        <Row justify="center">
          <Loader size={40} />
        </Row>
      ) : (
        routesMap[operation].map((routes: string[]) => (
          <div className="zap-route-items">
            {routes.map((asset: string, index) => {
              return (
                <>
                  <span key={asset} className="zap-route-item">
                    <img
                      className="image"
                      // @ts-ignore
                      src={
                        getAssetsIconMap()?.[namesManagerStore.getAssetName(asset)] ?? unknownIcon
                      }
                      alt=""
                    />{' '}
                    {namesManagerStore.getAssetName(asset)}
                  </span>
                  {index + 1 === routes.length ? null : (
                    <span className="zap-route-item-separator">{'>'}</span>
                  )}
                </>
              )
            })}
          </div>
        ))
      )}
      <div>
        <p className="disclaimer" style={{ marginBottom: 15, marginTop: 25 }}>
          Be aware of slippage inside the route! <br />
          Each step increases slippage by at least 0.3%
        </p>
      </div>
    </div>
  )
})
