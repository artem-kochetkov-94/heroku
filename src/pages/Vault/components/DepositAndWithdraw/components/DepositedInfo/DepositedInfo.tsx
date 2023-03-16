import { Col, Row, Tooltip } from 'antd'
import { formatAmountUsdc, formatAmout } from '../../utils'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'
import { useStores } from '../../../../../../stores/hooks'
import { AboutVault } from './AboutVault'
import { formatShareName, formatVaultIcon } from '../../../../../../utils/format'
import { getAssetsIconMap } from '../../../../../../static/tokens'
import unknownIcon from '../../../../../../static/UNKNOWN.png'
import './styles.css'

export const DepositedInfo = observer(() => {
  const { userInfoOfVaultStore, vaultDataPageStore, namesManagerStore } = useStores()

  const vault = vaultDataPageStore.data
  const userInfo = userInfoOfVaultStore.value
  const address = vault?.addr
  const assets = vault?.assets || []
  let formatedIcon = address && formatVaultIcon(address, vault?.networkName)

  // const isLoading =
  // assets?.map((asset: string) => namesManagerStore.getAssetName(asset))?.includes(null) ?? false

  // if (isLoading) {
  //   setTimeout(forceUpdate, 1000)
  // }

  return (
    <Col span={24}>
      <div className="app-paper">
        <p className="user-stat-title">User Stats</p>

        <Row gutter={[60, 12]}>
          <Col>
            <Row gutter={8} wrap={false}>
              <Col></Col>
              <Col>
                <p className="user-stat-item-value">
                  {userInfo && (
                    <>
                      {formatAmout(userInfo.depositedUnderlying)}
                      <span className="app-divider">|</span>$
                      {formatAmountUsdc(userInfo.depositedUnderlyingUsdc ?? 0)}
                    </>
                  )}
                </p>
                <p className="user-stat-item-title" style={{ paddingTop: 4 }}>
                  <Row gutter={8}>
                    <Col>Deposited</Col>
                    <Col>
                      <Tooltip color="#212130" title="Deposited underlying" placement="topRight">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </Col>
                  </Row>
                </p>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row gutter={8}>
              <Col>
                <Row align="top">
                  {formatedIcon && (
                    <>
                      {Array.isArray(formatedIcon) ? (
                        <>
                          {formatedIcon.map((icon: string) => (
                            <Col>
                              <img
                                // @ts-ignore
                                width="15"
                                height="15"
                                src={icon}
                                className={`icon`}
                              />
                            </Col>
                          ))}
                        </>
                      ) : (
                        <Col>
                          <img
                            // @ts-ignore
                            width="15"
                            height="15"
                            src={formatedIcon}
                            className={`icon`}
                          />
                        </Col>
                      )}
                    </>
                  )}

                  {!formatedIcon && (
                    <>
                      {assets.map((asset: string, index: number) => {
                        const name = namesManagerStore.getAssetName(asset) || ''

                        return (
                          <Col>
                            <img
                              // @ts-ignore
                              width="15"
                              height="15"
                              src={getAssetsIconMap()[name] ?? unknownIcon}
                              className={`icon`}
                              alt={name}
                            />
                          </Col>
                        )
                      })}
                    </>
                  )}
                </Row>
              </Col>
              <Col>
                <p className="user-stat-item-value">
                  {userInfo && formatAmout(userInfo.depositedShare)} (
                  {formatShareName(namesManagerStore.getAssetName(vault?.addr))})
                </p>
                <p className="user-stat-item-title" style={{ paddingTop: 4 }}>
                  <Row gutter={8}>
                    <Col>Share</Col>
                    <Col>
                      <Tooltip color="#212130" title="Share amount" placement="topRight">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </Col>
                  </Row>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>

        <AboutVault vault={vault} />
      </div>
    </Col>
  )
})
