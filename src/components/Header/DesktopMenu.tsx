import React, { useEffect } from 'react'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import { Wallet } from '../Wallet'
import { useStores } from '../../stores/hooks'
import { useLocation } from 'react-router'
import { resourcesLinks } from '../../App/constants'
import { observer } from 'mobx-react'
import { Button, Row, Col, Spin } from 'antd'
import { getAssetsIconMap } from '../../static/tokens'
import { TetuTokenValuesStore } from '../../stores'
import { LoadingOutlined } from '@ant-design/icons'
import { formatUnits } from 'ethers/lib/utils'
import { addSpace, millifyValue } from '../../utils/vaults'
import { TetuPrice } from './components'
import { Network } from '../Network'
import { TVL } from './components/TVL'
import LinkIcon from '../../static/arrow-link-white.svg'

type DesctopMenuProps = {}

const arrow = (
  <svg
    viewBox="64 64 896 896"
    focusable="false"
    data-icon="down"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
  </svg>
)

export const DesctopMenu: React.FC<DesctopMenuProps> = observer((props) => {
  const { networkManager, web3Store } = useStores()
  const location = useLocation()
  const isPoolPage = location.pathname === '/pool'
  const isConsolePage = location.pathname === '/console'
  const isDashboardPage = location.pathname === '/dashboard'
  const isStatsPage = location.pathname === '/stats'
  const isTetuQi = location.pathname === '/tetuqi'
  const isTetuBal = location.pathname === '/tetubal'
  const isLiqudity = isTetuQi || isTetuBal
  const isHome = location.pathname === '/'

  return (
    <>
      <div className="menu-list-1">
        <div className={cn('menu-list-item-1', { active: isHome })}>
          <Link to="/">Home</Link>
        </div>
        <div className={cn('menu-list-item-1', { active: isConsolePage })}>
          <Link to="/console">EARN</Link>
        </div>
        {/* <div className={cn('menu-list-item-1', { active: isDashboardPage })}>
          <Link to="/dashboard">Dashboard</Link>
        </div> */}
        {networkManager.isMaticNetwork && (
          <div
            className={cn('menu-list-item-1', 'menu-list-item-1--submenu', { active: isLiqudity })}
          >
            <span className="menu-item-select">Liquid Staking</span>
            <div className="menu-list-1-submenu">
              <div className="menu-list-1-submenu-item">
                <Link to="/tetuqi">tetuQi</Link>
              </div>
              <div className="menu-list-1-submenu-item">
                <Link to="/tetumesh">tetuMesh</Link>
              </div>
              <div className="menu-list-1-submenu-item">
                <Link to="/tetubal">tetuBal</Link>
              </div>
            </div>
          </div>
        )}

        {/* <div className="menu-list-item-1">
          <a href={resourcesLinks.swap} target="_blank" rel="noreferrer">
            Swap
          </a>
          <img src={LinkIcon} alt="" style={{ marginLeft: 7, marginBottom: 2 }} />
        </div> */}
        {/* {networkManager.isMaticNetwork && (
          <div className="menu-list-item-1">
            <a href="https://dune.xyz/tetu/Tetu.io" target="_blank" rel="noreferrer">
              Dune
            </a>
          </div>
        )} */}
      </div>
      <Row gutter={[46, 0]} align="middle" className="header-line-row">
        <Col>
          <Row gutter={24} align="middle">
            <Col>{!isHome && <TVL />}</Col>
            <Col>
              <TetuPrice />
            </Col>
          </Row>
        </Col>
        <Col>
          <Row gutter={24} align="middle">
            <Col>
              <Network />
            </Col>
            <Col>
              <div className="menu-wallet">
                <Wallet />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
})
