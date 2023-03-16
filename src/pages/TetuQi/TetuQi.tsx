/* eslint-disable import/first */
import React, { useEffect, useState } from 'react'
import { Col, Row, Typography } from 'antd'
import { RecomendedWay, VaultItem } from './components'
import { observer } from 'mobx-react'
import { useStores } from '../../stores/hooks/useStores'
import { getAssetsIconMap } from '../../static/tokens'
import { Icon } from '../../components/ui-kit'
import { fetchTetuQiPrice as fetchDataTetuQi } from '../Vault/components/LpInfo/LpInfo'
import { Loader } from '../../components/Loader'
import { formatUnits } from '@ethersproject/units'
import { Amount } from '../../components/Amount/Amount'
import { useHistory } from 'react-router-dom'
import Article1img from '../../static/images/articles/image 3.jpg'
import Article2img from '../../static/images/articles/image 4.jpg'
import Article3img from '../../static/images/articles/image 5.jpg'
import './styles/styles.css'
import './styles/styles-titles.css'
import './styles/styles-vaults.css'
import './styles/styles-deposit.css'
import './styles/styles-rate.css'
import './styles/styles-articles.css'
import './styles/styles-ways.css'
import { DepositTetuQi } from './DepositTetuQi'
import LinkIcon from '../../static/arrow-link.svg'

const { Title } = Typography

export const tetuQi = '0x4cd44ced63d9a6fef595f6ad3f7ced13fceac768'
const tetuQiQI = '0x53d034c0d2680F39C61c9e7a03Fb707a2A1b6e9B'
const xtetuQi = '0x8f1505c8f3b45cb839d09c607939095a4195738e'
const tetuQiVaults = [
  tetuQi, // tetuQi
  tetuQiQI, // tetuQi QIDAO
  // xtetuQi, // xtetuQi Tetu
].map((el: string) => el.toLowerCase())

const arrowBottom = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.12438 7.93649C6.86712 7.68784 6.44903 7.68782 6.19186 7.93651C5.93608 8.18383 5.93603 8.58393 6.19182 8.83132L9.53379 12.0635C9.66194 12.1874 9.83081 12.25 9.99998 12.25C10.169 12.25 10.338 12.1875 10.4662 12.0636L13.808 8.83146C14.0639 8.5841 14.064 8.18404 13.8081 7.93669C13.551 7.68798 13.1328 7.68793 12.8755 7.93666L9.99998 10.7178L7.12438 7.93649Z"
        fill="#C4C4DF"
      />
    </g>
  </svg>
)

const textHint1 =
  "The recommendation is based on a comparison of the current APR and the ratio of the price of QI to tetuQi. Including a full 28 day Tetu's boost. Profitability can change over time in any direction. Therefore, the recommended way is only an indicator of the current state, not a prediction of the future"

const getWay = (vaults: any[], rate: number) => {
  const it1_tetuQiApy = Number(vaults.find((el) => el.vault.addr === tetuQi)?.vault?.totalApy)
  const it3_tetuQiQIApy = Number(vaults.find((el) => el.vault.addr === tetuQiQI)?.vault?.totalApy)
  const it2 = (it3_tetuQiQIApy * (rate + 1)) / 2
  const it4 = it1_tetuQiApy / rate
  const it5_xtetuQiApy = Number(vaults.find((el) => el.vault.addr === xtetuQi)?.vault?.totalApy)
  const it6 = it5_xtetuQiApy / rate

  const items = [it1_tetuQiApy, it2, it3_tetuQiQIApy, it4, it5_xtetuQiApy, it6].map((x) =>
    Number.isNaN(Number(x)) ? 0 : x,
  )
  const max = Math.max(...items)

  return items.findIndex((el) => el === max)
}

