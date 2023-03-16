import React, { useEffect, useState } from 'react'
import { Row, Col, Typography, Tabs } from 'antd'
import { Filters } from './components/Filters'
import { observer } from 'mobx-react'
import { useStores } from '../../stores/hooks'
import { Link } from 'react-router-dom'
import { BigNumber } from 'ethers'
import { formatUnits } from '@ethersproject/units'
import { Amount } from '../../components/Amount'
import { platformNameMap, VaultRow } from '../../components/VaultRow'
import { LabelGroup } from './components/LabelGroup'
import { ClaimButton } from './components/ClaimButton'
import { useMediaQuery } from 'react-responsive'
import { UserBalance } from './components/UserBalance'
import { APRView } from './APRView'
import { Loader } from '../../components/Loader'
import { VaultsTable } from './components/Table'
import { Alert } from '../../components/ui-kit'
import './styles.css'
import { UserStat } from '../../components/UserStat'
import { useSearch } from './useSearch'

export type Vault = {
  address: string | number
  roi: null
  apy: number
  iapy: number
  name: string
  tvl: BigNumber
}

const { Text } = Typography
const { TabPane } = Tabs

export const getColumns = (walletAddress: string, isTablet: boolean) => [
  {
    title: 'Name',
    columnKey: 'name',
    dataIndex: ['vault', 'name'],
    sorter: true,
    render: (name: string, { vault }: any) => {
      const { assets } = vault

      return (
        <Link to={'vault/' + vault.addr} className="link-wrapper">
          <div style={{ width: '100%' }}>
            <Amount
              assets={assets}
              address={vault.addr}
              placement="topLeft"
              showTooltip={false}
              // @ts-ignores
              name={
                <VaultRow
                  assets={vault.assets}
                  platform={vault.platform}
                  small
                  address={vault.addr}
                  deactivated={!vault.active}
                  vault={vault}
                  networkName={vault.networkName}
                />
              }
              style={{ fontSize: 12, fontWeight: 500 }}
            >
              {vault.active === false && <span style={{ marginLeft: 8 }}> deactivated</span>}
            </Amount>
          </div>
        </Link>
      )
    },
  },
  {
    title: 'TVL',
    columnKey: 'tvl',
    dataIndex: ['vault', 'tvlUsdc'],
    sorter: true,
    render: (_value: string, { vault }: any) => {
      const { tvlUsdc, tvl } = vault

      return (
        <Link to={'vault/' + vault.addr} className="link-wrapper">
          <Amount
            standartWidth
            prefix="$"
            value={tvlUsdc}
            fontSize={16}
            style={{
              fontFamily: 'Source Sans Pro',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#fff',
            }}
            tooltipInner={
              <div>
                <div>TVL USDC: ${formatUnits(tvlUsdc)}</div>
                <div>TVL underlying: {formatUnits(tvl)}</div>
              </div>
            }
          />
        </Link>
      )
    },
  },
  {
    title: 'APY',
    columnKey: 'apr',
    sorter: true,
    render: (_value: string, { vault }: any) => {
      return <APRView vault={vault} />
    },
  },
  {
    title: 'Balance',
    columnKey: 'balance',
    sorter: !!walletAddress,
    render: (_value: any, { vault }: any) => {
      return (
        <Link to={'vault/' + vault.addr} className="link-wrapper">
          <UserBalance vaultAddr={vault.addr} vaultDecimals={vault.decimals} />
        </Link>
      )
    },
  },
  {
    title: 'Rewards',
    columnKey: 'rewards',
    sorter: !!walletAddress,
    render: (_value: string, { vault }: any) => {
      if (vault.rewardTokens.length === 0) {
        return (
          <div
            className="table-td-padding"
            style={{ paddingTop: 16, paddingBottom: 16, width: '100%' }}
          >
            -
          </div>
        )
      }

      return (
        <div className="table-td-padding">
          <ClaimButton vault={vault} />
        </div>
      )
    },
  },
]

enum VaultTabs {
  single = 'single',
  amb = 'amb',
  lps = 'lps',
}

export type Sort = {
  field: string
}

