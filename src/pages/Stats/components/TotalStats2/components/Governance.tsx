import React from 'react'
import { Row, Col } from 'antd'
import { observer } from 'mobx-react'
import { AmountDaily } from '../../../../../components/AmountDaily'
import { useStores } from '../../../../../stores/hooks'

export const Governance = observer(() => {
  const { totalStats2Store, metaMaskStore } = useStores()
  const { data, data24Hour } = totalStats2Store

  if (data.Governance === undefined) {
    return null
  }

  return (
    <div className="app-paper app-paper-min">
      <div className="stats-item-title">Governance</div>
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            caption="Tetu Balance"
            currentValue={data.Governance.TetuBalance}
            valueOf24Hour={data24Hour.Governance.TetuBalance}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            formated
            caption="% of total supply"
            prefix="% "
            currentValue={parseFloat(data.Governance.PercentOfTetu).toFixed(2)}
            valueOf24Hour={parseFloat(data24Hour.Governance.PercentOfTetu).toFixed(2)}
          />
        </Col>
      </Row>
    </div>
  )
})
