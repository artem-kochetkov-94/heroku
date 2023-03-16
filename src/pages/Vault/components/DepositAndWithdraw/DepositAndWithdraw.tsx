import React, { useState, useEffect } from 'react'
import { Col, Row, Spin } from 'antd'
import { observer } from 'mobx-react'
import { useStores } from '../../../../stores/hooks'
import { LoadingOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { ZapRoutes } from './components/ZapRoutes'
import { DepositAndWithdrawTabs } from './components/DepositAndWithdrawTabs'
import { Rewards } from './components/Rewards'
import { AddLiquidity } from './components/AddLiquidity/AddLiquidity'
import { DepositedInfo } from './components/DepositedInfo'
import { WithdrawTimeLine } from './components/WithdrawTimeLine'
import { userInfosStore } from '../../../../stores'
import { formatAmout } from './utils'
import { addressesMap } from '../../../../networks/Addresses'
import { useCheckProtectionMode } from '../hooks'
import { useAaveMaiBalVault } from '../../hooks'
import { LpInfoTetuQi } from '../LpInfo'

import './styles.css'
import { tetuQi } from '../../../TetuQi'
import { tetuMeshVault } from '../../../TetuMesh'
import { LpInfoTetuMesh } from '../LpInfo/LpInfoTetuMesh'
import { tetuBalVault } from '../../../TetuBal'
import { LpInfoTetuBal } from '../LpInfo/LpInfoTetuBal'
import { ZapV2DepositAndWithdrawTabs } from './components/ZapV2DepositAndWithdrawTabs'
import { formatVaultIcon } from '../../../../utils'
import { getAssetsIconMap } from '../../../../static/tokens'
import unknownIcon from '../../../../static/UNKNOWN.png'
import { ZapV2Routes } from './components/ZapV2Routes'

const antIcon = <LoadingOutlined style={{ fontSize: 90 }} spin />

export const DepositAndWithdraw = observer(() => {
  const { address } = useParams<{ address: string }>()
  const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit')

  const {
    metaMaskStore,
    tokenChainStore,
    networkManager,
    vaultDataPageStore,
    vaultOperationPageStore,
    zapV2ChainStore,
    vaultUserLockTSStore,
    userInfoOfVaultStore,
    namesManagerStore,
  } = useStores()

  vaultDataPageStore.vault = address

  const hasProtecktionMode = useCheckProtectionMode(address)
  const { isCheckingApprove, isShowLoader } = vaultOperationPageStore
  const vault = vaultDataPageStore.data
  const aaveMaiBalVaultState = useAaveMaiBalVault(vault)
  const userInfo = userInfoOfVaultStore.value
  const isLoadingPage =
    vaultDataPageStore.isLoading ||
    vaultUserLockTSStore.isFetching ||
    aaveMaiBalVaultState.isFetching

  // console.log(
  //     '-----',
  //     vaultDataPageStore.isLoading,
  //     vaultUserLockTSStore.isFetching,
  //     aaveMaiBalVaultState.isFetching
  // )

  // --------------- effects ---------------
  useEffect(() => {
    if (metaMaskStore.inited && networkManager.inited) {
      vaultDataPageStore.fetchData()
    }
  }, [
    metaMaskStore.inited,
    networkManager.inited,
    metaMaskStore.walletAddress,
    tokenChainStore.transactionStorage.data,
    networkManager.networkId,
  ])

  useEffect(() => {
    vaultOperationPageStore.checkShowLoaders()
  }, [
    isShowLoader,
    tokenChainStore.transactionStorage.data,
    isCheckingApprove,
    networkManager.networkId,
  ])

  useEffect(() => {
    vaultOperationPageStore.checkPendingTransactions()
  }, [tokenChainStore.pendingTranscations, vault, networkManager.networkId])

  const zapV2Method = zapV2ChainStore.getZapV2Method(vault)
  const zapV2Assets = zapV2ChainStore.getZapV2Assets(vault, zapV2Method)
  // console.log('zapV2Method', zapV2Method)
  // console.log('zapV2Assets', zapV2Assets)
  const vaultAssetName = namesManagerStore.getAssetName(vault?.addr)

  const vaultUnderlyingName = namesManagerStore.getAssetName(vault?.underlying)
  const assetsIconMap = getAssetsIconMap()
  const vaultIcon =
    formatVaultIcon(vault?.addr || '', vault?.networkName) || assetsIconMap[vaultUnderlyingName]
  let vaultIcons = []
  if (!vaultIcon && vault?.addr) {
    // console.log(formatVaultIcon(vault?.addr || '', 'matic'))
    vaultIcons = zapV2Assets.map((asset: string) => {
      const name = namesManagerStore.getAssetName(asset) || ''
      return getAssetsIconMap()[name] ?? unknownIcon
    })
  }
  if (Array.isArray(vaultIcon)) {
    vaultIcons = vaultIcon
  }

  useEffect(() => {
    if (vault !== null) {
      if (zapV2Method && zapV2Assets) {
        zapV2ChainStore.init(
          vault.addr,
          zapV2Assets,
          parseInt(vault.decimals),
          zapV2Method,
          vault.underlying,
        )
      }

      if (metaMaskStore.walletAddress) {
        vaultUserLockTSStore.fetch(vault.addr, metaMaskStore.walletAddress)
      }
    }

    return () => {
      zapV2ChainStore.reset()
      vaultUserLockTSStore.reset()
      userInfosStore.update(address)
    }
  }, [vault?.addr, metaMaskStore.walletAddress])

  if (!networkManager.inited) {
    return null
  }

  /*let excludedZap =
    networkManager.addresses.zapExcludeList
      .map((el: string) => el.toLowerCase())
      .includes(vault?.addr.toLowerCase()) || networkManager.networkId === '0x38'*/

  const isShowWithdrawTimeLine =
    userInfo?.depositedShare &&
    !!vaultUserLockTSStore.value &&
    addressesMap.aliases.matic.config.addresses.vaults.dxTETU.toLowerCase() ===
      vault?.addr?.toLowerCase()

  /*const isShowZap =
    vault && !aaveMaiBalVaultState.isAaveMaiBalVault && !excludedZap && !hasProtecktionMode*/

  const isShowZap = !!zapV2Method && zapV2Assets.length > 0

  return (
    <>
      <div style={{ margin: '0 auto' }}>
        <div style={{ position: 'relative' }}>
          {isLoadingPage && (
            <div className="spin loader">
              <Spin indicator={antIcon} />
            </div>
          )}
          <div
            className="wrapper"
            style={{
              // @ts-ignore
              filter: isLoadingPage ? 'blur(8px)' : null,
            }}
          >
            <Row justify="start" gutter={[32, { xs: 12, sm: 20 }]} style={{ height: '100%' }}>
              <Col
                xs={24}
                sm={{ span: 24 }}
                lg={{ span: 10, push: vaultDataPageStore.isConnectedWallet ? 0 : 6 }}
                className="card-1"
              >
                <div>
                  <div className="deposit-and-withdraw-wrapper zap-v2" style={{ minHeight: 80 }}>
                    {zapV2ChainStore.useZapContract ? (
                      // @ts-ignore
                      <ZapV2DepositAndWithdrawTabs
                        vaultIcon={
                          vaultIcon && !Array.isArray(vaultIcon) ? (
                            <span className="icon-group-small">
                              <img
                                // @ts-ignore
                                src={vaultIcon ?? unknownIcon}
                                className={`token-logo`}
                                alt={vaultAssetName}
                              />
                            </span>
                          ) : (
                            <span className="icon-group-2 icon-group-small">
                              {vaultIcons.map((vi: string) => (
                                <img
                                  // @ts-ignore
                                  src={vi}
                                  className={`token-logo-double`}
                                  alt={''}
                                />
                              ))}
                            </span>
                          )
                        }
                        vaultSymbol={vaultAssetName}
                        tab={tab}
                        // @ts-ignore
                        setTab={setTab}
                        isShowZap={isShowZap}
                      />
                    ) : (
                      // @ts-ignore
                      <DepositAndWithdrawTabs
                        tab={tab}
                        // @ts-ignore
                        setTab={setTab}
                        isShowZap={isShowZap}
                      />
                    )}
                  </div>
                </div>
                {zapV2ChainStore.useZapContract && (
                  <ZapV2Routes
                    tab={tab}
                    vault={vault}
                    vaultIcon={
                      vaultIcon && !Array.isArray(vaultIcon) ? (
                        <img
                          // @ts-ignore
                          src={vaultIcon ?? unknownIcon}
                          className="oneinch-wrapper-asset-out-img"
                          alt={vaultAssetName}
                          width="32px"
                        />
                      ) : (
                        <span className="oneinch-wrapper-asset-images">
                          {vaultIcons.map((vi: string) => (
                            <img
                              // @ts-ignore
                              src={vi}
                              className={`token-logo-double`}
                              alt={''}
                              width="32px"
                            />
                          ))}
                        </span>
                      )
                    }
                  />
                )}
                {/*<ZapRoutes operation={tab} />*/}
              </Col>
              {vaultDataPageStore.isConnectedWallet && (
                <Col xs={24} sm={{ span: 24 }} lg={{ span: 14 }} style={{ position: 'relative' }}>
                  <Row gutter={[20, { xs: 12, sm: 24 }]} style={{}}>
                    {vault?.addr?.toLowerCase() === tetuQi.toLowerCase() && (
                      <LpInfoTetuQi vault={vault} />
                    )}
                    {vault?.addr?.toLowerCase() === tetuMeshVault.toLowerCase() && (
                      <LpInfoTetuMesh />
                    )}
                    {vault?.addr?.toLowerCase() === tetuBalVault.toLowerCase() && <LpInfoTetuBal />}

                    {/* <LpInfoTetuQi vault={vault} /> */}
                    <AddLiquidity />
                    <DepositedInfo />
                    {isShowWithdrawTimeLine && (
                      <WithdrawTimeLine
                        deposited={formatAmout(userInfo?.depositedShare)}
                        assets={vault?.assets}
                      />
                    )}
                    <Rewards />
                  </Row>
                </Col>
              )}
            </Row>
          </div>
        </div>
      </div>
    </>
  )
})
