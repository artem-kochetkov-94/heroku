import { Row, Col, Typography } from 'antd'
import { Link } from 'react-router-dom'

import { getAssetsIconMap } from '../../../../static/tokens'
import { Ways } from '../../types'

import './styles-invest.css'

const { Title } = Typography

type InvestProps = {
  way: Ways
  vault: any
}

const FirstStep = () => {
  const assetsIconMap = getAssetsIconMap()

  return (
    <div className="tetuBal__invest-item">
      <div className="tetuBal__invest-item-header">
        <Row justify="space-between" align="middle">
          <Col>
            <div className="tetuBal__invest-item-step">1 step</div>
          </Col>
          <Col>
            <div className="tetuBal__invest-item-logo">
              <Row gutter={12} align="middle">
                <Col>
                  <img src={assetsIconMap.balWhite} alt="" width="24" />
                </Col>
                <Col>balancer.fi</Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
      <div className="tetuBal__invest-item-body">
        <Row gutter={[0, 8]}>
          <Col span={24}>
            <Row gutter={16} justify="center" align="middle">
              <Col>
                <img src={assetsIconMap.tetuBALBlack} alt="" width="44" />
              </Col>
              <Col>+</Col>
              <Col>
                <img src={assetsIconMap.wethBlack} alt="" width="44" />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify="center">
              <Col>
                <p>deposit your BAL and WETH</p>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify="center">
              <Col>
                <img src={assetsIconMap.arrowBottom} alt="" style={{ margin: '10px 0' }} />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify="center">
              <Col>
                <div className="tetuBal__invest-border-block">
                  <Row gutter={12} align="middle">
                    <Col>
                      <Row gutter={4} align="middle">
                        <Col>
                          <img src={assetsIconMap.tetuBALBlack} width="24" />
                        </Col>
                        <Col>
                          <img src={assetsIconMap.wethBlack} width="24" />
                        </Col>
                      </Row>
                    </Col>
                    <Col>80BAL - 20WETH</Col>
                    <Col>
                      <span className="tetuBal__invest-border-block-gray-text">pool</span>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify="center">
              <Col>
                <img src={assetsIconMap.arrowBottom} alt="" style={{ margin: '10px 0' }} />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row gutter={[0, 8]}>
              <Col span={24}>
                <img src={assetsIconMap.tetuBALSimple} alt="" width="44" />
              </Col>
              <Col span={24}>
                <p>get B-80BAL-20WETH</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}

const ThirdStep = () => {
  const assetsIconMap = getAssetsIconMap()

  return (
    <div className="tetuBal__invest-item">
      <div className="tetuBal__invest-item-header">
        <Row justify="space-between" align="middle">
          <Col>
            <div className="tetuBal__invest-item-step">3 step</div>
          </Col>
          <Col>
            <div className="tetuBal__invest-item-logo">
              <Row gutter={12} align="middle">
                <Col>
                  <img src={assetsIconMap.balWhite} alt="" width="24" />
                </Col>
                <Col>balancer.fi</Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
      <div className="tetuBal__invest-item-body">
        <Row gutter={[0, 8]}>
          <Col span={24}>
            <Row gutter={16} justify="center" align="middle">
              <Col>
                <img src={assetsIconMap.tetuBALSimple} alt="" width="44" />
              </Col>
              <Col>+</Col>
              <Col>
                <img src={assetsIconMap.tetuBAL} alt="" width="44" />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify="center">
              <Col>
                <p style={{ maxWidth: 251 }}>deposit your tokens</p>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify="center">
              <Col>
                <img src={assetsIconMap.arrowBottom} alt="" style={{ margin: '10px 0' }} />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify="center">
              <Col>
                <div className="tetuBal__invest-border-block">
                  <Row gutter={[0, 12]} justify="center">
                    <Col span={24}>
                      <Row gutter={4} justify="center">
                        <Col>
                          <img src={assetsIconMap.tetuBALSimple} width="24" />
                        </Col>
                        <Col>
                          <img src={assetsIconMap.tetuBAL} width="24" />
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row gutter={12} justify="center">
                        <Col>B-80BAL-20WETH – tetuBAL</Col>
                        <Col>
                          <span className="tetuBal__invest-border-block-gray-text">pool</span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify="center">
              <Col>
                <img src={assetsIconMap.arrowBottom} alt="" style={{ margin: '10px 0' }} />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row gutter={[0, 8]}>
              <Col span={24}>
                <Row gutter={16} justify="center" align="middle">
                  <Col>
                    <img src={assetsIconMap.percent} alt="" width="44" />
                  </Col>
                  <Col>+</Col>
                  <Col>
                    <img src={assetsIconMap.tetuBALBlack} alt="" width="44" />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <p>earn tranding fees and BAL rewards</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export const Invest: React.FC<InvestProps> = (props) => {
  const assetsIconMap = getAssetsIconMap()
  const { way, vault } = props

  return (
    <div className="tetuBal__invest">
      <div className="container">
        <div className="tetuBal__invest-title">
          <Title level={4}>How to invest</Title>
        </div>

        {way === Ways.First && (
          <div className="tetuBal__invest-inner">
            <Row gutter={[20, 20]} justify="center" align="stretch">
              <Col xs={24} sm={24} md={12} xl={8}>
                <FirstStep />
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <div className="tetuBal__invest-item">
                  <div className="tetuBal__invest-item-header">
                    <Row justify="space-between" align="middle">
                      <Col>
                        <div className="tetuBal__invest-item-step">2 step</div>
                      </Col>
                      <Col>
                        <div className="tetuBal__invest-item-logo">
                          <Row gutter={12} align="middle">
                            <Col>
                              <img src={assetsIconMap.balWhite} alt="" width="24" />
                            </Col>
                            <Col>tetu.io</Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="tetuBal__invest-item-body">
                    <Row gutter={[0, 8]}>
                      <Col span={24}>
                        <Row gutter={16} justify="center" align="middle">
                          <Col>
                            <img src={assetsIconMap.tetuBALSimple} alt="" width="44" />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="center">
                          <Col>
                            <p style={{ maxWidth: 251 }}>
                              permanently deposit 50% of your B-80BAL-20WETH in a 1:1 ratio
                            </p>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="center">
                          <Col>
                            <img
                              src={assetsIconMap.arrowBottom}
                              alt=""
                              style={{ margin: '10px 0' }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="center">
                          <Col>
                            <Link to={'vault/' + vault.vault.addr} className="link-wrapper">
                              <div className="tetuBal__invest-border-block">
                                <Row gutter={12} align="middle">
                                  <Col>
                                    <img src={assetsIconMap.tetuBAL} width="24" />
                                  </Col>
                                  <Col>tetuBAL</Col>
                                  <Col>
                                    <span className="tetuBal__invest-border-block-gray-text">
                                      vault
                                    </span>
                                  </Col>
                                </Row>
                              </div>
                            </Link>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="center">
                          <Col>
                            <img
                              src={assetsIconMap.arrowBottom}
                              alt=""
                              style={{ margin: '10px 0' }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row gutter={[0, 8]}>
                          <Col span={24}>
                            <img src={assetsIconMap.tetuBAL} alt="" width="44" />
                          </Col>
                          <Col span={24}>
                            <p>get tetuBAL</p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <ThirdStep />
              </Col>
            </Row>
          </div>
        )}

        {way === Ways.Second && (
          <div className="tetuBal__invest-inner">
            <Row gutter={[20, 20]} justify="center" align="stretch">
              <Col xs={24} sm={24} md={12} xl={8}>
                <FirstStep />
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <div className="tetuBal__invest-item">
                  <div className="tetuBal__invest-item-header">
                    <Row justify="space-between" align="middle">
                      <Col>
                        <div className="tetuBal__invest-item-step">2 step</div>
                      </Col>
                      <Col>
                        <div className="tetuBal__invest-item-logo">
                          <Row gutter={12} align="middle">
                            <Col>
                              <img src={assetsIconMap.balWhite} alt="" width="24" />
                            </Col>
                            <Col>balancer.fi</Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="tetuBal__invest-item-body">
                    <Row gutter={[0, 8]}>
                      <Col span={24}>
                        <Row gutter={16} justify="center" align="middle">
                          <Col>
                            <img src={assetsIconMap.tetuBALSimple} alt="" width="44" />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="center">
                          <Col>
                            <p style={{ maxWidth: 219 }}>
                              divide your B-80BAL-20WETH tokens in half
                            </p>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="center">
                          <Col>
                            <img
                              src={assetsIconMap.arrowBottom}
                              alt=""
                              style={{ margin: '10px 0' }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="center">
                          <Col>
                            <div className="tetuBal__invest-border-block">
                              <Row gutter={12} align="middle">
                                <Col>
                                  <span className="tetuBal__invest-border-block-gray-text">
                                    trade
                                  </span>
                                </Col>
                                <Col>
                                  <img src={assetsIconMap.tetuBALSimple} width="24" />
                                </Col>
                                <Col>
                                  <span className="tetuBal__invest-border-block-gray-text">
                                    for
                                  </span>
                                </Col>
                                <Col>
                                  <img src={assetsIconMap.tetuBAL} width="24" />
                                </Col>
                              </Row>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="center">
                          <Col>
                            <img
                              src={assetsIconMap.arrowBottom}
                              alt=""
                              style={{ margin: '10px 0' }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row gutter={[0, 8]} justify="center">
                          <Col span={24}>
                            <img src={assetsIconMap.tetuBAL} alt="" width="44" />
                          </Col>
                          <Col span={24}>
                            <p style={{ maxWidth: 300, margin: '0 auto' }}>get more tetuBAL</p>
                            <p style={{ maxWidth: 300, margin: '0 auto' }}>
                              when the exchange rate is less than 1:1
                            </p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <ThirdStep />
              </Col>
            </Row>
          </div>
        )}

        {way === Ways.Third && (
          <div className="tetuBal__invest-inner">
            <Row gutter={[20, 20]} align="stretch">
              <Col xs={24} sm={24} md={12}>
                <FirstStep />
              </Col>
              <Col xs={24} sm={24} md={12}>
                <div className="tetuBal__invest-item">
                  <div className="tetuBal__invest-item-header">
                    <Row justify="space-between" align="middle">
                      <Col>
                        <div className="tetuBal__invest-item-step">2 step</div>
                      </Col>
                      <Col>
                        <div className="tetuBal__invest-item-logo">
                          <Row gutter={12} align="middle">
                            <Col>
                              <img src={assetsIconMap.tetuWhite} alt="" width="24" />
                            </Col>
                            <Col>tetu.io</Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="tetuBal__invest-item-body">
                    <Row gutter={[0, 8]}>
                      <Col span={24}>
                        <Row gutter={16} justify="center" align="middle">
                          <Col>
                            <img src={assetsIconMap.tetuBALSimple} alt="" width="44" />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="center">
                          <Col>
                            <p style={{ maxWidth: 251 }}>
                              permanently deposit your B-80BAL-20WETH in a 1:1 ratio
                            </p>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="center">
                          <Col>
                            <img
                              src={assetsIconMap.arrowBottom}
                              alt=""
                              style={{ margin: '10px 0' }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="center">
                          <Col>
                            <Link to={'vault/' + vault.vault.addr} className="link-wrapper">
                              <div className="tetuBal__invest-border-block">
                                <Row gutter={12} align="middle">
                                  <Col>
                                    <img src={assetsIconMap.tetuBAL} width="24" />
                                  </Col>
                                  <Col>tetuBAL</Col>
                                  <Col>
                                    <span className="tetuBal__invest-border-block-gray-text">
                                      vault
                                    </span>
                                  </Col>
                                </Row>
                              </div>
                            </Link>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="center">
                          <Col>
                            <img
                              src={assetsIconMap.arrowBottom}
                              alt=""
                              style={{ margin: '10px 0' }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row gutter={[0, 8]}>
                          <Col span={24}>
                            <img src={assetsIconMap.tetuBAL} alt="" width="44" />
                          </Col>
                          <Col span={24}>
                            <p>hold your tetuBAL</p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {way === Ways.Fourth && (
          <div className="tetuBal__invest-inner">
            <Row gutter={[20, 20]} align="stretch">
              <Col xs={24} sm={24} md={12}>
                <FirstStep />
              </Col>
              <Col xs={24} sm={24} md={12}>
                <div className="tetuBal__invest-item">
                  <div className="tetuBal__invest-item-header">
                    <Row justify="space-between" align="middle">
                      <Col>
                        <div className="tetuBal__invest-item-step">2 step</div>
                      </Col>
                      <Col>
                        <div className="tetuBal__invest-item-logo">
                          <Row gutter={12} align="middle">
                            <Col>
                              <img src={assetsIconMap.balWhite} alt="" width="24" />
                            </Col>
                            <Col>balancer.fi</Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="tetuBal__invest-item-body">
                    <Row gutter={[0, 8]}>
                      <Col span={24}>
                        <Row justify="center">
                          <Col>
                            <div className="tetuBal__invest-border-block">
                              <Row gutter={12} align="middle">
                                <Col>
                                  <span className="tetuBal__invest-border-block-gray-text">
                                    trade
                                  </span>
                                </Col>
                                <Col>
                                  <img src={assetsIconMap.tetuBALSimple} width="24" />
                                </Col>
                                <Col>
                                  <span className="tetuBal__invest-border-block-gray-text">
                                    for
                                  </span>
                                </Col>
                                <Col>
                                  <img src={assetsIconMap.tetuBAL} width="24" />
                                </Col>
                              </Row>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="center">
                          <Col>
                            <img
                              src={assetsIconMap.arrowBottom}
                              alt=""
                              style={{ margin: '10px 0' }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row gutter={[0, 8]} justify="center">
                          <Col span={24}>
                            <img src={assetsIconMap.tetuBAL} alt="" width="44" />
                          </Col>
                          <Col span={24}>
                            <p style={{ maxWidth: 300, margin: '0 auto' }}>get more tetuBAL</p>
                            <p style={{ maxWidth: 300, margin: '0 auto' }}>
                              when the exchange rate is less than 1:1
                            </p>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="center">
                          <Col>
                            <img
                              src={assetsIconMap.arrowBottom}
                              alt=""
                              style={{ margin: '10px 0' }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row gutter={[0, 8]}>
                          <Col span={24}>
                            <img src={assetsIconMap.tetuBAL} alt="" width="44" />
                          </Col>
                          <Col span={24}>
                            <p>hold your tetuBAL</p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </div>
  )
}
