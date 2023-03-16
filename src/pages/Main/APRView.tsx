import React, { useState } from 'react'
import { CalculatorOutlined, LoadingOutlined, RedoOutlined } from '@ant-design/icons'
import { formatUnits } from 'ethers/lib/utils'
import { calcAmount, calcApr, formatVaultIcon, millifyValue } from '../../utils'
import { BigNumber } from 'ethers'
import { Modal, Row, Col, Spin } from 'antd'
import { getAssetsIconMap } from '../../static/tokens'
import unknownIcon from '../../static/UNKNOWN.png'
import { namesManagerStore, networkManager } from '../../stores'
import { Amount } from '../../components/Amount'
import { VaultRow } from '../../components/VaultRow'
import { AprDetailedView, calcAPY } from '../../components/AprDetailedView'
import { useForceUpdate } from '../../hooks'
import PercentIcon from '../../static/percent.svg'
import VaultIcon from '../../static/vault.svg'
import { addressesMap } from '../../networks/Addresses'
import { useStores } from '../../stores/hooks'
import { useMediaQuery } from 'react-responsive'
import { getVaultDescriptionByPlatform } from '../Vault/utils'

type APRViewProps = {
  vault: any
  reverse?: boolean
  hideControls?: boolean
  networkName?: string
}

const antSmallIcon = <LoadingOutlined style={{ fontSize: 16 }} spin />

