import React from 'react'
import { Row, Col, Spin } from 'antd'
import { getAssetsIconMap } from '../../static/tokens'
import unknownIcon from '../../static/UNKNOWN.png'
import { calcApr, formatAdress, formatVaultIcon } from '../../utils'
import { formatUnits } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'
import { namesManagerStore } from '../../stores'
import { useForceUpdate } from '../../hooks'
import { LoadingOutlined } from '@ant-design/icons'
import VaultIcon from '../../static/vault.svg'
import PercentIcon from '../../static/percent.svg'
import './styles.css'
import { addressesMap } from '../../networks/Addresses'
import { useStores } from '../../stores/hooks'
import { getVaultDescriptionByPlatform } from '../../pages/Vault/utils'

export const calcAPY = (val: string | number, period = 12) => {
  const APY = (Math.pow(1 + Number(val) / 100 / period, period) - 1) * 100
  return parseFloat(APY + '').toFixed(2)
}

const Values: React.FC<any> = (props: any) => {
  const { title, current, month, year, rewards, mb = 32 } = props

  if (current.apr === 0) {
    return null
  }

  const format = (v: number) => {
    return parseFloat(v + '').toFixed(2)
  }

  if (rewards) {
    return (
      <div className="apr-detailed-values" style={{ marginBottom: 8 }}>
        <Row align="middle" gutter={[8, 0]}>
          <Col>{title}</Col>
          <Col>
            <div className="apr-detailed-value">
              {current === '0.00' ? (
                '-'
              ) : (
                <>
                  <span style={{ fontSize: 12, lineHeight: '16px' }}>APR: {format(current)}%</span>{' '}
                  <span
                    style={{ marginLeft: 10, fontSize: 12, lineHeight: '16px', color: '#7F8FA4' }}
                  >
                    {/* @ts-ignore */}
                    APY: {format(calcAPY(current, 12))}%
                  </span>
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  return (
    <div className="apr-detaield-values-wrapper">
      {title && <div className="apr-detailed-sub-title">{title}</div>}
      <div className="apr-detailed-values">
        {year !== undefined && (
          <div className="apr-detailed-item">
            <div className="apr-detailed-item-inner">
              <div
                className="apr-detailed-label"
                style={{
                  marginTop: 24,
                  marginBottom: 4,
                  fontFamily: 'Source Sans Pro',
                  fontSize: 12,
                  lineHeight: '16px',
                  color: '#FFF',
                }}
              >
                APR
              </div>
              <div className="apr-detailed-value">
                <div
                  className="apy"
                  style={{
                    fontSize: 12,
                    lineHeight: '16px',
                    color: '#7F8FA4',
                  }}
                >
                  APY
                </div>
              </div>
            </div>
          </div>
        )}

        {year !== undefined && (
          <div className="apr-detailed-item">
            <div className="apr-detailed-item-inner">
              <div
                className="apr-detailed-label"
                style={{
                  fontFamily: 'Source Sans Pro',
                  fontSize: 12,
                  lineHeight: '16px',
                  color: '#7F8FA4',
                  opacity: 0.6,
                }}
              >
                Last Year
              </div>
              <div className="apr-detailed-value">
                {format(year.apr) === '0.00' ? (
                  '-'
                ) : (
                  <>
                    <div
                      className="apr"
                      style={{ marginBottom: 4, fontSize: 12, lineHeight: '16px', color: '#FFF' }}
                    >
                      {format(year.apr)}%
                    </div>
                    <div
                      className="apy"
                      style={{
                        fontSize: 12,
                        lineHeight: '16px',
                        color: '#7F8FA4',
                      }}
                    >
                      {format(year.apy)}%
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {month !== undefined && (
          <div className="apr-detailed-item">
            <div className="apr-detailed-item-inner">
              <div
                className="apr-detailed-label"
                style={{
                  fontFamily: 'Source Sans Pro',
                  fontSize: 12,
                  lineHeight: '16px',
                  color: '#7F8FA4',
                  opacity: 0.6,
                }}
              >
                Last Month
              </div>
              <div className="apr-detailed-value">
                {format(month.apr) === '0.00' ? (
                  '-'
                ) : (
                  <>
                    <div
                      className="apr"
                      style={{ marginBottom: 4, fontSize: 12, lineHeight: '16px', color: '#FFF' }}
                    >
                      {format(month.apr)}%
                    </div>
                    <div
                      className="apy"
                      style={{
                        fontSize: 12,
                        lineHeight: '16px',
                        color: '#7F8FA4',
                      }}
                    >
                      {format(month.apy)}%
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="apr-detailed-item">
          <div className="apr-detailed-item-inner">
            <div
              className="apr-detailed-label"
              style={{
                fontFamily: 'Source Sans Pro',
                fontSize: 12,
                lineHeight: '16px',
                color: '#7F8FA4',
                opacity: 0.6,
              }}
            >
              Current
            </div>
            <div className="apr-detailed-value">
              {format(current.apr) === '0.00' ? (
                '-'
              ) : (
                <>
                  <div
                    className="apr"
                    style={{ marginBottom: 4, fontSize: 12, lineHeight: '16px', color: '#FFF' }}
                  >
                    {format(current.apr)}%
                  </div>
                  <div
                    className="apy"
                    style={{
                      fontSize: 12,
                      lineHeight: '16px',
                      color: '#7F8FA4',
                    }}
                  >
                    {format(current.apy)}%
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type AprDetailedViewProps = {
  vault: any
}

const formatApr = (v: string, formated: boolean = false) => {
  if (formated) {
    return parseFloat(v + '').toFixed(2)
  }
  return parseFloat(formatUnits(v)).toFixed(2)
}

const computeData = (vault: any) => {
  const format = (v: string) => {
    return parseFloat(formatUnits(v)).toFixed(2)
  }

  const data: any = {
    autocompound: {
      current: {
        apr: format(vault.ppfsApr),
        apy: calcAPY(format(vault.ppfsApr), 365),
      },
      month: {
        apr: format(vault.ppfsAprMonth),
        apy: calcAPY(format(vault.ppfsAprMonth), 365),
      },
      year: {
        apr: format(vault.ppfsAprYear),
        apy: calcAPY(format(vault.ppfsAprYear), 365),
      },
    },
    vaultUnderling: vault.underlyingVaults.map((v: any) => {
      if (v === null) {
        return
      }
      const { ppfsApr, ppfsAprMonth, ppfsAprYear, name } = v

      if (
        vault.addr.toLowerCase() ===
        addressesMap.aliases.matic.config.addresses.vaults.dxTETU.toLowerCase()
      ) {
        return {
          name,
          current: {
            apr: Number(format(ppfsApr)),
            apy: calcAPY(Number(format(ppfsApr)), 365),
          },
          month: {
            apr: Number(format(ppfsAprMonth)),
            apy: calcAPY(Number(format(ppfsAprMonth)), 365),
          },
          year: {
            apr: Number(format(ppfsAprYear)),
            apy: calcAPY(Number(format(ppfsAprYear)), 365),
          },
          vault: v,
        }
      }

      return {
        name,
        current: {
          apr: Number(format(ppfsApr)) / 2,
          apy: calcAPY(Number(format(ppfsApr)) / 2, 365),
        },
        month: {
          apr: Number(format(ppfsAprMonth)) / 2,
          apy: calcAPY(Number(format(ppfsAprMonth)) / 2, 365),
        },
        year: {
          apr: Number(format(ppfsAprYear)) / 2,
          apy: calcAPY(Number(format(ppfsAprYear)) / 2, 365),
        },
        vault: v,
      }
    }),
    swapFeesApr: {
      current: {
        apr: parseFloat(vault.swapFeesAprDaily),
        apy: calcAPY(parseFloat(vault.swapFeesAprDaily), 365),
      },
      month: {
        apr: parseFloat(vault.swapFeesAprMonthly),
        apy: calcAPY(parseFloat(vault.swapFeesAprMonthly), 365),
      },
      year: {
        apr: parseFloat(vault.swapFeesAprYearly),
        apy: calcAPY(parseFloat(vault.swapFeesAprYearly), 365),
      },
    },
    rewardTokens: vault.rewardTokens
      .filter((el: any) => el.rewardTokensBal !== '0')
      .map((addr: string, index: number) => {
        const apr = format(vault.rewardsApr[index])
        // current only
        return {
          addr,
          current: apr,
          month: apr,
          year: apr,
        }
      }),
    total: {
      current: null,
      month: null,
      year: null,
    },
  }

  const calcTotal = (key: string) => {
    const autocompound = Number(data.autocompound[key].apr)

    const swapFeesApr = data.swapFeesApr[key].apr

    const vaultUnderling = data.vaultUnderling.reduce(
      (acc: number, item: any) => acc + Number(item?.[key]?.apr ?? 0),
      0,
    )

    const rewardTokens = data.rewardTokens.reduce(
      (acc: number, item: any) => acc + Number(item?.[key] ?? 0),
      0,
    )

    const apr = parseFloat(swapFeesApr + autocompound + rewardTokens + vaultUnderling).toFixed(2)

    const apy =
      Number(calcAPY(autocompound, 365)) +
      data.vaultUnderling.reduce(
        (acc: number, item: any) => acc + Number(calcAPY(item[key].apr, 365)),
        0,
      ) +
      Number(calcAPY(swapFeesApr, 365)) +
      data.rewardTokens.reduce((acc: number, item: any) => acc + Number(calcAPY(item[key], 12)), 0)

    return {
      apr,
      apy,
    }
  }

  data.total.current = calcTotal('current')
  data.total.month = calcTotal('month')
  data.total.year = calcTotal('year')

  return data
}

export const AprDetailedView: React.FC<AprDetailedViewProps> = (props) => {
  const { vault } = props
  const { buyBackRatio } = vault
  const forceUpdate = useForceUpdate()
  const { networkManager } = useStores()

  const hasVaulUnderling =
    vault.platform === '12' ||
    vault.addr === addressesMap.aliases.matic.config.addresses.vaults.dxTETU
  const data = computeData(vault)
  const { autocompound, vaultUnderling, rewardTokens, total } = data
  const swapFeesApr = parseFloat(vault.swapFeesAprDaily).toFixed(2)

  const isZeroAutocompound =
    autocompound.current.apr === '0.00' &&
    autocompound.year.apr === '0.00' &&
    autocompound.month.apr === '0.00'
  let isAutocompond = buyBackRatio === '100'
  let autocompoundValue = null

  autocompoundValue = 100 - Number(buyBackRatio) / 100
  if (autocompoundValue > 0) {
    isAutocompond = true
  }

  if (
    networkManager.addresses.excludeAutocompoundAprAddrs
      .map((el: string) => el.toLowerCase())
      .includes(vault?.addr?.toLowerCase()) ||
    vault.platform === '41'
  ) {
    isAutocompond = false
  }

  const checkIsShowUnderling = (underlyingVaults: any[]) => {
    return underlyingVaults?.filter((item) => {
      if (item === null) {
        return false
      }

      const APR =
        props.vault.addr.toLowerCase() ===
        addressesMap.aliases.matic.config.addresses.vaults.dxTETU.toLowerCase()
          ? parseFloat(Number(formatUnits(item.ppfsApr)) + '').toFixed(2)
          : parseFloat(Number(formatUnits(item.ppfsApr)) / 2 + '').toFixed(2)

      if (Number(APR) > 0) {
        return true
      } else {
        return false
      }
    })
  }

  const checkIsShowAutocompound = () => {
    const { ppfsApr, underlyingVaults } = vault
    const APR = Number(parseFloat(formatUnits(ppfsApr)).toFixed(2))
    const len = checkIsShowUnderling(underlyingVaults)?.length ?? 0
    return len > 0 || APR > 0 || Number(swapFeesApr) > 0
  }

  const checkIsShowRewards = () => {
    return vault.rewardsApr.filter((el: any) => el !== '0').length !== 0
  }

  const vaultDescription = getVaultDescriptionByPlatform(vault)

  return (
    <div className="apr-detailed">
      {vaultDescription && <div className="vaultDescriptionView">{vaultDescription}</div>}
      {autocompoundValue != 100 && vault?.network !== 'ETH' && (
        <div className="vaultSubDescriptionView">
          {100 - autocompoundValue}% of profit will be used for buy back TETU. Part of it will be
          added as TETU claimable rewards.
        </div>
      )}
      {vault.platform === '41' && (
        <div style={{ fontSize: 14, marginBottom: 16 }}>
          The assets will be deposited to Cone using veCONE to maximize your profit.
          <br />
          A part of the income will be reinvested to the veCONE to keep the profit at the maximum
          possible level.
          <br />
          The proportion for reinvesting in the veCONE is recalculating periodically and could be in
          a range of 50-10%
          <br />
          Another part (50-90%) will increase your LP position (compounding).
          <br />
          No claimable rewards assumed
          <br />
        </div>
      )}
      {vault.platform === '36' && vault.networkName === 'ETH' && (
        <div style={{ fontSize: 14, marginBottom: 16 }}>
          {autocompoundValue}% of profit is auto-compounding to underlying asset.
          <br />
          Assets deposited to Balancer gauge with boost from tetuBAL.
          <br />
          Boost depends on this vault TVL, other participants in farmed gauge and amount of veBAL
          under Tetu control.
          <br />
          <br />
          Current rewards boost: <b>x{vault.balancerBoost}</b>
        </div>
      )}
      {vault.platform === '36' && vault.networkName === 'ETH' && vault.ableToBoostUsd !== '0' && (
        <div style={{ fontSize: 14, marginBottom: 16 }}>
          Full boost is supported for up to <b>${vault.ableToBoostUsd}</b> of additional deposits.
        </div>
      )}
      {checkIsShowAutocompound() && (
        <div style={{ marginBottom: 10 }}>
          {(hasVaulUnderling || !isZeroAutocompound) && (
            <>
              <div className="apr-detailed-title">
                <b>AUTOCOMPOUND</b>
              </div>
              <div className="apr-autocompounded-description">
                Autocompounded APY calculated with daily compound period
              </div>
            </>
          )}
          {!isZeroAutocompound && (
            <>
              <Values
                title={
                  <Row align="middle" className="apr-detailed-item-first-row">
                    <Col>
                      <img
                        // @ts-ignore
                        src={VaultIcon}
                        className={`icon apr-detailed-item-img`}
                      />
                    </Col>
                    <Col>
                      <span className="apr-detailed-item-title">Vault</span>
                    </Col>
                  </Row>
                }
                year={autocompound.year}
                month={autocompound.month}
                current={autocompound.current}
              />
            </>
          )}

          {hasVaulUnderling && (
            <>
              {vaultUnderling?.map((el: any) => {
                const title = (
                  <Row align="middle" className="apr-detailed-item-first-row">
                    <Col>
                      {formatVaultIcon(el.vault.addr!, vault.networkName) ? (
                        <>
                          {Array.isArray(formatVaultIcon(el.vault.addr!, vault.networkName)) ? (
                            <>
                              {formatVaultIcon(el.vault.addr!, vault.networkName).map(
                                (img: string) => {
                                  return (
                                    <img
                                      // @ts-ignore
                                      src={img}
                                      className={`icon`}
                                      alt=""
                                      style={{
                                        height: 20,
                                        marginTop: -2,
                                        width: 'auto',
                                        borderRadius: 30,
                                        overflow: 'hidden',
                                        marginRight: 8,
                                      }}
                                    />
                                  )
                                },
                              )}
                            </>
                          ) : (
                            <img
                              // @ts-ignore
                              src={formatVaultIcon(address!, vault.networkName)}
                              className={`icon`}
                              alt=""
                              style={{
                                height: 20,
                                marginTop: -2,
                                width: 'auto',
                                borderRadius: 30,
                                overflow: 'hidden',
                                marginRight: 8,
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <>
                          {el.vault.assets.map((asset: string) => {
                            const name = namesManagerStore.getAssetName(asset)

                            if (name === null) {
                              setTimeout(forceUpdate, 1000)
                            }

                            return (
                              <img
                                // @ts-ignore
                                src={getAssetsIconMap()[name] ?? unknownIcon}
                                className={`icon apr-detailed-item-img`}
                                alt={name}
                              />
                            )
                          })}
                        </>
                      )}
                    </Col>
                    <Col>
                      <span className="apr-detailed-item-title">
                        {el.vault.assets.map((asset: string) =>
                          namesManagerStore.getAssetName(asset),
                        )}
                      </span>
                    </Col>
                  </Row>
                )
                return (
                  <Values
                    key={el.name}
                    title={title}
                    year={el.year}
                    month={el.month}
                    current={el.current}
                  />
                )
              })}
            </>
          )}

          {Number(swapFeesApr) > 0 && (
            <>
              <Values
                title={
                  <div>
                    <img className="apr-detailed-item-img" src={PercentIcon} alt="" style={{}} />
                    <span className="apr-detailed-item-title">Trading Fees:</span>
                  </div>
                }
                year={data.swapFeesApr.year}
                month={data.swapFeesApr.month}
                current={data.swapFeesApr.current}
              />
            </>
          )}
        </div>
      )}

      {checkIsShowRewards() && (
        <>
          {!isZeroAutocompound && !isZeroAutocompound && <br />}
          <div className="apr-detailed-title" style={{ marginBottom: 4 }}>
            <b>Claimable rewards</b>
          </div>
          <div className="apr-autocompounded-description">
            Claimable rewards APY calculated with monthly compound period
          </div>
          {rewardTokens.map((el: any) => {
            const name = namesManagerStore.getAssetName(el.addr)
            if (name === null) {
              setTimeout(() => {
                forceUpdate()
              }, 1000)
            }
            const icon = (
              <img
                // @ts-ignore
                src={getAssetsIconMap()[name] ?? unknownIcon}
                className={`apr-detailed-item-icon`}
                alt=""
                width="16px"
                style={{
                  marginRight: 0,
                }}
              />
            )
            const title = (
              <div style={{ display: 'inline-block' }}>
                <Row align="middle" gutter={[6, 4]}>
                  <Col>{icon}</Col>
                  <Col>
                    {name ?? <Spin indicator={<LoadingOutlined style={{ fontSize: 14 }} spin />} />}
                  </Col>
                </Row>
              </div>
            )
            return <Values title={title} current={el.current} rewards />
          })}
        </>
      )}

      <Values
        year={total.year}
        month={total.month}
        current={total.current}
        title={<span className="apr-detailed-item-title">TOTAL</span>}
        mb={0}
      />
    </div>
  )
}
