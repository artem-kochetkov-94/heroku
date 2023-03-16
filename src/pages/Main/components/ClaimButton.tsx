import React, { FC, useEffect } from 'react'
import { RewardsIcon } from './RewarsIcons'
import { millifyValue } from '../../../utils'
import { Button, Row, Spin } from 'antd'
import { observer } from 'mobx-react'
import { useStores } from '../../../stores/hooks'
import { LoadingOutlined } from '@ant-design/icons'
import { formatUnits } from 'ethers/lib/utils'
import { sum } from '../../../utils'
import { useForceUpdate } from '../../../hooks'

const antIcon = <LoadingOutlined style={{ fontSize: 16, marginRight: 8 }} spin />

type ClaimButtonProps = { vault: any; padding?: number }

export const ClaimButton: FC<ClaimButtonProps> = observer((props) => {
  const { transactionStorageStore, metaMaskStore, userInfosStore } = useStores()
  const forceUpdate = useForceUpdate()

  const { vault, padding = 0 } = props
  const store = userInfosStore.storeMap[vault.addr.toLowerCase()]
  const claimTx = Object.values(transactionStorageStore.getData()).find((el: any) => {
    return el.vaultAddress.toLowerCase() === vault.addr.toLowerCase()
  })
  let percent = null

  const isShowLoader = metaMaskStore.walletAddress
    ? metaMaskStore.isConnecting ||
      store === undefined ||
      (metaMaskStore.walletAddress && store.value === null)
    : false

  useEffect(() => {
    const timer = setTimeout(forceUpdate, 2000)
    return () => {
      clearTimeout(timer)
    }
  }, [isShowLoader])

  const rewardTokens = vault.rewardTokensBal
    .map((el: string, index: number) => (el === '0' ? null : vault.rewardTokens[index]))
    .filter((el: string | null) => el !== null)

  const Icons = (
    <div style={{ padding: `0px ${padding}px` }}>
      <Row align="middle">
        {claimTx ? antIcon : null}
        <RewardsIcon rewardTokens={rewardTokens} />
      </Row>
    </div>
  )

  if (isShowLoader) {
    return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  }

  if (
    !metaMaskStore.walletAddress ||
    store?.value?.rewardsBoostUsdc.filter((el: string) => el !== '0').length === 0
  ) {
    return Icons
  }

  const calcRewardsUsdc = millifyValue(formatUnits(sum(store.value?.rewardsBoostUsdc)), true)

  if (calcRewardsUsdc === '0') {
    return Icons
  }

  if (store.value?.rewardTokens?.[0]) {
    const index = 0
    const reward = store.value?.rewards[index]
    const rewardUSDC = store.value?.rewardsUsdc[index]
    const rewardBoost = store.value?.rewardsBoost[index]
    const rewardBoostUSDC = store.value?.rewardsBoostUsdc[index]

    if (
      reward != 0 &&
      rewardUSDC != 0 &&
      rewardBoost != 0 &&
      rewardBoostUSDC != 0 &&
      percent === null
    ) {
      percent = (Number(rewardBoost) / Number(reward)) * 100
    }
  }

  return (
    <Button
      size="small"
      className="main-page-claim-btn"
      onClick={() => {
        // @ts-ignore
        // if (!claimTx) {
        //   vaultOperationPageStore.claim(vault.addr)
        // }
      }}
    >
      <div className="line" style={{ backgroundSize: `${percent}% 100%` }}></div>
      <Row align="middle" wrap={false}>
        {claimTx ? antIcon : null}
        <RewardsIcon rewardTokens={vault.rewardTokens} />
        <span style={{ marginLeft: 4 }}>$ {calcRewardsUsdc}</span>
      </Row>
    </Button>
  )
})
