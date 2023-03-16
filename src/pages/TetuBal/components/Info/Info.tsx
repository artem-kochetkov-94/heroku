import { Row, Col } from 'antd'

import { VaultItem } from '../../components'

import { getAssetsIconMap } from '../../../../static/tokens'

import './styles-info.css'
import { millifyValue } from '../../../../utils'

type InfoProps = {
  vault: any
  balance: any
}

export const Info: React.FC<InfoProps> = ({ vault, balance }) => {
  const assetsIconMap = getAssetsIconMap()

  return (
    <div className="tetuBal__info">
      <div className="container">
        <Row
          gutter={[
            { xl: 8, sm: 0, xs: 0 },
            { xs: 20, sm: 20 },
          ]}
          align="stretch"
        >
          <Col xl={15} span={24}>
            <div className="tetuBal__info-inner">
              <Row align="middle">
                <Col xs={24} sm={24} md={12} className="tetuBal__info-col">
                  <div className="tetuBal__info-column">
                    <div className="tetuBal__info-token">
                      <div className="tetuBal__info-token-img">
                        <img src={assetsIconMap.tetuBALSimple} style={{ margin: 0 }} alt="" />
                      </div>
                      <div className="tetuBal__info-token-title">tetuBAL</div>
                      <div className="tetuBal__info-token-subtitle">B-80BAL-20WETH</div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} className="tetuBal__info-col tetuBal__vault-item">
                  <div className="tetuBal__info-column">
                    <VaultItem vault={vault.vault} />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xl={9} span={24}>
            <div className="tetuBal__info-inner tetuBal__info-col">
              <Row justify="center" align="stretch" style={{ height: '100%' }}>
                <Col style={{ maxWidth: 400 }}>
                  <div className="tetuBal__info-column">
                    <Row gutter={[0, 20]}>
                      <Col span={24}>
                        <div className="tetuBal__balance-item">
                          <span className="tetuBal__balance-text">My LP pool on Balancer:</span>
                          <span className="tetuBal__balance-value-1">
                            {balance && millifyValue(String(balance), true)}
                          </span>
                        </div>
                      </Col>
                      <Col span={24}>
                        <div className="tetuBal__balance-item">
                          <span className="tetuBal__balance-text">My BAL rewards on Balancer:</span>
                          <span className="tetuBal__balance-value-1">-</span>
                          {/* <span className="tetuBal__balance-value-2">$99</span> */}
                        </div>
                      </Col>
                      <Col span={24}>
                        <div className="tetuBal__balance-item tetuBal__balance-item--mobile-center">
                          <img src={assetsIconMap.xTETU} width="24" alt="" />
                          <span className="tetuBal__balance-text">xTETU:</span>
                          <span className="tetuBal__balance-value-1">-</span>
                          {/* <span className="tetuBal__balance-value-2">$33</span> */}
                        </div>
                      </Col>
                      <Col span={24}>
                        <div className="tetuBal__balance-item tetuBal__balance-item--mobile-center">
                          <img src={assetsIconMap.tetuBAL} width="24" alt="" />
                          <span className="tetuBal__balance-text">tetuBAL:</span>
                          <span className="tetuBal__balance-value-1">-</span>
                          {/* <span className="tetuBal__balance-value-2">$77</span> */}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}
