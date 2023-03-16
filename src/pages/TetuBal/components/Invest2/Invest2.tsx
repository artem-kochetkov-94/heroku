import { Col, Row } from 'antd'
import Title from 'antd/lib/typography/Title'
import { Link } from 'react-router-dom'
import { getAssetsIconMap } from '../../../../static/tokens'
import LinkIcon from '../../../../static/arrow-link.svg'

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
              <Row gutter={7} align="middle">
                <Col>
                  <img src={assetsIconMap.tetuBALBlack} alt="" width="20" />
                </Col>
                <Col style={{ paddingTop: 1 }}>balancer.fi</Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
      <div className="tetuBal__invest-item-body">
        <Row gutter={[0, 8]}>
          <Col span={24}>
            <Row gutter={12} justify="center" align="middle">
              <Col>
                <img src={assetsIconMap.tetuBALBlack} alt="" width="44" />
              </Col>
              <Col>
                <span style={{ color: '#7F8FA4', fontSize: 24 }}>+</span>
              </Col>
              <Col>
                <img src={assetsIconMap.wethBlack} alt="" width="44" />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify="center">
              <Col>
                <p>
                  deposit your <span>BAL</span> and <span>WETH</span>
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
                  href="https://polygon.balancer.fi/#/pool/0x3d468ab2329f296e1b9d8476bb54dd77d8c2320f000200000000000000000426"
                  target="_blank"
                  className="tetuBal__invest-border-block"
                  style={{ display: 'inline-block' }}
                  rel="noreferrer"
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
                          <img src={assetsIconMap.tetuBALBlack} width="25" />
                          <img
                            src={assetsIconMap.wethBlack}
                            width="25"
                            style={{ marginLeft: -5 }}
                          />
                        </Col>
                        <Col>80BAL - 20WETH</Col>
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
                <img src={assetsIconMap.tetuBALSimple} alt="" width="44" />
              </Col>
              <Col span={24}>
                <p>
                  get <span>B-80BAL-20WETH</span>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}

