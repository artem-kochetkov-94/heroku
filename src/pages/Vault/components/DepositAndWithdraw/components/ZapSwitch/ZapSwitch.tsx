import React from 'react'
import { Switch } from 'antd'
import { ThunderboltOutlined } from '@ant-design/icons'
import { useStores } from '../../../../../../stores/hooks'
import Zap from '../../../../../../static/zap.svg'

export const ZapSwitch = () => {
  const { zapChainStore } = useStores()

  return (
    <div className="operations-swicth-zap" style={{ marginBottom: 30 }}>
      <Switch
        checked={zapChainStore.useZapContract}
        onChange={() => {
          zapChainStore.toggleUseZapContract()
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
