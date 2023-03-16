import React, { useRef, useEffect } from 'react'
import { Button, Col, Input, Popconfirm, Row, Spin, Tabs, Tooltip, Typography } from 'antd'
import {
  compareAmount,
  formatAmountUsdc,
  formatAmout,
  formatToString,
  formatUnit,
  validateInput,
} from '../../utils'
import { useStores } from '../../../../../../stores/hooks'
import { formatUnits } from 'ethers/lib/utils'
import { observer } from 'mobx-react'
import { useForceUpdate } from '../../../../../../hooks'
import { useCheckProtectionMode } from '../../../hooks'
import { useAaveMaiBalVault } from '../../../../hooks'
import { formatDecimals } from './utils'
import { formatShareName } from '../../../../../../utils/format'
import { parseUnits } from '@ethersproject/units/lib.esm'
import { Amount } from '../../../../../../components/Amount/Amount'
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons/lib/icons'
import { ZapV2Switch } from '../ZapV2Switch'
import { ReactComponent as ExitSvg } from '../../../../../../static/wallet.svg'
import Icon from '@ant-design/icons'
import { DepositButton } from './componets/DepositButton'

type DepositAndWithdrawTabsProps = {
  tab: 'deposit' | 'withdraw'
  setTab(value: string): void
  isShowZap: boolean
}

const addressesWithConfirmWithdraw: string[] = [
  // addressesMap.aliases.matic.config.addresses.vaults.dxTETU.toLowerCase(),
]

export const retryFn = (fn: Function, count: number = 0) => {
  const maxRetry = 10
  if (count > maxRetry) {
    return
  }

  try {
    fn()
  } catch (e) {
    console.log('retryFn', e)
    setTimeout(() => {
      retryFn(fn, count + 1)
    }, 50)
  }
}

