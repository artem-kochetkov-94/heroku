import React, { useEffect } from 'react'
import { Row, Col } from 'antd'
import { observer } from 'mobx-react'
import { AmountDaily } from '../../../../../components/AmountDaily'
import { useStores } from '../../../../../stores/hooks'

export const ProfitSharingPool = observer(() => {
  const { totalStats2Store, metaMaskStore } = useStores()
  const { data, data24Hour } = totalStats2Store

  if (data.PS === undefined) {
    return null
  }

  return (
    <div className="app-paper app-paper-min">
      <div className="stats-item-title">Profit Sharing Pool</div>
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            caption="TVL Tetu"
            currentValue={data.PS.TETUTVL}
            valueOf24Hour={data24Hour.PS.TETUTVL}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            caption="TVL USDC"
            prefix="$ "
            currentValue={data.PS.TVLUSDC}
            valueOf24Hour={data24Hour.PS.TVLUSDC}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            formated
            prefix="% "
            caption="% of total supply"
            currentValue={data.PS.TETULOCKED}
            valueOf24Hour={data24Hour.PS.TETULOCKED}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            formated
            caption="Users"
            currentValue={data.PS.USERS}
            valueOf24Hour={data24Hour.PS.USERS}
          />
        </Col>
      </Row>
    </div>
  )
})
