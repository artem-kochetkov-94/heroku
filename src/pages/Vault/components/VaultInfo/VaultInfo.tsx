import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Table, Spin, Row, Col } from 'antd'
import { useStores } from '../../../../stores/hooks'
import moment from 'moment'
import { formatUnits } from '@ethersproject/units'
import { Amount } from '../../../../components/Amount'
import { getAssetsIconMap } from '../../../../static/tokens'
import unknownIcon from '../../../../static/UNKNOWN.png'
import copyIcon from '../../../../static/copy.svg'
import { millifyValue } from '../../../../utils'
import { platformIconsMap } from '../../../../static/platforms'
import LinkIcon from '../../../../static/link.svg'
import { formatName } from '../../../../components/Amount/utils'
import { LoadingOutlined } from '@ant-design/icons'
import { platformNameMap } from '../../../../components/VaultRow'
import { useParams } from 'react-router-dom'
import { Loader } from '../../../../components/Loader'
import { tetuStatsApi, tetuSharePriceApi } from '../../../../api/tetu-server'
import { ArrowUpOutlined } from '@ant-design/icons/lib/icons'

const columns = [
  {
    title: 'title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'value',
    dataIndex: 'value',
    key: 'value',
  },
]

export const VaultInfo: React.FC = observer(() => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    vaultInfoStore,
    networkManager,
    namesManagerStore,
    vaultPricePerFullShareStore,
    periodFinishForTokenStore,
    mainPageStore,
    web3Store,
    metaMaskStore,
  } = useStores()

  const vaultInfo = vaultInfoStore.value

  const { address } = useParams<{ address: string }>()

  useEffect(() => {
    if (vaultInfo === null) {
      vaultInfoStore.fetch(address)
      vaultPricePerFullShareStore.fetch(address)
    } else {
      if (periodFinishForTokenStore.value === null) {
        periodFinishForTokenStore.fetch(vaultInfo.addr, vaultInfo.rewardTokens)
      }
      if (vaultPricePerFullShareStore.value === null) {
        vaultPricePerFullShareStore.fetch(vaultInfo.addr)
      }
    }

    return () => {
      periodFinishForTokenStore.reset()
    }
  }, [vaultInfo])

  useEffect(() => {
    if (
      !mainPageStore.isLoadedTableData &&
      !mainPageStore.resourceStore.isFetching &&
      metaMaskStore.inited &&
      networkManager.inited
    ) {
      mainPageStore.fetchData()
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
    web3Store.getGasPrice()
  }, [
    mainPageStore.isLoadedTableData,
    mainPageStore.resourceStore.isFetching,
    metaMaskStore.inited,
    metaMaskStore.walletAddress,
    networkManager.inited,
  ])

  const handleClickCopy = (e: any, addr: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(addr ?? '')
  }

  if (
    vaultInfo === null ||
    vaultPricePerFullShareStore.value === null ||
    periodFinishForTokenStore.value === null ||
    isLoading
  ) {
    return (
      <Row align="middle" justify="center" style={{ minHeight: 300 }}>
        <Loader />
      </Row>
    )
  }

  const vaultData = mainPageStore.currentNetworkData?.find(
    (el: any) => el.vault.addr.toLowerCase() === address.toLowerCase(),
  )

  const subStrategies = vaultData?.vault?.subStrategies?.reduce((acc: any, item: any) => {
    const index = acc.findIndex((el: any) => el.platform === item.platform)
    if (index === -1) {
      acc.push(item)
    } else {
      acc[index] = {
        ...acc[index],
        ratio: String(Number(acc[index].ratio) + Number(item.ratio)),
      }
    }
    return acc
  }, [])

  const hasSubStrategies = subStrategies?.length > 0 ?? false

  const vaultLink = networkManager.network.blockExplorerUrls?.[0] + 'address/' + vaultInfo?.addr

  console.log('vaultInfo', JSON.parse(JSON.stringify(vaultInfo)))
  const dataSource = [
    {
      title: 'Users',
      value: vaultInfo?.users,
    },
    {
      title: 'Address',
      value: (
        <a href={vaultLink} target="_blank" rel="noreferrer">
          <img src={LinkIcon} alt="" style={{ marginRight: 12, marginBottom: 1 }} />
          {vaultInfo?.addr}
        </a>
      ),
    },
    {
      title: 'Created',
      value: moment(new Date(vaultInfo?.created * 1000).toString()).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Active',
      value: vaultInfo?.active ? (
        <span className="status">Active</span>
      ) : (
        <span className="status">Deactivated</span>
      ),
    },
    {
      title: 'Price Per Full Share',
      value: (
        <Amount
          value={vaultPricePerFullShareStore.value}
          toFixed={6}
          decimals={vaultInfo?.decimals}
        />
      ),
    },
    {
      title: 'TVL',
      value: <Amount value={vaultInfo?.tvl} />,
    },
    {
      title: 'TVL USDC',
      value: <Amount value={vaultInfo?.tvlUsdc} />,
    },
    {
      title: 'Reward duration',
      value: vaultInfo?.duration / (60 * 60 * 24) + ' days',
    },
    {
      title: 'Period finish for token',
      value: periodFinishForTokenStore.value?.map((el: string, index: number) => {
        if (vaultInfo.rewardTokensBal[index] === '0') {
          return null
        }

        const date = new Date(Number(el) * 1000).toString()
        const diffDays = moment(date).diff(moment(new Date()), 'days')
        const diffHours = moment(date).diff(moment(new Date()).add(diffDays, 'days'), 'hours')
        const name = namesManagerStore.getAssetName(vaultInfo.rewardTokens[index])

        return (
          <div style={{ marginBottom: 5 }}>
            <img
              style={{
                height: 20,
                borderRadius: name === 'xTETU' ? 0 : 20,
                marginRight: 8,
              }}
              // @ts-ignore
              src={getAssetsIconMap()?.[name] ?? unknownIcon}
              alt=""
            />
            {name}:{' '}
            {moment(date).format('YYYY-MM-DD HH:mm') + ` (${diffDays} days, ${diffHours} hours)`}
          </div>
        )
      }),
    },
    {
      title: 'Strategies earned TETU',
      value: <Amount value={vaultInfo?.earned} />,
    },
    // {
    //   title: 'APR (Autocompound)',
    //   value: parseFloat(parseFloat(formatUnits(vaultInfo?.ppfsApr ?? 0)).toFixed(4)) + '%',
    // },
    {
      title: 'Rewards APR | Tokens',
      value: (
        <div>
          {vaultInfo?.rewardsApr.map((apr: number, index: number) => {
            if (vaultInfo.rewardTokensBal[index] === '0') {
              return null
            }

            const name = namesManagerStore.getAssetName(vaultInfo.rewardTokens[index])

            return (
              <div style={{ marginBottom: 18 }}>
                <Amount
                  address={vaultInfo?.rewardTokens[index]}
                  // @ts-ignore
                  style={{ display: 'inline-block' }}
                >
                  <div style={{ display: 'inline-block' }}>
                    <img
                      style={{
                        height: 20,
                        borderRadius: name === 'xTETU' ? 0 : 20,
                        marginRight: 8,
                      }}
                      // @ts-ignore
                      src={getAssetsIconMap()?.[name] ?? unknownIcon}
                      alt=""
                    />{' '}
                    {name}:{parseFloat(parseFloat(formatUnits(apr)).toFixed(4))}%{' '}
                    <span className="app-divider">|</span>
                    {millifyValue(vaultInfo?.rewardTokensBal[index])}
                    <span className="app-divider">|</span> $
                    {millifyValue(vaultInfo?.rewardTokensBalUsdc[index])}
                  </div>
                </Amount>
              </div>
            )
          })}
        </div>
      ),
    },
    {
      title: 'Platform',
      value: (
        <div>
          {/*
          TODO: add platform icons
          <img
            style={{
              height: 20,
              marginTop: -3,
              marginRight: 8,
              borderRadius: 20,
            }}
            // @ts-ignore
            src={platformIconsMap[platformNameMap[vaultInfo?.strategy?.platform]]}
            alt=""
          />{' '}
          */}
          {/*platformIconsMap*/}
          {/*@ts-ignore*/}
          {platformNameMap[vaultInfo?.strategy?.platform]}
        </div>
      ),
    },
    hasSubStrategies
      ? {
          title: 'Platfroms Ratio',
          value: (
            <div>
              {subStrategies
                .map((el: any) => {
                  // @ts-ignore
                  return `${platformNameMap[el.platform]} (${el.ratio})`
                })
                .join(' / ')}
            </div>
          ),
        }
      : null,
    {
      title: 'Strategy address',
      value: (
        <a
          href={`${networkManager.network.blockExplorerUrls?.[0]!}address/${
            vaultInfo?.strategy?.strategy
          }`}
          target="_blank"
          rel="noreferrer"
        >
          <img src={LinkIcon} alt="" style={{ marginRight: 12 }} />
          {vaultInfo?.strategy?.strategy}
        </a>
      ),
    },
    {
      title: 'Strategy created',
      value: moment(new Date(vaultInfo?.strategy?.strategyCreated * 1000).toString()).format(
        'YYYY-MM-DD HH:mm',
      ),
    },
    {
      title: 'Strategy on pause',
      value: vaultInfo?.strategy?.strategyOnPause.toString(),
    },
    {
      title: 'Decimals',
      value: vaultInfo?.decimals,
    },
  ].filter((el) => el !== null)

  const dataSourceVault: any[] = [
    {
      title: 'Address',
      value: (
        <>
          <a href={vaultLink} target="_blank" rel="noreferrer">
            {vaultInfo?.addr}
            {/* <img src={LinkIcon} alt="" style={{ marginRight: 12, marginBottom: 1 }} /> */}
            <ArrowUpOutlined
              style={{
                position: 'relative',
                top: 1,
                marginLeft: 5,
                transform: 'rotate(45deg)',
                color: '#04A8F0',
              }}
            />
          </a>
          <img
            src={copyIcon}
            style={{ position: 'relative', top: -1, marginLeft: 5, cursor: 'pointer' }}
            onClick={(e) => handleClickCopy(e, vaultInfo?.addr)}
          />
        </>
      ),
    },
    {
      title: 'Decimals',
      value: vaultInfo?.decimals,
    },
    {
      title: 'Platform',
      value: (
        <div>
          {/*@ts-ignore*/}
          {platformNameMap[vaultInfo?.strategy?.platform]}
        </div>
      ),
    },
    hasSubStrategies
      ? {
          title: 'Platfroms Ratio',
          value: (
            <div>
              {subStrategies
                .map((el: any) => {
                  // @ts-ignore
                  return `${platformNameMap[el.platform]} (${el.ratio})`
                })
                .join(' / ')}
            </div>
          ),
        }
      : null,
    {
      title: 'Users',
      value: vaultInfo?.users,
    },
    {
      title: 'Price Per Full Share',
      value: (
        <Amount
          value={vaultPricePerFullShareStore.value}
          toFixed={6}
          decimals={vaultInfo?.decimals}
        />
      ),
    },
    {
      title: 'TVL',
      value: <Amount value={vaultInfo?.tvl} />,
    },
    {
      title: 'TVL USDC',
      value: <Amount value={vaultInfo?.tvlUsdc} />,
    },
  ].filter((el) => el !== null)
  const dataSourceRewards: any[] = [
    // {
    //   title: 'Reward',
    //   value: vaultInfo?.rewardTokens?.map((reward: string) => {
    //     const name = namesManagerStore.getAssetName(reward)
    //
    //     return (
    //       <div style={{ display: 'inline-block', marginRight: 8 }}>
    //         <img
    //           style={{ height: 24, marginBottom: 3 }}
    //           // @ts-ignore
    //           src={getAssetsIconMap()?.[name] ?? unknownIcon}
    //           alt=""
    //         />
    //       </div>
    //     )
    //   }),
    // },
    // {
    //   title: 'Reward destribution period',
    //   value: vaultInfo?.duration / (60 * 60 * 24) + ' days',
    // },
    // {
    //   title: 'Period finish for token',
    //   value: periodFinishForTokenStore.value?.map((el: string, index: number) => {
    //     const date = new Date(Number(el) * 1000).toString()
    //     const diffDays = moment(date).diff(moment(new Date()), 'days')
    //     const diffHours = moment(date).diff(moment(new Date()).add(diffDays, 'days'), 'hours')
    //     const name = namesManagerStore.getAssetName(vaultInfo.rewardTokens[index])
    //     return (
    //       <div style={{ marginBottom: 5 }}>
    //         {name}:{' '}
    //         {moment(date).format('YYYY-MM-DD HH:mm') + ` (${diffDays} days, ${diffHours} hours)`}
    //       </div>
    //     )
    //   }),
    // },
    {
      title: 'Rewards APR',
      value: (
        <div>
          {vaultInfo?.rewardsApr.map((apr: number, index: number) => {
            const name = namesManagerStore.getAssetName(vaultInfo.rewardTokens[index])
            return (
              <div style={{ marginBottom: 12 }}>
                <Amount
                  address={vaultInfo?.rewardTokens[index]}
                  // @ts-ignore
                  style={{ display: 'inline-block', fontSize: 16 }}
                >
                  <div style={{ display: 'inline-block', fontSize: 16 }}>
                    <img
                      style={{
                        height: 24,
                        marginBottom: 3,
                        borderRadius: name === 'xTETU' ? 0 : 20,
                        marginRight: 8,
                      }}
                      // @ts-ignore
                      src={getAssetsIconMap()?.[name] ?? unknownIcon}
                      alt=""
                    />
                    {name}: {parseFloat(parseFloat(formatUnits(apr)).toFixed(4))}%{' '}
                    <span className="app-divider">|</span>
                    {millifyValue(vaultInfo?.rewardTokensBal[index])}
                    <span className="app-divider">|</span> $
                    {millifyValue(vaultInfo?.rewardTokensBalUsdc[index])}
                    {/* {parseFloat(parseFloat(formatUnits(apr)).toFixed(4))}%{' '} */}
                  </div>
                </Amount>
              </div>
            )
          })}
        </div>
      ),
    },
    // {
    //   title: 'APR (Autocompound)',
    //   value: parseFloat(parseFloat(formatUnits(vaultInfo?.ppfsApr ?? 0)).toFixed(4)) + '%',
    // },
  ]
  const dataSourceStrategy: any[] = [
    {
      title: 'Strategies earned TETU',
      value: <Amount value={vaultInfo?.earned} />,
    },
    {
      title: 'Strategy address',
      value: (
        <>
          <a
            href={`${networkManager.network.blockExplorerUrls?.[0]!}address/${
              vaultInfo?.strategy?.strategy
            }`}
            target="_blank"
            rel="noreferrer"
          >
            {vaultInfo?.strategy?.strategy}
            {/* <img src={LinkIcon} alt="" style={{ marginRight: 12 }} /> */}
            <ArrowUpOutlined
              style={{
                position: 'relative',
                top: 1,
                marginLeft: 5,
                transform: 'rotate(45deg)',
                color: '#04A8F0',
              }}
            />
          </a>
          <img
            src={copyIcon}
            style={{ position: 'relative', top: -1, marginLeft: 5, cursor: 'pointer' }}
            onClick={(e) => handleClickCopy(e, vaultInfo?.strategy?.strategy)}
          />
        </>
      ),
    },
  ]

  return (
    <Row gutter={32} style={{ maxWidth: 1100 }}>
      <Col flex={1}>
        <div
          className="app-paper vault-info vault-info-main vault-info-vault"
          style={{ marginBottom: 25 }}
        >
          <p className="vault-info-main-title">Vault</p>

          <p className="vault-info-main-status">
            {vaultInfo?.created && (
              <span className="vault-info-main-status-text">
                {moment(new Date(vaultInfo?.created * 1000).toString()).format('DD.MM.YYYY HH:mm')}
              </span>
            )}
            {vaultInfo?.active ? (
              <span className="vault-info-main-status-button">Active</span>
            ) : (
              <span className="vault-info-main-status-button vault-info-main-status-button-disabled">
                Deactivated
              </span>
            )}
          </p>
          {/* @ts-ignore */}
          <Table dataSource={dataSourceVault} columns={columns} size="large" pagination={false} />
        </div>

        <div
          className="app-paper vault-info vault-info-main vault-info-rewards"
          style={{ marginBottom: 25 }}
        >
          <p className="vault-info-main-title">Rewards</p>
          {/* @ts-ignore */}
          <Table dataSource={dataSourceRewards} columns={columns} size="large" pagination={false} />
        </div>

        <div
          className="app-paper vault-info vault-info-main vault-info-strategy"
          style={{ marginBottom: 25 }}
        >
          <p className="vault-info-main-title">Strategy</p>

          <p className="vault-info-main-status">
            {vaultInfo?.strategy?.strategyCreated && (
              <span className="vault-info-main-status-text">
                {moment(new Date(vaultInfo?.strategy?.strategyCreated * 1000).toString()).format(
                  'DD.MM.YYYY HH:mm',
                )}
              </span>
            )}
            {vaultInfo?.strategy.strategyOnPause ? (
              <span className="vault-info-main-status-button vault-info-main-status-button-pause">
                Pause
              </span>
            ) : (
              <span className="vault-info-main-status-button">Active</span>
            )}
          </p>

          <Table
            dataSource={dataSourceStrategy}
            columns={columns}
            size="large"
            pagination={false}
          />
        </div>

        {/* <div className="app-paper vault-info vault-info-main" style={{ marginBottom: 25 }}> */}
        {/* @ts-ignore */}
        {/* <Table dataSource={dataSource} columns={columns} size="large" pagination={false} /> */}
        {/* </div> */}
      </Col>
      <Col className="vault-info-sidebar">
        <Row gutter={[0, { xs: 12, sm: 12, md: 24 }]} style={{ flexDirection: 'column' }}>
          <Col>
            <a
              className="vault-info-main-link"
              href={`${tetuStatsApi}${networkManager.network.other.urlParam}&vault=${address}`}
              target="_blank"
              rel="noreferrer"
            >
              <Row gutter={6}>
                <Col>TVL chart</Col>
                <Col>
                  <ArrowUpOutlined style={{ transform: 'rotate(45deg)', color: '#04A8F0' }} />
                </Col>
              </Row>
            </a>
          </Col>
          <Col>
            <a
              className="vault-info-main-link"
              href={`${tetuSharePriceApi}${networkManager.network.other.urlParam}&vault=${address}`}
              target="_blank"
              rel="noreferrer"
            >
              <Row gutter={6}>
                <Col>Share Price</Col>
                <Col>
                  <ArrowUpOutlined style={{ transform: 'rotate(45deg)', color: '#04A8F0' }} />
                </Col>
              </Row>
            </a>
          </Col>
        </Row>
      </Col>
    </Row>
  )
})
