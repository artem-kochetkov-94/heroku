import React, { useRef, useEffect, useState } from 'react'
import { useStores } from '../../../../../../stores/hooks'
import {
  compareAmount,
  formatAmount,
  formatAmout,
  formatToString,
  formatUnit,
  validateInput,
} from '../../utils'
import { formatUnits } from 'ethers/lib/utils'
import { Button, Col, Input, Row, Tabs, Typography, Popover } from 'antd'
import { observer } from 'mobx-react'
import { Loader } from '../../../../../../components/Loader'
import { retryFn } from '../DepositAndWithdrawTabs'
import { formatShareName } from '../../../../../../utils'
import Icon from '@ant-design/icons'
import { ReactComponent as ExitSvg } from '../../../../../../static/wallet.svg'
import './styles.css'
import { ZapV2SelectToken } from '../ZapV2SelectToken'
import { ZapV2Slippage } from '../ZapV2Slippage/ZapV2Slippage'
import { Icon as PriceIcon } from '../../../../../../components/ui-kit'
import { ZapV2Switch } from '../ZapV2Switch'

export type ZapV2DepositAndWithdrawTabsProps = {
  vaultSymbol: any
  vaultIcon: any
  tab: 'deposit' | 'withdraw'
  setTab(value: string): void
  isShowZap: boolean
}

