import { Col, Row, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { getAssetsIconMap } from '../../../static/tokens'
import { meshTetuMesh, tetuMeshVault } from '../TetuMesh'
import LinkIcon from '../../../static/arrow-link.svg'

const { Title } = Typography

const FirstStep: React.FC<InvestProps> = (props) => {
  const { data } = props
  const assetsIconMap = getAssetsIconMap()

  if (data?.price && parseFloat(data?.price) < 1) {
    return (
      <Col xs={24} sm={24} md={12} xl={8}>
        <div className="tetuMesh__invest-item">
          <div className="tetuMesh__invest-item-header">
            <Row justify="space-between" align="middle">
              <Col>
                <div className="tetuMesh__invest-item-step">1 step</div>
              </Col>
              <Col>
                <div className="tetuMesh__invest-item-logo">
                  <Row gutter={7} align="middle">
                    <Col>
                      <img src={assetsIconMap.tetuWhite} alt="" width="23" />
                    </Col>
                    <Col>tetu.io</Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
          <div className="tetuMesh__invest-item-body">
            <Row gutter={[0, 8]}>
              <Col span={24}>
                <Row gutter={12} justify="center" align="middle">
                  <Col>
                    <img src={assetsIconMap.MESH} alt="" width="44" />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row justify="center">
                  <Col>
                    <p>
                      permanently deposit <span>50%</span> of your <span>MESH</span> in a 1:1 ratio
                    </p>
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
                    <Link
                      to={'vault/' + tetuMeshVault}
                      className="tetuMesh__invest-border-block"
                      style={{ display: 'inline-block' }}
                    >
                      <Row gutter={[0, 10]} style={{ flexDirection: 'column' }}>
                        <Col>
                          <Row justify="space-between">
                            <Col>
                              <p>vault</p>
                            </Col>
                            <Col>
                              <img src={LinkIcon} width="11px" />
                            </Col>
                          </Row>
                        </Col>

                        <Col>
                          <Row gutter={12} align="middle">
                            <Col>
                              <img src={assetsIconMap.tetuMESH} width="25" />
                            </Col>
                            <Col>tetuMESH</Col>
                          </Row>
                        </Col>
                      </Row>
                    </Link>
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
                    <img src={assetsIconMap.tetuMESH} alt="" width="44" />
                  </Col>
                  <Col span={24}>
                    <p>
                      get <span>tetuMESH</span>
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    )
  }

  return (
    <Col xs={24} sm={24} md={12} xl={8}>
      <div className="tetuMesh__invest-item">
        <div className="tetuMesh__invest-item-header">
          <Row justify="space-between" align="middle">
            <Col>
              <div className="tetuMesh__invest-item-step">1 step</div>
            </Col>
            <Col>
              <div className="tetuMesh__invest-item-logo">
                <Row gutter={7} align="middle">
                  <Col>
                    <img src={assetsIconMap.meshWhite} alt="" width="16" />
                  </Col>
                  <Col style={{ paddingTop: 1 }}>meshswap.fi</Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
        <div className="tetuMesh__invest-item-body">
          <Row gutter={[0, 8]}>
            <Col span={24}>
              <Row gutter={16} justify="center" align="middle">
                <Col>
                  <img src={assetsIconMap.MESH} alt="" width="44" />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="center">
                <Col>
                  <p>
                    divide your <span>MESH</span> tokens in half
                  </p>
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
                  <a
                    className="tetuMesh__invest-border-block"
                    style={{ display: 'inline-block' }}
                    href="https://meshswap.fi/exchange/swap"
                    target="_blank"
                  >
                    <Row gutter={[0, 10]} style={{ flexDirection: 'column' }}>
                      <Col>
                        <Row justify="space-between">
                          <Col>
                            <p>trade</p>
                          </Col>
                          <Col>
                            <img src={LinkIcon} width="11px" />
                          </Col>
                        </Row>
                      </Col>

                      <Col>
                        <Row gutter={12} align="middle">
                          <Col>
                            <img src={assetsIconMap.MESH} width="24" />
                          </Col>
                          <Col>
                            <span className="tetuMesh__invest-border-block-gray-text">for</span>
                          </Col>
                          <Col>
                            <img src={assetsIconMap.tetuMESH} width="24" />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </a>
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
                  <img src={assetsIconMap.tetuMESH} alt="" width="44" />
                </Col>
                <Col span={24}>
                  <p>
                    get <span>tetuMESH</span>
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  )
}

const SecondStep = () => {
  const assetsIconMap = getAssetsIconMap()

  return (
    <Col xs={24} sm={24} md={12} xl={8}>
      <div className="tetuMesh__invest-item">
        <div className="tetuMesh__invest-item-header">
          <Row justify="space-between" align="middle">
            <Col>
              <div className="tetuMesh__invest-item-step">2 step</div>
            </Col>
            <Col>
              <div className="tetuMesh__invest-item-logo">
                <Row gutter={12} align="middle">
                  <Col>
                    <img src={assetsIconMap.meshWhite} alt="" width="16" />
                  </Col>
                  <Col style={{ paddingTop: 1 }}>meshswap.fi</Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
        <div className="tetuMesh__invest-item-body">
          <Row gutter={[0, 8]}>
            <Col span={24}>
              <Row gutter={12} justify="center" align="middle">
                <Col>
                  <img src={assetsIconMap.MESH} alt="" width="44" />
                </Col>
                <Col>
                  <span style={{ color: '#7F8FA4', fontSize: 24 }}>+</span>
                </Col>
                <Col>
                  <img src={assetsIconMap.tetuMESH} alt="" width="44" />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="center">
                <Col>
                  <p>deposit your tokens</p>
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
                  <a
                    className="tetuMesh__invest-border-block"
                    style={{ display: 'inline-block' }}
                    href="https://meshswap.fi/exchange/pool/detail/0xcf40352253de7a0155d700a937dc797d681c9867"
                    target="_blank"
                  >
                    <Row gutter={[0, 10]} style={{ flexDirection: 'column' }}>
                      <Col>
                        <Row justify="space-between">
                          <Col>
                            <p>pool</p>
                          </Col>
                          <Col>
                            <img src={LinkIcon} width="11px" />
                          </Col>
                        </Row>
                      </Col>

                      <Col>
                        <Row gutter={12} align="middle">
                          <Col>
                            <Row wrap={false}>
                              <Col>
                                <img
                                  src={assetsIconMap.MESH}
                                  width="24"
                                  style={{ marginRight: -2 }}
                                />
                              </Col>
                              <Col>
                                <img src={assetsIconMap.tetuMESH} width="24" />
                              </Col>
                            </Row>
                          </Col>
                          <Col>
                            <span>MESH - tetuMESH</span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </a>
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
                  <img src={assetsIconMap.MESH} alt="" width="44" style={{ marginRight: -3 }} />
                  <img src={assetsIconMap.tetuMESH} alt="" width="44" />
                </Col>
                <Col span={24}>
                  <p>
                    get liquidity tokens (<span>MSLP</span>) and earn trading fees
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  )
}

const ThirdStep = () => {
  const assetsIconMap = getAssetsIconMap()

  return (
    <Col xs={24} sm={24} md={12} xl={8}>
      <div className="tetuMesh__invest-item">
        <div className="tetuMesh__invest-item-header">
          <Row justify="space-between" align="middle">
            <Col>
              <div className="tetuMesh__invest-item-step">3 step</div>
            </Col>
            <Col>
              <div className="tetuMesh__invest-item-logo">
                <Row gutter={7} align="middle">
                  <Col>
                    <img src={assetsIconMap.tetuWhite} alt="" width="23" />
                  </Col>
                  <Col>tetu.io</Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
        <div className="tetuMesh__invest-item-body">
          <Row gutter={[0, 8]}>
            <Col span={24}>
              <Row gutter={16} justify="center" align="middle">
                <Col>
                  <img src={assetsIconMap.MESH} alt="" width="44" style={{ marginRight: -3 }} />
                  <img src={assetsIconMap.tetuMESH} alt="" width="44" />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="center">
                <Col>
                  <p>
                    deposit your <span>MSLP</span>
                  </p>
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
                  <Link
                    className="tetuMesh__invest-border-block"
                    to={'vault/' + meshTetuMesh}
                    style={{ display: 'inline-block' }}
                  >
                    <Row gutter={[0, 10]} style={{ flexDirection: 'column' }}>
                      <Col>
                        <Row justify="space-between">
                          <Col>
                            <p>vault</p>
                          </Col>
                          <Col>
                            <img src={LinkIcon} width="11px" />
                          </Col>
                        </Row>
                      </Col>

                      <Col>
                        <Row gutter={12} align="middle">
                          <Col>
                            <Row wrap={false}>
                              <Col>
                                <img
                                  src={assetsIconMap.MESH}
                                  width="24"
                                  style={{ marginRight: -2 }}
                                />
                              </Col>
                              <Col>
                                <img src={assetsIconMap.tetuMESH} width="24" />
                              </Col>
                            </Row>
                          </Col>
                          <Col>
                            <span>MESH - tetuMESH</span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Link>
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
                  <img src={assetsIconMap.tetuMESH} alt="" width="44" />
                </Col>
                <Col span={24}>
                  <p>
                    earn <span>tetuMESH</span> rewards
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  )
}

type InvestProps = {
  data: any
}

export const Invest: React.FC<InvestProps> = (props) => {
  const { data } = props
  const assetsIconMap = getAssetsIconMap()

  return (
    <Row gutter={[0, 0]}>
      <Col span={24}>
        <div className="tetuMesh__invest">
          <div className="tetuMesh__invest-title">
            <Title level={4}>How to invest</Title>
          </div>

          <div className="tetuMesh__invest-inner">
            <Row
              gutter={[
                { xs: 16, sm: 16, xl: 24 },
                { xs: 16, sm: 16, xl: 30 },
              ]}
              justify="center"
              align="stretch"
            >
              <FirstStep data={data} />
              <SecondStep />
              <ThirdStep />
            </Row>
          </div>
        </div>
      </Col>
      <Col span={24}>
        <div className="tetuMesh__invest-footer">
          <Row align="middle" gutter={{ lg: 60, xl: 85 }}>
            <Col style={{ marginRight: 'auto', color: '#fff', fontWeight: 700 }}>
              <span className="tetuMesh__invest-footer-exit">Exit</span>
            </Col>
            <Col>
              <Row gutter={7} align="middle">
                <Col>
                  <div className="tetuMesh__invest-footer-step">1</div>
                </Col>
                <Col>withdraw MSLP from tetu.io</Col>
              </Row>
            </Col>
            <Col>
              <Row gutter={7} align="middle">
                <Col>
                  <div className="tetuMesh__invest-footer-step">2</div>
                </Col>
                <Col>withdraw</Col>
                <Col>
                  <img src={assetsIconMap.MESH} width={24} />
                </Col>
                <Col>and</Col>
                <Col>
                  <img src={assetsIconMap.tetuMESH} width={24} />
                </Col>
                <Col>from meshswap.fi</Col>
              </Row>
            </Col>
            <Col>
              <Row gutter={7} align="middle">
                <Col>
                  <div className="tetuMesh__invest-footer-step">3</div>
                </Col>
                <Col>trade</Col>
                <Col>
                  <img src={assetsIconMap.tetuMESH} width={24} />
                </Col>
                <Col>for</Col>
                <Col>
                  <img src={assetsIconMap.MESH} width={24} />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )
}
