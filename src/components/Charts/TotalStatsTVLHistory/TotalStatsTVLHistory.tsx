import React, { useEffect, useRef } from 'react'
import { Row, Button } from 'antd'
import { observer } from 'mobx-react'
import { useStores } from '../../../stores/hooks'
import { addSpace } from '../../../utils'
import * as echarts from 'echarts'
import ReactECharts from 'echarts-for-react'
import day from 'dayjs'
import { Loader } from '../../Loader'

import './styles.css'

export const TotalStatsTVLHistory = observer(() => {
  const { tvlHistoryChartStore } = useStores()

  const $wrapperRef = useRef<any>()

  const title = (
    <div style={{ textAlign: 'left', fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
      <b>TVL at work (USDC)</b>
    </div>
  )

  useEffect(() => {
    tvlHistoryChartStore.loadData()
  }, [])

  const option = {
    color: ['#37A2FF'],
    backgroundColor: 'transparent',
    showAllTooltips: true,
    height: 210,
    width: '78%',
    paddingTop: 20,
    tooltip: {
      trigger: 'axis',
      // enterable: false,
      className: 'chart-tooltip',
      backgroundColor: 'transparent',
      show: true,
      showContent: true,
      alwaysShowContent: true,
      textStyle: {
        color: '#ffffff',
      },
      borderWidth: 0,
      position: [40, 0],
      extraCssText: 'box-shadow: none',

      formatter: (args: any) => {
        const [{ dataIndex }] = args
        const [date, value] = tvlHistoryChartStore.data[dataIndex]

        return (
          `<div class="tvl-chart-label">${day(date).format('MMM DD, YY HH:mm')}</div>` +
          `<div class="tvl-chart-value">$ ${addSpace(parseFloat(value).toFixed(2))}</div>`
        )
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      nameTextStyle: {
        color: '#ffffff',
      },
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        name: '',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#09A6F1',
            },
            {
              offset: 1,
              color: '#6c60f7',
            },
          ]),
        },
        data: tvlHistoryChartStore.data.map(([date, block]: any) => [
          day(date).format('DD MMM HH:mm'),
          block,
        ]),
      },
    ],
  }

  return (
    <div ref={(ref) => ($wrapperRef.current = ref)}>
      {title}
      {!tvlHistoryChartStore.isFetched ? (
        <Row justify="center" align="middle" style={{ height: 300 }}>
          <Loader />
        </Row>
      ) : (
        <div style={{ paddingLeft: 10, marginBottom: 0, marginLeft: -50, marginRight: -50 }}>
          <ReactECharts
            option={option}
            theme="dark"
            onChartReady={(e) => {
              setTimeout(() => {
                const width =
                  $wrapperRef.current.getElementsByClassName('echarts-for-react')[0].offsetWidth
                const paddingLeft = (width - width * 0.78) / 2 - 10

                e._api.dispatchAction({
                  type: 'showTip',
                  x: paddingLeft + width * 0.78,
                  y: 200,
                  position: [40, 0],
                })
              }, 100)
            }}
          />
        </div>
      )}
    </div>
  )
})
