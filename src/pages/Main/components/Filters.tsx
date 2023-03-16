import React, { useState } from 'react'
import { Row, Col, Input, Checkbox, Select, Spin, Button } from 'antd'
import { observer } from 'mobx-react'
import { useStores } from '../../../stores/hooks'
import SearchIcon from '../../../static/search.svg'
import { otherPlatforms, platformNameMap } from '../../../components/VaultRow'
import { formatToString, validateInput } from '../../Vault/components/DepositAndWithdraw/utils'
import { Amount } from '../../../components/Amount'
import { LoadingOutlined } from '@ant-design/icons'
import { getAssetsIconMap } from '../../../static/tokens'
import unknownIcon from '../../../static/UNKNOWN.png'
import { useForceUpdate } from '../../../hooks'
import './filtersStyles.css'
import sortIcon from '../../../static/sort-icon.svg'
import filterIcon from '../../../static/filter-icon.svg'
import { Sort } from '../Main'
import { SortType } from '../../../stores/views/main-page/vault-filters-store'

type FilterProps = {
  platforms: Set<string>
  assets: Set<string>
  withOtherPlatforms: boolean
  sort: null | Sort
  handleSort: (field: string) => void
}

const { Option } = Select
const antIcon = <LoadingOutlined style={{ fontSize: 18, marginLeft: 15 }} spin />

