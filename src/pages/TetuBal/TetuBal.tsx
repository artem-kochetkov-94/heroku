import React, { useEffect, useState } from 'react'

import { observer } from 'mobx-react'
import { Row, Col, Typography, Button, Tabs } from 'antd'

import { Invest2, VaultItem, ZapTetuBal } from './components'

import { Loader } from '../../components/Loader'

import { useStores } from '../../stores/hooks/useStores'

import { getAssetsIconMap } from '../../static/tokens'

import './styles/styles.css'
import './styles/styles-titles.css'
import './styles/styles-rate.css'
import './styles/styles-vaults.css'
import './styles/styles-balance.css'
import './styles/styles-description.css'
import './styles/styles-how-it-works.css'
import './styles/styles-info.css'
import './styles/styles-tabs.css'

import howItWorks from './assets/how-it-works.png'
import { Link, useHistory } from 'react-router-dom'

import { useLoadData } from './hooks/useLoadData'
import { useGetMyBalance } from './hooks/useGetMyBalance'
import { DepositTetuBal } from './components/DepositTetuBal'

import LinkIcon from '../../static/arrow-link.svg'

const { Title } = Typography

const { TabPane } = Tabs

export const tetuBalVault = '0x7fc9e0aa043787bfad28e29632ada302c790ce33'.toLowerCase()
export const balTetuBalVault = '0xBD06685a0e7eBd7c92fc84274b297791F3997ed3'.toLowerCase()

export enum LiquidStakingPageTabs {
  Operations = 'Operations',
  Info = 'Info',
  HowtoInvest = 'How to Invest',
  Howitworks = 'How it works',
}

