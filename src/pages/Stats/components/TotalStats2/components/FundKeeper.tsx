import React, { useEffect } from 'react'
import { Row, Col } from 'antd'
import { observer } from 'mobx-react'
import { AmountDaily } from '../../../../../components/AmountDaily'
import { useStores } from '../../../../../stores/hooks'

export const FundKeeper = observer(() => {
  const { totalStats2Store, metaMaskStore } = useStores()
  const { data, data24Hour } = totalStats2Store

  if (data.FundKeeper === undefined) {
    return null
  }

  return (
    <div className="app-paper app-paper-min">
      <div className="stats-item-title">Fund Keeper</div>
      <Row gutter={[20, 20]} style={{ marginBottom: 30 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            caption="Tetu Balance"
            currentValue={data.FundKeeper.fundkeeper.tetu}
            valueOf24Hour={data24Hour.FundKeeper.fundkeeper.tetu}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            caption="USDC Balance"
            prefix="$ "
            currentValue={data.FundKeeper.fundkeeper.usdc}
            valueOf24Hour={data24Hour.FundKeeper.fundkeeper.usdc}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            formated
            caption="% of total supply"
            prefix="% "
            currentValue={data.FundKeeper.fundkeeper.TETULocked}
            valueOf24Hour={data24Hour.FundKeeper.fundkeeper.TETULocked}
          />
        </Col>
      </Row>
      {/* new stats */}
      <div className="stats-item-title" style={{ paddingTop: 15 }}>
        Fund Keeper LP Balance
      </div>
      <Row gutter={[20, 20]}>
        {/*
                <Col xs={24} sm={12} md={8} lg={6}>
                  <AmountDaily
                    caption="LP Token Balance"
                    currentValue={data.FundKeeper.TETU}
                    valueOf24Hour={data24Hour.FundKeeper.TETU}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <AmountDaily
                    caption="LP Total Supply"
                    currentValue={data.FundKeeper.TETU}
                    valueOf24Hour={data24Hour.FundKeeper.TETU}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <AmountDaily
                    caption="Balance Ratio"
                    currentValue={data.FundKeeper.TETU}
                    valueOf24Hour={data24Hour.FundKeeper.TETU}
                  />
                </Col>
        */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            formated
            prefix={data.FundKeeper.lp.token0Symbol === 'USDC' ? '$' : ''}
            caption={'LP ' + data.FundKeeper.lp.token0Symbol + ' Balance'}
            currentValue={data.FundKeeper.lp.fundKeeperToken0Balance + ''}
            valueOf24Hour={data24Hour.FundKeeper.lp.fundKeeperToken0Balance + ''}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            formated
            prefix={data.FundKeeper.lp.token1Symbol === 'USDC' ? '$' : ''}
            caption={'LP ' + data.FundKeeper.lp.token1Symbol + ' Balance'}
            currentValue={data.FundKeeper.lp.fundKeeperToken1Balance + ''}
            valueOf24Hour={data24Hour.FundKeeper.lp.fundKeeperToken1Balance + ''}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <AmountDaily
            formated
            caption={'LP Balance %'}
            prefix="% "
            currentValue={data.FundKeeper.lp.balanceRatio * 100}
            valueOf24Hour={data24Hour.FundKeeper.lp.balanceRatio * 100}
          />
        </Col>
      </Row>
    </div>
  )
})