export const ZapV2DepositAndWithdrawTabs: React.FC<ZapV2DepositAndWithdrawTabsProps> = observer(
  (props) => {
    const { tab, setTab, vaultSymbol, vaultIcon, isShowZap } = props

    const $depositRef = useRef(null)
    const $withdrawRef = useRef(null)
    const $inputRef = useRef(null)
    const $inputRef2 = useRef(null)

    const {
      userInfoOfVaultStore,
      vaultDataPageStore,
      vaultOperationPageStore,
      // namesManagerStore,
      zapV2ChainStore,
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
      isPendingApproveDeposit,
      isPendingApproveWithdraw,
      isPendingDeposit,
      isPendingWithdraw,
      depositValue,
      withdrawValue,
      quoteDepositShare,
      quoteExitAmount,
      decimalsOfTokenIn,
      priceimpactDeposit,
      priceimpactExit,
    } = zapV2ChainStore

    useEffect(() => {
      zapV2ChainStore.clearBuildedTx()
    }, [tab])

    // console.log('quoteDepositShare', quoteDepositShare)

    const vault = vaultDataPageStore.data
    const isLoadingPage = vaultDataPageStore.isLoading
    const userInfo = userInfoOfVaultStore.value
    // console.log("userinfo", userInfo)
    // console.log('vault', vault)
    const handleChangeDeposit = (value: any) => {
      const islimitExceeded = compareAmount(
        value,
        formatUnits(zapV2ChainStore.balanceOfTokenIn, zapV2ChainStore.decimalsOfTokenIn),
      )
      const deposit = islimitExceeded
        ? formatUnits(zapV2ChainStore.balanceOfTokenIn, zapV2ChainStore.decimalsOfTokenIn)
        : value

      if (islimitExceeded) {
        retryFn(() => {
          // @ts-ignore
          $depositRef.current.value = deposit
          // @ts-ignore
          $inputRef.current.focus()
        })
      }
      zapV2ChainStore.setDepositValueAndQuote(value)
    }

    const handleClickInputTotalBalance = () => {
      // if (isApprovedDeposit) {
      zapV2ChainStore.setDepositValueAndQuote(
        formatUnits(zapV2ChainStore.balanceOfTokenIn, zapV2ChainStore.decimalsOfTokenIn),
      )
      // }
    }

    const handleChangeWithdraw = (value: any) => {
      const depositedShare = formatAmount(userInfo.depositedShare, vault?.decimals)
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
      zapV2ChainStore.setWithdrawValueAndQuote(withdraw)
    }

    const handleClickInputTotalWithdraw = () => {
      // @ts-ignore
      zapV2ChainStore.setWithdrawValueAndQuote(formatUnits(userInfo.depositedShare))
    }

    const handleClickDeposit = () => zapV2ChainStore.deposit()
    const handleClickApprove = () => zapV2ChainStore.approve()
    const handleClickApproveWithdraw = () => zapV2ChainStore.approveWithdraw()
    const handleClickWithdraw = () => zapV2ChainStore.withdraw()

    const ConnectWallet = (
      <div style={{ paddingTop: 30, fontSize: 18 }}>
        <Row justify="center">Connect wallet</Row>
      </div>
    )

    useEffect(() => {
      zapV2ChainStore.fetchData()
    }, [
      metaMaskStore.walletAddress,
      zapV2ChainStore.transactionStorage.data,
      networkManager.networkId,
    ])

    useEffect(() => {
      zapV2ChainStore.checkShowLoaders()
    }, [
      isShowLoader,
      zapV2ChainStore.transactionStorage.data,
      isCheckingApprove,
      networkManager.networkId,
    ])

    useEffect(() => {
      zapV2ChainStore.checkPendingTransactions()
    }, [zapV2ChainStore.pendingTranscations, vault, networkManager.networkId])

    const [open, setOpen] = useState(false)

    const hide = () => {
      setOpen(false)
    }

    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen)
    }

    if (
      vault === null ||
      userInfo === null ||
      // zapV2ChainStore.isShowLoader ||
      zapV2ChainStore.balanceOfTokenIn === null
    ) {
      return <Loader size={40} />
    }

    return (
      // @ts-ignore
      <Tabs type="card" activeKey={tab} onChange={setTab} size="large" id="13">
        <Tabs.TabPane tab="Deposit" key="deposit">
          {vaultDataPageStore.isConnectedWallet ? (
            <>
              {isShowZap && <ZapV2Switch />}
              <input
                className="hidden-input"
                // @ts-ignore
                ref={(ref) => ($inputRef.current = ref)}
              />

              <>
                <div className="zap-v2-select-wrapper">
                  <Row justify="space-between">
                    <div className="label"></div>
                    <Typography.Text className="input-label zap-input-balance">
                      <Row gutter={0} align="middle">
                        <Col>
                          <Icon
                            component={ExitSvg}
                            style={{ color: '#7F8FA4', fontSize: 12, marginRight: 6 }}
                          />
                        </Col>
                        <Col>
                          <b className="balance">
                            {userInfo && (
                              <>
                                {formatUnits(
                                  zapV2ChainStore.balanceOfTokenIn,
                                  zapV2ChainStore.decimalsOfTokenIn,
                                )}
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
                              0 /*!isApprovedDeposit*/ ? 'label-max-disabled' : ''
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
                      <ZapV2SelectToken />
                    </div>

                    <div className="zap-price-of-in">
                      {depositValue
                        ? '~$ ' + zapV2ChainStore.getTokenInAmountUsd(depositValue)
                        : ''}
                    </div>

                    <Input
                      className="zap-select-wrapper-input"
                      size="large"
                      // @ts-ignore
                      ref={(ref) => ($depositRef.current = ref)}
                      style={{
                        width: '100%',
                        marginBottom: 16,
                      }}
                      type="text"
                      // disabled={!isApprovedDeposit}
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

              <div className="zap-direction">
                <svg
                  width="8"
                  height="10"
                  viewBox="0 0 8 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.00049 0.399902C3.69299 0.399902 3.44983 0.6573 3.44983 0.967143V7.65702L1.8417 5.98974C1.62638 5.7665 1.27573 5.7665 1.06041 5.98974C0.84705 6.21095 0.847051 6.56815 1.06041 6.78936L3.60975 9.43247C3.82507 9.65571 4.17572 9.65571 4.39103 9.43247L6.94037 6.78936C7.15373 6.56815 7.15373 6.21095 6.94037 5.98974C6.72505 5.7665 6.3744 5.7665 6.15908 5.98974L4.55115 7.65682L4.55115 0.967143C4.55115 0.6573 4.30799 0.399902 4.00049 0.399902Z"
                    fill="#7F8FA4"
                  />
                </svg>
              </div>

              <div className="zap-v2-vault-token-wrapper">
                <Row justify="end">
                  <Typography.Text className="input-label zap-input-balance">
                    <Row gutter={0} align="middle">
                      <Col>
                        <Icon
                          component={ExitSvg}
                          style={{ color: '#7F8FA4', fontSize: 12, marginRight: 6 }}
                        />
                      </Col>
                      <Col>
                        <b className="balance">
                          {userInfo && <>{formatAmout(userInfo.depositedShare)}</>}
                        </b>
                      </Col>
                    </Row>
                  </Typography.Text>
                </Row>

                <div style={{ position: 'relative' }}>
                  <div className="zap-v2-vault-token">
                    {vaultIcon}
                    {/*<img className="token-logo" src={getAssetsIconMap()[vaultSymbol]} alt={vaultSymbol} />*/}
                    <span className="token-caption">{formatShareName(vaultSymbol)}</span>
                  </div>

                  <div className="zap-price-of-out">
                    {quoteDepositShare
                      ? '~$ ' +
                        zapV2ChainStore.getVaultShareAmountUsd(
                          formatAmount(quoteDepositShare, vault.decimals),
                        )
                      : ''}
                  </div>

                  <Input
                    className="zap-output"
                    size="large"
                    type="text"
                    disabled={true}
                    value={
                      parseInt(quoteDepositShare) > 0
                        ? formatAmount(quoteDepositShare, vault.decimals)
                        : ''
                    }
                  />
                </div>
              </div>

              {zapV2ChainStore.isShowLoader ? (
                <Row justify="center">
                  <Loader size={10} padding={8} />
                </Row>
              ) : (
                <Row justify="center">
                  {!isApprovedDeposit ? (
                    <Button
                      shape="round"
                      onClick={handleClickApprove}
                      loading={isPendingApproveDeposit || isCheckingApprove}
                      className="btn-approve"
                      type="primary"
                    >
                      <strong>Approve</strong>
                    </Button>
                  ) : (
                    <Button
                      shape="round"
                      onClick={handleClickDeposit}
                      loading={isPendingDeposit || isFetchingDeposit}
                      disabled={
                        vault?.active === false ||
                        parseFloat(
                          formatUnits(
                            zapV2ChainStore.balanceOfTokenIn,
                            zapV2ChainStore.decimalsOfTokenIn,
                          ),
                        ) == 0
                      }
                      className="btn-deposit"
                      type="primary"
                    >
                      <strong>Deposit</strong>
                    </Button>
                  )}
                </Row>
              )}

              <Row justify="space-between">
                <div className="slippage-wrapper">
                  <ZapV2Slippage />
                </div>

                {priceimpactDeposit && (
                  <div className="price-impact-wrapper">
                    <span className="price-impact-title">Price Impact</span>
                    <Popover
                      content={
                        <div onClick={hide}>
                          <p
                            style={{
                              marginBottom: 0,
                              fontFamily: 'Source Sans Pro',
                              fontWeight: 500,
                              fontSize: 14,
                              lineHeight: '20px',
                              color: '#131313',
                            }}
                          >
                            During deposit actions, the total price impact on the whole route.
                          </p>
                        </div>
                      }
                      trigger="click"
                      open={open}
                      onOpenChange={handleOpenChange}
                    >
                      <div>
                        <PriceIcon
                          // className="slippage-icon"
                          name="info"
                          width={13}
                          height={13}
                          style={{ marginBottom: 9, marginRight: 12 }}
                        />
                      </div>
                    </Popover>
                    <span
                      className={`price-impact-value ${
                        parseFloat(priceimpactDeposit) < -10 ? 'price-impact-value-bad' : ''
                      } ${parseFloat(priceimpactDeposit) < -2.5 ? 'price-impact-value-warn' : ''}`}
                    >
                      {Math.round(priceimpactDeposit * 100) / 100}%
                    </span>
                  </div>
                )}
              </Row>

              <div className="deposit-text-container">
                <div className="bottom-text-splitter" />
                <span className="deposit-text">{zapV2ChainStore.getZapV2Descriptions()[0]}</span>
              </div>
            </>
          ) : (
            ConnectWallet
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Exit" key="withdraw">
          {vaultDataPageStore.isConnectedWallet ? (
            <>
              {isShowZap && <ZapV2Switch />}
              <input
                className="hidden-input"
                // @ts-ignore
                ref={(ref) => ($inputRef2.current = ref)}
              />
              <>
                <div className="zap-v2-select-wrapper">
                  <div className="zap-v2-vault-token-wrapper">
                    <Row justify="end">
                      <Typography.Text className="input-label zap-input-balance">
                        <Row gutter={0} align="middle">
                          <Col>
                            <Icon
                              component={ExitSvg}
                              style={{ color: '#7F8FA4', fontSize: 12, marginRight: 6 }}
                            />
                          </Col>
                          <Col>
                            <b className="balance">
                              {userInfo && <>{formatAmout(userInfo.depositedShare)}</>}
                            </b>
                          </Col>
                          <Col>
                            <span onClick={handleClickInputTotalWithdraw} className="label-max">
                              MAX
                            </span>
                          </Col>
                        </Row>
                      </Typography.Text>
                    </Row>

                    <div style={{ position: 'relative' }}>
                      <div className="zap-v2-vault-token for-withdraw">
                        {vaultIcon}
                        {/*<img className="token-logo" src={getAssetsIconMap()[vaultSymbol]} alt={vaultSymbol} />*/}
                        <span className="token-caption">{formatShareName(vaultSymbol)}</span>
                      </div>

                      <div className="zap-price-of-in">
                        {withdrawValue
                          ? '~$ ' + zapV2ChainStore.getVaultShareAmountUsd(withdrawValue)
                          : ''}
                      </div>

                      <Input
                        className="zap-select-wrapper-input"
                        size="large"
                        type="text"
                        disabled={!isApprovedWithdraw}
                        // @ts-ignore
                        ref={(ref) => ($withdrawRef.current = ref)}
                        style={{ marginTop: 2 }}
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

                  <div className="zap-direction">
                    <svg
                      width="8"
                      height="10"
                      viewBox="0 0 8 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.00049 0.399902C3.69299 0.399902 3.44983 0.6573 3.44983 0.967143V7.65702L1.8417 5.98974C1.62638 5.7665 1.27573 5.7665 1.06041 5.98974C0.84705 6.21095 0.847051 6.56815 1.06041 6.78936L3.60975 9.43247C3.82507 9.65571 4.17572 9.65571 4.39103 9.43247L6.94037 6.78936C7.15373 6.56815 7.15373 6.21095 6.94037 5.98974C6.72505 5.7665 6.3744 5.7665 6.15908 5.98974L4.55115 7.65682L4.55115 0.967143C4.55115 0.6573 4.30799 0.399902 4.00049 0.399902Z"
                        fill="#7F8FA4"
                      />
                    </svg>
                  </div>

                  <div className="zap-v2-vault-token-wrapper" style={{ position: 'relative' }}>
                    <Row justify="space-between">
                      <div className="label"></div>
                      <Typography.Text className="input-label zap-input-balance">
                        <Row gutter={0} align="middle">
                          <Col>
                            <Icon
                              component={ExitSvg}
                              style={{ color: '#7F8FA4', fontSize: 12, marginRight: 6 }}
                            />
                          </Col>
                          <Col>
                            <b className="balance">
                              {userInfo && (
                                <>
                                  {formatUnits(zapV2ChainStore.balanceOfTokenIn, decimalsOfTokenIn)}
                                  {/*($*/}
                                  {/*{formatAmountUsdc(userInfo.underlyingBalanceUsdc)})*/}
                                </>
                              )}
                            </b>
                          </Col>
                        </Row>
                      </Typography.Text>
                    </Row>

                    <div className="zap-output-tokenin-wrapper">
                      <ZapV2SelectToken />
                    </div>

                    <div className="zap-price-of-out zap-price-of-out-withdraw">
                      {quoteExitAmount
                        ? '~$ ' +
                          zapV2ChainStore.getTokenInAmountUsd(
                            parseFloat(
                              parseFloat(formatUnits(quoteExitAmount, decimalsOfTokenIn)).toFixed(
                                9,
                              ),
                            ),
                          )
                        : ''}
                    </div>

                    <Input
                      className="zap-output"
                      size="large"
                      // @ts-ignore
                      ref={(ref) => ($withdrawRef.current = ref)}
                      style={{
                        width: '100%',
                        marginBottom: 24,
                      }}
                      type="text"
                      disabled={true}
                      value={
                        parseInt(quoteExitAmount) > 0
                          ? parseFloat(
                              parseFloat(formatUnits(quoteExitAmount, decimalsOfTokenIn)).toFixed(
                                9,
                              ),
                            )
                          : ''
                      }
                    />
                  </div>
                </div>

                {zapV2ChainStore.isShowLoader ? (
                  <Row justify="center">
                    <Loader size={10} padding={8} />
                  </Row>
                ) : (
                  <Row justify="center">
                    {isApprovedWithdraw ? (
                      <Button
                        shape="round"
                        loading={isPendingWithdraw || isFetchingWithdraw}
                        onClick={handleClickWithdraw}
                        disabled={userInfo && formatUnit(userInfo.depositedShare) === 0}
                        className="btn-withdraw"
                        type="primary"
                      >
                        <strong>Exit</strong>
                      </Button>
                    ) : (
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
                    )}
                  </Row>
                )}

                <Row justify="space-between">
                  <div className="slippage-wrapper">
                    <ZapV2Slippage />
                  </div>
                  {priceimpactExit && (
                    <div className="price-impact-wrapper">
                      <span className="price-impact-title">Price Impact</span>
                      <span
                        className={`price-impact-value ${
                          parseFloat(priceimpactExit) < -10 ? 'price-impact-value-bad' : ''
                        } ${parseFloat(priceimpactExit) < -2.5 ? 'price-impact-value-warn' : ''}`}
                      >
                        {Math.round(priceimpactExit * 100) / 100}%
                      </span>
                    </div>
                  )}
                </Row>

                <div className="deposit-text-container">
                  <div className="bottom-text-splitter" />
                  <span className="deposit-text">{zapV2ChainStore.getZapV2Descriptions()[1]}</span>
                </div>
              </>
            </>
          ) : (
            ConnectWallet
          )}
        </Tabs.TabPane>
      </Tabs>
    )
  },
)