const SecondStep = (props: any) => {
  const { vault, tetuBalPrice } = props
  const assetsIconMap = getAssetsIconMap()

  if (tetuBalPrice < 1) {
    return (
      <div className="tetuBal__invest-item">
        <div className="tetuBal__invest-item-header">
          <Row justify="space-between" align="middle">
            <Col>
              <div className="tetuBal__invest-item-step">2 step</div>
            </Col>
            <Col>
              <div className="tetuBal__invest-item-logo">
                <Row gutter={6} align="middle">
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
              <Row gutter={12} justify="center" align="middle">
                <Col>
                  <img src={assetsIconMap.BAL} alt="" width="44" />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="center">
                <Col>
                  <p>
                    divide your <span>B-80BAL-20WETH</span> tokens in half
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
                    href="https://polygon.balancer.fi/#/"
                    target="_blank"
                    className="tetuBal__invest-border-block"
                    rel="noreferrer"
                    style={{ display: 'inline-block' }}
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
                            <img src={assetsIconMap.BAL} width="24" />
                          </Col>
                          <Col>
                            <p>for</p>
                          </Col>
                          <Col>
                            <img src={assetsIconMap.tetuVeBAL} width={24} />
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
                  <img src={assetsIconMap.tetuBAL} alt="" width="44" />
                </Col>
                <Col span={24}>
                  <p>
                    get <span>tetuBAL</span>
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  return (
    <div className="tetuBal__invest-item">
      <div className="tetuBal__invest-item-header">
        <Row justify="space-between" align="middle">
          <Col>
            <div className="tetuBal__invest-item-step">2 step</div>
          </Col>
          <Col>
            <div className="tetuBal__invest-item-logo">
              <Row gutter={6} align="middle">
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
            <Row gutter={12} justify="center" align="middle">
              <Col>
                <img src={assetsIconMap.tetuBALSimple} alt="" width="44" />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify="center">
              <Col>
                <p>
                  permanently deposit <span>50%</span> of your <span>B-80BAL-20WETH</span> in a 1:1
                  ratio
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
                  to={'vault/' + vault.vault.addr}
                  className="tetuBal__invest-border-block"
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
                          <img src={assetsIconMap.veBAL} width="24" />
                        </Col>
                        <Col>tetuBAL</Col>
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
                <img src={assetsIconMap.tetuVeBAL} alt="" width="44" />
              </Col>
              <Col span={24}>
                <p>
                  get <span>tetuBAL</span>
                </p>
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
              <Row gutter={7} align="middle">
                <Col>
                  <img src={assetsIconMap.tetuBALBlack} alt="" width="20" />
                </Col>
                <Col style={{ paddingTop: 1 }}>balancer.fi</Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
      <div className="tetuBal__invest-item-body">
        <Row gutter={[0, 8]}>
          <Col span={24}>
            <Row gutter={12} justify="center" align="middle">
              <Col>
                <img src={assetsIconMap.veBAL} alt="" width="44" />
              </Col>
              <Col>
                <span style={{ color: '#7F8FA4', fontSize: 24 }}>+</span>
              </Col>
              <Col>
                <img src={assetsIconMap.tetuVeBAL} alt="" width="44" />
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
                  href="https://polygon.balancer.fi/#/pool/0xb797adfb7b268faeaa90cadbfed464c76ee599cd0002000000000000000005ba"
                  target="_blank"
                  className="tetuBal__invest-border-block"
                  style={{ display: 'inline-block' }}
                  rel="noreferrer"
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
                          <img src={assetsIconMap.tetuVeBAL} width="25" />
                          <img src={assetsIconMap.tetuBAL} width="25" style={{ marginLeft: -4 }} />
                        </Col>
                        <Col>B-80BAL-20WETH – tetuBAL</Col>
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
                <Row gutter={12} justify="center" align="middle">
                  <img src={assetsIconMap.veBAL} alt="" width="44" />
                  <img
                    src={assetsIconMap.tetuVeBAL}
                    alt=""
                    width="44"
                    style={{ marginLeft: -10 }}
                  />
                </Row>
              </Col>
              <Col span={24}>
                <p>
                  get <span>LP</span> tokens
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}

const FourthStep = () => {
  const assetsIconMap = getAssetsIconMap()

  return (
    <div className="tetuBal__invest-item">
      <div className="tetuBal__invest-item-header">
        <Row justify="space-between" align="middle">
          <Col>
            <div className="tetuBal__invest-item-step">4 step</div>
          </Col>
          <Col>
            <div className="tetuBal__invest-item-logo">
              <Row gutter={6} align="middle">
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
            <Row gutter={12} justify="center" align="middle">
              <img src={assetsIconMap.veBAL} alt="" width="44" />
              <img src={assetsIconMap.tetuVeBAL} alt="" width="44" style={{ marginLeft: -10 }} />
            </Row>
          </Col>
          <Col span={24}>
            <Row justify="center">
              <p>
                deposit your <span>LP</span> tokens
              </p>
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
                  to={'vault/' + '0xBD06685a0e7eBd7c92fc84274b297791F3997ed3'}
                  className="tetuBal__invest-border-block"
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
                          <img src={assetsIconMap.veBAL} width="25" />
                          <img
                            src={assetsIconMap.tetuVeBAL}
                            width="25"
                            style={{ marginLeft: -4 }}
                          />
                        </Col>
                        <Col>B-80BAL-20WETH – tetuBAL</Col>
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
            <Row gutter={[12, 12]} justify="center" align="middle" style={{ marginBottom: 5 }}>
              <Col>
                <img src={assetsIconMap.tetuVeBAL} alt="" width="44" />
              </Col>
              <Col>
                <span style={{ color: '#7F8FA4', fontSize: 24 }}>+</span>
              </Col>
              <Col>
                <img src={assetsIconMap.xTETU} alt="" width="44" />
              </Col>
            </Row>
            <Row justify="center">
              <p>
                earn <span>tetuBAL</span> and <span>xTetu</span> rewards
              </p>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export const Invest2 = (props: any) => {
  const assetsIconMap = getAssetsIconMap()
  const { vault, tetuBalPrice } = props

  return (
    <div className="tetuBal__invest">
      {/* <div className="container"> */}
      {/* <div className="tetuBal__invest-title">
        <Title level={4}>How to invest</Title>
      </div> */}

      <div className="tetuBal__invest-inner">
        <Row
          gutter={[
            { xs: 16, sm: 16, xl: 24 },
            { xs: 16, sm: 16, xl: 30 },
          ]}
          justify="center"
          align="stretch"
        >
          <Col xs={24} sm={24} md={12} xl={12}>
            <FirstStep />
          </Col>
          <Col xs={24} sm={24} md={12} xl={12}>
            <SecondStep vault={vault} tetuBalPrice={tetuBalPrice} />
          </Col>
          <Col xs={24} sm={24} md={12} xl={12}>
            <ThirdStep />
          </Col>
          <Col xs={24} sm={24} md={12} xl={12}>
            <FourthStep />
          </Col>
        </Row>
      </div>

      <div className="" style={{ marginTop: 20 }}>
        <div className="tetuBal__invest-footer" style={{ height: 'auto' }}>
          <Row align="middle" gutter={{ lg: 25, xl: 49 }}>
            <Col style={{ marginRight: 'auto', color: '#fff', fontWeight: 700 }}>
              <span className="tetuMesh__invest-footer-exit">Exit</span>
            </Col>
            <Col>
              <Row gutter={7} align="middle">
                <Col>
                  <div className="tetuBal__invest-footer-step">1</div>
                </Col>
                <Col>withdraw LP from tetu.io </Col>
              </Row>
            </Col>
            <Col>
              <Row gutter={7} align="middle">
                <Col>
                  <div className="tetuBal__invest-footer-step">2</div>
                </Col>
                <Col>withdraw</Col>
                <Col>
                  <img src={assetsIconMap.veBAL} width={24} />
                </Col>
                <Col>and</Col>
                <Col>
                  <img src={assetsIconMap.tetuVeBAL} width={24} />
                </Col>
                <Col>from balancer.fi</Col>
              </Row>
            </Col>
            <Col>
              <Row gutter={7} align="middle">
                <Col>
                  <div className="tetuBal__invest-footer-step">3</div>
                </Col>
                <Col>trade</Col>
                <Col>
                  <img src={assetsIconMap.tetuVeBAL} width={24} />
                </Col>
                <Col>for</Col>
                <Col>
                  <img src={assetsIconMap.veBAL} width={24} />
                </Col>
              </Row>
            </Col>
            <Col>
              <Row gutter={7} align="middle">
                <Col>
                  <div className="tetuBal__invest-footer-step">4</div>
                </Col>
                <Col>withdraw</Col>
                <Col>
                  <img src={assetsIconMap.tetuBALBlack} width={24} />
                </Col>
                <Col>and</Col>
                <Col>
                  <img src={assetsIconMap.wethBlack} width={24} />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      {/* </div> */}
    </div>
  )
}
