import React, { useEffect, useState, useRef } from 'react'
import { Tooltip, TooltipProps, Spin, Button, Row } from 'antd'
import { observer } from 'mobx-react'
import { useStores } from '../../stores/hooks'
import { LoadingOutlined, CopyOutlined, LinkOutlined } from '@ant-design/icons'
import { findDOMNode } from 'react-dom'
import { tokens } from '../../static/tokens'
import { formatUnits } from '@ethersproject/units'
import { formatName } from './utils'

import './styles.css'
import { addSpace, millifyValue } from '../../utils'
import { useMediaQuery } from 'react-responsive'

export type AmountProps = {
  value?: string
  address?: string
  fontSize?: number
  bold?: boolean
  placement?: TooltipProps['placement']
  mouseEnterDelay?: TooltipProps['mouseEnterDelay']
  color?: TooltipProps['color']
  canCopy?: boolean
  showIcon?: boolean
  assets?: string[]
  prefix?: string
  showTooltip?: boolean
  imageStyle?: object
  name?: string
  style?: object
  formated?: boolean
  // tooltip width
  standartWidth?: boolean
  decimals?: number
  tooltipInner?: any
  toFixed?: number
  tooltipStyle?: object
  inline?: boolean
}

export const Amount: React.FC<AmountProps> = observer((props) => {
  const {
    address,
    bold = false,
    placement,
    mouseEnterDelay = 1.2,
    color = 'geekblue',
    value,
    assets = [],
    prefix,
    showTooltip = true,
    imageStyle = {},
    style,
    formated,
    standartWidth = false,
    decimals = 18,
    name,
    tooltipInner,
    toFixed,
    tooltipStyle,
    inline,
  } = props

  let { fontSize = 14 } = props

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 840px)' })

  if (isTabletOrMobile) {
    fontSize = fontSize * 0.8
  }

  const $tooltip = useRef(null)

  const [vaultInfo, setVaultInfo] = useState({})
  const [copied, setCopied] = useState(false)
  const [isFetchingVaultInfo, setIsFetchingVaultInfo] = useState(false)

  const { contractUtilsChainStore, contractReaderChainStore, networkManager } = useStores()

  // const fetchVaultInfo = () => {
  //   setIsFetchingVaultInfo(true)
  //   contractReaderChainStore.getVaultInfo(address).then((vaultInfo: any) => {
  //     setVaultInfo(vaultInfo)
  //     setIsFetchingVaultInfo(false)
  //   })
  // }

  // useEffect(() => {
  //   if (!vaultInfo) {
  //     // fetchVaultInfo()
  //   }
  //   // contractUtilsChainStore.
  // }, [])

  const Tag = bold ? (p: any) => <strong {...p} /> : (p: any) => <span {...p} />

  const isLoading = isFetchingVaultInfo

  const icon = isLoading ? (
    <Spin indicator={<LoadingOutlined style={{ fontSize, marginRight: 5 }} spin />} />
  ) : null

  const handleClickCopy = (e: any) => {
    e.stopPropagation()
    navigator.clipboard.writeText(address ?? '')
    setCopied(true)
  }

  const handleChangeVisible = (visible: boolean) => {
    if (visible) {
      const node = findDOMNode($tooltip.current)
      if (node) {
        if (!standartWidth) {
          // @ts-ignore
          node.closest('.ant-tooltip-inner').style.width = '475px'
        } else {
          // @ts-ignore
          node.closest('.ant-tooltip-inner').style.width = '350px'
        }
      }
    } else {
      setTimeout(() => {
        setCopied(false)
      }, 50)
    }
  }

  // @ts-ignore
  const images = assets.map((asset: string) => tokens[asset]?.(imageStyle))

  const title = (
    <div
      // @ts-ignore
      ref={(ref) => ($tooltip.current = ref)}
      onClick={(e) => {
        e.stopPropagation()
      }}
      style={{ width: inline ? 'auto' : '100%' }}
    >
      {tooltipInner || (
        <>
          <div style={{ fontSize: 14 }}>
            {/* @ts-ignore */}
            {vaultInfo?.name}
          </div>
          <div>
            {value && (
              <span style={{ fontSize: 12 }}>
                <span style={{ fontWeight: 500 }}>amount</span>:{' '}
                {formated ? addSpace(value) : addSpace(formatUnits(value!, decimals))}
              </span>
            )}
            {address && (
              <div style={{ fontSize: 12 }}>
                <span style={{ fontWeight: 500 }}>address</span>:{' '}
                <a
                  style={{ display: 'inline-block', marginLeft: 6 }}
                  href={networkManager.network.blockExplorerUrls?.[0] + 'address/' + address}
                  target="_blank"
                  rel="noreferrer"
                >
                  {address} <LinkOutlined />
                </a>{' '}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )

  const inner = (
    <Tag style={{ fontSize, display: 'flex', marginTop: -1, ...style }}>
      <Row align="middle" style={{ width: '100%' }}>
        <span style={{ fontWeight: 400, color: '#fff' }}>
          {prefix} {value && millifyValue(value, formated, toFixed, decimals)}
        </span>
        {typeof name === 'string' ? formatName(name) : name}
        {props.children}
      </Row>
    </Tag>
  )

  return showTooltip ? (
    <Tooltip
      color="#212130"
      className="amount-component"
      autoAdjustOverflow
      onVisibleChange={handleChangeVisible}
      title={title}
      placement={placement}
      mouseEnterDelay={mouseEnterDelay}
      style={tooltipStyle}
    >
      {inner}
    </Tooltip>
  ) : (
    inner
  )
})
