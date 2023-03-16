import React, { useRef, useEffect } from 'react'
import { useStores } from '../../../../../../stores/hooks'
import {
  compareAmount,
  formatAmountUsdc,
  formatAmout,
  formatInt,
  formatToString,
  formatUnit,
  validateInput,
} from '../../utils'
import { formatUnits } from 'ethers/lib/utils'
import { Button, Col, Input, Row, Slider, Tabs, Typography } from 'antd'
import { ZapSelectToken } from '../ZapSelectToken'
import WarningIcon from '../../../../../../static/warning.svg'
import { observer } from 'mobx-react'
import { Loader } from '../../../../../../components/Loader'
import { retryFn } from '../DepositAndWithdrawTabs'
import { formatShareName } from '../../../../../../utils/format'
import { ZapSwitch } from '../ZapSwitch'
import { Slippage } from '../Slippage/Slippage'
import Icon from '@ant-design/icons'
import { ReactComponent as ExitSvg } from '../../../../../../static/wallet.svg'
import './styles.css'

export type ZapDepositAndWithdrawTabsProps = {
  tab: 'deposit' | 'withdraw'
  setTab(value: string): void
  isShowZap: boolean
}

export const ZapDepositAndWithdrawTabs: React.FC<ZapDepositAndWithdrawTabsProps> = observer(
  (props) => {
    const { tab, setTab, isShowZap } = props

    const $depositRef = useRef(null)
    const $withdrawRef = useRef(null)
    const $inputRef = useRef(null)
    const $inputRef2 = useRef(null)

    const {
      userInfoOfVaultStore,
      vaultDataPageStore,
      vaultOperationPageStore,
      namesManagerStore,
      zapChainStore,
      networkManager,
      metaMaskStore,
    } = useStores()

    const {
      isApprovedDeposit,
      isCheckingApprove,
      isApprovedWithdraw,
      isCheckingApproveWithdraw,
      isShowLoader,
      isFetchingDeposit,
      isFetchingWithdraw,
      isFetchingWithdrawAllAndClaim,
      isPendingApproveDeposit,
      isPendingApproveWithdraw,
      isPendingDeposit,
      isPendingWithdraw,
      isPendingWithdrawAndClaim,
      depositValue,
      withdrawValue,
    } = zapChainStore

    const vault = vaultDataPageStore.data
    const isLoadingPage = vaultDataPageStore.isLoading
    const userInfo = userInfoOfVaultStore.value

    const handleChangeDeposit = (value: any) => {
      const islimitExceeded = compareAmount(
        value,
        formatUnits(zapChainStore.balanceOfTokenIn, zapChainStore.decimalsOfTokenIn),
      )
      const deposit = islimitExceeded
        ? formatUnits(zapChainStore.balanceOfTokenIn, zapChainStore.decimalsOfTokenIn)
        : value

      if (islimitExceeded) {
        retryFn(() => {
          // @ts-ignore
          $depositRef.current.value = deposit
          // @ts-ignore
          $inputRef.current.focus()
        })
      }
      zapChainStore.setDepositValue(value)
    }

    const handleClickInputTotalBalance = () => {
      if (isApprovedDeposit) {
        zapChainStore.setDepositValue(
          formatUnits(zapChainStore.balanceOfTokenIn, zapChainStore.decimalsOfTokenIn),
        )
      }
    }

    const handleChangeWithdraw = (value: any) => {
      const depositedShare = formatAmout(userInfo.depositedShare)
      const islimitExceeded = value > depositedShare
      const withdraw = islimitExceeded ? depositedShare : value

      if (islimitExceeded) {
        retryFn(() => {
          // @ts-ignore
          $withdrawRef.current.value = withdraw
          // @ts-ignore
          $inputRef2.current.focus()
        })
      }
      zapChainStore.setWithdrawValue(withdraw)
    }

    const handleClickInputTotalWithdraw = () => {
      // @ts-ignore
      zapChainStore.setWithdrawValue(formatUnits(userInfo.depositedShare))
    }

    const handleClickDeposit = () => zapChainStore.deposit()
    const handleClickApprove = () => zapChainStore.approve()
    const handleClickApproveWithdraw = () => zapChainStore.approveWithdraw()
    const handleClickWithdraw = () => zapChainStore.withdraw()

    const handleClickWithdrawAllAndClaim = () => vaultOperationPageStore.withdrawAllAndClaim()

    const ConnectWallet = (
      <div style={{ paddingTop: 30, fontSize: 18 }}>
        <Row justify="center">Connect wallet</Row>
      </div>
    )

    useEffect(() => {
      zapChainStore.fetchData()
    }, [
      metaMaskStore.walletAddress,
      zapChainStore.transactionStorage.data,
      networkManager.networkId,
    ])

    useEffect(() => {
      zapChainStore.checkShowLoaders()
    }, [
      isShowLoader,
      zapChainStore.transactionStorage.data,
      isCheckingApprove,
      networkManager.networkId,
    ])

    useEffect(() => {
      zapChainStore.checkPendingTransactions()
    }, [zapChainStore.pendingTranscations, vault, networkManager.networkId])

    if (
      vault === null ||
      userInfo === null ||
      zapChainStore.isShowLoader ||
      zapChainStore.balanceOfTokenIn === null
    ) {
      return <Loader size={40} />
    }

    return (
      // @ts-ignore
      <Tabs type="card" activeKey={tab} onChange={setTab} size="large" id="13">
        <Tabs.TabPane tab="Deposit" key="deposit">
          {vaultDataPageStore.isConnectedWallet ? (
            <>
              {isShowZap && <ZapSwitch />}

              <input
                className="hidden-input"
                // @ts-ignore
                ref={(ref) => ($inputRef.current = ref)}
              />

              {!isApprovedDeposit ? (
                <div className="input-with-amount">
                  <Input
                    className="zap-select-wrapper-input"
                    size="large"
                    // @ts-ignore
                    ref={(ref) => ($depositRef.current = ref)}
                    style={{
                      width: '100%',
                      marginBottom: 24,
                    }}
                    type="text"
                    disabled={!isApprovedDeposit}
                    value={depositValue}
                    onChange={(e) => {
                      const {
                        target: { value },
                      } = e

                      const formated =
                        formatToString(validateInput(value)) === 'NaN'
                          ? value
                          : formatToString(validateInput(value))
                      handleChangeDeposit(formated)
                    }}
                  />
                </div>
              ) : (
                <>
                  {/* <Slider
                    min={0}
                    max={
                      userInfo &&
                      parseFloat(
                        formatUnits(
                          zapChainStore.balanceOfTokenIn,
                          zapChainStore.decimalsOfTokenIn,
                        ),
                      )
                    }
                    onChange={(value) => {
                      const balance = parseFloat(
                        formatUnits(
                          zapChainStore.balanceOfTokenIn!,
                          zapChainStore.decimalsOfTokenIn!,
                        ),
                      )
                      //@ts-ignore
                      const step = (value / balance) * 100
                      if (step >= 99) {
                        handleClickInputTotalBalance()
                      } else {
                        zapChainStore.setDepositValue(value)
                      }
                    }}
                    value={depositValue}
                    disabled={!isApprovedDeposit}
                    step={
                      userInfo &&
                      // @ts-ignore
                      parseFloat(
                        formatUnits(
                          zapChainStore.balanceOfTokenIn,
                          zapChainStore.decimalsOfTokenIn,
                        ),
                      ) / 100
                    }
                    style={{
                      marginBottom: 32,
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                  /> */}
                  <div className="zap-select-wrapper">
                    <Row justify="space-between">
                      <div className="label">Token for zapping:</div>
                      <Typography.Text className="input-label zap-input-balance">
                        <Row gutter={4} align="middle">
                          <Col>
                            <Icon component={ExitSvg} style={{ color: '#7F8FA4', fontSize: 10 }} />
                          </Col>
                          <Col>
                            <b className={isApprovedDeposit ? '' : ''}>
                              {userInfo && (
                                <>
                                  {formatUnits(
                                    zapChainStore.balanceOfTokenIn,
                                    zapChainStore.decimalsOfTokenIn,
                                  )}
                                  {' ' +
                                    namesManagerStore.getAssetName(zapChainStore.tokenIn) +
                                    ' '}
                                  {/*($*/}
                                  {/*{formatAmountUsdc(userInfo.underlyingBalanceUsdc)})*/}
                                </>
                              )}
                            </b>
                          </Col>
                          <Col>
                            <span
                              onClick={handleClickInputTotalBalance}
                              className={`label-max ${
                                !isApprovedDeposit ? 'label-max-disabled' : ''
                              }`}
                            >
                              MAX
                            </span>
                          </Col>
                        </Row>
                      </Typography.Text>
                    </Row>

                    <div style={{ position: 'relative' }}>
                      <div className="zap-wrapper main-page">
                        <ZapSelectToken />
                      </div>

                      <Input
                        className="zap-select-wrapper-input"
                        size="large"
                        // @ts-ignore
                        ref={(ref) => ($depositRef.current = ref)}
                        style={{
                          width: '100%',
                          marginBottom: 24,
                        }}
                        type="text"
                        disabled={!isApprovedDeposit}
                        value={depositValue}
                        onChange={(e) => {
                          const {
                            target: { value },
                          } = e

                          const formated =
                            formatToString(validateInput(value)) === 'NaN'
                              ? value
                              : formatToString(validateInput(value))
                          handleChangeDeposit(formated)
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {!isApprovedDeposit ? (
                <Row justify="center">
                  <Button
                    shape="round"
                    style={{ minWidth: 167 }}
                    onClick={handleClickApprove}
                    loading={isPendingApproveDeposit || isCheckingApprove}
                    className="btn-approve"
                    type="primary"
                  >
                    <strong>Approve</strong>
                  </Button>
                </Row>
              ) : (
                <Row justify="center">
                  <Button
                    shape="round"
                    onClick={handleClickDeposit}
                    loading={isPendingDeposit || isFetchingDeposit}
                    disabled={
                      vault?.active === false ||
                      parseFloat(
                        formatUnits(
                          zapChainStore.balanceOfTokenIn,
                          zapChainStore.decimalsOfTokenIn,
                        ),
                      ) == 0
                    }
                    className="btn-deposit"
                    type="primary"
                  >
                    <strong>Deposit</strong>
                  </Button>
                </Row>
              )}

              {isApprovedDeposit && (
                <div className="slippage-wrapper">
                  <Slippage />
                </div>
              )}
            </>
          ) : (
            ConnectWallet
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Withdraw" key="withdraw">
          {vaultDataPageStore.isConnectedWallet ? (
            <>
              {isShowZap && <ZapSwitch />}

              {/* <Typography.Text className="input-label">
                Share:{' '}
                <b className="link-hover" onClick={handleClickInputTotalWithdraw}>
                  {userInfo && (
                    <>
                      {formatAmout(userInfo.depositedShare)}
                      {' ' + formatShareName(namesManagerStore.getAssetName(vault?.addr)) + ' '}
                      ($
                      {formatAmountUsdc(userInfo.depositedUnderlyingUsdc ?? 0)})
                    </>
                  )}
                </b>
              </Typography.Text> */}
              <input
                className="hidden-input"
                // @ts-ignore
                ref={(ref) => ($inputRef2.current = ref)}
              />
              {!isApprovedWithdraw ? (
                <>
                  {/* <div
                    style={{
                      height: 166,
                      fontSize: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      fontWeight: 500,
                      paddingBottom: 30,
                    }}
                  >
                    <img
                      src={WarningIcon}
                      alt=""
                      style={{ width: 20, height: 20, marginRight: 10 }}
                    />{' '}
                    Please, approve the withdraw
                  </div> */}
                  <div className="input-with-amount">
                    <Input
                      className="zap-select-wrapper-input"
                      size="large"
                      type="text"
                      disabled={!isApprovedDeposit}
                      // @ts-ignore
                      ref={(ref) => ($withdrawRef.current = ref)}
                      style={{ marginBottom: 24, width: '100%' }}
                      value={withdrawValue}
                      onChange={(e) => {
                        const {
                          target: { value },
                        } = e
                        const formated =
                          formatToString(validateInput(value)) === 'NaN'
                            ? value
                            : formatToString(validateInput(value))
                        handleChangeWithdraw(formated)
                      }}
                    />
                  </div>

                  <Row justify="center">
                    <Button
                      shape="round"
                      style={{ minWidth: 167 }}
                      onClick={handleClickApproveWithdraw}
                      loading={isPendingApproveWithdraw || isCheckingApproveWithdraw}
                      className="btn-approve"
                      type="primary"
                    >
                      <strong>Approve</strong>
                    </Button>
                  </Row>
                </>
              ) : (
                <>
                  <div className="zap-select-wrapper">
                    <Row justify="space-between">
                      <div className="label">Token for zapping:</div>
                      <Typography.Text className="input-label zap-input-balance">
                        <Row gutter={4} align="middle">
                          <Col>
                            <Icon component={ExitSvg} style={{ color: '#7F8FA4', fontSize: 10 }} />
                          </Col>
                          <Col>
                            <b className={isApprovedDeposit ? '' : ''}>
                              {userInfo && (
                                <>
                                  {formatAmout(userInfo.depositedShare)}
                                  {' ' +
                                    formatShareName(namesManagerStore.getAssetName(vault?.addr)) +
                                    ' '}
                                  ($
                                  {formatAmountUsdc(userInfo.depositedUnderlyingUsdc ?? 0)})
                                </>
                              )}
                            </b>
                          </Col>
                          <Col>
                            <span
                              onClick={handleClickInputTotalWithdraw}
                              className={`label-max ${
                                !isApprovedDeposit ? 'label-max-disabled' : ''
                              }`}
                            >
                              MAX
                            </span>
                          </Col>
                        </Row>
                      </Typography.Text>
                    </Row>

                    <div style={{ position: 'relative' }}>
                      <div className="zap-wrapper main-page">
                        <ZapSelectToken />
                      </div>

                      <Input
                        className="zap-select-wrapper-input"
                        size="large"
                        type="text"
                        disabled={!isApprovedDeposit}
                        // @ts-ignore
                        ref={(ref) => ($withdrawRef.current = ref)}
                        style={{ marginBottom: 24, width: '100%' }}
                        value={withdrawValue}
                        onChange={(e) => {
                          const {
                            target: { value },
                          } = e
                          const formated =
                            formatToString(validateInput(value)) === 'NaN'
                              ? value
                              : formatToString(validateInput(value))
                          handleChangeWithdraw(formated)
                        }}
                      />
                    </div>
                  </div>
                  {/* <Slider
                    min={0}
                    max={userInfo && formatUnit(userInfo.depositedShare)}
                    step={userInfo && formatUnit(userInfo.depositedShare) / 100}
                    onChange={(value) => {
                      const step = (value / formatUnit(userInfo.depositedShare)) * 100
                      if (step >= 99) {
                        handleClickInputTotalWithdraw()
                      } else {
                        zapChainStore.setWithdrawValue(formatInt(value))
                      }
                    }}
                    value={withdrawValue}
                    style={{
                      marginBottom: 32,
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                  /> */}

                  <Row justify="center" gutter={[20, 20]}>
                    <Col span={24}>
                      <Button
                        shape="round"
                        loading={isPendingWithdraw || isFetchingWithdraw}
                        onClick={handleClickWithdraw}
                        disabled={userInfo && formatUnit(userInfo.depositedShare) === 0}
                        className="btn-withdraw"
                        type="primary"
                      >
                        <strong>Withdraw</strong>
                      </Button>
                    </Col>
                  </Row>

                  <div className="slippage-wrapper">
                    <Slippage />
                  </div>
                </>
              )}
            </>
          ) : (
            ConnectWallet
          )}
        </Tabs.TabPane>
      </Tabs>
    )
  },
)