export const DepositAndWithdrawTabs: React.FC<DepositAndWithdrawTabsProps> = observer((props) => {
  const { tab, setTab, isShowZap } = props

  const forceUpdate = useForceUpdate()

  const $depositRef = useRef(null)
  const $withdrawRef = useRef(null)
  const $inputRef = useRef(null)
  const $inputRef2 = useRef(null)

  const {
    vaultPricePerFullShareStore,
    userInfoOfVaultStore,
    vaultDataPageStore,
    vaultOperationPageStore,
    namesManagerStore,
    networkManager,
  } = useStores()

  const {
    isCheckingApprove,
    isApprovedDeposit,
    isFetchingDeposit,
    isFetchingWithdraw,
    isFetchingWithdrawAllAndClaim,
    isPendingApproveDeposit,
    isPendingDeposit,
    isPendingWithdraw,
    isPendingWithdrawAndClaim,
    depositValue,
    withdrawValue,
  } = vaultOperationPageStore

  const vault = vaultDataPageStore.data
  const userInfo = userInfoOfVaultStore.value

  const hasProtecktionMode = useCheckProtectionMode(vault?.addr)
  const aaveMaiBalVault = useAaveMaiBalVault(vault)

  const handleChangeDeposit = (value: any) => {
    const underlyingBalance = formatUnits(userInfo.underlyingBalance, +vault.decimals)
    let islimitExceeded = compareAmount(value, underlyingBalance)
    let deposit = islimitExceeded ? underlyingBalance : value

    if (aaveMaiBalVault.isAaveMaiBalVault) {
      const { maxDepositUsd } = aaveMaiBalVault.state
      const assetPrice =
        Number(formatUnits(userInfo.underlyingBalanceUsdc)) /
        Number(formatUnits(userInfo.underlyingBalance))
      const depositUsd = assetPrice * Number(deposit)
      const isDepositMoreMaxValue = depositUsd > maxDepositUsd

      if (isDepositMoreMaxValue) {
        deposit = formatDecimals(String(maxDepositUsd / assetPrice))
        retryFn(() => {
          // @ts-ignore
          $depositRef.current.value = deposit
          // @ts-ignore
          $inputRef.current.focus()
        })
      }

      if (maxDepositUsd === 0) {
        deposit = String(maxDepositUsd)
      }
    } else {
      if (islimitExceeded) {
        retryFn(() => {
          // @ts-ignore
          $depositRef.current.value = deposit
          // @ts-ignore
          $inputRef.current.focus()
        })
      }
    }
    vaultOperationPageStore.setDepositValue(deposit)
  }

  const handleClickInputTotalBalance = () => {
    if (isApprovedDeposit) {
      handleChangeDeposit(formatUnits(userInfo.underlyingBalance))
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
    vaultOperationPageStore.setWithdrawValue(withdraw)
  }

  const handleClickInputTotalWithdraw = () => {
    // @ts-ignore
    // user info has already normalized decimals, no need to use vault.decimals
    vaultOperationPageStore.setWithdrawValue(formatUnits(userInfo.depositedShare))
  }

  const handleClickDeposit = () => vaultOperationPageStore.deposit()
  const handleClickApprove = () => vaultOperationPageStore.approve()
  const handleClickWithdraw = () => vaultOperationPageStore.withdraw()
  const handleClickWithdrawAllAndClaim = () => vaultOperationPageStore.withdrawAllAndClaim()

  const ConnectWallet = (
    <div style={{ paddingTop: 30, fontSize: 18 }}>
      <Row justify="center">Connect wallet</Row>
    </div>
  )

  const assetName = namesManagerStore.getAssetName(vault?.underlying)

  if (assetName === null) {
    setTimeout(forceUpdate, 1000)
  }

  const strategySplitterStore = vaultDataPageStore.strategySplitterStore

  const isFetchedWithdrawRequest =
    strategySplitterStore?.maxCheapWithdrawStore?.isFetched && vaultPricePerFullShareStore.isFetched

  const getIsShowWithdrawRequestUI = () => {
    if (isFetchedWithdrawRequest) {
      return null
    }
    const maxCheapWithdraw = getMaxCheapWithdrawByPricePerFullShare()
    if (maxCheapWithdraw === null) {
      return false
    }
    return withdrawValue > maxCheapWithdraw
  }

  const parse = (v: string) => {
    return parseFloat(formatUnits(v))
  }

  const getMaxCheapWithdrawByPricePerFullShare = () => {
    if (
      vaultPricePerFullShareStore.value === null ||
      strategySplitterStore.maxCheapWithdrawStore.value === null
    ) {
      return null
    }
    const maxCheapWithdraw =
      parse(vaultPricePerFullShareStore.value) *
      parse(strategySplitterStore.maxCheapWithdrawStore.value)
    return maxCheapWithdraw
  }

  useEffect(() => {
    if (vault?.addr) {
      vaultPricePerFullShareStore.fetch(vault?.addr)
    }
    return () => {
      vaultPricePerFullShareStore.reset()
    }
  }, [vault?.addr])

  const hiddenWithdraw = networkManager.addresses?.disabledWithdraw
    ?.map((el: any) => el.toLowerCase())
    ?.includes(vault?.addr.toLowerCase())

  return (
    <>
      {/* @ts-ignore*/}
      <Tabs type="card" activeKey={tab} onChange={setTab} size="large" id="13">
        <Tabs.TabPane tab="Deposit" key="deposit">
          {vaultDataPageStore.isConnectedWallet ? (
            <>
              {isShowZap && <ZapV2Switch />}
              <Typography.Text className="input-label">
                <Row gutter={4} align="middle">
                  <Col>
                    <Icon component={ExitSvg} style={{ color: '#7F8FA4', fontSize: 10 }} />
                  </Col>
                  <Col>
                    <b className={isApprovedDeposit ? '' : ''}>
                      {userInfo && (
                        <>
                          {formatAmout(userInfo.underlyingBalance)}
                          {/* {' ' + assetName + ' '} */}
                          {/* ($ */}
                          {/* {formatAmountUsdc(userInfo.underlyingBalanceUsdc)}) */}
                        </>
                      )}
                    </b>
                  </Col>
                  <Col>
                    <span
                      onClick={handleClickInputTotalBalance}
                      className={`label-max ${!isApprovedDeposit ? 'label-max-disabled' : ''}`}
                    >
                      MAX
                    </span>
                  </Col>
                </Row>
              </Typography.Text>

              <input
                className="hidden-input"
                // @ts-ignore
                ref={(ref) => ($inputRef.current = ref)}
              />
              {/* <ZapSelectToken />
              <Slippage /> */}
              {!isApprovedDeposit ? (
                <div className="input-with-amount" style={{ marginBottom: 24 }}>
                  <Input
                    size="large"
                    // @ts-ignore
                    ref={(ref) => ($depositRef.current = ref)}
                    style={{
                      // marginBottom: 24,
                      width: '100%',
                    }}
                    type="text"
                    disabled={true}
                    value={'0'}
                  />
                </div>
              ) : (
                // <div
                //   style={{
                //     height: 166,
                //     fontSize: 18,
                //     display: 'flex',
                //     alignItems: 'center',
                //     justifyContent: 'flex-start',
                //     fontWeight: 500,
                //     paddingBottom: 30,
                //   }}
                // >
                //   <img
                //     src={WarningIcon}
                //     alt=""
                //     style={{ width: 20, height: 20, marginRight: 10 }}
                //   />{' '}
                //   Please, approve the deposit
                // </div>
                <>
                  {/* <Slider
                    min={0}
                    max={userInfo && formatUnit(userInfo.underlyingBalance)}
                    onChange={(value) => {
                      const step = value / (formatUnit(userInfo.underlyingBalance) / 100)
                      if (step >= 99) {
                        handleClickInputTotalBalance()
                      } else {
                        handleChangeDeposit(formatInt(value, +vault.decimals))
                      }
                    }}
                    value={depositValue}
                    disabled={!isApprovedDeposit}
                    step={userInfo && formatUnit(userInfo.underlyingBalance) / 100}
                    style={{
                      marginBottom: 32,
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                  /> */}
                  <div className="input-with-amount" style={{ marginBottom: 24 }}>
                    <Input
                      size="large"
                      // @ts-ignore
                      ref={(ref) => ($depositRef.current = ref)}
                      style={{
                        width: '100%',
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
                    <span className="input-with-amount-value">
                      ~ $
                      {(userInfo &&
                        depositValue &&
                        validateInput(depositValue) &&
                        //@ts-ignore
                        (formatUnits(parseUnits(depositValue).toString()) /
                          //@ts-ignore
                          formatUnits(userInfo?.underlyingBalance)) *
                          //@ts-ignore
                          formatAmountUsdc(userInfo?.underlyingBalanceUsdc ?? 0)) ||
                        0}
                    </span>
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
                // here vault deposit
                <Row justify="center">
                  <DepositButton
                    handleClickDeposit={handleClickDeposit}
                    isFetchingDeposit={isFetchingDeposit}
                    isPendingDeposit={isPendingDeposit}
                  />
                </Row>
              )}
            </>
          ) : (
            ConnectWallet
          )}
        </Tabs.TabPane>
        {!hiddenWithdraw && (
          <Tabs.TabPane tab="Withdraw" key="withdraw">
            {vaultDataPageStore.isConnectedWallet ? (
              <>
                {isShowZap && <ZapV2Switch />}
                <Typography.Text className="input-label">
                  <Row gutter={4} align="middle">
                    <Col>
                      <Icon component={ExitSvg} style={{ color: '#7F8FA4', fontSize: 10 }} />
                    </Col>
                    <Col>
                      <b>
                        {userInfo && (
                          <>
                            {formatAmout(userInfo.depositedShare)}
                            {/* {' ' + formatShareName(namesManagerStore.getAssetName(vault?.addr)) + ' '}
                        ($
                        {formatAmountUsdc(userInfo.depositedUnderlyingUsdc ?? 0)}) */}
                          </>
                        )}
                      </b>
                    </Col>
                    <Col>
                      <span
                        onClick={handleClickInputTotalWithdraw}
                        className={`label-max ${!isApprovedDeposit ? 'label-max-disabled' : ''}`}
                      >
                        MAX
                      </span>
                    </Col>
                  </Row>
                </Typography.Text>
                <input
                  className="hidden-input"
                  // @ts-ignore
                  ref={(ref) => ($inputRef2.current = ref)}
                />

                {/* <Slider
                  min={0}
                  max={userInfo && formatUnit(userInfo.depositedShare)}
                  step={userInfo && formatUnit(userInfo.depositedShare) / 100}
                  onChange={(value) => {
                    const step = value / (formatUnit(userInfo.depositedShare) / 100)
                    if (step >= 99) {
                      handleClickInputTotalWithdraw()
                    } else {
                      vaultOperationPageStore.setWithdrawValue(formatInt(value, +vault.decimals))
                    }
                  }}
                  value={withdrawValue}
                  style={{
                    marginBottom: 32,
                    marginLeft: 0,
                    marginRight: 0,
                  }}
                /> */}
                <div className="input-with-amount" style={{ marginBottom: 24 }}>
                  <Input
                    size="large"
                    type="text"
                    disabled={!isApprovedDeposit}
                    // @ts-ignore
                    ref={(ref) => ($withdrawRef.current = ref)}
                    style={{ width: '100%' }}
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
                  <span className="input-with-amount-value">
                    ~ $
                    {(userInfo &&
                      withdrawValue &&
                      validateInput(withdrawValue) &&
                      //@ts-ignore
                      (formatUnits(parseUnits(withdrawValue).toString()) /
                        //@ts-ignore
                        formatUnits(userInfo?.depositedShare)) *
                        //@ts-ignore
                        formatUnits(userInfo?.depositedUnderlyingUsdc ?? 0)) ||
                      0}
                  </span>
                </div>

                <Row justify="space-between" gutter={[12, { xs: 12, sm: 12, md: 20 }]}>
                  {addressesWithConfirmWithdraw.includes(vault?.addr?.toLowerCase()) ? (
                    <Popconfirm
                      placement="top"
                      title={
                        <>
                          <p>
                            Any early withdrawal will lead to an automatic loss of at least part of
                            your funds. Do you agree?
                          </p>
                        </>
                      }
                      disabled={userInfo && formatUnit(userInfo.depositedShare) === 0}
                      onConfirm={
                        isPendingWithdraw || isFetchingWithdraw ? () => {} : handleClickWithdraw
                      }
                      okText="Yes"
                      cancelText="No"
                      style={{ width: '100%' }}
                    >
                      <Col xs={24} sm={10} lg={24} xl={10}>
                        <Button
                          shape="round"
                          loading={isPendingWithdraw || isFetchingWithdraw}
                          onClick={() => {}}
                          disabled={
                            hasProtecktionMode ||
                            (userInfo && formatUnit(userInfo.depositedShare) === 0) ||
                            vaultOperationPageStore.isFetchingWithdrawProcess ||
                            vaultOperationPageStore.isPendingWithdrawProcess
                          }
                          className="btn-withdraw"
                          type="primary"
                        >
                          <strong>Withdraw</strong>
                        </Button>
                      </Col>
                    </Popconfirm>
                  ) : (
                    <Col xs={24} sm={10} lg={24} xl={10}>
                      <Button
                        shape="round"
                        loading={isPendingWithdraw || isFetchingWithdraw}
                        onClick={handleClickWithdraw}
                        disabled={
                          hasProtecktionMode ||
                          (userInfo && formatUnit(userInfo.depositedShare) === 0) ||
                          vaultOperationPageStore.isFetchingWithdrawProcess ||
                          vaultOperationPageStore.isPendingWithdrawProcess
                        }
                        className="btn-withdraw"
                        type="primary"
                      >
                        <strong>Withdraw</strong>
                      </Button>
                    </Col>
                  )}
                  {vault?.rewardTokens?.length === 0 ? (
                    <Col xs={24} sm={14} lg={24} xl={14}>
                      <Button
                        shape="round"
                        loading={isPendingWithdrawAndClaim || isFetchingWithdrawAllAndClaim}
                        onClick={
                          isPendingWithdrawAndClaim || isFetchingWithdrawAllAndClaim
                            ? () => {}
                            : handleClickWithdrawAllAndClaim
                        }
                        disabled={
                          (userInfo && formatUnit(userInfo.depositedShare) === 0) ||
                          vaultOperationPageStore.isFetchingWithdrawProcess ||
                          vaultOperationPageStore.isPendingWithdrawProcess
                        }
                        className="btn-withdraw-and-claim"
                        type="primary"
                      >
                        <strong>Withdraw all and claim</strong>
                      </Button>
                    </Col>
                  ) : (
                    <Popconfirm
                      placement="top"
                      title={
                        <>
                          {addressesWithConfirmWithdraw.includes(vault?.addr?.toLowerCase()) ? (
                            <p>
                              Any early withdrawal will lead to an automatic loss of at least part
                              of your funds. Do you agree?
                            </p>
                          ) : (
                            <>
                              <p>Are you sure you want to withdraw all and claim?</p>
                              <p>
                                If you don't have a 100% boost, you will only have a fraction of
                                your rewards.
                              </p>
                            </>
                          )}
                        </>
                      }
                      disabled={userInfo && formatUnit(userInfo.depositedShare) === 0}
                      onConfirm={
                        isPendingWithdrawAndClaim || isFetchingWithdrawAllAndClaim
                          ? () => {}
                          : handleClickWithdrawAllAndClaim
                      }
                      okText="Yes"
                      cancelText="No"
                      style={{ width: '100%' }}
                    >
                      <Col xs={24} sm={14} lg={24} xl={14}>
                        <Button
                          shape="round"
                          loading={isPendingWithdrawAndClaim || isFetchingWithdrawAllAndClaim}
                          onClick={() => {}}
                          disabled={
                            (userInfo && formatUnit(userInfo.depositedShare) === 0) ||
                            vaultOperationPageStore.isFetchingWithdrawProcess ||
                            vaultOperationPageStore.isPendingWithdrawProcess
                          }
                          className="btn-withdraw-and-claim"
                          type="primary"
                        >
                          <strong>Withdraw all and claim</strong>
                        </Button>
                      </Col>
                    </Popconfirm>
                  )}
                </Row>
              </>
            ) : (
              ConnectWallet
            )}
          </Tabs.TabPane>
        )}
      </Tabs>

      {isFetchedWithdrawRequest && getIsShowWithdrawRequestUI() && tab === 'withdraw' && (
        <div style={{ marginTop: 40, marginBottom: -20 }}>
          {vault?.platform === '24' && strategySplitterStore && (
            <>
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    marginTop: 40,
                    marginBottom: 25,
                  }}
                >
                  <p style={{ fontSize: 14 }}>
                    {/*Your balance is higher than MaxCheapWithdraw. It requires withdrawing from*/}
                    {/*multiple strategies and may fail to for the reason of gas limit. Please, request*/}
                    {/*the necessary amount for withdrawal and click "Process" until MaxCheapWithdraw*/}
                    {/*will be not reached the required amount*/}
                    Your balance is higher than the optimal withdrawal limit
                    <span style={{ marginLeft: 20 }}>
                      <Tooltip
                        color="#212130"
                        title='Your balance is higher than MaxCheapWithdraw. It requires withdrawing from
                      multiple strategies and may fail to for the reason of gas limit. Please, request
                      the necessary amount for withdrawal and click "Process" until MaxCheapWithdraw
                      will be not reached the required amount
                        '
                        placement="topRight"
                      >
                        <QuestionCircleOutlined />
                      </Tooltip>{' '}
                    </span>
                  </p>

                  {(() => {
                    let width = 0

                    const wantToWithdrawValue = parse(
                      strategySplitterStore.wantToWithdrawStore.value,
                    )

                    if (wantToWithdrawValue >= Number(withdrawValue)) {
                      width = 100
                    } else {
                      width = (wantToWithdrawValue * 100) / withdrawValue
                    }

                    if (withdrawValue == 0) {
                      width = 0
                    }

                    const wantToWithdraw = strategySplitterStore?.wantToWithdrawStore?.value
                      ? parse(strategySplitterStore.wantToWithdrawStore.value) + ''
                      : '0'

                    const isLoadingWantToWithdraw =
                      strategySplitterStore?.wantToWithdrawStore?.isFetching ||
                      vaultOperationPageStore.isFetchingWithdrawRequest ||
                      vaultOperationPageStore.isPendingWithdrawRequest

                    return (
                      <div className="progress-wrapper" style={{ marginBottom: 20 }}>
                        <Typography.Title level={5}>Progress</Typography.Title>
                        <div
                          style={{
                            opacity: 0.8,
                            marginTop: -3,
                            marginBottom: 14,
                          }}
                        >
                          <Typography.Text>
                            <Row gutter={[10, 0]} align="middle">
                              <Col>MaxCheapWithdraw: </Col>
                              <Col>
                                {strategySplitterStore.maxCheapWithdrawStore.isFetched ? (
                                  <Row gutter={[4, 4]} align="middle">
                                    <Col>
                                      <Amount
                                        formated
                                        value={getMaxCheapWithdrawByPricePerFullShare() + ''}
                                        style={{ fontSize: 14, marginBottom: -2 }}
                                      />
                                    </Col>
                                    <Col>
                                      {formatShareName(namesManagerStore.getAssetName(vault?.addr))}
                                    </Col>
                                  </Row>
                                ) : null}
                              </Col>
                            </Row>
                          </Typography.Text>
                        </div>
                        <div className="line-wrapper">
                          {/* @ts-ignore */}
                          <div
                            className="date"
                            style={{
                              width: '100%',
                              textAlign: 'center',
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            <Row align="middle" gutter={[10, 0]}>
                              <Col>Want to withdraw:</Col>
                              <Col>
                                {isLoadingWantToWithdraw ? (
                                  <Spin
                                    indicator={
                                      <LoadingOutlined
                                        style={{
                                          fontSize: 20,
                                          marginBottom: -2,
                                          position: 'relative',
                                          top: 2,
                                        }}
                                        spin
                                      />
                                    }
                                  />
                                ) : (
                                  <Row align="middle" gutter={[4, 0]}>
                                    <Col>
                                      <Amount
                                        formated
                                        value={wantToWithdraw}
                                        style={{ fontSize: 14, marginBottom: -2 }}
                                      />
                                    </Col>
                                    <Col>
                                      {formatShareName(namesManagerStore.getAssetName(vault?.addr))}
                                    </Col>
                                  </Row>
                                )}
                              </Col>
                            </Row>
                          </div>
                          <div className="line" style={{ backgroundSize: `${width}% 100%` }}></div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
                <Row gutter={[20, 20]}>
                  <Col span={12}>
                    <Button
                      shape="round"
                      loading={
                        vaultOperationPageStore.isFetchingWithdrawRequest ||
                        vaultOperationPageStore.isPendingWithdrawRequest
                      }
                      onClick={() => {
                        vaultOperationPageStore.withdrawRequest(withdrawValue).then(() => {
                          strategySplitterStore.wantToWithdrawStore.fetch()
                        })
                      }}
                      disabled={
                        withdrawValue == 0 ||
                        parse(strategySplitterStore.wantToWithdrawStore.value) >=
                          Number(withdrawValue)
                      }
                      className="btn-withdraw"
                      type="primary"
                    >
                      <strong>Request</strong>
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      shape="round"
                      loading={
                        vaultOperationPageStore.isFetchingWithdrawProcess ||
                        vaultOperationPageStore.isPendingWithdrawProcess
                      }
                      onClick={() => {
                        vaultOperationPageStore.withdrawProcess()
                      }}
                      disabled={
                        withdrawValue == 0 ||
                        parse(strategySplitterStore.wantToWithdrawStore.value) <
                          Number(withdrawValue)
                      }
                      className="btn-withdraw"
                      type="primary"
                    >
                      <strong>Process</strong>
                    </Button>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
})
