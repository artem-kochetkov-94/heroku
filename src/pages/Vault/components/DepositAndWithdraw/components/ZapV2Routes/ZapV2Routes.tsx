import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { useStores } from '../../../../../../stores/hooks'
import './styles.css'
import OneInch from '../../../../../../static/1inch.png'
import { Modal } from './Modal'

type ZapV2RoutesProps = {
  vaultIcon: any
  tab: string
  vault: any
}

export const ZapV2Routes: React.FC<ZapV2RoutesProps> = observer((props) => {
  const { vaultIcon, tab, vault } = props
  const { zapV2ChainStore } = useStores()
  const [activeModal, setActiveModal] = useState(false)

  const tokenIn = zapV2ChainStore.tokenList.find(
    (item: { address: string; logo: string; caption: string }) =>
      item.address === zapV2ChainStore.tokenIn,
  )

  if (!Object.keys(zapV2ChainStore.buildedTx).length) {
    return null
  }

  return (
    <div className="app-paper zap-routes">
      <div className="zap-routes-title">Routes</div>
      <div className="oneinch-wrapper">
        {tab === 'deposit' ? (
          <img className="oneinch-wrapper-asset" src={tokenIn.logo} alt={tokenIn.caption} />
        ) : (
          vaultIcon
        )}

        <div className="oneinch-wrapper-line"></div>
        <div
          className="oneinch-route-link"
          onClick={() => {
            setActiveModal(true)
          }}
        >
          <div className="oneinch-route-link-image">
            <img src={OneInch} alt="" />
          </div>
          <div className="oneinch-route-link-text">1INCH ROUTER</div>
        </div>
        <div className="oneinch-wrapper-line"></div>
        {tab === 'deposit' ? (
          <div className="oneinch-wrapper-asset-out">{vaultIcon}</div>
        ) : (
          <img className="oneinch-wrapper-asset" src={tokenIn.logo} alt={tokenIn.caption} />
        )}
      </div>

      <Modal visible={activeModal} onClose={() => setActiveModal(false)} vault={vault} />
    </div>
  )
})