export const TetuBal = observer(() => {
  const { mainPageStore, metaMaskStore, networkManager, web3Store } = useStores()
  const assetsIconMap = getAssetsIconMap()
  const history = useHistory()

  const { way, balancerLpData, tetuBalLpData } = useLoadData()
  const { balance } = useGetMyBalance(balancerLpData)

  const vault = mainPageStore.getVaultByAddress(tetuBalVault)
  const balTetuBal = mainPageStore.getVaultByAddress(balTetuBalVault)

  const [activeTab, setActiveTab] = useState<LiquidStakingPageTabs>(
    LiquidStakingPageTabs.Operations,
  )

  const Spiner = (
    <div className="tetuBal__page">
      <div className="container">
        <Row justify="center">
          <Title className="tetuBal__title" level={2}>
            TetuBAL
          </Title>
        </Row>
        <Row justify="center">
          <Loader size={48} padding={0} />
        </Row>
      </div>
    </div>
  )

  useEffect(() => {
    if (metaMaskStore.inited && networkManager.inited) {
      mainPageStore.fetchData()
    }
    web3Store.getGasPrice()
  }, [metaMaskStore.inited, metaMaskStore.walletAddress, networkManager.inited])

  if (!networkManager.inited) {
    return Spiner
  }

  if (!networkManager.isMaticNetwork) {
    history.push('/')
    return null
  }

  if (vault == undefined || way === null) {
    return Spiner
  }

  // console.log('way', way)

  return (
    <div className="tetuBal__page">
      <div className="container">
        <Title className="tetuBal__title" level={2}>
          TetuBAL
        </Title>

        <Tabs
          activeKey={activeTab}
          onChange={(key: string) => setActiveTab(key as LiquidStakingPageTabs)}
        >
          <TabPane tab="Operations" key={LiquidStakingPageTabs.Operations} />
          <TabPane tab="Info" key={LiquidStakingPageTabs.Info} />
          <TabPane tab="How to Invest" key={LiquidStakingPageTabs.HowtoInvest} />
          <TabPane tab="How it works" key={LiquidStakingPageTabs.Howitworks} />
        </Tabs>

        <div className="tabs-wrapper">
          {activeTab === LiquidStakingPageTabs.Operations && (
            <div>
              <ZapTetuBal vault={balTetuBal.vault} />
            </div>
          )}
          {activeTab === LiquidStakingPageTabs.Info && (
            <div>
              <Row className="tetuBal__sub-title">
                <Col className="tetuBal__sub-title-item-wrapper">
                  <Row align="middle" justify="center">
                    <div className="tetuBal__sub-title-item">
                      <Row align="middle">
                        <Title level={4}>Deposit</Title>
                        <img src={assetsIconMap.BAL} alt="" />
                        <Title level={4}>and</Title>
                        <img
                          src={assetsIconMap.wethBlack}
                          style={{ marginRight: 0, marginLeft: 16 }}
                          alt=""
                        />
                      </Row>
                    </div>

                    <div className="tetuBal__sub-title-separator"></div>
                  </Row>
                </Col>

                <Col className="tetuBal__sub-title-item-wrapper">
                  <Row align="middle" justify="center">
                    <div className="tetuBal__sub-title-item">
                      <Row justify="center" align="middle">
                        <Title level={4}>Earn veBAL airdrop wrapped in to</Title>
                        <img src={assetsIconMap.tetuVeBAL} alt="" />
                        <Title level={4}>and</Title>
                        <img src={assetsIconMap.xTETU} alt="" />
                        <Title level={4}>rewards</Title>
                      </Row>
                    </div>
                  </Row>
                </Col>
              </Row>
              {/* <div className="container"> */}
              <div className="tetuBal__vaults-wrapper">
                <Row
                  justify="center"
                  gutter={[
                    { xs: 16, sm: 16, xl: 20 },
                    { xs: 16, sm: 16, xl: 0 },
                  ]}
                >
                  <Col xs={24} sm={12} md={12} xl={7} xxl={6} className="tetuBal__column">
                    <div className="tetuBal__vault-item">
                      <DepositTetuBal vault={vault} data={tetuBalLpData} />
                    </div>
                  </Col>

                  <Col xs={24} sm={12} md={12} xl={7} xxl={6} className="tetuBal__column">
                    <div className="tetuBal__vault-item">
                      <div className="tetuMesh__vault">
                        <div className="tetuMesh__vault-name">
                          <div className="vault-row-wrapper">
                            <div className="icon-group">
                              <img src={assetsIconMap.veBAL} className={`icon`} />
                              <img src={assetsIconMap.tetuVeBAL} className={`icon`} />
                            </div>

                            <div className="vault-row-title">
                              <div className="vault-row-title-name">B-80BAL-20WETH - tetuBAL</div>
                              <div className="vault-row-title-platform">Balancer.fi</div>
                            </div>
                          </div>
                        </div>
                        <VaultItem
                          vault={balTetuBal.vault}
                          hideButton={true}
                          buttonContent={
                            <Link
                              to={'vault/' + balTetuBal.vault.addr}
                              className="link-wrapper"
                              style={{ marginTop: 'auto' }}
                            >
                              <Button type="primary" block size="small">
                                Deposit
                              </Button>
                            </Link>
                          }
                        />
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} sm={24} xl={10} xxl={12} className="tetuBal__column">
                    <div className="tetuBal__info-wrapper">
                      <div className="tetuBal__info-inner">
                        <div className="tetuBal__info-header">
                          <div className="tetuBal__rate-wrapper">
                            <p className="tetuBal__rate-title">Current ratio</p>
                            <div className="tetuBal__rate-wrapper-content">
                              <div className="tetuBal__rate-token tetuBal__rate-token0">
                                <div className="tetuBal__rate-token-value">
                                  <Title level={4}>1</Title>
                                </div>
                                <div className="tetuBal__rate-token-img">
                                  <img src={assetsIconMap.veBAL} />
                                </div>
                                <Title level={4} className="tetuBal__rate-token-name">
                                  B-80BAL-20WETH
                                </Title>
                              </div>

                              <Title level={4} className="tetuBal__rate-middle">
                                =
                              </Title>

                              <div className="tetuBal__rate-token tetuBal__rate-token1">
                                <div className="tetuBal__rate-token-value">
                                  <Title level={4}>
                                    {/* @ts-ignore */}
                                    {tetuBalLpData ? `${tetuBalLpData.price}`.slice(0, 4) : '-'}
                                  </Title>
                                </div>
                                <div className="tetuBal__rate-token-img">
                                  <img src={assetsIconMap.tetuVeBAL} />
                                </div>
                                <Title level={4} className="tetuBal__rate-token-name">
                                  tetuBAL
                                </Title>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tetuBal__info-content">
                          <p className="tetuBal__info-content-title">Trade</p>
                          <a
                            href="https://polygon.balancer.fi/#/"
                            target="_blank"
                            className="tetuBal__content-item"
                            rel="noreferrer"
                          >
                            <Row justify="space-between" align="middle">
                              <Col>
                                <Row gutter={16}>
                                  <Col>
                                    <Row gutter={8}>
                                      <Col>
                                        <img src={assetsIconMap.veBAL} width="20" />
                                      </Col>
                                      <Col>B-80BAL-20WETH</Col>
                                    </Row>
                                  </Col>
                                  <Col>
                                    <span>to</span>
                                  </Col>
                                  <Col>
                                    <Row gutter={8}>
                                      <Col>
                                        <img src={assetsIconMap.tetuVeBAL} width="20" />
                                      </Col>
                                      <Col>tetuBAL</Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </Col>

                              <Col style={{ marginLeft: 'auto' }}>
                                <img src={LinkIcon} width="10px" className="imgLink" />
                              </Col>
                            </Row>
                          </a>

                          <p className="tetuBal__info-content-title">Manage on Balancer.fi</p>
                          <a
                            href="https://polygon.balancer.fi/#/pool/0x3d468ab2329f296e1b9d8476bb54dd77d8c2320f000200000000000000000426"
                            target="_blank"
                            className="tetuBal__content-item"
                            rel="noreferrer"
                          >
                            <Row justify="space-between" align="middle">
                              <Col>
                                <Row gutter={16}>
                                  <Col>
                                    <Row gutter={8} align="middle">
                                      <Col>
                                        <Row>
                                          <Col>
                                            <img src={assetsIconMap.BAL} alt="" width="20" />
                                          </Col>
                                          <Col style={{ marginLeft: -8 }}>
                                            <img src={assetsIconMap.wethBlack} alt="" width="20" />
                                          </Col>
                                        </Row>
                                      </Col>
                                      <Col>80BAL - 20WETH</Col>
                                    </Row>
                                  </Col>
                                  <Col>
                                    <span className="tetuBal__rate-block-gray-text">pool</span>
                                  </Col>
                                </Row>
                              </Col>

                              <Col style={{ marginLeft: 'auto' }}>
                                <img src={LinkIcon} width="10px" className="imgLink" />
                              </Col>
                            </Row>
                          </a>
                          <a
                            href="https://polygon.balancer.fi/#/pool/0xb797adfb7b268faeaa90cadbfed464c76ee599cd0002000000000000000005ba"
                            target="_blank"
                            className="tetuBal__content-item"
                            rel="noreferrer"
                          >
                            <Row justify="space-between" align="middle">
                              <Col>
                                <Row gutter={16}>
                                  <Col>
                                    <Row gutter={8} align="middle">
                                      <Col>
                                        <Row>
                                          <Col>
                                            <img src={assetsIconMap.veBAL} alt="" width="20" />
                                          </Col>
                                          <Col style={{ marginLeft: -8 }}>
                                            <img src={assetsIconMap.tetuVeBAL} alt="" width="20" />
                                          </Col>
                                        </Row>
                                      </Col>
                                      <Col>B-80BAL-20WETH - tetuBAL</Col>
                                    </Row>
                                  </Col>
                                  <Col>
                                    <span className="tetuBal__rate-block-gray-text">pool</span>
                                  </Col>
                                </Row>
                              </Col>

                              <Col style={{ marginLeft: 'auto' }}>
                                <img src={LinkIcon} width="10px" className="imgLink" />
                              </Col>
                            </Row>
                          </a>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              {/* </div> */}
            </div>
          )}
          {activeTab === LiquidStakingPageTabs.HowtoInvest && (
            <div>
              <Invest2 vault={vault} tetuBalPrice={tetuBalLpData?.price} />
            </div>
          )}
          {activeTab === LiquidStakingPageTabs.Howitworks && (
            <div className="tetuBal__how-it-works">
              {/* <div className="container"> */}
              {/* <div className="tetuBal__how-it-works-title">
                  <Title level={4}>How it works</Title>
                </div> */}
              <div className="tetuBal__how-it-works-inner">
                <img src={howItWorks} alt="" />
              </div>
              {/* </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
