import React, { useState, useEffect } from 'react'
import { Col, Row, Spin, Tooltip } from 'antd'
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'
import { useAaveMaiBalVault } from '../../../../../hooks'

type AboutVaultProps = {
  vault: any
}

const Loader = <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />

export const AboutVault: React.FC<AboutVaultProps> = observer((props) => {
  const { vault } = props

  const { isAaveMaiBalVault, state, isFetching } = useAaveMaiBalVault(vault)

  if (isAaveMaiBalVault) {
    return (
      <div>
        <Row gutter={[10, 10]} style={{ marginTop: 40, marginBottom: 16 }}>
          <Col>Max deposit:</Col>
          <Col>{isFetching ? Loader : '$' + parseFloat(state.maxDepositUsd + '').toFixed(2)}</Col>
          <Col style={{ marginLeft: 'auto' }}>
            <Tooltip
              color="#212130"
              title="Available MAI tokens for borrowing on QiDAO platform"
              placement="topRight"
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </Col>
        </Row>
        <Row gutter={[10, 10]}>
          <Col>Liquidation Price:</Col>
          <Col>{isFetching ? Loader : '$' + parseFloat(state.liquidationPrice).toFixed(2)}</Col>
          <Col style={{ marginLeft: 'auto' }}>
            <Tooltip
              color="#212130"
              title="Assets under control will be partially liquidated if the price reaches this level"
              placement="topRight"
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </Col>
        </Row>
      </div>
    )
  }

  return null
})
