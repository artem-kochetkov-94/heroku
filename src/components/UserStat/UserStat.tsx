import { useState } from 'react'
import { Col, Row, Spin } from 'antd'
import { observer } from 'mobx-react'
import { LoadingOutlined } from '@ant-design/icons'
import { useStores } from '../../stores/hooks'
import styles from './UserStat.module.scss'
import { TotalRewards } from '../../pages/Main/components/TotalRewards'
import { useForceUpdate } from '../../hooks'
import { getAssetsIconMap } from '../../static/tokens'
import unknownIcon from '../../static/UNKNOWN.png'
import { Amount } from '../../components/Amount'
import { useMediaQuery } from 'react-responsive'

const antIcon = <LoadingOutlined style={{ fontSize: 18, marginLeft: 15 }} spin />

export const UserStat: React.FC = observer(() => {
  const { mainPageStore, namesManagerStore } = useStores()
  const forceUpdate = useForceUpdate()
  const assetsIconMap = getAssetsIconMap()

  const [isExpanded, setIsExpanded] = useState(false)

  const isXS = useMediaQuery({ query: '(max-width: 575px)' })

  const toggle = () => {
    setIsExpanded(!isExpanded)
  }

  const positiveRewards =
    mainPageStore.totalRewardsBoostToClaim === null
      ? []
      : mainPageStore.totalRewardsBoostToClaim.items.filter((el: any, index: number) => {
          if (el.amountUsdc === '0') {
            return false
          }
          return true
        })

  return (
    <div className={`${styles.wrapperBg} ${isExpanded ? styles.wrapperBgActive : ''}`}>
      <div className={`${styles.wrapper} ${isExpanded ? styles.wrapperActive : ''}`}>
        <Row
          className={`${styles.header} ${isExpanded ? styles.headerActive : ''}`}
          justify="space-between"
          wrap={false}
        >
          <Col className={styles.headerLeft}>
            <Row justify="space-between" wrap={false} gutter={25} align="middle">
              <Col>
                <p className={styles.headerTitle}>
                  {mainPageStore.totalRewardsBoostToClaim === null ? (
                    <Spin indicator={antIcon} />
                  ) : (
                    <span>
                      <Amount
                        value={mainPageStore.totalRewardsBoostToClaim.total}
                        prefix="$"
                        style={{ fontSize: 16, lineHeight: '22px' }}
                      />
                    </span>
                  )}
                </p>
                <p className={styles.headerSubtitle}>Rewards</p>
              </Col>
              <Col>
                {!positiveRewards.length ? null : (
                  <Row gutter={{ xs: 6, sm: 10 }} align="middle">
                    {positiveRewards.map((el: any, index: number) => {
                      const name = namesManagerStore.getAssetName(el.token)

                      if (name === null) {
                        setTimeout(forceUpdate, 1000)
                      }

                      if (el.amountUsdc === '0') {
                        return null
                      }

                      return (
                        <>
                          <Col
                            className="rewardIconCol"
                            style={{
                              marginRight:
                                index !== positiveRewards.length - 1 && positiveRewards.length > 3
                                  ? isXS
                                    ? -10
                                    : -20
                                  : 0,
                            }}
                          >
                            <img
                              className={styles.rewardIconImg}
                              // @ts-ignore
                              src={assetsIconMap?.[name] ?? unknownIcon}
                            />
                          </Col>
                        </>
                      )
                    })}
                  </Row>
                )}
              </Col>
            </Row>
          </Col>

          <Col className={styles.headerRight}>
            <Row justify="space-between" align="middle" gutter={16}>
              <Col>
                <p className={styles.headerTitle}>
                  {mainPageStore.totalDeposits === null ? (
                    <Spin indicator={antIcon} />
                  ) : (
                    <span>
                      <Amount
                        value={mainPageStore.totalDeposits}
                        prefix="$"
                        style={{ fontSize: 16, lineHeight: '22px' }}
                      />
                    </span>
                  )}
                </p>
                <p className={styles.headerSubtitle}>Deposits</p>
              </Col>
              <Col>
                <button
                  className={`${styles.toggleButton} ${
                    isExpanded ? styles.toggleButtonActive : ''
                  }`}
                  onClick={toggle}
                >
                  <span></span>
                </button>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className={`${styles.content} ${isExpanded ? styles.contentActive : ''}`}>
          <TotalRewards />
          {/* <div className={styles.body}>
          {!metaMaskStore.walletAddress ? (
            <>
              <p>
                User total deposits: <b>...</b>
              </p>
              <p>
                User total rewards: <b>...</b>
              </p>
            </>
          ) : (
            <>
              <p>
                User total deposits:{' '}
                <b>
                  {mainPageStore.totalDeposits === null ? (
                    <Spin indicator={antIcon} />
                  ) : (
                    <span>
                      <Amount value={mainPageStore.totalDeposits} prefix="$" />
                    </span>
                  )}
                </b>
              </p>
              <p>
                User total rewards:{' '}
                <b>
                  {' '}
                  {mainPageStore.totalRewardsBoostToClaim === null ? (
                    <Spin indicator={antIcon} />
                  ) : (
                    <span>
                      <Amount value={mainPageStore.totalRewardsBoostToClaim.total} prefix="$" />
                    </span>
                  )}
                </b>
              </p>
              <p className={styles.vaultBalance}>
                <span className={styles.vaultBalanceIcon}></span>
                <span>xTETU:</span>
                <span className={styles.vaultBalanceBorderBlock}>
                  <b>2.25K</b>
                </span>
                <span>
                  <b>$ 136.84</b>
                </span>
              </p>

              <p className={styles.vaultBalance}>
                <span className={styles.vaultBalanceIcon}></span>
                <span>dxTETU:</span>
                <span className={styles.vaultBalanceBorderBlock}>
                  <b>7.87</b>
                </span>
                <span>
                  <b>$ 0.428</b>
                </span>
              </p>

              <p className={styles.vaultBalance}>
                <span className={styles.vaultBalanceIcon}></span>
                <span>tetuQi:</span>
                <span className={styles.vaultBalanceBorderBlock}>
                  <b>0.00000499</b>
                </span>
                <span>
                  <b>$ 0.00000397</b>
                </span>
              </p>
            </>
          )}
        </div> */}

          {/* <div className={styles.footer}>Show my deposits</div> */}
        </div>
      </div>
    </div>
  )
})
