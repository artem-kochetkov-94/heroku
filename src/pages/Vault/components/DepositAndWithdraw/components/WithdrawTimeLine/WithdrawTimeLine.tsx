import React from 'react'
import { useStores } from '../../../../../../stores/hooks'
import { observer } from 'mobx-react'
import day from 'dayjs'
import { Col, Row, Typography } from 'antd'
import { getAssetsIconMap } from '../../../../../../static/tokens'
import unknownIcon from '../../../../../../static/UNKNOWN.png'
import { useForceUpdate } from '../../../../../../hooks'

export type WithdrawTimeLineProps = {
  deposited: number
  assets: string[]
}

export const WithdrawTimeLine: React.FC<WithdrawTimeLineProps> = observer((props) => {
  const { deposited, assets } = props
  const { vaultUserLockTSStore, namesManagerStore } = useStores()
  const forceUpdate = useForceUpdate()

  if (deposited <= 0 || !vaultUserLockTSStore.value || +vaultUserLockTSStore.value === 0) {
    return null
  }

  // todo fetch from vault contract lockPeriod() - result in seconds
  const dayPeriod = 90
  const lockDuration = dayPeriod * 24 * 60 * 60

  const lockStartDate = +vaultUserLockTSStore.value
  const lockEndDate = lockStartDate + lockDuration
  const currentDate = Math.floor(new Date().getTime() / 1000)
  const currentLockDuration = currentDate - lockStartDate
  const leftSec = lockEndDate - currentDate
  const leftDays = leftSec / 60 / 60 / 24

  // todo fetch from vault contract lockPenalty()/LOCK_PENALTY_DENOMINATOR
  const penaltyPercent = 0.5
  const percentLeftRatio = (lockDuration - leftSec) / lockDuration
  const percent = (penaltyPercent + percentLeftRatio * penaltyPercent) * 100

  const shares_base = deposited * penaltyPercent
  const to_withdraw = shares_base + ((deposited - shares_base) * currentLockDuration) / lockDuration

  const icons = assets.map((asset) => {
    const name = namesManagerStore.getAssetName(asset)

    if (name === null) {
      setTimeout(forceUpdate, 1000)
    }

    return (
      <img
        style={{ maxHeight: 20, marginBottom: 3 }}
        className="image"
        // @ts-ignore
        src={getAssetsIconMap()?.[name] ?? unknownIcon}
        alt=""
      />
    )
  })

  const format = (v: number) => {
    return parseFloat(parseFloat(v + '').toFixed(2))
  }

  return (
    <Col span={24}>
      <div className="progress-wrapper">
        <div className="app-paper">
          <div>
            <Typography.Text
              style={{
                marginRight: 5,
                fontSize: 20,
                fontFamily: 'Source Sans Pro',
                fontWeight: 600,
                lineHeight: '24px',
                color: '#ffffff',
              }}
            >
              Lock duration
            </Typography.Text>
          </div>
          <div style={{ marginBottom: 24 }}>
            <Typography.Text style={{ fontSize: 12, marginBottom: 10, opacity: 0.6 }}>
              100% withdraw on {day(new Date(lockEndDate * 1000)).format('DD MMMM HH:mm')}
            </Typography.Text>
          </div>

          <div className="caption">
            <Row justify="space-between">
              <Col>
                <span className="progress-wrapper-percent">
                  {percent > 100 ? 100 + '' : parseFloat(parseFloat('' + percent).toFixed(2))}%
                </span>
              </Col>
              <Col>
                <span className="progress-wrapper-days">
                  Days left: {leftDays < 0 ? 0 : parseFloat(leftDays + '').toFixed(1)}
                </span>
              </Col>
            </Row>
          </div>
          <div className="line-wrapper">
            {/* <div className="date">
            Days left: {leftDays < 0 ? 0 : parseFloat(leftDays + '').toFixed(1)}
          </div> */}
            <div className="line" style={{ backgroundSize: `${percent}% 100%` }}></div>
          </div>
          <div className="values">
            <Row justify="space-between">
              <Col>
                <Row gutter={4}>
                  <Col>{icons}</Col>
                  <Col>{to_withdraw > deposited ? format(deposited) : format(to_withdraw)}</Col>
                </Row>
              </Col>

              <Col style={{ color: '#7f8fa4' }}>
                <Row gutter={4}>
                  <Col>{icons}</Col>
                  <Col>{format(deposited)}</Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Col>
  )
})
