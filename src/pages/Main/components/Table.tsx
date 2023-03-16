import React, { FC, useMemo, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useStores } from '../../../stores/hooks/useStores'
import { getColumns, Sort, Vault } from '../Main'
import { Button, Col, Empty, Row, Table } from 'antd'
import cn from 'classnames'
import { HIGHLIGHTED_VAULTS } from '../../../networks/Addresses/MaticAddresses/constants'
import { formatUnits } from '@ethersproject/units'
import { Link } from 'react-router-dom'
import { Amount } from '../../../components/Amount'
import { APRView } from '../APRView'
import { UserBalance } from './UserBalance'
import { ClaimButton } from './ClaimButton'
import './mobileVault.css'
import { VaultRow } from '../../../components/VaultRow'
import { SortType } from '../../../stores/views/main-page/vault-filters-store'
import {
  sortTetuToken,
  sortUserBalance,
  sortUserRewards,
  sortVaultApr,
  sortVaultCreated,
  sortVaultsName,
  sortVaultsTvl,
} from '../../../stores/views/main-page/utils'

enum VaultTabs {
  single = 'single',
  amb = 'amb',
  lps = 'lps',
}

export const VaultsTable: FC<{ tableData: any; sort: null | Sort }> = (props) => {
  const { tableData, sort } = props
  const { mainPageStore, metaMaskStore, networkManager, userInfosStore } = useStores()

  // console.log('tableData', JSON.parse(JSON.stringify(tableData)))

  const limit = Number(process.env.REACT_APP_VAULT_TABLE_PAGINATION_LIMIT)
  const showFirst = Number(process.env.REACT_APP_VAULT_TABLE_SHOW_FIRST)
  const [visibleTableRows, setVisibleTableRows] = useState(showFirst)
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 840px)' })
  const isWidth840 = useMediaQuery({ query: '(max-width: 840px)' })
  const isWidth767 = useMediaQuery({ query: '(max-width: 767px)' })

  const sortData = (data: any[]) => {
    const userInfos = userInfosStore.isFetched ? userInfosStore.storeMap : null

    switch (sort?.field) {
      case SortType.tetuTokenAsc:
        return sortTetuToken(data)
      case SortType.nameAsc:
        return sortVaultsName(data)
      case SortType.nameDesc:
        return sortVaultsName(data).reverse()

      case SortType.tvlAsc:
        return sortVaultsTvl(data)
      case SortType.tvlDesc:
        return sortVaultsTvl(data).reverse()

      case SortType.aprAsc:
        return sortVaultApr(data)
      case SortType.aprDesc:
        return sortVaultApr(data).reverse()

      case SortType.createdAsc:
        return sortVaultCreated(data)
      case SortType.createdDesc:
        return sortVaultCreated(data).reverse()

      case SortType.balanceAsc:
        return sortUserBalance(data, userInfos)
      case SortType.balanceDesc:
        return sortUserBalance(data, userInfos).reverse()

      case SortType.rewardsAsc:
        return sortUserRewards(data, userInfos)
      case SortType.rewardsDesc:
        return sortUserRewards(data, userInfos).reverse()
    }

    return data
  }

  const columns = useMemo(() => {
    return getColumns(metaMaskStore.walletAddress, isWidth840)
  }, [metaMaskStore.walletAddress, isWidth840])

  const pagination = () => {
    const len = tableData?.length
    const count = visibleTableRows + limit > len ? len : visibleTableRows + limit
    setVisibleTableRows(count)
  }

  const showAllVaults = () => {
    setVisibleTableRows(tableData?.length)
  }

  const calcVisibleRows = () => {
    const len = tableData?.length

    if (len === undefined) {
      return
    }

    if (visibleTableRows > len) {
      setVisibleTableRows(len)
    }

    if (visibleTableRows === 0 && len > 0) {
      setVisibleTableRows(showFirst)
      return
    }

    if (visibleTableRows < showFirst || visibleTableRows > len) {
      if (len > showFirst) {
        setVisibleTableRows(showFirst)
      } else {
        setVisibleTableRows(len)
      }
    }
  }

  let dataSource = tableData?.slice(0, visibleTableRows)

  if (!isWidth767) {
    return (
      <>
        {dataSource.length === 0 ? (
          <div style={{ marginTop: 50 }}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          <Table<Vault>
            className={`vaults-table ${isTabletOrMobile ? 'vaults-table-mobile' : ''}`}
            size={isTabletOrMobile ? 'small' : 'large'}
            pagination={false}
            dataSource={dataSource}
            // @ts-ignore
            columns={columns}
            // loading={mainPageStore.isLodingTable}

            rowClassName={({ vault }: any) =>
              cn({
                'deactivated-row': vault.active === false,
                'tetu-row': HIGHLIGHTED_VAULTS.includes(vault.addr?.toLowerCase()),
              })
            }
            scroll={{ x: 500 }}
            onChange={(pagination, filters, sorter, extra) => {
              mainPageStore.handleChangeTable(pagination, filters, sorter, extra)
            }}
          />
        )}
        {dataSource && !!tableData.length && tableData.length > showFirst && (
          <Row gutter={10}>
            <Col>
              <Button
                // type="primary"
                onClick={
                  visibleTableRows === mainPageStore.totalCountOfVauts ? () => {} : showAllVaults
                }
                className="table-btn"
              >
                Show all
              </Button>
            </Col>
            <Col>
              <Button
                // loading={mainPageStore.isLodingTable}
                onClick={
                  visibleTableRows === mainPageStore.totalCountOfVauts ? () => {} : pagination
                }
                className="table-btn"
              >
                Show more {visibleTableRows} /
                <span className="table-btn-gray-text"> {tableData?.length}</span>
              </Button>
            </Col>
          </Row>
        )}
      </>
    )
  }

  let mobileDataSource = tableData ? sortData(tableData).slice(0, visibleTableRows) : []

  return (
    <>
      {mobileDataSource.length === 0 ? (
        <div style={{ marginTop: 50 }}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <>
          {mobileDataSource.map(({ vault }: any) => (
            <div
              className={cn('mobile-vault', {
                'deactivated-row': vault.active === false,
                'tetu-row': HIGHLIGHTED_VAULTS.includes(vault.addr?.toLowerCase()),
              })}
            >
              <div className="mobile-vault-inner">
                <Row gutter={[0, 15]}>
                  <Col span={24}>
                    <Link to={'vault/' + vault.addr} className="link-wrapper">
                      <div style={{ width: '100%' }}>
                        <Amount
                          assets={vault.assets}
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
                          {vault.active === false && (
                            <span style={{ marginLeft: 8 }}> deactivated</span>
                          )}
                        </Amount>
                      </div>
                    </Link>
                  </Col>
                  <Col span={24} className="mobile-vault-content-column">
                    <Row gutter={18}>
                      <Col>
                        <Row style={{ flexDirection: 'column' }} gutter={[0, 12]}>
                          <Col>
                            <Link to={'vault/' + vault.addr} className="link-wrapper">
                              <Amount
                                standartWidth
                                prefix="$"
                                value={vault.tvlUsdc}
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
                                    <div>TVL: ${formatUnits(vault.tvlUsdc)}</div>
                                    <div>TVL underlying: {formatUnits(vault.tvl)}</div>
                                  </div>
                                }
                              />
                            </Link>
                          </Col>
                          <Col>
                            <APRView vault={vault} reverse={true} />
                          </Col>
                        </Row>
                      </Col>
                      <Col>
                        <Row
                          justify="space-between"
                          gutter={[0, 12]}
                          style={{ flexDirection: 'column' }}
                        >
                          <Col>
                            <Link to={'vault/' + vault.addr} className="link-wrapper">
                              <UserBalance vaultAddr={vault.addr} vaultDecimals={vault.decimals} />
                            </Link>
                          </Col>
                          <Col style={{ paddingTop: 2 }}>
                            {vault.rewardTokens.length === 0 ? (
                              <div style={{ padding: '0px 0', width: '100%' }}>-</div>
                            ) : (
                              <ClaimButton vault={vault} />
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>
          ))}
        </>
      )}
      {mobileDataSource && !!tableData.length && tableData.length > showFirst && (
        <Row gutter={10}>
          <Col>
            <Button
              className="table-btn"
              onClick={
                visibleTableRows === mainPageStore.totalCountOfVauts ? () => {} : showAllVaults
              }
            >
              Show all
            </Button>
          </Col>
          <Col>
            <Button
              className="table-btn"
              onClick={visibleTableRows === mainPageStore.totalCountOfVauts ? () => {} : pagination}
            >
              Show more {visibleTableRows} /
              <span className="table-btn-gray-text"> {tableData?.length}</span>
            </Button>
          </Col>
        </Row>
      )}
    </>
  )
}
