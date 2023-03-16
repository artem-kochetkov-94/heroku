import React from 'react'
import { Col, Row, Tabs } from 'antd'
import { VaultTitle } from './components'
import { useParams } from 'react-router-dom'
import { useStores } from '../../../../stores/hooks'
import { PageTabs } from '../../Vault'
import { observer } from 'mobx-react'
import { Banner } from '../Banner'
import './styles.css'

type NavProps = {
  activeTab: PageTabs
  setActiveTab(value: PageTabs): void
  excludedHardWorks: boolean
}

const { TabPane } = Tabs

export const Nav: React.FC<NavProps> = observer((props) => {
  const { networkManager } = useStores()
  const { activeTab, setActiveTab, excludedHardWorks } = props
  const { address } = useParams<{ address: string }>()

  return (
    <div className="vault-page-nav">
      <Row justify="space-between" align="middle">
        <Col span={24}>
          <VaultTitle />
        </Col>
        <Col span={24}>
          <Tabs activeKey={activeTab} onChange={(key: string) => setActiveTab(key as PageTabs)}>
            <TabPane tab="Operations" key={PageTabs.DepositAndWithdraw} />
            <TabPane tab="Info" key={PageTabs.VaultInfo} />
            {/* <TabPane
              tab={
                <a
                  style={{ color: '#fff' }}
                  href={`${tetuStatsApi}${networkManager.network.other.urlParam}&vault=${address}`}
                  target="_blank"
                >
                  TVL{' '}
                  <span>
                    <ArrowUpOutlined style={{ transform: 'rotate(45deg)' }} />
                  </span>
                </a>
              }
              key={PageTabs.TVL}
            />
            <TabPane
              tab={
                <a
                  style={{ color: '#fff' }}
                  href={`${tetuSharePriceApi}${networkManager.network.other.urlParam}&vault=${address}`}
                  target="_blank"
                >
                  Share Price{' '}
                  <span>
                    <ArrowUpOutlined style={{ transform: 'rotate(45deg)' }} />
                  </span>
                </a>
              }
              key={PageTabs.SharePrice}
            /> */}
            {networkManager.isMaticNetwork && (
              <TabPane
                key={PageTabs.DuneVaultStats}
                tab={
                  <a
                    href={`https://dune.xyz/tetu/Vault-Stats?2.%20vault=${address}`}
                    target="_blank"
                  >
                    Dune Vault Stats
                  </a>
                }
              />
            )}
            {/*
            {networkManager.isMaticNetwork && (
              <TabPane
                key={PageTabs.Insurance}
                tab={
                  <a
                    style={{ color: '#fff' }}
                    href={`https://app.insurace.io/Insurance/Cart?id=137&referrer=35772147701804136882228090348989940568260897783&chain=POLYGON `}
                    target="_blank"
                  >
                    Insurance
                  </a>
                }
              />
            )}
            */}
            {!excludedHardWorks && <TabPane tab="Hard Works" key={PageTabs.HardWorks} />}
            {/*
            <TabPane
                key={PageTabs.Referall}
                tab={
                  <a
                      style={{ color: '#fff' }}
                      href={`https://docs.insurace.io/landing-page/documentation/refer-and-earn/customize-referral-link`}
                      target="_blank"
                  >
                    Insurance
                  </a>
                }
            />
            */}
          </Tabs>
        </Col>
      </Row>
    </div>
  )
})
