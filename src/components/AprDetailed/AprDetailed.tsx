import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { useStores } from '../../stores/hooks'
import { Row, Col, Spin } from 'antd'
import { vaultChainStore } from '../../stores'
import { calcAmount, formatAdress } from '../../utils'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { TetuSwapLPAbi } from '../../abi/TetuSwapLP'
import day from 'dayjs'
import { getAssetsIconMap } from '../../static/tokens'
import unknownIcon from '../../static/UNKNOWN.png'
import { VaultAbi } from '../../abi/Vault'
import { LoadingOutlined } from '@ant-design/icons'
import { addressesMap } from '../../networks/Addresses'
import { networkManager } from '../../stores/chain-stores/network-manager'

import './styles.css'

export type AprDetailedProps = {
  vault: any
}

const computePpfsApr = (curPpfs: string, startPpfs: string, curTime: string, startTime: string) => {
  const PRECISION =
    '1' +
    Array.from({ length: 18 })
      .map((_) => '0')
      .join('')

  if (parseFloat(curPpfs) <= parseFloat(startPpfs)) {
    return '0'
  }

  const ppfsChange = BigNumber.from(curPpfs).sub(BigNumber.from(startPpfs))
  const timeChange = BigNumber.from(curTime).sub(BigNumber.from(startTime))

  return ppfsChange
    .mul(PRECISION)
    .div(timeChange)
    .mul(365 * 24 * 60 * 60)
    .mul(100)
    .div(PRECISION)
    .toString()
}

const computeBlocks = (points: number[], currentBlock: number) => {
  return points.map(
    (point) => currentBlock - point * networkManager.blockPeriods.block_at_day_period,
  )
}

const calcWeeklyPoints = (totalDays: number, currentBlock: number) => {
  if (totalDays < 7) {
    const point = totalDays / 2
    return computeBlocks([point * 0.5, point, point * 1.5, point * 2], currentBlock)
  }
  const points = [1, 2, 3, 4, 5, 6, 7]
  return computeBlocks(points, currentBlock)
}

const calcMonthlyPoints = (totalDays: number, currentBlock: number) => {
  if (totalDays > 28) {
    const points = [1, 5, 10, 14, 19, 23, 25, 28]
    return computeBlocks(points, currentBlock)
  }
  if (totalDays < 28 && totalDays > 14) {
    const points = [1, 3, 7, 10, 12, 14]
    return computeBlocks(points, currentBlock)
  }
  if (totalDays > 1) {
    return calcWeeklyPoints(totalDays, currentBlock)
  }
  return [currentBlock, currentBlock]
}

const calcYearlyPoints = (totalDays: number, currentBlock: number) => {
  const monthCount = Math.trunc(totalDays / 28)

  if (monthCount === 0) {
    return calcMonthlyPoints(totalDays, currentBlock)
  }

  const points = Array.from({ length: monthCount * 3 }).map((_, index) => (index + 1) * 10)
  return computeBlocks(points, currentBlock)
}

