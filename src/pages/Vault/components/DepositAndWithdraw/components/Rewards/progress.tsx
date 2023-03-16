import React from 'react'
import { Row, Col } from 'antd'

import './styles.css'
import { formatAmountUsdc, formatAmout } from '../../utils'
import { getAssetsIconMap } from '../../../../../../static/tokens'

type ProgressProps = {
  // current: number | string
  // total: number | string
  reward: string
  rewardUSDC: string
  rewardBoost: string
  rewardBoostUSDC: string
  name: string
  dd: number
}

export const Progress: React.FC<ProgressProps> = (props) => {
  const { reward, rewardUSDC, rewardBoost, rewardBoostUSDC, name, dd } = props

  const width = (Number(rewardBoost) / Number(reward)) * 100

  // if (reward == '0') {
  //   return <div className="progress-wrapper"></div>
  // }

  const icon = (
    <img
      style={{
        height: 20,
        marginBottom: 3,
        borderRadius: name === 'xTETU' ? 0 : 20,
        position: 'relative',
        top: 0,
      }}
      // @ts-ignore
      src={name ? getAssetsIconMap()[name] : null}
      alt=""
    />
  )

  return (
    <div className="progress-wrapper">
      <div className="caption">
        <Row justify="space-between">
          <Col>
            <span className="progress-wrapper-percent">
              {Number.isNaN(width) ? 0 : parseFloat(parseFloat(width + '').toFixed(2))}%
            </span>
          </Col>
          <Col>
            <span className="progress-wrapper-days">
              Days left: {parseFloat(parseFloat(dd + '').toFixed(1))}
            </span>
          </Col>
        </Row>
      </div>
      <div className="line-wrapper">
        {/* <div className="date">Days left: {parseFloat(parseFloat(dd + '').toFixed(1))}</div> */}
        <div className="line" style={{ backgroundSize: `${width}% 100%` }}></div>
      </div>
      <div className="values">
        <Row justify="space-between">
          <Col>
            <Row gutter={4}>
              <Col>{icon}</Col>
              <Col style={{ color: '#7f8fa4' }}>{name}: </Col>
              <Col>
                <span className="progress-wrapper-value-border">
                  {parseFloat(formatAmout(rewardBoost) + '').toFixed(2)}
                </span>
              </Col>
              <Col>$ {parseFloat(formatAmout(rewardBoostUSDC) + '').toFixed(2)}</Col>
            </Row>
          </Col>
          <Col style={{ color: '#7f8fa4' }}>
            <Row gutter={4}>
              <Col>{icon}</Col>
              <Col>{name}: </Col>
              <Col>
                <span className="progress-wrapper-value-border">
                  {parseFloat(formatAmout(reward) + '').toFixed(2)}
                </span>
              </Col>
              <Col>$ {parseFloat(formatAmout(rewardUSDC) + '').toFixed(2)}</Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}
