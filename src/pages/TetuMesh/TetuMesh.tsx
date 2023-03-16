import React, { useEffect } from 'react'
import { Button, Col, Row } from 'antd'
import Title from 'antd/lib/typography/Title'
import { observer } from 'mobx-react'
import { Link, useHistory } from 'react-router-dom'
import { getAssetsIconMap } from '../../static/tokens'
import { useStores } from '../../stores/hooks'
import { VaultItem } from './VaultItem'
import { Loader } from '../../components/Loader'
import { Invest } from './Invest/Invest'
import { Icon } from '../../components/ui-kit'

import howItWorks2x from './assets/how-it-works-2x-min.png'

import './styles/styles.css'
import './styles/styles-titles.css'
import './styles/styles-vaults.css'
import './styles/styles-how-it-works.css'
import './styles/styles-invest.css'
import './styles/styles-info.css'
import { Amount } from '../../components/Amount'
import { useFetchData } from './ useFetchData'
import { DepositTetuMesh } from './DepositTetuMesh'

import LinkIcon from '../../static/arrow-link.svg'

export const tetuMeshVault = '0xDcB8F34a3ceb48782c9f3F98dF6C12119c8d168a'
export const meshTetuMesh = '0xADC56043BFf96e2F3394bFd5719cd6De0a734257'