// TODO: don't detect wallet status change
export const Main = observer(() => {
  const { mainPageStore, metaMaskStore, networkManager, web3Store } = useStores()

  const isWidth840 = useMediaQuery({ query: '(max-width: 840px)' })
  const [sort, setSort] = useState<null | Sort>(null)
  const { networkChecked } = useSearch()

  const handleSort = (field: string) => {
    if (!sort) {
      setSort({
        field,
      })

      return
    }

    setSort({
      field,
    })
  }

  const filtredVaults =
    mainPageStore.currentNetworkData
      ?.filter((el: any) => {
        if (mainPageStore.isOnlyDeactivated) {
          return !el.vault.active
        } else {
          return el.vault.active
        }
      })
      ?.filter((el: any) => {
        if (mainPageStore.activeTab.toLowerCase() === 'all') {
          return true
        }

        if (
          networkManager.other.mainPage.vaultTabs.find(
            (el: any) => el.name === mainPageStore.activeTab,
          ) === undefined
        ) {
          return true
        }

        const {
          platforms = [],
          include,
          exclude,
        } = networkManager.other.mainPage.vaultTabs.find(
          (el: any) => el.name === mainPageStore.activeTab,
        )

        if (include) {
          if (include.map((it: any) => it.toLowerCase()).includes(el.vault.addr.toLowerCase())) {
            return true
          }
        }

        if (exclude) {
          if (exclude.map((it: any) => it.toLowerCase()).includes(el.vault.addr)) {
            return false
          }
        }

        if (el.vault.platform === '24') {
          return (
            el.vault.subStrategies?.some((strategy: any) => {
              return platforms.includes(strategy.platform)
            }) ?? false
          )
        }

        return platforms.includes(el.vault.platform)
      }) ?? []

  const platforms = new Set<string>(
    filtredVaults?.reduce((acc: any, el: any) => {
      const platformsIds = [
        ...acc,
        el.vault.platform,
        ...(el.vault?.subStrategies?.map((el: any) => el.platform) ?? []),
      ]

      const platforms = platformsIds.map((el: any) => {
        // @ts-ignore
        return { id: el, name: platformNameMap[el] }
      })

      const platformNames = platforms.reduce((acc: any, el: any) => {
        const names = acc.map((el: any) => el.name)
        if (!names.includes(el.name)) {
          acc.push(el)
        }
        return acc
      }, [])

      return platformNames.map((el: any) => el.id)
    }, []) ?? [],
  )
  platforms.delete('24')

  const currentVaultTab = networkManager.other.mainPage.vaultTabs.find(
    (el: any) => el.name === mainPageStore.activeTab,
  )

  const assets = new Set<string>(
    filtredVaults
      ?.map((el: any) => {
        return el.vault?.assets
      })
      .flat() ?? [],
  )

  useEffect(() => {
    if (metaMaskStore.inited && networkManager.inited && networkChecked) {
      mainPageStore.resetData()
      mainPageStore.fetchData()
    }
    web3Store.getGasPrice()
  }, [metaMaskStore.inited, metaMaskStore.walletAddress, networkManager.inited, networkChecked])

  // useEffect(() => {
  //   const allTabs = networkManager.other.mainPage.vaultTabs.map((el: any) => el.name)
  //
  //   if (mainPageStore.activeTab === null || !allTabs.includes(mainPageStore.activeTab)) {
  //     mainPageStore.setActiveTab(networkManager.other.mainPage.vaultTabs[0].name)
  //   }
  // }, [networkManager.other.mainPage.vaultTabs[0].name])

  const loadingTable = (
    <Row justify="center" align="middle" style={{ marginTop: 52 }}>
      <Loader size={28} padding={0} />
      <Text style={{ color: '#fff', fontSize: 18, marginBottom: 0, marginLeft: 12 }}>
        Loading vaults
      </Text>
    </Row>
  )

  const table = mainPageStore.isLoadedTableData ? (
    <div>
      <Tabs
        activeKey={mainPageStore.activeTab}
        onChange={(tab: string) => {
          mainPageStore.setActiveTab(tab as VaultTabs)
        }}
        className="main-page-tabs"
        style={{ paddingTop: 20 }}
      >
        <TabPane tab="All" key="All">
          {currentVaultTab?.description && <Alert message={currentVaultTab?.description} mb={12} />}
          <VaultsTable tableData={mainPageStore.tableData} sort={sort} />
        </TabPane>
        {networkManager.other.mainPage.vaultTabs.map((el: any, i: number) => {
          const tableData = mainPageStore.tableData.filter((it: any) => {
            const { include, exclude, includeOnly } = el

            if (includeOnly) {
              if (
                includeOnly.map((it: any) => it.toLowerCase()).includes(it.vault.addr.toLowerCase())
              ) {
                return true
              } else {
                return false
              }
            }

            if (include) {
              if (
                include.map((it: any) => it.toLowerCase()).includes(it.vault.addr.toLowerCase())
              ) {
                return true
              }
            }

            if (exclude) {
              if (exclude.map((it: any) => it.toLowerCase()).includes(it.vault.addr)) {
                return false
              }
            }

            if (it.vault.platform === '24') {
              return (
                it.vault.subStrategies?.some((strategy: any) => {
                  return el.platforms.includes(strategy.platform)
                }) ?? false
              )
            }

            if (!includeOnly) {
              return el.platforms.includes(it.vault.platform)
            }
          })

          return (
            <TabPane
              tab={
                el.namePart1 ? (
                  <>
                    <span style={{ color: '#7F8FA4' }}>{el.namePart1}</span>{' '}
                    <span style={{ color: '#7F8FA4', opacity: 0.6 }}>{el.namePart2}</span>
                  </>
                ) : (
                  el.name
                )
              }
              key={el.name}
            >
              {/* <TabPane tab={el.name} key={el.name}> */}
              {currentVaultTab?.description && (
                <Alert message={currentVaultTab?.description} mb={12} />
              )}
              <VaultsTable tableData={tableData} sort={sort} />
            </TabPane>
          )
        })}
      </Tabs>
    </div>
  ) : null

  // if (tabletUI) {
  //   return (
  //     <>
  //       <div className="main-page page">
  //         <div className="main-page-container container">
  //           <LabelGroup />
  //           <Row style={{ marginBottom: 0, marginTop: 20 }} gutter={[20, 20]}>
  //             <Col sm={12} xs={24}>
  //               <UserStat />
  //               {/* <TotalRewards /> */}
  //             </Col>
  //           </Row>
  //           <Filters
  //             platforms={platforms}
  //             assets={assets}
  //             withOtherPlatforms={mainPageStore.activeTab.toLowerCase() === 'all'}
  //           />
  //           {mainPageStore.isLoadedTableData ? table : loadingTable}
  //         </div>
  //       </div>
  //     </>
  //   )
  // }

  return (
    <>
      <div className="main-page page">
        <div className="main-page-container container">
          <Row>
            <Col span={24}>
              {isWidth840 ? (
                <Row gutter={[0, 15]} justify="start">
                  <Col span={24}>
                    <LabelGroup />
                  </Col>
                  <Col span={24}>
                    <UserStat />
                  </Col>
                </Row>
              ) : (
                <Row gutter={[20, 15]} justify="space-between">
                  <Col md={12} lg={12}>
                    <LabelGroup />
                  </Col>
                  <Col md={12} lg={12}>
                    <Row justify="end">
                      <Col>
                        <UserStat />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
            </Col>
            <Col span={24}>
              <Row gutter={[20, { xs: 12, sm: 12, lg: 15 }]}>
                <Col
                  xs={{ span: 24, order: 1 }}
                  sm={{ span: 24, order: 1 }}
                  lg={{ span: 16, order: 0 }}
                >
                  {mainPageStore.isLoadedTableData ? table : loadingTable}
                </Col>
                <Col
                  xs={{ span: 24, order: 0 }}
                  sm={{ span: 24, order: 0 }}
                  lg={{ order: 1, span: 8 }}
                >
                  {/* <TotalRewards /> */}
                  <div className="filters-wrapper">
                    <Filters
                      platforms={platforms}
                      assets={assets}
                      withOtherPlatforms={mainPageStore.activeTab.toLowerCase() === 'all'}
                      sort={sort}
                      handleSort={handleSort}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
})
