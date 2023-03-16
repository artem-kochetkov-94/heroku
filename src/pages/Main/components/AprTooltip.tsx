import React, { useEffect } from 'react'
import { useStores } from '../../../stores/hooks'
import { observer } from 'mobx-react'
import { Spin, Row } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { formatUnits } from '@ethersproject/units'
import { getAssetsIconMap } from '../../../static/tokens'
import unknownIcon from '../../../static/UNKNOWN.png'
import { calcAmount, calcApr } from '../../../utils'
import { TetuSwapLPAbi } from '../../../abi/TetuSwapLP'
import { contractReaderChainStore } from '../../../stores'
import { BigNumber } from 'ethers'

const antSmallIcon = <LoadingOutlined style={{ fontSize: 18 }} spin />

type AprTooltipInnerProps = {
  rewardTokens: string[]
  rewardsApr: string[]
  ppfs: string
  inner?: any
  customApr?: any
  buyBackRatio?: string
  underlingApr?: any[]
  vault?: any
}

export const AprTooltipInner: React.FC<AprTooltipInnerProps> = observer((props) => {
  const { namesManagerStore, networkManager } = useStores()
  const { rewardTokens, rewardsApr, ppfs, inner = null, buyBackRatio, underlingApr, vault } = props

  const APR = Number(parseFloat(formatUnits(ppfs)).toFixed(2))
  const period = 365
  const APY = (Math.pow(1 + APR / 100 / period, period) - 1) * 100
  let isAutocompond = true

  if (
    networkManager.addresses.excludeAutocompoundAprAddrs
      .map((el: string) => el.toLowerCase())
      .includes(vault?.addr?.toLowerCase())
  ) {
    isAutocompond = false
  }

  return (
    <div>
      {isAutocompond && (
        <div>
          <div>
            Autocompound: {APR}% (APY: {parseFloat(APY + '').toFixed(2)}%)
          </div>
        </div>
      )}
      {!!underlingApr?.length && (
        <div style={{ marginTop: 6, marginBottom: 6 }}>
          <div>Autocompound underling:</div>
          {underlingApr.map((el) => {
            const APR = parseFloat(formatUnits(el.ppfsApr)).toFixed(2)
            const APY = parseFloat(
              (Math.pow(1 + Number(formatUnits(el.ppfsApr)) / 100 / period, period) - 1) * 100 + '',
            ).toFixed(2)

            return (
              <div>
                {el.name}: {APR}% (APY: {APY}%)
              </div>
            )
          })}
        </div>
      )}

      {!!rewardTokens?.length && (
        <div>
          <div>Reward tokens APR:</div>
          {rewardTokens.map((tokenAddr, index) => {
            const apr = rewardsApr[index]
            const name = namesManagerStore.getAssetName(tokenAddr)
            const period = 12
            const APY = (Math.pow(1 + Number(formatUnits(apr)) / 100 / period, period) - 1) * 100

            return (
              <div>
                {name ? (
                  <Row align="middle">
                    <img
                      style={{ height: 20, marginRight: 4 }}
                      // @ts-ignore
                      src={getAssetsIconMap()[name] ?? unknownIcon}
                      alt=""
                    />
                    <div key={tokenAddr}>
                      {name}: {parseFloat(formatUnits(apr)).toFixed(2)}% (APY:{' '}
                      {parseFloat(APY + '').toFixed(2)}%)
                    </div>
                  </Row>
                ) : (
                  <div key={tokenAddr}>
                    <Spin indicator={antSmallIcon} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {inner}
    </div>
  )
})

//
// useEffect(() => {
//   const asyncWrapper = async () => {
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
//           const nextApr = calcAmount([
//             apr,
//             calcApr(el.vault.rewardsApr, el.vault.ppfsApr, el.vault.decimals).toString(),
//           ])
//
//           setApr(nextApr)
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
//   }
//
//   asyncWrapper().then(async () => {
//     if (vault.platform === '12') {
//       const contract = new web3Store.web3.eth.Contract(
//         // @ts-ignore
//         TetuSwapLPAbi,
//         vault.underlying,
//       )
//
//       const underlineVaults = await Promise.allSettled([
//         contract.methods.vault0().call(),
//         contract.methods.vault1().call(),
//       ])
//
//       const response = await Promise.allSettled([
//         ...underlineVaults.map((el: any) => contractReaderChainStore.getVaultPpfsApr(el.value)),
//         ...underlineVaults.map((el: any) => contractReaderChainStore.getVaultName(el.value)),
//       ])
//
//       const values: string[] = response.map((el: any) => el.value)
//       const [vault0PpfsApr, vault1PpfsApr, vault0Name, vault1Name] = values
//
//       const apr1 = Number(parseFloat(formatUnits(vault0PpfsApr)).toFixed(2)) / 2
//       const apr2 = Number(parseFloat(formatUnits(vault1PpfsApr)).toFixed(2)) / 2
//
//       const prevApr = apr
//
//       inner2.current = (
//         <div>
//           {/*{vault.name}*/}
//           prev: {prevApr}; sum:{' '}
//           {formatUnits(
//             calcAmount([
//               prevApr,
//               BigNumber.from(vault0PpfsApr).div(2).toString(),
//               BigNumber.from(vault1PpfsApr).div(2).toString(),
//             ]),
//           )}
//           <div>
//             Autocompound {vault0Name}: {apr1}%
//           </div>
//           <div>
//             Autocompound {vault1Name}: {apr2}%
//           </div>
//         </div>
//       )
//
//       setApr(
//         calcAmount([
//           apr,
//           BigNumber.from(vault0PpfsApr).div(2).toString(),
//           BigNumber.from(vault1PpfsApr).div(2).toString(),
//         ]),
//       )
//     }
//   })
// }, [vault.addr])