export const TetuMesh = observer(() => {
  const { mainPageStore, metaMaskStore, networkManager, web3Store } = useStores()
  const assetsIconMap = getAssetsIconMap()
  const history = useHistory()
  const vault = mainPageStore.getVaultByAddress(tetuMeshVault)
  const vaultMeshTetuMesh = mainPageStore.getVaultByAddress(meshTetuMesh)

  const { data } = useFetchData()

  useEffect(() => {
    if (metaMaskStore.inited && networkManager.inited) {
      mainPageStore.fetchData()
    }
    web3Store.getGasPrice()
  }, [metaMaskStore.inited, metaMaskStore.walletAddress, networkManager.inited])

  const Spiner = (
    <div className="tetuMesh__page">
      <div className="container">
        <Title className="tetuMesh__title" level={2}>
          TetuMESH
        </Title>
        <Row justify="center">
          <Loader size={48} padding={0} />
        </Row>
      </div>
    </div>
  )

  if (!networkManager.inited || vault === null || vault === undefined) {
    return Spiner
  }

  if (!networkManager.isMaticNetwork) {
    history.push('/')
    return null
  }

  return (
    <div className="tetuMesh__page tetuMesh__page">
      <div className="container">
        <Title className="tetuMesh__title" level={2}>
          TetuMESH
        </Title>

        <Row className="tetuMesh__sub-title">
          <Col className="tetuMesh__sub-title-item-wrapper">
            <Row align="middle" justify="center">
              <div className="tetuMesh__sub-title-item">
                <Row align="middle">
                  <Col>
                    <Title level={4}>Invest your</Title>
                  </Col>
                  <Col>
                    <img src={assetsIconMap.MESH} style={{ marginRight: 0 }} alt="" />
                  </Col>
                </Row>
              </div>

              <div className="tetuMesh__sub-title-separator"></div>
            </Row>
          </Col>

          <Col className="tetuMesh__sub-title-item-wrapper">
            <Row align="middle" justify="center">
              <div className="tetuMesh__sub-title-item">
                <Row align="middle">
                  <Col>
                    <Title level={4}>Have all</Title>
                  </Col>
                  <Col>
                    <img src={assetsIconMap.MESH} alt="" />
                  </Col>
                  <Col>
                    <Title level={4}>benefits like a max lock</Title>
                  </Col>
                </Row>
              </div>

              <div className="tetuMesh__sub-title-separator"></div>
            </Row>
          </Col>

          <Col>
            <Row align="middle" justify="center">
              <div className="tetuMesh__sub-title-item">
                <Row align="middle">
                  <Col>
                    <Title level={4}>Earn</Title>
                  </Col>
                  <Col>
                    <img src={assetsIconMap.tetuMESH} alt="" />
                  </Col>
                  <Col>
                    <Title level={4}>rewards</Title>
                  </Col>
                </Row>
              </div>

              <div className="tetuMesh__sub-title-separator"></div>
            </Row>
          </Col>

          <Col>
            <Row align="middle" justify="center">
              <div className="tetuMesh__sub-title-item">
                <Row align="middle">
                  <Col>
                    <Icon
                      name="exit"
                      style={{ marginRight: 16, display: 'flex', alignItems: 'center' }}
                    />
                  </Col>
                  <Col>
                    <Title level={4}>at any time</Title>
                  </Col>
                </Row>
              </div>
            </Row>
          </Col>
        </Row>

        <div className="tetuMesh__vaults-wrapper">
          <Row
            justify="center"
            gutter={[
              { xs: 16, sm: 16, xl: 20 },
              { xs: 16, sm: 16, xl: 0 },
            ]}
          >
            <Col xs={24} sm={12} md={12} xl={7} xxl={6} className="tetuMesh__column">
              <div className="tetuMesh__vault-item">
                <div className="tetuMesh__vault">
                  <div className="tetuMesh__vault-name">
                    <div className="vault-row-wrapper">
                      <div className="icon-group">
                        <img src={assetsIconMap.MESH} className={`icon`} />
                      </div>

                      <div className="vault-row-title">
                        <div className="vault-row-title-name">tetuMesh</div>
                        <div className="vault-row-title-platform">MESH</div>
                      </div>
                    </div>
                  </div>
                  <div className="tetuMesh__vault-content">
                    <div className="tetuMesh__vault-content-table">
                      <Row justify="space-between" align="middle">
                        <Col span={12} className="tetuMesh__label">
                          <p style={{ marginBottom: 0 }}>Total locked</p>
                        </Col>
                        <Col span={12} className="tetuMesh__tar">
                          <Amount value={vault.vault.tvl} style={{ fontSize: 14, color: '#fff' }} />
                        </Col>
                      </Row>
                    </div>

                    <DepositTetuMesh data={data} />
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} xl={7} xxl={6} className="tetuMesh__column">
              <div className="tetuMesh__vault-item">
                <div className="tetuMesh__vault">
                  <div className="tetuMesh__vault-name">
                    <div className="vault-row-wrapper">
                      <div className="icon-group">
                        <img src={assetsIconMap.MESH} className="icon" />
                        <img src={assetsIconMap.tetuMESH} className="icon" />
                      </div>
                      <div className="vault-row-title-name">MESH - tetuMESH</div>
                      <div className="vault-row-title-platform">Meshswap</div>
                    </div>
                  </div>

                  <VaultItem
                    vault={vaultMeshTetuMesh.vault}
                    hideButton={true}
                    buttonContent={
                      <Link to={'vault/' + meshTetuMesh} className="link-wrapper">
                        <Button type="primary" block size="small">
                          Deposit
                        </Button>
                      </Link>
                    }
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} xl={10} xxl={12} className="tetuMesh__column">
              <div className="tetuMesh__info-wrapper">
                <div className="tetuMesh__info-inner">
                  <div className="tetuMesh__info-header">
                    <div className="tetuQi__rate-wrapper">
                      <p className="tetuQi__rate-title">Current ratio</p>
                      <div className="tetuQi__rate-wrapper-content">
                        <div className="tetuQi__rate-token tetuQi__rate-token0">
                          <div className="tetuQi__rate-token-value">
                            <Title level={4}>1</Title>
                          </div>
                          <div className="tetuQi__rate-token-img">
                            <img src={assetsIconMap.MESH} alt="" />
                          </div>
                          <Title level={4} className="tetuQi__rate-token-name">
                            MESH
                          </Title>
                        </div>

                        <Title level={4} className="tetuQi__rate-middle">
                          =
                        </Title>

                        <div className="tetuQi__rate-token tetuQi__rate-token1">
                          <div className="tetuQi__rate-token-value">
                            <Title level={4}>
                              {/* @ts-ignore */}
                              {data?.price ? parseFloat(data?.price).toFixed(2) : '-'}
                            </Title>
                          </div>
                          <div className="tetuQi__rate-token-img">
                            <img src={assetsIconMap.tetuMESH} />
                          </div>
                          <Title level={4} className="tetuQi__rate-token-name">
                            tetuMESH
                          </Title>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tetuMesh__info-content">
                    <p className="tetuMesh__info-content-title">Trade</p>
                    <a
                      href="https://meshswap.fi/exchange/swap"
                      target="_blank"
                      className="tetuMesh__content-item"
                    >
                      <Row justify="space-between" align="middle">
                        <Col>
                          <Row gutter={16}>
                            <Col>
                              <Row gutter={8}>
                                <Col>
                                  <img src={assetsIconMap.MESH} width="20" />
                                </Col>
                                <Col>MESH</Col>
                              </Row>
                            </Col>
                            <Col>
                              <span>to</span>
                            </Col>
                            <Col>
                              <Row gutter={8}>
                                <Col>
                                  <img src={assetsIconMap.tetuMESH} width="20" />
                                </Col>
                                <Col>tetuMESH</Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>

                        <Col style={{ marginLeft: 'auto' }}>
                          <img src={LinkIcon} width="10px" />
                        </Col>
                      </Row>
                    </a>
                  </div>
                </div>
              </div>

              {/* <div className="tetuMesh__info-inner">
                  <div className="tetuMesh__info-column">
                    <Row gutter={[20, 20]} justify="center">
                      <Col>
                        <a
                          href="https://meshswap.fi/exchange/pool/detail/0xcf40352253de7a0155d700a937dc797d681c9867"
                          target="_blank"
                        >
                          <div className="tetuMesh__rate-block tetuMesh__rate-block--border tetuMesh__rate-block--button">
                            manage MESH - tetuMESH
                          </div>
                        </a>
                      </Col>
                      <Col>
                        <a href="https://meshswap.fi/exchange/swap" target="_blank">
                          <div className="tetuMesh__rate-block tetuMesh__rate-block--border tetuMesh__rate-block--button">
                            swap MESH to tetuMESH
                          </div>
                        </a>
                      </Col>
                    </Row>
                  </div>
                </div> */}
            </Col>
          </Row>
        </div>

        <Invest data={data} />

        <div className="tetuMesh__how-it-works">
          <div className="tetuMesh__how-it-works-title">
            <Title level={4}>How it works</Title>
          </div>
          <div className="tetuMesh__how-it-works-inner">
            <img src={howItWorks2x} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
})