export const Filters: React.FC<FilterProps> = observer((props) => {
  const { platforms, assets, withOtherPlatforms, sort, handleSort } = props
  const { mainPageStore, namesManagerStore, metaMaskStore } = useStores()
  const forceUpdate = useForceUpdate()
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [isSortVisible, setIsSortVisible] = useState(false)

  const sortPlatform = (indexes: string[]) => {
    const compare = (a: any, b: any) => {
      const nameA = platformNameMap[a as keyof typeof platformNameMap]?.toLowerCase()
      const nameB = platformNameMap[b as keyof typeof platformNameMap]?.toLowerCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    }
    return indexes.sort(compare)
  }

  const sortAssets = (assets: string[]) => {
    const compare = (a: any, b: any) => {
      if (!namesManagerStore.getAssetName(a) || !namesManagerStore.getAssetName(b)) {
        return 0
      }

      const nameA = namesManagerStore.getAssetName(a).toLowerCase()
      const nameB = namesManagerStore.getAssetName(b).toLowerCase()

      if (nameA < nameB) return -1
      if (nameA > nameB) return 1

      return 0
    }
    return assets.sort(compare)
  }

  const filterOtherPlatform = (el: string) => {
    return !otherPlatforms.includes(el)
  }

  const handleOpenFilters = () => {
    setIsSortVisible(false)
    setIsFiltersVisible(true)
  }

  const handleOpenSort = () => {
    setIsFiltersVisible(false)
    setIsSortVisible(true)
  }

  const handleResetFilters = () => {
    mainPageStore.vaultsFiltersStore.clearAsset()
    mainPageStore.vaultsFiltersStore.clearPlatforrm()
    mainPageStore.vaultsFiltersStore.setAutoClaimValue('')

    if (metaMaskStore.walletAddress) {
      mainPageStore.vaultsFiltersStore.setIsOnlyDeposited(false)
    }

    mainPageStore.vaultsFiltersStore.setIsNewVaultsFirst(false)
    mainPageStore.vaultsFiltersStore.setIsOnlyStablecoins(false)
    mainPageStore.vaultsFiltersStore.setIsOnlyBlueChips(false)
    mainPageStore.vaultsFiltersStore.setIsOnlyDeactivated(false)
    mainPageStore.vaultsFiltersStore.setIsOnlyAutocompondVaults(false)
    mainPageStore.vaultsFiltersStore.setIsOnlySingleVaults(false)

    setIsFiltersVisible(false)
  }

  return (
    <>
      <div className="filters-desktop">
        <div style={{ marginBottom: 40 }}>
          <nav className="vault-filters-nav">
            <span className="vault-filters-nav-title">Filter</span>
            <button
              className="vault-filters-nav-reset"
              onClick={() => mainPageStore.vaultsFiltersStore.resetFilters()}
            >
              Reset
            </button>
          </nav>
        </div>
        <Row gutter={[24, 24]}>
          <Col xs={{ span: 24 }} sm={14} lg={24}>
            <Row gutter={[20, 10]} align="middle">
              <Col xs={24} sm={24} lg={24}>
                <div className="vault-search" style={{ marginBottom: 30 }}>
                  <img src={SearchIcon} alt="" className="search-icon" />
                  <Input
                    size="small"
                    placeholder="Search"
                    value={mainPageStore.vaultsFiltersStore.searchByName}
                    onChange={(e) =>
                      mainPageStore.vaultsFiltersStore.setSearchByName(e.target.value)
                    }
                  />
                </div>
              </Col>
              <Col xs={24} sm={24} lg={24}>
                <span className="filter-form-label">Platform:</span>
                <Select
                  style={{ width: '100%', marginBottom: 30 }}
                  placeholder="Platform"
                  onChange={(value) => mainPageStore.vaultsFiltersStore.selectPlattform(value)}
                  value={mainPageStore.vaultsFiltersStore.selectedPlatform}
                  defaultValue="all"
                  loading={!mainPageStore.isFetchedAllVaults}
                  className="filter-select"
                >
                  {mainPageStore.isFetchedAllVaults && (
                    <>
                      <Option key="all" value="all">
                        All platform
                      </Option>
                      {/* @ts-ignore */}
                      {sortPlatform([...platforms].filter(filterOtherPlatform)).map((platform) => (
                        <Option key={platform} value={platform}>
                          {/* @ts-ignore */}
                          {platformNameMap[platform]}
                        </Option>
                      ))}
                      {withOtherPlatforms && (
                        <Option key="Other" value="other">
                          Other
                        </Option>
                      )}
                    </>
                  )}
                </Select>
              </Col>
              <Col xs={24} sm={24} lg={24}>
                <span className="filter-form-label">Assets:</span>
                <Select
                  style={{ width: '100%', marginBottom: 4 }}
                  placeholder="Select assets"
                  onChange={(value) => {
                    mainPageStore.vaultsFiltersStore.selectAsset(value)
                  }}
                  value={mainPageStore.vaultsFiltersStore.selectedAsset}
                  loading={!mainPageStore.isFetchedAllVaults}
                  mode="multiple"
                  className="filter-select filter-select-multiple"
                >
                  {mainPageStore.isFetchedAllVaults && (
                    <>
                      {/* @ts-ignore */}
                      {sortAssets([...assets])
                        .map((asset: any) => {
                          const name = namesManagerStore.getAssetName(asset)

                          if (name === null) {
                            return null
                          }

                          return (
                            <Option key={asset} value={name}>
                              {name}
                            </Option>
                          )
                        })
                        .filter((el: any) => el !== null)}
                    </>
                  )}
                </Select>
              </Col>
            </Row>
          </Col>

          {metaMaskStore.walletAddress && (
            <Col xs={{ span: 24 }} sm={14} lg={24} className="filter-rewards-field">
              <div style={{ marginTop: 13, marginBottom: 6 }}>
                {/*<b style={{ fontSize: 16 }}>Automatic Claim</b>*/}
                <span className="filter-form-label">Rewards</span>
              </div>
              {/*<span className="filter-form-label">Minimum amount to Claim $:</span>*/}
              <div className="amount-auto-claim-wrapper">
                <Input
                  size="small"
                  className="amount-auto-claim filter-input"
                  style={{ width: '100%', marginBottom: 20 }}
                  value={mainPageStore.vaultsFiltersStore.autoClaimValue}
                  type="number"
                  // type="text"
                  // pattern="[0-9]*"
                  onChange={(e) => {
                    const {
                      target: { value },
                    } = e

                    const formated =
                      formatToString(validateInput(value)) === 'NaN'
                        ? value
                        : formatToString(validateInput(value))

                    mainPageStore.vaultsFiltersStore.setAutoClaimValue(formated)
                  }}
                />
              </div>

              {/*
              <Button
                style={{ width: '100%' }}
                type="primary"
                loading={mainPageStore.vaultsFiltersStore.isClaiming}
                onClick={() => {
                  mainPageStore.vaultsFiltersStore.claimAll()
                }}
              >
                Claim All
              </Button>
              */}

              {/*
              {mainPageStore.vaultsFiltersStore.totalRewardsBoostToClaim && (
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: 0,
                    fontSize: 16,
                    fontWeight: 500,
                    opacity: 0.8,
                  }}
                >
                  Total rewards: $
                  {addSpace(
                    parseFloat(formatUnits(mainPageStore.vaultsFiltersStore.totalRewardsBoostToClaim)).toFixed(2),
                  )}
                </div>
              )}
              */}
            </Col>
          )}

          <Col xs={{ span: 24 }} sm={{ span: 8, push: 2 }} lg={{ span: 24, push: 0 }}>
            <div className="filter-checkbox-wrapper">
              <Row align="middle" gutter={[20, 20]}>
                {metaMaskStore.walletAddress && (
                  <Col xs={24} sm={24} lg={24}>
                    <Checkbox
                      onChange={(e) =>
                        mainPageStore.vaultsFiltersStore.setIsOnlyDeposited(e.target.checked)
                      }
                      checked={mainPageStore.vaultsFiltersStore.isOnlyDeposited}
                    >
                      <span>Deposited Vaults</span>
                    </Checkbox>
                  </Col>
                )}
                <Col xs={24} sm={24} lg={24}>
                  <Checkbox
                    onChange={(e) =>
                      mainPageStore.vaultsFiltersStore.setIsNewVaultsFirst(e.target.checked)
                    }
                    checked={mainPageStore.vaultsFiltersStore.isNewVaultsFirst}
                  >
                    <span>Show new vaults first</span>
                  </Checkbox>
                </Col>
                <Col xs={24} sm={24} lg={24}>
                  <Checkbox
                    onChange={(e) =>
                      mainPageStore.vaultsFiltersStore.setIsOnlyStablecoins(e.target.checked)
                    }
                    checked={mainPageStore.vaultsFiltersStore.isOnlyStablecoins}
                  >
                    <span>Only stablecoins</span>
                  </Checkbox>
                </Col>
                <Col xs={24} sm={24} lg={24}>
                  <Checkbox
                    onChange={(e) =>
                      mainPageStore.vaultsFiltersStore.setIsOnlyBlueChips(e.target.checked)
                    }
                    checked={mainPageStore.vaultsFiltersStore.isOnlyBlueChips}
                  >
                    <span>Only Blue Chips</span>
                  </Checkbox>
                </Col>
                <Col xs={24} sm={24} lg={24}>
                  <Checkbox
                    onChange={(e) =>
                      mainPageStore.vaultsFiltersStore.setIsOnlyDeactivated(e.target.checked)
                    }
                    checked={mainPageStore.vaultsFiltersStore.isOnlyDeactivated}
                  >
                    <span>Deactivated Vaults</span>
                  </Checkbox>
                </Col>
                <Col xs={24} sm={24} lg={24}>
                  <Checkbox
                    onChange={(e) =>
                      mainPageStore.vaultsFiltersStore.setIsOnlyAutocompondVaults(e.target.checked)
                    }
                    checked={mainPageStore.vaultsFiltersStore.isOnlyAutocompondVaults}
                  >
                    <span>99% Autocompounded Vaults</span>
                  </Checkbox>
                </Col>

                <Col xs={24} sm={24} lg={24}>
                  <Checkbox
                    onChange={(e) =>
                      mainPageStore.vaultsFiltersStore.setIsOnlySingleVaults(e.target.checked)
                    }
                    checked={mainPageStore.vaultsFiltersStore.isOnlySingleVault}
                  >
                    <span>Single token Vaults</span>
                  </Checkbox>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>

      <div className="filters-mobile">
        <Row gutter={10} align="middle">
          <Col flex={1}>
            <div className="vault-search">
              <img src={SearchIcon} alt="" className="search-icon" />
              <Input
                size="small"
                placeholder="Search"
                value={mainPageStore.vaultsFiltersStore.searchByName}
                onChange={(e) => mainPageStore.vaultsFiltersStore.setSearchByName(e.target.value)}
              />
            </div>
          </Col>
          <Col>
            <div className="filters-mobile-sort-button" onClick={handleOpenSort}>
              <img src={sortIcon} />
            </div>
            {isSortVisible && (
              <div className="filters-mobile-popup filters-mobile-sort">
                <div className="filters-mobile-popup-title">Sort</div>
                <div
                  className="filters-mobile-sort-list-item"
                  onClick={() => {
                    handleSort(
                      sort?.field === SortType.nameAsc ? SortType.nameDesc : SortType.nameAsc,
                    )
                  }}
                >
                  Name
                  {sort?.field === SortType.nameAsc && <span className={`sort-icon-ASC`} />}
                  {sort?.field === SortType.nameDesc && <span className={`sort-icon-DESC`} />}
                </div>
                <div
                  className="filters-mobile-sort-list-item"
                  onClick={() => {
                    handleSort(sort?.field === SortType.tvlAsc ? SortType.tvlDesc : SortType.tvlAsc)
                  }}
                >
                  TVL
                  {sort?.field === SortType.tvlAsc && <span className={`sort-icon-ASC`} />}
                  {sort?.field === SortType.tvlDesc && <span className={`sort-icon-DESC`} />}
                </div>
                <div
                  className="filters-mobile-sort-list-item"
                  onClick={() => {
                    handleSort(sort?.field === SortType.aprAsc ? SortType.aprDesc : SortType.aprAsc)
                  }}
                >
                  APY
                  {sort?.field === SortType.aprAsc && <span className={`sort-icon-ASC`} />}
                  {sort?.field === SortType.aprDesc && <span className={`sort-icon-DESC`} />}
                </div>
                <div
                  className="filters-mobile-sort-list-item"
                  onClick={() => {
                    handleSort(
                      sort?.field === SortType.balanceAsc
                        ? SortType.balanceDesc
                        : SortType.balanceAsc,
                    )
                  }}
                >
                  Balance
                  {sort?.field === SortType.balanceAsc && <span className={`sort-icon-ASC`} />}
                  {sort?.field === SortType.balanceDesc && <span className={`sort-icon-DESC`} />}
                </div>
                <div
                  className="filters-mobile-sort-list-item"
                  onClick={() => {
                    handleSort(
                      sort?.field === SortType.rewardsAsc
                        ? SortType.rewardsDesc
                        : SortType.rewardsAsc,
                    )
                  }}
                >
                  Rewards
                  {sort?.field === SortType.rewardsAsc && <span className={`sort-icon-ASC`} />}
                  {sort?.field === SortType.rewardsDesc && <span className={`sort-icon-DESC`} />}
                </div>
                <div
                  className="filters-mobile-popup-close"
                  onClick={() => setIsSortVisible(false)}
                />
              </div>
            )}
          </Col>
          <Col>
            <div className="filters-mobile-filter-button" onClick={handleOpenFilters}>
              <img src={filterIcon} />
            </div>
            {isFiltersVisible && (
              <div className="filters-mobile-popup filters-mobile-filters">
                <div className="filters-mobile-popup-title">Filter</div>
                <Row gutter={[0, 23]}>
                  <Col span={24}>
                    <span className="filter-form-label">Platform</span>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Platform"
                      onChange={(value) => mainPageStore.vaultsFiltersStore.selectPlattform(value)}
                      value={mainPageStore.vaultsFiltersStore.selectedPlatform}
                      defaultValue="all"
                      loading={!mainPageStore.isFetchedAllVaults}
                      className="filter-select"
                    >
                      {mainPageStore.isFetchedAllVaults && (
                        <>
                          <Option key="all" value="all">
                            All platform
                          </Option>
                          {/* @ts-ignore */}
                          {sortPlatform([...platforms].filter(filterOtherPlatform)).map(
                            (platform) => (
                              <Option key={platform} value={platform}>
                                {/* @ts-ignore */}
                                {platformNameMap[platform]}
                              </Option>
                            ),
                          )}
                          {withOtherPlatforms && (
                            <Option key="Other" value="other">
                              Other
                            </Option>
                          )}
                        </>
                      )}
                    </Select>
                  </Col>
                  <Col span={24}>
                    <span className="filter-form-label">Assets</span>
                    <Select
                      style={{ width: '100%', marginBottom: 4 }}
                      placeholder="Select assets"
                      onChange={(value) => {
                        mainPageStore.vaultsFiltersStore.selectAsset(value)
                      }}
                      value={mainPageStore.vaultsFiltersStore.selectedAsset}
                      loading={!mainPageStore.isFetchedAllVaults}
                      mode="multiple"
                      className="filter-select filter-select-multiple"
                    >
                      {mainPageStore.isFetchedAllVaults && (
                        <>
                          {/* @ts-ignore */}
                          {sortAssets([...assets])
                            .map((asset: any) => {
                              const name = namesManagerStore.getAssetName(asset)

                              if (name === null) {
                                return null
                              }

                              return (
                                <Option key={asset} value={name}>
                                  {name}
                                </Option>
                              )
                            })
                            .filter((el: any) => el !== null)}
                        </>
                      )}
                    </Select>
                  </Col>
                  <Col span={24}>
                    <div>
                      <span className="filter-form-label">Rewards</span>
                    </div>
                    <div className="amount-auto-claim-wrapper">
                      <Input
                        size="small"
                        className="amount-auto-claim filter-input"
                        style={{ width: '100%' }}
                        value={mainPageStore.vaultsFiltersStore.autoClaimValue}
                        type="number"
                        onChange={(e) => {
                          const {
                            target: { value },
                          } = e

                          const formated =
                            formatToString(validateInput(value)) === 'NaN'
                              ? value
                              : formatToString(validateInput(value))

                          mainPageStore.vaultsFiltersStore.setAutoClaimValue(formated)
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="filter-checkbox-wrapper">
                      <Row align="middle" gutter={[0, 20]}>
                        {metaMaskStore.walletAddress && (
                          <Col span={24}>
                            <Checkbox
                              onChange={(e) =>
                                mainPageStore.vaultsFiltersStore.setIsOnlyDeposited(
                                  e.target.checked,
                                )
                              }
                              checked={mainPageStore.vaultsFiltersStore.isOnlyDeposited}
                            >
                              <span>Deposited Vaults</span>
                            </Checkbox>
                          </Col>
                        )}
                        <Col span={24}>
                          <Checkbox
                            onChange={(e) =>
                              mainPageStore.vaultsFiltersStore.setIsNewVaultsFirst(e.target.checked)
                            }
                            checked={mainPageStore.vaultsFiltersStore.isNewVaultsFirst}
                          >
                            <span>Show new vaults first</span>
                          </Checkbox>
                        </Col>
                        <Col span={24}>
                          <Checkbox
                            onChange={(e) =>
                              mainPageStore.vaultsFiltersStore.setIsOnlyStablecoins(
                                e.target.checked,
                              )
                            }
                            checked={mainPageStore.vaultsFiltersStore.isOnlyStablecoins}
                          >
                            <span>Only stablecoins</span>
                          </Checkbox>
                        </Col>
                        <Col span={24}>
                          <Checkbox
                            onChange={(e) =>
                              mainPageStore.vaultsFiltersStore.setIsOnlyBlueChips(e.target.checked)
                            }
                            checked={mainPageStore.vaultsFiltersStore.isOnlyBlueChips}
                          >
                            <span>Only Blue Chips</span>
                          </Checkbox>
                        </Col>
                        <Col span={24}>
                          <Checkbox
                            onChange={(e) =>
                              mainPageStore.vaultsFiltersStore.setIsOnlyDeactivated(
                                e.target.checked,
                              )
                            }
                            checked={mainPageStore.vaultsFiltersStore.isOnlyDeactivated}
                          >
                            <span>Deactivated Vaults</span>
                          </Checkbox>
                        </Col>
                        <Col span={24}>
                          <Checkbox
                            onChange={(e) =>
                              mainPageStore.vaultsFiltersStore.setIsOnlyAutocompondVaults(
                                e.target.checked,
                              )
                            }
                            checked={mainPageStore.vaultsFiltersStore.isOnlyAutocompondVaults}
                          >
                            <span>99% Autocompounded Vaults</span>
                          </Checkbox>
                        </Col>
                        <Col span={24}>
                          <Checkbox
                            onChange={(e) =>
                              mainPageStore.vaultsFiltersStore.setIsOnlySingleVaults(
                                e.target.checked,
                              )
                            }
                            checked={mainPageStore.vaultsFiltersStore.isOnlySingleVault}
                          >
                            <span>Single token Vaults</span>
                          </Checkbox>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col span={24}>
                    <Row gutter={[0, 12]}>
                      <Col span={24}>
                        <Button
                          className="ant-btn ant-btn-primary ant-btn-sm"
                          block
                          onClick={() => setIsFiltersVisible(false)}
                        >
                          Apply
                        </Button>
                      </Col>
                      <Col span={24}>
                        <Button
                          className="ant-btn ant-btn-primary ant-btn-sm"
                          block
                          onClick={handleResetFilters}
                        >
                          Reset
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <div
                  className="filters-mobile-popup-close"
                  onClick={() => setIsFiltersVisible(false)}
                />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </>
  )
})