export const TetuQi = observer(() => {
  const { mainPageStore, metaMaskStore, networkManager, web3Store, userInfosStore } = useStores()

  const assetsIconMap = getAssetsIconMap()
  const [tetuQiPrice, setTetuQiPrice] = useState<any>(null)
  const history = useHistory()

  const Spiner = (
    <div className="tetuQi__page">
      <div className="container">
        <Row>
          <Title className="tetuQi__title" level={2}>
            tetuQi
          </Title>
        </Row>
        <Row justify="center">
          <Loader size={48} padding={0} />
        </Row>
      </div>
    </div>
  )

  const { QI, tetuqi } = networkManager.addresses.assets

  useEffect(() => {
    if (metaMaskStore.inited && networkManager.inited) {
      mainPageStore.fetchData()
    }
    web3Store.getGasPrice()
  }, [metaMaskStore.inited, metaMaskStore.walletAddress, networkManager.inited])

  useEffect(() => {
    fetchDataTetuQi().then(setTetuQiPrice)
  }, [])

  if (!networkManager.inited) {
    return Spiner
  }

  if (!networkManager.isMaticNetwork) {
    history.push('/')
    return null
  }

  const vaults = mainPageStore.currentNetworkData
    ?.filter((el: any) => {
      return tetuQiVaults.includes(el.vault.addr.toLowerCase())
    })
    .sort((a: any, b: any) => b.vault.totalApy - a.vault.totalApy)

  if (vaults === undefined) {
    return Spiner
  }

  const totalTvl = vaults.find((el: any) => el.vault.addr === tetuQi).vault.tvl
  const totalTvlUsdc = vaults.find((el: any) => el.vault.addr === tetuQi).vault.tvlUsdc

  const userInfoStores =
    vaults?.map((el: any) => {
      return userInfosStore.storeMap[el.vault.addr.toLowerCase()]
    }) ?? []

  const totalDepositUsdc = userInfoStores?.reduce((acc: number, item: any) => {
    const deposited = item?.value?.depositedUnderlyingUsdc
      ? formatUnits(item?.value?.depositedUnderlyingUsdc)
      : 0
    // @ts-ignore
    return acc + Number(deposited)
  }, 0)

  const totalDeposit = userInfoStores?.reduce((acc: number, item: any) => {
    const deposited = item?.value?.depositedUnderlying
      ? formatUnits(item?.value?.depositedUnderlying)
      : 0
    // @ts-ignore
    return acc + Number(deposited)
  }, 0)

  const rewardTokensUsdc = userInfoStores?.reduce((acc: any, item: any) => {
    item?.value?.rewardTokens?.forEach((token: any, index: number) => {
      const value = Number(formatUnits(item?.value?.rewardsUsdc[index]))
      if (token in acc) {
        acc[token] = acc[token] + value
      } else {
        acc[token] = value
      }
    })
    return acc
  }, {})

  const rewardTokens = userInfoStores?.reduce((acc: any, item: any) => {
    item?.value?.rewardTokens?.forEach((token: any, index: number) => {
      const value = Number(formatUnits(item?.value?.rewards[index]))
      if (token in acc) {
        acc[token] = acc[token] + value
      } else {
        acc[token] = value
      }
    })
    return acc
  }, {})

  const recomendedWayIndex = getWay(vaults, tetuQiPrice)
  const isLoading = mainPageStore.isLoadedTableData

  const format = (val: string) => {
    if (val === undefined) {
      return null
    }
    return parseFloat(parseFloat(val).toFixed(2))
  }

  return (
    <div className="tetuQi__page">
      <div className="container">
        <Title className="tetuQi__title" level={2}>
          TetuQi
        </Title>

        <Row className="tetuQi__sub-title">
          {/* @ts-ignore */}
          <Col className="tetuQi__sub-title-item-wrapper">
            {/* <Col xs={24} md={10} lg={5} xl={4} className="tetuQi__sub-title-item-wrapper"> */}
            <Row align="middle" justify="center">
              <div className="tetuQi__sub-title-item">
                <Row align="middle">
                  <Title level={4}>Invest your</Title>
                  <img src={assetsIconMap.QI} style={{ marginRight: 0 }} alt="" />
                </Row>
              </div>

              <div className="tetuQi__sub-title-separator"></div>
            </Row>
          </Col>

          <Col className="tetuQi__sub-title-item-wrapper">
            {/* <Col xs={24} md={14} lg={11} xl={9} className="tetuQi__sub-title-item-wrapper"> */}
            <Row align="middle" justify="center">
              <div className="tetuQi__sub-title-item">
                <Row justify="center" align="middle">
                  <Title level={4}>Have all</Title>
                  <img src={assetsIconMap.QI} alt="" />
                  <Title level={4}>benefits like a 4-year lock</Title>
                </Row>
              </div>
            </Row>
          </Col>

          <Col className="tetuQi__sub-title-item-wrapper">
            {/* <Col xs={24} md={14} lg={8} xl={7} className="tetuQi__sub-title-item-wrapper"> */}
            <Row align="middle" justify="center">
              <div className="tetuQi__sub-title-separator"></div>

              <div className="tetuQi__sub-title-item">
                <Row align="middle">
                  <Title level={4}>Earn</Title>
                  <img src={assetsIconMap.tetuQi} alt="" />
                  <Title level={4}>and</Title>
                  <img src={assetsIconMap.xTETU} alt="" />
                  <Title level={4}>rewards</Title>
                </Row>
              </div>

              <div className="tetuQi__sub-title-separator"></div>
            </Row>
          </Col>

          <Col className="tetuQi__sub-title-item-wrapper">
            {/* <Col xs={24} md={10} lg={10} xl={4} className="tetuQi__sub-title-item-wrapper"> */}
            <Row align="middle" justify="center">
              <div className="tetuQi__sub-title-item">
                <Row align="middle">
                  <Icon
                    name="exit"
                    style={{ marginRight: 16, display: 'flex', alignItems: 'center' }}
                  />
                  <Title level={4}>at any time</Title>
                </Row>
              </div>
            </Row>
          </Col>
        </Row>
      </div>

      {mainPageStore.isLoadedTableData ? (
        <div className="container">
          {/* vault list */}
          <div className="tetuQi__vaults-wrapper">
            <Row
              justify="center"
              gutter={[
                { xs: 16, sm: 16, xl: 20 },
                { xs: 16, sm: 16, xl: 0 },
              ]}
            >
              {vaults.map((el: any, index: number) => {
                return (
                  <Col className="tetuQi__column" xs={24} sm={12} xl={7} xxl={6}>
                    <div className="tetuQi__vault-item">
                      {el.vault.addr === tetuQi ? (
                        <VaultItem vault={el.vault} depositEl={<DepositTetuQi />} />
                      ) : (
                        <VaultItem vault={el.vault} />
                      )}
                    </div>
                  </Col>
                )
              })}

              {/*  total deposit */}
              {metaMaskStore.walletAddress && (
                <Col className="tetuQi__column" xs={24} sm={24} xl={10} xxl={12}>
                  <div className="tetuQi__total-deposit-wrapper">
                    <div className="tetuQi__total-deposit-inner">
                      <div className="tetuQi__total-deposit-header">
                        <div className="tetuQi__rate-wrapper">
                          <p className="tetuQi__rate-title">Current ratio</p>
                          <div className="tetuQi__rate-wrapper-content">
                            <div className="tetuQi__rate-token tetuQi__rate-token0">
                              <div className="tetuQi__rate-token-value">
                                <Title level={4}>1</Title>
                              </div>
                              <div className="tetuQi__rate-token-img">
                                <img src={assetsIconMap.QI} alt="" />
                              </div>
                              <Title level={4} className="tetuQi__rate-token-name">
                                QI
                              </Title>
                            </div>

                            <Title level={4} className="tetuQi__rate-middle">
                              =
                            </Title>

                            <div className="tetuQi__rate-token tetuQi__rate-token1">
                              <div className="tetuQi__rate-token-value">
                                <Title level={4}>
                                  {!!tetuQiPrice ? parseFloat(tetuQiPrice).toFixed(2) : '-'}
                                </Title>
                              </div>
                              <div className="tetuQi__rate-token-img">
                                <img src={assetsIconMap.tetuQi} alt="" />
                              </div>
                              <Title level={4} className="tetuQi__rate-token-name">
                                tetuQi
                              </Title>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tetuQi__total-deposit-content">
                        <Row
                          className="tetuQi__total-deposit"
                          gutter={[58, { xs: 0, sm: 14 }]}
                          justify="center"
                        >
                          <Col xs={24} sm={12}>
                            <Row gutter={[0, 8]}>
                              <Col className="tetuQi__total-deposit-item" span={24}>
                                <div className="tetuQi__total-deposit-label">Total QI locked:</div>
                                <div className="tetuQi__total-deposit-value">
                                  <Row align="bottom" gutter={[0, 0]}>
                                    <Col>
                                      <Amount value={totalTvl} />
                                    </Col>
                                    <Col>
                                      <span className="tetuQi__total-deposit-sub-value">
                                        <Amount value={totalTvlUsdc} prefix="$" />
                                      </span>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>

                              <Col className="tetuQi__total-deposit-item" span={24}>
                                <div className="tetuQi__total-deposit-label">
                                  My total tetuQi deposits:
                                </div>
                                <div className="tetuQi__total-deposit-value">
                                  <Row align="bottom" gutter={[0, 0]}>
                                    <Col>
                                      <Amount value={totalDeposit + ''} formated />
                                    </Col>
                                    <Col>
                                      <span className="tetuQi__total-deposit-sub-value">
                                        <Amount value={totalDepositUsdc + ''} formated prefix="$" />
                                      </span>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xs={24} sm={12}>
                            <Row gutter={[0, 8]}>
                              <Col className="tetuQi__total-deposit-item" span={24}>
                                <div className="tetuQi__total-deposit-label">
                                  <img src={assetsIconMap.xTETU} alt="" />
                                  xTETU:
                                </div>
                                <div className="tetuQi__total-deposit-value">
                                  <Row align="bottom" gutter={[0, 0]}>
                                    <Col>
                                      <Amount
                                        value={
                                          rewardTokens?.[
                                            '0x225084D30cc297F3b177d9f93f5C3Ab8fb6a1454'
                                          ] + ''
                                        }
                                        formated
                                      />
                                    </Col>
                                    <Col>
                                      <span className="tetuQi__total-deposit-sub-value">
                                        <Amount
                                          value={
                                            rewardTokensUsdc?.[
                                              '0x225084D30cc297F3b177d9f93f5C3Ab8fb6a1454'
                                            ] + ''
                                          }
                                          formated
                                          prefix="$"
                                        />
                                      </span>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>

                              <Col className="tetuQi__total-deposit-item" span={24}>
                                <div className="tetuQi__total-deposit-label">
                                  <img src={assetsIconMap.tetuQi} alt="" />
                                  tetuQi:
                                </div>
                                <div className="tetuQi__total-deposit-value">
                                  <Row align="bottom" gutter={[0, 0]}>
                                    <Col>
                                      <Amount
                                        value={
                                          rewardTokens?.[
                                            '0x4Cd44ced63d9a6FEF595f6AD3F7CED13fCEAc768'
                                          ] + ''
                                        }
                                        formated
                                      />
                                    </Col>
                                    <Col>
                                      <span className="tetuQi__total-deposit-sub-value">
                                        <Amount
                                          value={
                                            rewardTokensUsdc?.[
                                              '0x4Cd44ced63d9a6FEF595f6AD3F7CED13fCEAc768'
                                            ] + ''
                                          }
                                          formated
                                          prefix="$"
                                        />
                                      </span>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </div>

          {/* rate  */}

          {/* <div className="tetuQi__rate">
            <Row gutter={[0, 0]} justify="center" align="middle">
              <Col xs={24} sm={24} md={16} xl={15} xxl={12}>
                <Row className="tetuQi__rate-left" align="middle">
                  <Col xs={24} xl={10}>
                    <Title level={5} className="tetuQi__rate-label">
                      The current ratio
                    </Title>
                  </Col>
                  <Col xs={24} xl={14}></Col>
                </Row>
              </Col> */}
          {/*<Col xs={24} sm={24} md={8} xl={9} xxl={12}>*/}
          {/*  <div className="tetuQi__rate-right">*/}
          {/*    <Title level={5} className="tetuQi__rate-label">*/}
          {/*      <Row>*/}
          {/*        <span>we recommend</span>*/}
          {/*        <span style={{ marginLeft: 12, marginRight: 12 }}>*/}
          {/*          <Amount*/}
          {/*            mouseEnterDelay={0.3}*/}
          {/*            tooltipInner={*/}
          {/*              <p style={{ marginTop: 6, marginBottom: 6 }}>{textHint1}</p>*/}
          {/*            }*/}
          {/*            placement="topRight"*/}
          {/*            inline*/}
          {/*          >*/}
          {/*            <span>*/}
          {/*              <Icon name="question" />*/}
          {/*            </span>*/}
          {/*          </Amount>*/}
          {/*        </span>*/}
          {/*        <span>the following investment method:</span>*/}
          {/*      </Row>*/}
          {/*    </Title>*/}
          {/*  </div>*/}
          {/*</Col>*/}
          {/* </Row>
          </div> */}

          {/*<RecomendedWay way={recomendedWayIndex} />*/}

          <div className="tetuQi__articles-title">
            <Title level={3}>Related Articles</Title>
          </div>

          <Row
            justify="center"
            gutter={[
              { xs: 16, sm: 16, xl: 20 },
              { xs: 16, sm: 16, xl: 0 },
            ]}
            className="tetuQi__articles"
          >
            <Col xs={24} sm={12} md={8} className="tetuQi__articles-item-col">
              <a
                className="tetuQi__articles-item"
                href="https://medium.com/@tetu.finance/introducing-the-new-tetuqi-vault-high-apy-and-flexibility-e1c476fd3956"
                target="_blank"
              >
                <img className="tetuQi__articles-img" src={Article1img} />
                <div className="tetuQi__articles-wrapper">
                  <div className="tetuQi__article-title">
                    Introducing the new tetuQi vault — High APY and flexibility...
                  </div>
                  <span className="tetuQi__articles-link">
                    medium.com{' '}
                    <img src={LinkIcon} alt="" style={{ marginLeft: 7, marginBottom: 2 }} />
                  </span>
                </div>
              </a>
            </Col>

            <Col xs={24} sm={12} md={8} className="tetuQi__articles-item-col">
              <a
                className="tetuQi__articles-item"
                href="https://medium.com/@tetu.finance/auto-compounds-with-xtetuqi-77620f5d7dec"
                target="_blank"
              >
                <img className="tetuQi__articles-img" src={Article3img} />
                <div className="tetuQi__articles-wrapper">
                  <div className="tetuQi__article-title">Auto compounds with xtetuQi</div>
                  <span className="tetuQi__articles-link">
                    medium.com{' '}
                    <img src={LinkIcon} alt="" style={{ marginLeft: 7, marginBottom: 2 }} />
                  </span>
                </div>
              </a>
            </Col>

            <Col xs={24} sm={12} md={8} className="tetuQi__articles-item-col">
              <a
                className="tetuQi__articles-item"
                href="https://medium.com/@tetu.finance/tetu-the-convex-of-the-qiwars-3b0ad9b36431"
                target="_blank"
              >
                <img className="tetuQi__articles-img" src={Article2img} />
                <div className="tetuQi__articles-wrapper">
                  <div className="tetuQi__article-title">Tetu — the convex of the QiWars</div>
                  <span className="tetuQi__articles-link">
                    medium.com{' '}
                    <img src={LinkIcon} alt="" style={{ marginLeft: 7, marginBottom: 2 }} />
                  </span>
                </div>
              </a>
            </Col>
          </Row>
        </div>
      ) : (
        <Loader size={48} padding={0} />
      )}
    </div>
  )
})
