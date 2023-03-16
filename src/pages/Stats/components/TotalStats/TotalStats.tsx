import React, { useEffect } from 'react'
import { Row, Col } from 'antd'
import { observer } from 'mobx-react'
import { useStores } from '../../../../stores/hooks'
import { Loader } from '../../../../components/Loader'
import { AmountDaily } from '../../../../components/AmountDaily'
import { TotalStatsTVLHistory, TetuLocked } from '../../../../components/Charts'

import './styles.css'

export const TotalStats = observer(() => {
  const { statsPageStore, metaMaskStore } = useStores()

  useEffect(() => {
    if (!statsPageStore.isFetched && !statsPageStore.isFetching) {
      statsPageStore.loadData()
    }
  }, [metaMaskStore.walletAddress])

  const { data, data24Hour } = statsPageStore

  return (
    <div className="page stats container">
      <div className="title">Project Statistics</div>
      {!statsPageStore.isFetched ? (
        <Loader />
      ) : (
        <Row gutter={[20, 20]}>
          <Col span={24} lg={12}>
            <div className="app-paper app-paper-min">
              <TetuLocked />
            </div>
          </Col>
          <Col span={24} lg={12}>
            <div className="app-paper app-paper-min">
              <TotalStatsTVLHistory />
            </div>
          </Col>

          <Col span={24}>
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
          </Col>

          <Col span={24}>
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
                    currentValue={data.PS.USERS - 131}
                    valueOf24Hour={data24Hour.PS.USERS - 131}
                  />
                </Col>
              </Row>
            </div>
          </Col>

          <Col span={24}>
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
          </Col>

          <Col span={24}>
            <div className="app-paper app-paper-min">
              <div className="stats-item-title">Fund Keeper</div>
              <Row gutter={[20, 20]} style={{ marginBottom: 30 }}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <AmountDaily
                    caption="Tetu Balance"
                    currentValue={data.FundKeeper.TETU}
                    valueOf24Hour={data24Hour.FundKeeper.TETU}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <AmountDaily
                    caption="USDC Balance"
                    prefix="$ "
                    currentValue={data.FundKeeper.USDC}
                    valueOf24Hour={data24Hour.FundKeeper.USDC}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <AmountDaily
                    formated
                    caption="% of total supply"
                    prefix="% "
                    currentValue={data.FundKeeper.TETULocked}
                    valueOf24Hour={data24Hour.FundKeeper.TETULocked}
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
                    caption={'LP ' + data.FundKeeper.token0Symbol + ' Balance'}
                    currentValue={data.FundKeeper.fundKeeperToken0Balance + ''}
                    valueOf24Hour={data24Hour.FundKeeper.fundKeeperToken0Balance + ''}
                  />
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                  <AmountDaily
                    formated
                    prefix="$ "
                    caption={'LP ' + data.FundKeeper.token1Symbol + ' Balance'}
                    currentValue={data.FundKeeper.fundKeeperToken1Balance + ''}
                    valueOf24Hour={data24Hour.FundKeeper.fundKeeperToken1Balance + ''}
                  />
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                  <AmountDaily
                    formated
                    caption={'LP Balance %'}
                    prefix="% "
                    currentValue={data.FundKeeper.balanceRatio * 100}
                    valueOf24Hour={data24Hour.FundKeeper.balanceRatio * 100}
                  />
                </Col>
              </Row>
            </div>
          </Col>

          <Col span={24}>
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
                    valueOf24Hour={parseFloat(data24Hour.LiquidityBalancer.PercentOfTetu).toFixed(
                      2,
                    )}
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
          </Col>

          <Col span={24}>
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
          </Col>
        </Row>
      )}
    </div>
  )
})
