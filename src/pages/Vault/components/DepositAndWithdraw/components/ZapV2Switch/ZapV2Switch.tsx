import React from 'react'
import { Switch } from 'antd'
import { useStores } from '../../../../../../stores/hooks'
import Zap from '../../../../../../static/zap.svg'

export const ZapV2Switch = () => {
  const { zapV2ChainStore } = useStores()

  return (
    <div className="operations-swicth-zap" style={{ marginBottom: 30 }}>
      <Switch
        checked={zapV2ChainStore.useZapContract}
        onChange={() => {
          zapV2ChainStore.toggleUseZapContract()
        }}
        checkedChildren={
          <span>
            <span className="operations-swicth-zap-label">Zap</span>
            <img src={Zap} alt="" className="operations-swicth-zap-image" />
          </span>
        }
        unCheckedChildren={
          <span>
            <span className="operations-swicth-zap-label">Zap</span>
            <img src={Zap} alt="" className="operations-swicth-zap-image" />
          </span>
        }
      ></Switch>
    </div>
  )
}