export const APRTooltipInner: React.FC<APRViewProps> = (props) => {
  const { vault } = props
  const { buyBackRatio, underlyingVaults, rewardsApr, ppfsApr, rewardTokens, totalApr } = vault
  let isAutocompond = buyBackRatio === '100'
  let autocompoundValue = null
  const forceUpdate = useForceUpdate()

  const swapFeesApr = parseFloat(vault.swapFeesAprDaily)

  const { networkManager } = useStores()

  autocompoundValue = 100 - buyBackRatio / 100
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

  // @ts-ignore
  const APR = Number(parseFloat(formatUnits(ppfsApr)).toFixed(2))
  const period = 365
  const APY = (Math.pow(1 + APR / 100 / period, period) - 1) * 100

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
    const len = checkIsShowUnderling(underlyingVaults)?.length ?? 0

    return len > 0 || APR > 0 || Number(swapFeesApr) > 0
  }

  const vaultDescription = getVaultDescriptionByPlatform(vault)

  const checkIsShowRewards = () => {
    return rewardsApr.filter((el: any) => el !== '0').length !== 0
  }

  const showBuyBackCaption =
    autocompoundValue != 100 &&
    vault?.network !== 'ETH' &&
    vault?.addr?.toLowerCase() !== networkManager.addresses.vaults.tetuBal?.toLowerCase()

  return (
    <div style={{ padding: 4 }}>
      {vaultDescription && <div style={{ paddingBottom: 16 }}>{vaultDescription}</div>}
      <div>
        {showBuyBackCaption && (
          <div style={{ fontSize: 14, marginBottom: 16 }}>
            {100 - autocompoundValue}% of profit will be used for buy back TETU. Part of it will be
            added as xTETU claimable rewards.
          </div>
        )}
        {vault.platform === '41' && (
          <div style={{ fontSize: 14, marginBottom: 16 }}>
            The assets will be deposited to Cone using veCONE to maximize your profit.
            <br />
            A part of the income will be reinvested to the veCONE to keep the profit at the maximum
            possible level.
            <br />
            The proportion for reinvesting in the veCONE is recalculating periodically and could be
            in a range of 50-10%
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
      </div>
      <div style={{ marginBottom: 16, display: checkIsShowAutocompound() ? 'block' : 'none' }}>
        <b>Autocompound:</b>
        <div style={{ fontSize: 14, marginBottom: 4, color: '#C4C4DF' }}>
          Autocompounded APY calculated with daily compound period
        </div>
        {APR > 0 && (
          <div>
            <div className="apr-tooltip-vault-row">
              <Row gutter={[8, 0]}>
                <Col>
                  <Row gutter={[4, 4]} align="middle">
                    {/*
                    <Col>
                      {formatVaultIcon(vault.addr!) ? (
                        <>
                          <img
                            // @ts-ignore
                            src={formatVaultIcon(vault.addr!)}
                            className={`icon`}
                            alt=""
                            style={{
                              height: 20,
                              marginTop: -2,
                              width: 'auto',
                              borderRadius: 30,
                              overflow: 'hidden',
                            }}
                          />
                        </>
                      ) : (
                        <>
                          {vault.assets.map((asset: string) => {
                            const name = namesManagerStore.getAssetName(asset)

                            if (name === null) {
                              setTimeout(forceUpdate, 1000)
                            }

                            return (
                              <img
                                // @ts-ignore
                                src={getAssetsIconMap()[name] ?? unknownIcon}
                                className={`icon`}
                                alt={name}
                                style={{
                                  height: 20,
                                  marginTop: -2,
                                  width: 'auto',
                                  marginRight: 4,
                                  borderRadius: 30,
                                  overflow: 'hidden',
                                }}
                              />
                            )
                          })}
                        </>
                      )}
                    </Col>
                    <Col>
                      {formatVaultName(vault.addr!) ??
                        vault.assets
                          .map((asset: string) => namesManagerStore.getAssetName(asset))
                          .join('-')}
                      :
                    </Col>
                                    */}

                    <Col>
                      <img
                        // @ts-ignore
                        src={VaultIcon}
                        className={`icon`}
                        style={{
                          height: 20,
                          marginTop: -2,
                          width: 'auto',
                          marginRight: 4,
                        }}
                      />
                    </Col>
                    <Col>Vault:</Col>
                  </Row>
                </Col>
                <Col>
                  <div style={{ color: '#C4C4DF' }}>
                    {APR}% APR ({parseFloat(APY + '').toFixed(2)}% APY)
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        )}

        {!!checkIsShowUnderling(underlyingVaults)?.length && (
          <div style={{ marginTop: 6, marginBottom: 6 }}>
            {/*<div style={{ marginBottom: 4 }}>Autocompound underling:</div>*/}
            {checkIsShowUnderling(underlyingVaults).map((el: any) => {
              const APR =
                props.vault.addr.toLowerCase() ===
                addressesMap.aliases.matic.config.addresses.vaults.dxTETU.toLowerCase()
                  ? parseFloat(Number(formatUnits(el.ppfsApr)) + '').toFixed(2)
                  : parseFloat(Number(formatUnits(el.ppfsApr)) / 2 + '').toFixed(2)

              const APY = parseFloat(
                (Math.pow(1 + Number(APR) / 100 / period, period) - 1) * 100 + '',
              ).toFixed(2)

              return (
                <div style={{ marginBottom: 6 }}>
                  <Row gutter={[8, 0]}>
                    <Col>
                      <Row gutter={[4, 4]} align="middle">
                        <Col>
                          {formatVaultIcon(el.addr!, vault?.networkName) ? (
                            <>
                              {Array.isArray(formatVaultIcon(el.addr!, vault?.networkName)) ? (
                                <>
                                  {formatVaultIcon(el.addr!, vault?.networkName).map(
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
                                          }}
                                        />
                                      )
                                    },
                                  )}
                                </>
                              ) : (
                                <img
                                  // @ts-ignore
                                  src={formatVaultIcon(address!, vault?.networkName)}
                                  className={`icon`}
                                  alt=""
                                  style={{
                                    height: 20,
                                    marginTop: -2,
                                    width: 'auto',
                                    borderRadius: 30,
                                    overflow: 'hidden',
                                  }}
                                />
                              )}
                            </>
                          ) : (
                            <>
                              {el.assets.map((asset: string) => {
                                const name = namesManagerStore.getAssetName(asset)

                                if (name === null) {
                                  setTimeout(forceUpdate, 1000)
                                }

                                return (
                                  <img
                                    // @ts-ignore
                                    src={getAssetsIconMap()[name] ?? unknownIcon}
                                    className={`icon`}
                                    alt={name}
                                    style={{
                                      height: 20,
                                      marginTop: -2,
                                      width: 'auto',
                                      borderRadius: 30,
                                      overflow: 'hidden',
                                    }}
                                  />
                                )
                              })}
                            </>
                          )}
                        </Col>
                        <Col>
                          {el.assets.map((asset: string) => namesManagerStore.getAssetName(asset))}:
                        </Col>
                      </Row>
                    </Col>
                    <Col style={{ color: '#C4C4DF' }}>
                      {APR}% APR ({APY}% APY)
                    </Col>
                  </Row>
                </div>
              )
            })}
          </div>
        )}

        {swapFeesApr > 0 && (
          <div style={{ marginBottom: 4, marginTop: 4 }}>
            <img
              src={PercentIcon}
              alt=""
              style={{
                height: 20,
                marginTop: -2,
                marginRight: 8,
                width: 'auto',
                borderRadius: 30,
                overflow: 'hidden',
              }}
            />
            Trading Fees:{' '}
            <span style={{ color: '#C4C4DF' }}>
              {parseFloat(swapFeesApr + '').toFixed(2)}% APR ({calcAPY(swapFeesApr, 365)}% APY)
            </span>
          </div>
        )}
      </div>

      {checkIsShowRewards() && (
        <div style={{ paddingTop: 4, marginBottom: 16 }}>
          <div style={{ marginBottom: 4 }}>
            <b>Claimable rewards:</b>
          </div>
          <div style={{ fontSize: 14, marginBottom: 4, color: '#C4C4DF' }}>
            Claimable rewards APY calculated with monthly compound period
          </div>
          {rewardTokens.map((tokenAddr: string, index: number) => {
            const apr = rewardsApr[index]

            if (apr === '0') {
              return null
            }

            const name = namesManagerStore.getAssetName(tokenAddr)
            const period = 12
            const APY = (Math.pow(1 + Number(formatUnits(apr)) / 100 / period, period) - 1) * 100

            return (
              <div>
                {name ? (
                  <Row gutter={[8, 0]}>
                    <Col>
                      <img
                        style={{
                          height: 20,
                          marginTop: -2,
                          width: 'auto',
                          borderRadius: 30,
                          overflow: 'hidden',
                        }}
                        src={getAssetsIconMap()?.[name] ?? unknownIcon}
                        alt=""
                      />
                    </Col>
                    <Col>{name}:</Col>
                    <Col>
                      <div style={{ color: '#C4C4DF' }}>
                        {parseFloat(formatUnits(apr)).toFixed(2)}% APR (
                        {parseFloat(APY + '').toFixed(2)}% APY)
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <div key={tokenAddr}>
                    <Spin indicator={antSmallIcon} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div>
        <div>
          <div>
            <b>Total: </b>
            <span style={{ color: '#C4C4DF' }}>
              {parseFloat(totalApr).toFixed(2)}% APR ({vault.totalApy}% APY)
            </span>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export const APRView: React.FC<APRViewProps> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { vault, reverse, hideControls, networkName } = props
  const { buyBackRatio, underlyingVaults, rewardsApr, ppfsApr, decimals } = vault

  let isAutocompond = buyBackRatio === '100'

  let autocompoundValue = null
  const swapFeesApr = parseFloat(vault.swapFeesAprDaily)
  const { networkManager } = useStores()
  const isTablet880 = useMediaQuery({ query: '(max-width: 880px)' })
  const isTablet1199 = useMediaQuery({ query: '(max-width: 1199px)' })

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  let apr = calcApr(rewardsApr, ppfsApr, decimals).toString()

  autocompoundValue = 100 - Number(buyBackRatio) / 100

  if (autocompoundValue > 0) {
    isAutocompond = true
  }

  const addresses = networkName
    ? networkManager.getAddressesByNetworkName(networkName)
    : networkManager.addresses

  if (
    addresses.excludeAutocompoundAprAddrs
      .map((el: string) => el.toLowerCase())
      .includes(vault?.addr?.toLowerCase())
  ) {
    isAutocompond = false
  }

  underlyingVaults?.forEach((vault: any) => {
    if (vault === null || vault?.ppfsApr === null) {
      return
    }

    const { ppfsApr } = vault

    const underlingApr =
      props.vault.addr.toLowerCase() ===
      addressesMap.aliases.matic.config.addresses.vaults.dxTETU.toLowerCase()
        ? ppfsApr
        : BigNumber.from(ppfsApr).div(2).toString()

    apr = calcAmount([apr, underlingApr])
  })

  if (
    addresses.vaultsWithLabel_new
      .map((el: string) => el.toLowerCase())
      .includes(vault?.addr?.toLowerCase())
  ) {
    return (
      <span
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Amount
          showIcon={false}
          canCopy={false}
          placement="top"
          formated
          fontSize={14}
          style={{
            fontFamily: 'Source Sans Pro',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '24px',
            color: '#fff',
            display: 'inline-block',
          }}
          tooltipInner={
            <div>
              At the moment, the theoretical APY is{' '}
              {
                <Row
                  align="middle"
                  className=""
                  style={{
                    paddingLeft: isTablet1199 ? 0 : 16,
                    display: 'inline-flex',
                    marginLeft: -14,
                  }}
                >
                  {Number(vault.totalApy) > 1_000_000_000 ? (
                    <span
                      style={{ fontSize: 28, lineHeight: '16px', marginRight: 4, marginTop: -4 }}
                    >
                      ∞
                    </span>
                  ) : (
                    vault.totalApy
                  )}
                  %<span style={{ marginLeft: 6 }}></span>
                  {isAutocompond && (
                    <span style={{ marginLeft: 4 }}>
                      <RedoOutlined />
                    </span>
                  )}
                </Row>
              }
              . It will take some time to adjust, so this value may change a lot in the near future.
            </div>
          }
        >
          <Row align="middle" className="" style={{ paddingLeft: isTablet1199 ? 0 : 16 }}>
            New
          </Row>
        </Amount>
      </span>
    )
  }

  return (
    <>
      <span
        onClick={(e) => {
          e.stopPropagation()
          showModal()
        }}
      >
        <Amount
          showIcon={false}
          canCopy={false}
          placement="top"
          formated
          fontSize={14}
          style={{
            fontFamily: 'Source Sans Pro',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '24px',
            color: '#fff',
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
          // костыль, если понадобиться поповер, поправить tooltip
          tooltipInner={networkName ? null : <APRTooltipInner vault={vault} />}
        >
          <Row
            align="middle"
            className=""
            style={{ paddingLeft: isTablet1199 ? 0 : 16 }}
            wrap={false}
          >
            {!hideControls && !reverse && (
              <>
                <span style={{ marginRight: 10, marginTop: 2 }}>
                  <CalculatorOutlined style={{ color: '#7F8FA4' }} />
                </span>
                {isAutocompond && (
                  <span style={{ marginRight: 10, marginTop: 2 }}>
                    <RedoOutlined style={{ color: '#7F8FA4' }} />
                  </span>
                )}
              </>
            )}
            {Number(vault.totalApy) > 1_000_000_000_000 ? (
              <span style={{ fontSize: 28, lineHeight: '16px', marginRight: 4, marginTop: -4 }}>
                ∞
              </span>
            ) : (
              millifyValue(vault.totalApy, true)
            )}
            %
            {!hideControls && reverse && (
              <>
                <span style={{ marginLeft: 10, marginTop: 2 }}>
                  <CalculatorOutlined style={{ color: '#7F8FA4' }} />
                </span>
                {isAutocompond && (
                  <span style={{ marginLeft: 10, marginTop: 2 }}>
                    <RedoOutlined style={{ color: '#7F8FA4' }} />
                  </span>
                )}
              </>
            )}
          </Row>
          <Row
            align="middle"
            className=""
            style={{ paddingLeft: isTablet1199 ? 0 : 16 }}
            wrap={false}
            hidden={!vault.balancerBoost}
          >
            <div>🔥 x{vault.balancerBoost}</div>
          </Row>
        </Amount>
      </span>
      {/* // костыль, если понадобиться модалка, поправить tooltip */}
      {networkName ? null : (
        <Modal
          title={
            <VaultRow
              className="apr-detailed"
              assets={vault.assets}
              platform={vault.platform}
              small
              address={vault.addr}
              deactivated={!vault.active}
              networkName={networkName}
            />
          }
          width={550}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          // @ts-ignore
          header={null}
          className="apr-detailed-modal"
        >
          <AprDetailedView vault={vault} />
        </Modal>
      )}
    </>
  )
}
