import React, { useEffect } from 'react'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import { useStores } from '../../../stores/hooks'
import { useLocation } from 'react-router'
import { resourcesLinks } from '../../../App/constants'
import { observer } from 'mobx-react'
import { Button, Row, Col, Spin } from 'antd'
import { getAssetsIconMap } from '../../../static/tokens'
import { TetuTokenValuesStore } from '../../../stores'
import { LoadingOutlined } from '@ant-design/icons'
import { formatUnits } from 'ethers/lib/utils'
import { addSpace, millifyValue } from '../../../utils/vaults'
import LogoWithoutText from '../../../static/logo/full-logo-dark.svg'

const currentTetuTokenPriceStore = new TetuTokenValuesStore()
const lastDayTetuTokenPriceStore = new TetuTokenValuesStore()
const antIcon = <LoadingOutlined style={{ fontSize: 20, marginLeft: 6 }} spin />

export const AmountDaily = (props: any) => {
  const { currentValue, valueOf24Hour, formated } = props

  if (currentValue == undefined) {
    return null
  }

  const format = (value: number, isFormated: boolean, toFixed: number = 2) => {
    if (Number.isNaN(value)) {
      return ''
    }
    const float = parseFloat(parseFloat(String(value)).toFixed(toFixed))
    return float
  }

  const current = formated ? currentValue : formatUnits(currentValue)
  // const valueOf24 = formated ? valueOf24Hour : formatUnits(valueOf24Hour)
  // const diffValue = current - valueOf24
  // const percent = (diffValue / valueOf24) * 100
  // const isUp = Math.sign(diffValue) === 1
  // const isDown = Math.sign(diffValue) === -1
  // const hasNotChanged = Math.sign(diffValue) === 0

  return (
    <Row gutter={[4, 4]} align="bottom">
      <Col className="current-value">$ {addSpace(format(current, formated, 4) + '')}</Col>
      {/*
      <Col
        className={cn('diff-percent', {
          up: isUp,
          down: isDown,
          notChanged: hasNotChanged,
        })}
        style={{ fontSize: 12, marginRight: 0 }}
      >
        %{format(percent, formated)}
      </Col>
      */}
    </Row>
  )
}

export const TetuPrice = observer(() => {
  const { networkManager, web3Store } = useStores()

  useEffect(() => {
    if (networkManager.inited) {
      if (!currentTetuTokenPriceStore.isFetched && !currentTetuTokenPriceStore.isFetching) {
        currentTetuTokenPriceStore.fetch()
      }

      if (!lastDayTetuTokenPriceStore.isFetched && !lastDayTetuTokenPriceStore.isFetching) {
        web3Store.web3.eth.getBlockNumber().then((currentBlock: number) => {
          const blockOfLast24Hours = currentBlock - networkManager.blockPeriods.block_at_day_period
          lastDayTetuTokenPriceStore.fetch(blockOfLast24Hours)
        })
      }
    }

    return () => {
      currentTetuTokenPriceStore.reset()
      lastDayTetuTokenPriceStore.reset()
    }
  }, [networkManager.inited, networkManager.networkId])

  const assetsIconMap = getAssetsIconMap()
  const isFetchingTetuPrice = currentTetuTokenPriceStore.isFetching

  return (
    <div className="buy-tetu">
      <div
        onClick={() => {
          window.open(networkManager.buyTetu)
        }}
      >
        <Row align="middle" gutter={[4, 4]}>
          <Col>
            {/* <img src={assetsIconMap.TETU} alt="" style={{ marginRight: 4 }} /> */}
            <img src={LogoWithoutText} alt="" style={{ marginRight: 4 }} width={20} />
            {/* logo-dark */}
          </Col>
          <Col>
            <Row gutter={[4, 4]} align="middle">
              <Col>
                {isFetchingTetuPrice ? (
                  <Spin indicator={antIcon} />
                ) : (
                  <>
                    <AmountDaily
                      currentValue={currentTetuTokenPriceStore.value?.[0] as string}
                      valueOf24Hour={lastDayTetuTokenPriceStore.value?.[0] as string}
                    />
                  </>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
})
