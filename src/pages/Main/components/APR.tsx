import React, { useState, useMemo } from 'react'
import { calcApr } from '../../../utils'
import { Amount } from '../../../components/Amount'
import { AprTooltipInner } from './AprTooltip'
import { useStores } from '../../../stores/hooks'
import { observer } from 'mobx-react'
import { calcAmount } from '../../../utils/amount'
import { formatUnits } from 'ethers/lib/utils'

import { CalculatorOutlined, LoadingOutlined, RedoOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { AprDetailed } from '../../../components/AprDetailed'
import { VaultRow } from '../../../components/VaultRow'
import { getVaultUnderlingApr } from '../../../api/apr'

type APRProps = {
  vault: any
}

const computedApr: any = {
  // polygon dxTETU
  '0xacee7bd17e7b04f7e48b29c0c91af67758394f0f': ['0x225084d30cc297f3b177d9f93f5c3ab8fb6a1454'], // xTETU
}

export const APR: React.FC<APRProps> = observer((props) => {
  const { mainPageStore, contractReaderChainStore, web3Store } = useStores()

  const { vault } = props

  let apr = calcApr(vault.rewardsApr, vault.ppfsApr, vault.decimals).toString()
  let { rewardTokens, rewardsApr, ppfsApr, buyBackRatio } = vault

  if (vault.addr in computedApr) {
    const rewards: any = {}

    rewardTokens.forEach((el: any, index: number) => {
      rewards[el] = {
        token: el,
        apr: rewardsApr[index],
      }
    })

    mainPageStore.tableData
      .filter((el: any) => {
        return computedApr[vault.addr].includes(el.vault.addr)
      })
      .forEach((el: any) => {
        ppfsApr = calcAmount([ppfsApr, el.vault.ppfsApr])

        apr = calcAmount([
          apr,
          // @ts-ignore
          calcApr(el.vault.rewardsApr, el.vault.ppfsApr, el.vault.decimals).toString(),
        ])

        el.vault.rewardTokens.forEach((token: string, index: number) => {
          const apr = el.vault.rewardsApr[index]

          if (token in rewards) {
            rewards[token].apr = calcAmount([rewards[token].apr, apr])
          } else {
            rewards[el] = {
              token,
              apr,
            }
          }
        })
      })

    if (Object.keys(rewards).length > 0) {
      rewardTokens = []
      rewardsApr = []

      Object.values(rewards).forEach((el: any) => {
        rewardTokens.push(el.token)
        rewardsApr.push(el.apr)
      })
    }
  }

  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  // const [loading, setLoading] = useState(false)

  //<RedoOutlined />

  const isAutocompond = buyBackRatio === '100'
  //
  // useEffect(() => {
  //   let isCancelled = false
  //
  //   const asyncWrapper = async () => {
  //     // setLoading(true)
  //
  //     let nextApr = Number(
  //       formatUnits(calcApr(vault.rewardsApr, vault.ppfsApr, vault.decimals).toString()),
  //     )
  //
  //     if (vault.addr in computedApr) {
  //       const rewards: any = {}
  //
  //       rewardTokens.forEach((el: any, index: number) => {
  //         rewards[el] = {
  //           token: el,
  //           apr: rewardsApr[index],
  //         }
  //       })
  //
  //       mainPageStore.currentNetworkData
  //         .filter((el: any) => {
  //           return computedApr[vault.addr].includes(el.vault.addr)
  //         })
  //         .forEach((el: any) => {
  //           ppfsApr = calcAmount([ppfsApr, el.vault.ppfsApr])
  //
  //           nextApr += Number(
  //             formatUnits(
  //               calcApr(el.vault.rewardsApr, el.vault.ppfsApr, el.vault.decimals).toString(),
  //             ),
  //           )
  //
  //           forceUpdate()
  //
  //           el.vault.rewardTokens.forEach((token: string, index: number) => {
  //             const apr = el.vault.rewardsApr[index]
  //
  //             if (token in rewards) {
  //               rewards[token].apr = calcAmount([rewards[token].apr, apr])
  //             } else {
  //               rewards[el] = {
  //                 token,
  //                 apr,
  //               }
  //             }
  //           })
  //         })
  //
  //       if (Object.keys(rewards).length > 0) {
  //         rewardTokens = []
  //         rewardsApr = []
  //
  //         Object.values(rewards).forEach((el: any) => {
  //           rewardTokens.push(el.token)
  //           rewardsApr.push(el.apr)
  //         })
  //       }
  //     }
  //
  //     if (vault.platform === '12') {
  //       const contract = new web3Store.web3.eth.Contract(
  //         // @ts-ignore
  //         TetuSwapLPAbi,
  //         vault.underlying,
  //       )
  //
  //       const underlineVaultsResponse = await Promise.allSettled([
  //         contract.methods.vault0().call(),
  //         contract.methods.vault1().call(),
  //       ])
  //
  //       const underlineVaults = underlineVaultsResponse.map((el: any) => el.value)
  //
  //       const response = await Promise.allSettled([
  //         ...underlineVaults.map((el: any) => contractReaderChainStore.getVaultPpfsApr(el)),
  //         ...underlineVaults.map((el: any) => contractReaderChainStore.getVaultName(el)),
  //       ])
  //
  //       const values: string[] = response.map((el: any) => el.value)
  //       const [vault0PpfsApr, vault1PpfsApr, vault0Name, vault1Name] = values
  //
  //       const apr1 = Number(formatUnits(vault0PpfsApr)) / 2
  //       const apr2 = Number(formatUnits(vault1PpfsApr)) / 2
  //
  //       //Autocompound
  //       inner.current = (
  //         <div>
  //           <div>
  //             {vault0Name}: {parseFloat(apr1 + '').toFixed(2)}%
  //           </div>
  //           <div>
  //             {vault1Name}: {parseFloat(apr2 + '').toFixed(2)}%
  //           </div>
  //         </div>
  //       )
  //
  //       nextApr += apr1 + apr2
  //     }
  //
  //     if (!isCancelled) {
  //       // setApr(nextApr)
  //     }
  //     // setLoading(false)
  //   }
  //
  //   // asyncWrapper()
  //
  //   return () => {
  //     // isCancelled = true
  //     // setLoading(true)
  //     // setApr(0)
  //   }
  // }, [vault.addr])
  //
  // const antIcon = <LoadingOutlined style={{ fontSize: 18, marginLeft: 15 }} spin />

  return (
    <>
      <div>
        <span
          onClick={(e) => {
            e.stopPropagation()
            showModal()
          }}
          style={{
            position: 'relative',
            zIndex: 10,
          }}
        >
          <Amount
            showIcon={false}
            canCopy={false}
            // @ts-ignore
            placement="topLeft"
            formated
            prefix="%"
            // @ts-ignore
            standartWidth
            fontSize={16}
            style={{ fontWeight: 500, display: 'inline-block' }}
            tooltipInner={
              <AprTooltipInner
                rewardTokens={rewardTokens}
                rewardsApr={rewardsApr}
                ppfs={ppfsApr}
                buyBackRatio={buyBackRatio}
                underlingApr={vault?.underlingApr}
                vault={vault}
              />
            }
          >
            {parseFloat(parseFloat(vault.totalApr + '').toFixed(2))}
            <span style={{ marginLeft: 6 }}>
              <CalculatorOutlined />
            </span>
            {isAutocompond && (
              <span style={{ marginLeft: 4 }}>
                <RedoOutlined />
              </span>
            )}
          </Amount>
        </span>
      </div>
      <Modal
        title={
          <VaultRow
            className="apr-detailed"
            assets={vault.assets}
            platform={vault.platform}
            small
            address={vault.addr}
            deactivated={!vault.active}
            networkName={vault.networkName}
          />
        }
        width={750}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        // @ts-ignore
        header={null}
      >
        <AprDetailed vault={vault} />
      </Modal>
    </>
  )
})
