import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Spin } from 'antd'
import { web3Store } from '../../../../stores/web3-store'
import { parseUnits } from 'ethers/lib/utils'
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'
import { DystopiaPair } from '../../../../abi/DystopiaPair'
import { BigNumber } from 'ethers'
import { formatUnits } from '@ethersproject/units'
import { useFetchData } from '../../../TetuQi/DepositTetuQi/useFetchData'

const DYSTOPIA_tetuQI_QI = '0x42c0cc5f1827C5d908392654389E5D93da426378'
const tetuQi = '0x4cd44ced63d9a6fef595f6ad3f7ced13fceac768'
const Qi = '0x580A84C73811E1839F75d86d75d88cCa0c241fF4'

export const fetchTetuQiPrice = async () => {
  const underlingContact = new web3Store.web3.eth.Contract(
    // @ts-ignore
    DystopiaPair,
    DYSTOPIA_tetuQI_QI,
  )
  const tetuQiPerQi: BigNumber = await underlingContact.methods
    .getAmountOut(parseUnits('1'), Qi)
    .call()
  return formatUnits(tetuQiPerQi)
}

export const LpInfoTetuQi = (props: any) => {
  const { vault } = props
  const { data, loading } = useFetchData()

  const Loader = (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 18, marginLeft: 5 }} spin />} />
  )

  if (vault?.addr?.toLowerCase() !== tetuQi.toLowerCase()) {
    return null
  }

  return (
    <Col span={24}>
      <div className="app-paper">
        {/*<Row gutter={[10, 10]} style={{ marginBottom: 16 }}>*/}
        {/*  <Col>Qi reserve in LP:</Col>*/}
        {/*  <Col>{isLoading ? Loader : parseFloat(data.tokenStacked || '0').toFixed(2)}</Col>*/}
        {/*
          <Col style={{ marginLeft: 'auto' }}>
            <Tooltip color="#212130" title="Share amount" placement="topRight">
              <QuestionCircleOutlined />
            </Tooltip>{' '}
          </Col>
          */}
        {/*</Row>*/}
        <Row gutter={[10, 10]} style={{ marginBottom: 32 }}>
          <Col>tetuQi price:</Col>
          <Col>{loading ? Loader : parseFloat(String(data?.price)).toFixed(4)} Qi</Col>
        </Row>
        <Row>
          <Button
            onClick={() => {
              window.open('https://dystopia.exchange')
            }}
            type="primary"
          >
            {' '}
            Buy tetuQi
          </Button>
        </Row>
      </div>
    </Col>
  )
}