export const AprDetailed: React.FC<AprDetailedProps> = observer((props) => {
  const { vault } = props
  const { contractReaderChainStore, web3Store, namesManagerStore, networkManager } = useStores()
  const [isFetching, setIsFetching] = useState(true)
  const [data, setData] = useState<any>(null)
  const [hasNotData, setHasNotData] = useState(false)
  const hasVaulUnderling =
    vault.platform === '12' ||
    vault.addr.toLowerCase() ===
      addressesMap.aliases.matic.config.addresses.vaults.dxTETU.toLowerCase()

  const getCreatedDays = async (addr: string) => {
    const vaultContarct = new web3Store.web3.eth.Contract(
      // @ts-ignore
      VaultAbi,
      addr,
    )
    const created = await vaultContarct.methods.created().call()
    const cretedAt = day(new Date(created * 1000))
    const now = day(new Date())
    const diffDays = now.diff(cretedAt, 'days')
    return diffDays
  }

  const fetchBlocks = async (addr: string) => {
    const currentBlock = await web3Store.web3.eth.getBlockNumber()
    const diffDays = await getCreatedDays(addr)

    const weekly = calcWeeklyPoints(diffDays, currentBlock)
    const monthly = calcMonthlyPoints(diffDays, currentBlock)
    const yearly = calcYearlyPoints(diffDays, currentBlock)

    return {
      weekly,
      monthly,
      yearly,
    }
  }

  const fetchAutocompoundApr = async (blocks: any, addr?: string) => {
    const fetch = async (blocks: number[]) => {
      const promies = blocks.map((block: number) => {
        return Promise.allSettled([
          vaultChainStore.getPricePerFullShare(addr ?? vault.addr, block).catch(console.log),
          web3Store.web3.eth.getBlock(block),
        ])
      })

      return await Promise.allSettled(promies)
    }

    const [resWeekly, resMonthly, resYearly]: any = await Promise.allSettled([
      fetch(blocks.weekly),
      fetch(blocks.monthly),
      fetch(blocks.yearly),
    ])

    const handleResponse = (response: any) => {
      const values = response
        // @ts-ignore // TODO:
        .map((el: any) => {
          const [prPpfs, prBlock] = el.value
          return [prPpfs.value, prBlock.value.timestamp]
        })
        // @ts-ignore // TODO:
        .filter((el) => el[0] !== '0')

      const calcPpfsApr = values.reduce((acc: any, item: any, index: number) => {
        if (index !== values.length - 1) {
          acc.push(
            computePpfsApr(
              values[index][0],
              values[index + 1][0],
              values[index][1],
              values[index + 1][1],
            ),
          )
        }
        return acc
      }, [])

      if (calcPpfsApr.length === 0) {
        return '0'
      }

      if (calcPpfsApr.length === 1) {
        return calcPpfsApr[0]
      }

      return BigNumber.from(calcAmount(calcPpfsApr)).div(calcPpfsApr.length).toString()
    }

    const weekly = handleResponse(resWeekly.value)
    const monthly = handleResponse(resMonthly.value)
    const yearly = handleResponse(resYearly.value)

    return {
      weekly,
      monthly,
      yearly,
    }
  }

  const fetchTokenApr = async (blocks: any) => {
    const fetch = (blocks: number[]) => {
      const promises = blocks.map(async (block) => {
        const promises = vault.rewardTokens.map((tokenAddr: string) => {
          return contractReaderChainStore.getComputeRewardApr(vault.addr, tokenAddr, block)
        })
        return await Promise.allSettled(promises)
      })
      return Promise.allSettled(promises)
    }

    const [weeklyRes, monthlyRes, yearlyRes]: any[] = await Promise.allSettled([
      fetch(blocks.weekly),
      fetch(blocks.monthly),
      fetch(blocks.yearly),
    ])

    const handleResponse = (response: any, blocks: any) => {
      return response
        .map((el: any, index: any) => {
          return {
            // @ts-ignore
            block: blocks[index],
            vaulAddr: vault.addr,
            // @ts-ignore
            computeRewardsApr: el.value.map((el, index) => {
              return {
                tokenAddr: vault.rewardTokens[index],
                value: el.value,
              }
            }),
          }
        })
        .reduce((acc: any, item: any) => {
          item.computeRewardsApr.forEach((el: any) => {
            if (el.value !== '0') {
              Array.isArray(acc[el.tokenAddr])
                ? acc[el.tokenAddr].push(el.value)
                : (acc[el.tokenAddr] = [el.value])
            }
          })
          return acc
        }, {})
    }

    const resultWeekly = handleResponse(weeklyRes.value, blocks.weekly)
    const resultMonthly = handleResponse(monthlyRes.value, blocks.monthly)
    const resultYearly = handleResponse(yearlyRes.value, blocks.yearly)

    const sum = (values: string[] | undefined) => {
      if (values === undefined) {
        return '0'
      }
      return BigNumber.from(calcAmount(values)).div(values.length).toString()
    }

    const result = vault.rewardTokens.map((tokenAddr: string) => {
      return {
        rewardAddr: tokenAddr,
        weekly: sum(resultWeekly[tokenAddr]),
        monthly: sum(resultMonthly[tokenAddr]),
        yearly: sum(resultYearly[tokenAddr]),
      }
    })

    return result
  }

  const fetchAutocompoundVaultUnderlingApr = async () => {
    const contract = new web3Store.web3.eth.Contract(
      // @ts-ignore
      TetuSwapLPAbi,
      vault.underlying,
    )

    if (
      vault.addr.toLowerCase() ===
      addressesMap.aliases.matic.config.addresses.vaults.dxTETU.toLowerCase()
    ) {
      const vault0 = networkManager.addresses.core.PS!
      const vault0blocks = await fetchBlocks(vault0)
      const response = await Promise.allSettled([
        fetchAutocompoundApr(vault0blocks, vault0),
        contractReaderChainStore.getVaultName(vault0),
      ])
      const values: any = response.map((el: any) => el.value)
      const [vault0PpfsApr, vault0Name] = values
      return [
        {
          vaultName: vault0Name,
          vaultAddr: vault0,
          weekly: vault0PpfsApr.weekly,
          monthly: vault0PpfsApr.monthly,
          yearly: vault0PpfsApr.yearly,
        },
      ]
    }

    const underlineVaultsResponse = await Promise.allSettled([
      contract.methods.vault0().call(),
      contract.methods.vault1().call(),
    ])

    const underlineVaults = underlineVaultsResponse.map((el: any) => el.value)

    const [vault0, vault1] = underlineVaults

    const vault0blocks = await fetchBlocks(vault0)
    const vault1blocks = await fetchBlocks(vault1)

    const blocks = [vault0blocks, vault1blocks]

    const response = await Promise.allSettled([
      ...underlineVaults.map((el: any, index) => fetchAutocompoundApr(blocks[index], el)),
      ...underlineVaults.map((el: any) => contractReaderChainStore.getVaultName(el)),
    ])

    const values: any = response.map((el: any) => el.value)

    const [vault0PpfsApr, vault1PpfsApr, vault0Name, vault1Name] = values

    const format = (v: string) => {
      return BigNumber.from(v).div(2).toString()
    }

    const result = [
      {
        vaultName: vault0Name,
        vaultAddr: underlineVaults[0],
        weekly: format(vault0PpfsApr.weekly),
        monthly: format(vault0PpfsApr.monthly),
        yearly: format(vault0PpfsApr.yearly),
      },
      {
        vaultName: vault1Name,
        vaultAddr: underlineVaults[1],
        weekly: format(vault1PpfsApr.weekly),
        monthly: format(vault1PpfsApr.monthly),
        yearly: format(vault1PpfsApr.yearly),
      },
    ]

    return result
  }

  const loadData = async () => {
    setIsFetching(true)
    const days = await getCreatedDays(vault.addr)

    if (days > 5) {
      const blocks = await fetchBlocks(vault.addr)
      const rewardTokens = await fetchTokenApr(blocks)
      const autocompound = await fetchAutocompoundApr(blocks)
      const vaultUnderling = hasVaulUnderling ? await fetchAutocompoundVaultUnderlingApr() : null

      setData({
        rewardTokens,
        autocompound,
        vaultUnderling,
      })
    } else {
      setHasNotData(true)
    }
    setIsFetching(false)
  }

  useEffect(() => {
    loadData()

    return () => {
      setIsFetching(true)
      setData(null)
      setHasNotData(false)
    }
  }, [vault, hasVaulUnderling])

  const calcAPY = (val: string) => {
    const period = 12
    const APY = (Math.pow(1 + Number(val) / 100 / period, period) - 1) * 100
    return parseFloat(APY + '').toFixed(2)
  }

  const Values: React.FC<any> = (props: any) => {
    const { title, weekly, monthly, yearly } = props

    if (weekly === '0.00') {
      return null
    }

    return (
      <>
        {title && <div className="apr-detailed-sub-title">{title}:</div>}
        <div className="apr-detailed-values">
          <div className="apr-detailed-item">
            <div className="apr-detailed-label">Yearly average</div>
            <div className="apr-detailed-value">
              {yearly === '0.00' ? (
                '-'
              ) : (
                <>
                  {yearly} % (APY {calcAPY(yearly)} %)
                </>
              )}
            </div>
          </div>
          <div className="apr-detailed-item">
            <div className="apr-detailed-label">Monthly average</div>
            <div className="apr-detailed-value">
              {monthly === '0.00' ? (
                '-'
              ) : (
                <>
                  {monthly} % (APY {calcAPY(monthly)} %)
                </>
              )}
            </div>
          </div>
          <div className="apr-detailed-item">
            <div className="apr-detailed-label">Weekly average</div>
            <div className="apr-detailed-value">
              {weekly === '0.00' ? (
                '-'
              ) : (
                <>
                  {weekly} % (APY {calcAPY(weekly)} %)
                </>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  const formatApr = (v: string, formated: boolean = false) => {
    if (formated) {
      return parseFloat(v + '').toFixed(2)
    }
    return parseFloat(formatUnits(v)).toFixed(2)
  }

  const checkShowRewards = (rewards: any[]) => {
    const count = rewards.reduce((acc, item) => {
      if (item.weekly !== '0' && item.monthly !== '0' && item.yearly !== '0') {
        return acc + 1
      }
      return acc
    }, 0)

    return count > 0
  }

  const isZeroAutocompound =
    !data?.autocompound ||
    (data?.autocompound?.yearly === '0' &&
      data?.autocompound?.weekly === '0' &&
      data?.autocompound?.monthly === '0')

  if (hasNotData && !isFetching) {
    return (
      <div>
        <Row style={{ height: 400 }} justify="center" align="middle">
          <Col>
            <Row align="middle">
              <span style={{ fontSize: 30 }}>Vault deployed less than a week ago</span>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }

  return (
    <>
      {data === null || isFetching ? (
        <div>
          <Row style={{ height: 400 }} justify="center" align="middle">
            <Col>
              <Row align="middle">
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 32, marginRight: 8 }} spin />}
                />
                <span style={{ fontSize: 30 }}>Loading apr...</span>
              </Row>
            </Col>
          </Row>
        </div>
      ) : (
        <div className="apr-detailed">
          {(hasVaulUnderling || !isZeroAutocompound) && (
            <div style={{ marginBottom: 40 }}>
              {(hasVaulUnderling || !isZeroAutocompound) && (
                <div className="apr-detailed-title">Autocompound:</div>
              )}
              {!isZeroAutocompound && (
                <>
                  <Values
                    title="Underlying"
                    yearly={formatApr(data.autocompound.yearly)}
                    weekly={formatApr(data.autocompound.weekly)}
                    monthly={formatApr(data.autocompound.monthly)}
                  />
                </>
              )}

              {hasVaulUnderling && (
                <>
                  <br />
                  <div className="apr-detailed-sub-title">Underlying:</div>
                  {data?.vaultUnderling?.map((el: any) => {
                    const prefix =
                      vault.addr.toLowerCase() ===
                      addressesMap.aliases.matic.config.addresses.vaults.dxTETU.toLowerCase()
                        ? ''
                        : '50% '
                    return (
                      <Values
                        key={el.vaultName}
                        title={prefix + el.vaultName}
                        yearly={formatApr(el.yearly)}
                        weekly={formatApr(el.weekly)}
                        monthly={formatApr(el.monthly)}
                      />
                    )
                  })}
                </>
              )}
            </div>
          )}

          {checkShowRewards(data?.rewardTokens) && (
            <>
              {!isZeroAutocompound && !isZeroAutocompound && <br />}
              <div className="apr-detailed-title">Reward tokens:</div>
              {data.rewardTokens.map((el: any) => {
                const name = namesManagerStore.getAssetName(el.rewardAddr)
                const icon = (
                  <img
                    // @ts-ignore
                    src={getAssetsIconMap()[name] ?? unknownIcon}
                    className={`apr-detailed-item-icon`}
                    alt=""
                  />
                )
                const title = (
                  <div style={{ display: 'inline-block' }}>
                    <Row align="middle">
                      <Col>{icon}</Col>
                      <Col>{name ?? formatAdress(el.rewardAddr)}</Col>
                    </Row>
                  </div>
                )
                return (
                  <Values
                    title={title}
                    yearly={formatApr(el.yearly)}
                    monthly={formatApr(el.monthly)}
                    weekly={formatApr(el.weekly)}
                  />
                )
              })}
            </>
          )}

          <div className="apr-detailed-title" style={{ marginTop: 40 }}>
            Total:
          </div>
          <Values
            yearly={formatApr(
              calcAmount(
                [
                  data?.autocompound?.yearly,
                  ...(data?.vaultUnderling?.map((el: any) => el.yearly) ?? []),
                  ...(data?.rewardTokens?.map((el: any) => el.yearly) ?? []),
                ].filter((el) => !!el),
              ),
            )}
            monthly={formatApr(
              calcAmount(
                [
                  data?.autocompound?.monthly,
                  ...(data?.vaultUnderling?.map((el: any) => el.monthly) ?? []),
                  ...(data?.rewardTokens?.map((el: any) => el.monthly) ?? []),
                ].filter((el) => !!el),
              ),
            )}
            weekly={formatApr(
              calcAmount(
                [
                  data?.autocompound?.weekly,
                  ...(data?.vaultUnderling?.map((el: any) => el.weekly) ?? []),
                  ...(data?.rewardTokens?.map((el: any) => el.weekly) ?? []),
                ].filter((el) => !!el),
              ),
            )}
          />
        </div>
      )}
    </>
  )
})
