import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { useStores } from '../../../stores/hooks'
import ReactECharts from 'echarts-for-react'
import { Row } from 'antd'
import { Loader } from '../../Loader'

export const TetuLocked = observer(() => {
  const { tetuLockedChartStore } = useStores()

  useEffect(() => {
    if (!tetuLockedChartStore.isFetched) {
      tetuLockedChartStore.loadData()
    }
  }, [tetuLockedChartStore.isFetched])

  const title = (
    <div style={{ textAlign: 'left', fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
      <b>Tetu Holders</b>
    </div>
  )

  if (!tetuLockedChartStore.isFetched) {
    return (
      <>
        {title}
        <Row align="middle" justify="center" style={{ minHeight: 300 }}>
          <Loader />
        </Row>
      </>
    )
  }

  const { LPs, PS, items } = tetuLockedChartStore.data

  const format = (val: string) => {
    return Number(parseFloat(val).toFixed(2))
  }

  const sum = (items: string[]) => {
    return items.reduce((acc: number, item: string) => {
      acc += format(item)
      return acc
    }, 0)
  }

  const tetu_lp = sum(LPs)
  const itemsSum = sum(items.map((el: any) => el.value))
  const other = format(String(100 - PS - tetu_lp - itemsSum))

  const data = [
    { value: parseFloat(tetu_lp + '').toFixed(2), name: 'TETU liquidity Pool' },
    { value: parseFloat(PS).toFixed(2), name: 'Profit Share Pool' },
    ...items.map((el: any) => {
      return {
        value: format(el.value),
        name: el.name,
      }
    }),
    { value: other, name: 'Other' },
  ]

  const option = {
    backgroundColor: 'transparent',
    color: ['#1168EB', '#686DF1', '#7D2CF5', '#5E3994', '#483CE1', '#1449A5', '#3E93FF'],
    height: 300,

    showAllTooltips: true,
    tooltip: {
      trigger: 'item',
      textStyle: {},
    },
    legend: {
      top: '75%',
      bottom: 'auto',
      itemWidth: 14,
      itemHeight: 14,
      // orient: 'vertical',
      // left: 'bottom',
    },
    series: [
      {
        name: '',
        type: 'pie',
        top: '-13%',
        bottom: '-10%',
        radius: ['30%', '60%'],
        // roseType: 'area',
        data,
        label: {
          color: '#fff',
          fontSize: 12,
          formatter: ({ name, value }: any) => {
            return value + ' % ' + name
          },
          // show: false,
          // position: 'bottom',
        },
        itemStyle: {
          // borderRadius: 8,
          // borderWidth: 3,
          // borderType: 'solid',
          // borderColor: 'transparent',
          // width: '80%',
        },
        emphasis: {
          itemStyle: {},
        },
      },
    ],
  }

  return (
    <div>
      {title}
      <ReactECharts option={option} theme="dark" />
    </div>
  )
})
