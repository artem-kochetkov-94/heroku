import React, { useEffect } from 'react'
import { Row, Col } from 'antd'
import { observer } from 'mobx-react'
import { AmountDaily } from '../../../../../components/AmountDaily'
import { useStores } from '../../../../../stores/hooks'

export const LiquidityBalancer = observer(() => {
  const { totalStats2Store, metaMaskStore } = useStores()
  const { data, data24Hour } = totalStats2Store

  if (data.LiquidityBalancer === undefined) {
    return null
  }

  return (
    <div className="app-paper app-paper-min">
      <div className="stats-item-title">Liquidity Balancer</div>
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            caption="Tetu Balance"
            currentValue={data.LiquidityBalancer.TetuBalance}
            valueOf24Hour={data24Hour.LiquidityBalancer.TetuBalance}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            caption="LP TETU-USDC Balance"
            prefix="$ "
            currentValue={data.LiquidityBalancer.LPTETUUSDCBALANCE}
            valueOf24Hour={data24Hour.LiquidityBalancer.LPTETUUSDCBALANCE}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            formated
            caption="% of total supply"
            prefix="% "
            currentValue={parseFloat(data.LiquidityBalancer.PercentOfTetu).toFixed(2)}
            valueOf24Hour={parseFloat(data24Hour.LiquidityBalancer.PercentOfTetu).toFixed(2)}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            caption="Target Price"
            prefix="$ "
            currentValue={data.LiquidityBalancer.TargetPrice}
            valueOf24Hour={data24Hour.LiquidityBalancer.TargetPrice}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            caption="Target TVL"
            prefix="$"
            currentValue={data.LiquidityBalancer.TargetTVL}
            valueOf24Hour={data24Hour.LiquidityBalancer.TargetTVL}
          />
        </Col>
      </Row>
    </div>
  )
})
