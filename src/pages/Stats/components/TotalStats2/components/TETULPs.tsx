import React, { useEffect } from 'react'
import { Row, Col } from 'antd'
import { observer } from 'mobx-react'
import { AmountDaily } from '../../../../../components/AmountDaily'
import { useStores } from '../../../../../stores/hooks'

export const TETULPs = observer(() => {
  const { totalStats2Store, metaMaskStore } = useStores()

  const { data, data24Hour } = totalStats2Store

  if (data.TETUUSDCLP === undefined) {
    return null
  }

  return (
    <div className="app-paper app-paper-min">
      <div className="stats-item-title">TETU LPs</div>
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            caption="TETU Balance"
            currentValue={data.TETUUSDCLP.TETUBalance}
            valueOf24Hour={data24Hour.TETUUSDCLP.TETUBalance}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            caption="USDC Balance"
            prefix="$ "
            currentValue={data.TETUUSDCLP.USDCBalance}
            valueOf24Hour={data24Hour.TETUUSDCLP.USDCBalance}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            formated
            caption="% of total supply"
            prefix="% "
            currentValue={data.TETUUSDCLP.TETULOCKED}
            valueOf24Hour={data24Hour.TETUUSDCLP.TETULOCKED}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            formated
            caption="Users"
            currentValue={data.TETUUSDCLP.USERS}
            valueOf24Hour={data24Hour.TETUUSDCLP.USERS}
          />
        </Col>
      </Row>
    </div>
  )
})
