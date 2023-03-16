import React, { useEffect } from 'react'
import { Row, Col } from 'antd'
import { observer } from 'mobx-react'
import { AmountDaily } from '../../../../../components/AmountDaily'
import { useStores } from '../../../../../stores/hooks'

export const VaultsStats = observer(() => {
  const { totalStats2Store, metaMaskStore } = useStores()
  const { data, data24Hour } = totalStats2Store

  if (data.VaultStats === undefined) {
    return null
  }

  return (
    <div className="app-paper app-paper-min">
      <div className="stats-item-title">Vaults Stats</div>

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            caption="TVL USDC"
            prefix="$ "
            currentValue={data.VaultStats.TVLUSDC}
            valueOf24Hour={data24Hour.VaultStats.TVLUSDC}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            caption="Strategies earned TETU"
            currentValue={data.VaultStats.TetuBoughtBack}
            valueOf24Hour={data24Hour.VaultStats.TetuBoughtBack}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            caption="TVL at work"
            prefix="$ "
            currentValue={data.VaultStats.TotalTvlAtWork}
            valueOf24Hour={data24Hour.VaultStats.TotalTvlAtWork}
          />
        </Col>
      </Row>
    </div>
  )
})
