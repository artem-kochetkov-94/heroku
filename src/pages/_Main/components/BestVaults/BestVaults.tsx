import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useStores } from '../../../../stores/hooks'
import { useHistory } from 'react-router-dom'
import { formatUnits } from '@ethersproject/units'
import { Amount } from '../../../../components/Amount'
import { VaultRow } from '../../../../components/VaultRow'
import { APRView } from '../../../Main/APRView'
import './styles.css'
import { Col, Row } from 'antd'
import Carousel from 'better-react-carousel'
import styles from './BestVaults.module.scss'
import { useChangeNetwork } from '../../../../hooks'
import { addressesMap, maticAddresses } from '../../../../networks/Addresses'
import { ethereumAddresses } from '../../../../networks/Addresses/EthereumAddresses'
import { bestVaultsFilter } from '../../../../networks/bestVaults'

const namesMap = {
  [ethereumAddresses.config.network.other.networkName]: 'Ethereum',
  [maticAddresses.config.network.other.networkName]: 'Polygon',
}

export const BestVaults = observer(() => {
  const { mainPageStore, metaMaskStore, networkManager, web3Store } = useStores()

  const handleChangeNetwork = useChangeNetwork()
  const history = useHistory()

  useEffect(() => {
    if (metaMaskStore.inited && networkManager.inited) {
      mainPageStore.resetData()
      mainPageStore.fetchData([
        maticAddresses.config.network.other.networkName,
        ethereumAddresses.config.network.other.networkName,
      ])
    }
    web3Store.getGasPrice()
  }, [metaMaskStore.inited, metaMaskStore.walletAddress, networkManager.inited])

  if (!mainPageStore.isLoadedTableData) {
    return null
  }

  const data = mainPageStore.data.filter(bestVaultsFilter)

  const handleClickVault = (vault: any) => {
    if (
      vault.network === networkManager.network.other.networkName ||
      vault.networkName === networkManager.network.other.networkName
    ) {
      history.push('vault/' + vault.addr)
      return
    }

    const cb = (chainId: string) => {
      handleChangeNetwork(chainId, true)
      history.push('vault/' + vault.addr)
    }

    Object.keys(addressesMap.aliases).forEach((key: string) => {
      // @ts-ignore
      const networkName = addressesMap.aliases[key].config.network.other.networkName

      if (vault.network === networkName || vault.networkName === networkName) {
        // @ts-ignore
        const chainId = addressesMap.aliases[key].config.network.chainId
        networkManager.setNetworkId(chainId, cb)
      }
    })
  }

  return (
    <div className={styles.wrapper}>
      <div className="container">
        <Row gutter={[32, { xs: 20, sm: 32 }]}>
          <Col span={24}>
            <div>
              <Row gutter={34} align="middle">
                <Col>
                  <p className={styles.title}>The best vaults</p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={24}>
            <Carousel
              cols={3}
              rows={1}
              gap={32}
              containerStyle={{ margin: 0 }}
              scrollSnap={true}
              mobileBreakpoint={1}
              responsiveLayout={[
                {
                  breakpoint: 991,
                  cols: 2,
                  rows: 1,
                  gap: 32,
                },
                {
                  breakpoint: 575,
                  cols: 1,
                  rows: 1,
                  gap: 16,
                },
              ]}
            >
              {data.map((item: any) => {
                const { vault } = item
                const { assets, tvl, tvlUsdc } = vault
                const networkName = vault.network || vault.networkName

                return (
                  <Carousel.Item>
                    <div className="bestVaultWrapper" onClick={() => handleClickVault(vault)}>
                      <div className="bestVaultWrapperHeader">
                        {/* <Link to={'vault/' + vault.addr} className="link-wrapper"> */}
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
                                networkName={networkName}
                              />
                            }
                            style={{ fontSize: 12, fontWeight: 500 }}
                          >
                            {vault.active === false && (
                              <span style={{ marginLeft: 8 }}> deactivated</span>
                            )}
                          </Amount>
                          <div className="network">{namesMap[networkName]}</div>
                        </div>
                        {/* </Link> */}
                      </div>

                      <div className="bestVaultWrapperContent">
                        <Row align="middle" gutter={20} style={{ height: '100%' }}>
                          <Col>
                            {/* <Link to={'vault/' + vault.addr} className="link-wrapper"> */}
                            <Row gutter={8} align="middle">
                              <Col>
                                <span className="bestVaultWrapperContentItemTitle">TVL</span>
                              </Col>
                              <Col>
                                <Amount
                                  standartWidth
                                  prefix="$"
                                  value={tvlUsdc}
                                  fontSize={14}
                                  style={{
                                    fontFamily: 'Source Sans Pro',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    lineHeight: '20px',
                                    color: '#fff',
                                  }}
                                  tooltipInner={
                                    <div>
                                      <div>TVL USDC: ${formatUnits(tvlUsdc)}</div>
                                      <div>TVL underlying: {formatUnits(tvl)}</div>
                                    </div>
                                  }
                                />
                              </Col>
                            </Row>
                            {/* </Link> */}
                          </Col>
                          <Col>
                            <Row gutter={8} align="middle">
                              <Col>
                                <span className="bestVaultWrapperContentItemTitle">APY</span>
                              </Col>
                              <Col>
                                <APRView
                                  vault={vault}
                                  hideControls={true}
                                  networkName={networkName}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Carousel.Item>
                )
              })}
            </Carousel>
          </Col>
        </Row>
      </div>
    </div>
  )
})
