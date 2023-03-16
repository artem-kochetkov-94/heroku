import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { Amount } from '../../../components/Amount'
import { formatUnits } from '@ethersproject/units'
import { useStores } from '../../../stores/hooks'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { useForceUpdate } from '../../../hooks'

type UserBalanceProps = {
  vaultAddr: string
  vaultDecimals: number
}

export const UserBalance: React.FC<UserBalanceProps> = observer((props) => {
  const { userInfosStore, metaMaskStore } = useStores()
  const { vaultAddr, vaultDecimals } = props
  const store = userInfosStore.storeMap[vaultAddr.toLowerCase()]
  const forceUpdate = useForceUpdate()

  let isShowLoader =
    metaMaskStore.isConnecting || store === undefined || store.isFething || store.value === null

  useEffect(() => {
    const timer = setTimeout(forceUpdate, 2000)
    return () => {
      clearTimeout(timer)
    }
  }, [isShowLoader, metaMaskStore.walletAddress, metaMaskStore.inited])

  if (!metaMaskStore.walletAddress) {
    return <>–</>
  }

  if (isShowLoader) {
    return <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
  }

  return (
    <Amount
      standartWidth
      prefix="$"
      value={store.value?.depositedUnderlyingUsdc}
      decimals={18} // we use reader => all numbers normalized to 18
      tooltipInner={<div>Underlying: {formatUnits(store.value.depositedUnderlying)}</div>}
      fontSize={14}
      style={{
        fontFamily: 'Source Sans Pro',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '24px',
        color: '#fff',
      }}
    />
  )
})
