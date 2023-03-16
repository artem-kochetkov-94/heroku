import React, { useState } from 'react'
import { Button, Typography, Col, Popconfirm } from 'antd'
import { formatAmountUsdc } from '../../utils'
import { sum } from '../../../../../../utils'
import { getAssetsIconMap } from '../../../../../../static/tokens'
import { useStores } from '../../../../../../stores/hooks'
import { observer } from 'mobx-react'
import { Progress } from './progress'
import { formatUnits } from '@ethersproject/units'
import day from 'dayjs'
import { useCheckProtectionMode } from '../../../hooks'
import { useFetchRewardsBoostData } from '../../hooks'

export const Rewards = observer(() => {
  const { userInfoOfVaultStore, vaultOperationPageStore, namesManagerStore } = useStores()
  const [claimWithConfirmModal, setClaimWithConfirmModal] = useState(true)
  const { isFetchingClaim, isPendingClaim } = vaultOperationPageStore
  const rewardsBoost = useFetchRewardsBoostData()
  const userInfo = userInfoOfVaultStore.value
  const handleClickClaim = () => vaultOperationPageStore.claim()

  // @ts-ignore
  const hasProtecktionMode = useCheckProtectionMode(
    vaultOperationPageStore.vaultDataPageStore.data?.addr,
  )

  const hasRewards =
    (userInfo?.rewards?.length ?? 0) > 0 &&
    userInfo?.rewards.filter((el: string) => el !== '0').length > 0

  if (rewardsBoost.data === null) {
    return null
  }

  const { rewardRatioWithoutBoost, rewardBoostDuration } = rewardsBoost.data

  return hasRewards ? (
    <Col span={24}>
      <div className="app-paper">
        <div className="rewards-row">
          <div className="rewards-col">
            <div>
              <Typography.Text
                style={{
                  display: 'block',
                  marginBottom: 24,
                  marginRight: 5,
                  fontSize: 20,
                  fontFamily: 'Source Sans Pro',
                  fontWeight: 600,
                  lineHeight: '24px',
                  color: '#ffffff',
                }}
              >
                Rewards
                {/* Rewards: ${parseFloat(formatUnits(sum([...userInfo?.rewardsBoostUsdc]))).toFixed(2)} */}
              </Typography.Text>
            </div>
            {userInfo?.rewardTokens.map((tokenAddr: string, index: number) => {
              const reward = userInfo?.rewards[index]
              const rewardUSDC = userInfo?.rewardsUsdc[index]
              const name = namesManagerStore.getAssetName(tokenAddr)
              const rewardBoost = userInfo.rewardsBoost[index]
              const rewardBoostUSDC = userInfo.rewardsBoostUsdc[index]

              const now = new Date()
              const max_day = rewardBoostDuration / 60 / 60 / 24
              const rewardPercent = (rewardBoost / reward) * 100
              const k1 = hasProtecktionMode
                ? rewardPercent / 100
                : (rewardPercent - rewardRatioWithoutBoost) / (100 - rewardRatioWithoutBoost) // процентов начислено
              const dd = max_day - max_day * k1
              const dateLeft = day(now).add(dd, 'day').format('DD MMMM HH:mm')

              if (reward == 0 || rewardUSDC == 0 || rewardBoost == 0 || rewardBoostUSDC == 0) {
                return
              }

              if (claimWithConfirmModal) {
                if (parseFloat(rewardBoost) >= parseFloat(reward)) {
                  setClaimWithConfirmModal(false)
                }
              }

              return (
                <>
                  <Progress
                    {...{
                      name,
                      reward,
                      rewardUSDC,
                      rewardBoost,
                      rewardBoostUSDC,
                      dd,
                    }}
                  />
                  <div style={{ marginBottom: 24 }}>
                    <Typography.Text style={{ fontSize: 12, marginRight: 5, opacity: 0.6 }}>
                      100% rewards on {dateLeft}
                    </Typography.Text>
                  </div>
                </>
              )
            })}
          </div>

          <div className="rewards-col rewards-col-btn">
            {claimWithConfirmModal || true ? (
              <Popconfirm
                placement="top"
                title={
                  <>
                    <p>Are you sure you want to claim?</p>
                    <p>
                      If you don't have a 100% boost, you will only have a fraction of your rewards.
                    </p>
                  </>
                }
                onConfirm={isPendingClaim || isFetchingClaim ? () => {} : handleClickClaim}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  shape="round"
                  className="btn-claim"
                  onClick={() => {}}
                  loading={isPendingClaim || isFetchingClaim}
                >
                  <strong>Claim </strong> ${' '}
                  {parseFloat(formatUnits(sum([...userInfo?.rewardsBoostUsdc]))).toFixed(2)}
                </Button>
              </Popconfirm>
            ) : (
              <Button
                shape="round"
                className="btn-claim"
                onClick={isPendingClaim || isFetchingClaim ? () => {} : handleClickClaim}
                loading={isPendingClaim || isFetchingClaim}
              >
                <strong>Claim </strong> ${' '}
                {parseFloat(formatUnits(sum([...userInfo?.rewardsBoostUsdc]))).toFixed(2)}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Col>
  ) : null
})
