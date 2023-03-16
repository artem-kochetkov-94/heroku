import { useEffect } from 'react'
import { useStores } from '../../../stores/hooks'
import { Spin, Row, Col } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'
import { Amount } from '../../../components/Amount'
import { useForceUpdate } from '../../../hooks'
import { getAssetsIconMap } from '../../../static/tokens'
import unknownIcon from '../../../static/UNKNOWN.png'

const antIcon = <LoadingOutlined style={{ fontSize: 18, marginLeft: 15 }} spin />

export const TotalRewards = observer(() => {
  const { mainPageStore, namesManagerStore, metaMaskStore, networkManager } = useStores()
  const forceUpdate = useForceUpdate()
  const assetsIconMap = getAssetsIconMap()

  useEffect(() => {
    let interval: any = null

    if (
      metaMaskStore.inited &&
      networkManager.inited &&
      mainPageStore.isLoadedTableData &&
      metaMaskStore.walletAddress &&
      mainPageStore.userInfosStore.isFetched &&
      !mainPageStore.userInfosStore.isFetching
    ) {
      interval = setInterval(() => {
        mainPageStore.refetchUserInfo()
      }, 60 * 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [
    metaMaskStore.inited,
    networkManager.inited,
    networkManager.networkId,
    mainPageStore.isLoadedTableData,
    metaMaskStore.walletAddress,
    mainPageStore.userInfosStore.isFetched,
    mainPageStore.userInfosStore.isFetching,
  ])

  if (!metaMaskStore.walletAddress) {
    return (
      <div className="main-user-info-wrapper">
        <div className="total-rewards"></div>
      </div>
    )
  }

  return (
    <div className="main-user-info-wrapper">
      <div className="total-rewards">
        <Row gutter={4}>
          {mainPageStore.totalRewardsBoostToClaim === null ? (
            <p style={{ marginBottom: 0 }}>No Deposits</p>
          ) : (
            <>
              <div className="reward-list">
                {mainPageStore.totalRewardsBoostToClaim.items.map((el: any, index: number) => {
                  const name = namesManagerStore.getAssetName(el.token)

                  if (name === null) {
                    setTimeout(forceUpdate, 1000)
                  }

                  if (el.amountUsdc === '0') {
                    return null
                  }

                  return (
                    <div
                      className="list-item-wrapper"
                      style={{
                        marginBottom:
                          mainPageStore.totalRewardsBoostToClaim.items.length - 1 === index ? 0 : 4,
                      }}
                    >
                      <div className="list-item">
                        <Amount
                          address={el.token}
                          // @ts-ignore
                          key={el.token}
                          style={{ display: 'block', marginRight: 5 }}
                        >
                          <img
                            style={{ height: 18, marginRight: 5 }}
                            // @ts-ignore
                            src={assetsIconMap?.[name] ?? unknownIcon}
                            alt=""
                          />
                          <span className="token-name">{name}:</span>{' '}
                        </Amount>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span
                            style={{
                              marginLeft: 4,
                              marginRight: 8,
                              padding: '0px 4px',
                              background: '#384559',
                              borderRadius: 4,
                            }}
                          >
                            <Amount value={el.amount} style={{ display: 'block' }} />
                          </span>

                          <Amount
                            value={el.amountUsdc}
                            prefix="$"
                            style={{ marginLeft: 0, display: 'block' }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </Row>
      </div>
    </div>
  )
})
