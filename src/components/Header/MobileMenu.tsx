import React, { useState } from 'react'
import { Col, Row } from 'antd'
import { Wallet } from '../Wallet'
import { Link, NavLink } from 'react-router-dom'
import { resourcesLinks } from '../../App/constants'
import Telegram from '../../static/telegram.svg'
import { GithubOutlined, MediumOutlined, TwitterOutlined } from '@ant-design/icons'
import GitBook from '../../static/gitbook.svg'
import Discord from '../../static/discord.svg'
import { useLocation } from 'react-router'
import Logo from '../../static/logo/full-logo-dark-gradient.svg'
import { useStores } from '../../stores/hooks'
import { useMediaQuery } from 'react-responsive'
import { observer } from 'mobx-react'
import { TetuPrice } from './components'
import { Network } from '../Network'
import Audit1 from '../../static/audit-1.png'
import Audit2 from '../../static/audit-2.png'
import Audit3 from '../../static/audit-3.svg'
import Immunefi from '../../static/immunefi.svg'

type MobileMenuProps = {
  isShowMenu: boolean
  showMenuToggle(): void
}

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

export const MobileMenu: React.FC<MobileMenuProps> = observer((props) => {
  const { isShowMenu, showMenuToggle } = props
  const { networkManager } = useStores()

  const [subMenu, setSubMenu] = useState({
    VE: false,
  })

  const showToggle = (key: keyof typeof subMenu) => {
    setSubMenu({
      ...subMenu,
      [key]: !subMenu[key],
    })
  }

  const isTablet900 = useMediaQuery({ query: '(max-width: 900px)' })

  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const isStatsPage = location.pathname === '/stats'
  const isTetuQi = location.pathname === '/tetuqi'

  return (
    <>
      <Row justify="end" align="middle" gutter={[30, 0]} className="header-line-row">
        {/* {!isTablet900 && ( */}
        <Col>
          <TetuPrice />
        </Col>
        {/* )} */}

        {!isTablet900 && (
          <Col>
            <Network />
          </Col>
        )}

        {!isTablet900 && (
          <Col>
            <div className="menu-wallet">
              <Wallet />
            </div>
          </Col>
        )}

        <Col>
          <button className="menu-burger-wrapper" onClick={showMenuToggle}>
            <div className={`menu-burger ${isShowMenu ? 'visible' : ''}`}>
              <i />
            </div>
          </button>
        </Col>
      </Row>

      <div className={`menu-contianer ${isShowMenu ? 'visible' : ''}`}>
        <div className="container">
          <div className="menu-container-row">
            <Link to="/" onClick={showMenuToggle}>
              <img src={Logo} alt="" className="header-logo" />
            </Link>

            <button className="menu-burger-wrapper" onClick={showMenuToggle}>
              <div className={`menu-burger ${isShowMenu ? 'visible' : ''}`}>
                <i />
              </div>
            </button>
          </div>

          <div className="wrapper">
            <div className="menu-list">
              <div className="menu-list-item">
                <NavLink to="/" activeClassName="active" exact onClick={showMenuToggle}>
                  Home
                </NavLink>
              </div>

              <div className="menu-list-item">
                <NavLink to="/console" activeClassName="active" exact onClick={showMenuToggle}>
                  Earn
                </NavLink>
              </div>

              {/* <div className="menu-list-item">
                <a href={resourcesLinks.swap} target="_blank" rel="noreferrer">
                  Swap
                </a>
              </div> */}

              {networkManager.isMaticNetwork && (
                <div
                  className={`menu-list-item menu-list-item--submenu ${subMenu.VE ? 'active' : ''}`}
                >
                  <span
                    onClick={() => {
                      showToggle('VE')
                    }}
                  >
                    Liquid Staking <i>{arrow}</i>
                  </span>
                  <div className="menu-list-submenu">
                    <div className="menu-list-submenu-item">
                      <NavLink to="/tetuqi" onClick={showMenuToggle}>
                        tetuQi
                      </NavLink>
                    </div>
                    <div className="menu-list-submenu-item">
                      <NavLink to="/tetumesh" onClick={showMenuToggle}>
                        tetuMesh
                      </NavLink>
                    </div>
                    <div className="menu-list-submenu-item">
                      <NavLink to="/tetubal" onClick={showMenuToggle}>
                        tetuBal
                      </NavLink>
                    </div>
                  </div>
                </div>
              )}

              {networkManager.isMaticNetwork && (
                <div className="menu-list-item">
                  <a href="https://dune.xyz/tetu/Tetu.io" target="_blank" rel="noreferrer">
                    Dune
                  </a>
                </div>
              )}
              <div className="menu-list-item">
                <a target="_blank" href={resourcesLinks.about} rel="noreferrer">
                  About
                </a>
              </div>
              <div className="menu-list-item">
                <a target="_blank" href={resourcesLinks.team} rel="noreferrer">
                  Team
                </a>
              </div>
              <div className="menu-list-item">
                <a target="_blank" href={resourcesLinks.faq} rel="noreferrer">
                  FAQ
                </a>
              </div>
            </div>

            <div style={{ width: '100%', maxWidth: 310, margin: '0 auto' }}>
              <Row
                justify="space-between"
                className="socials"
                style={{ transform: 'translateY(3px)' }}
              >
                {/* <Col>
                  <a target="_blank" href={resourcesLinks.telegram} rel="noreferrer">
                    <img src={Telegram} alt="" style={{ height: 54, marginTop: -12 }} />
                  </a>
                </Col> */}
                <Col>
                  <a target="_blank" href={resourcesLinks.github} rel="noreferrer">
                    <GithubOutlined style={{ fontSize: 24, paddingTop: 2, color: '#7F8FA4' }} />
                  </a>
                </Col>
                <Col>
                  <a target="_blank" href={resourcesLinks.gitbook} rel="noreferrer">
                    <img src={GitBook} alt="" style={{ height: 24, marginTop: -1 }} />
                  </a>
                </Col>
                <Col>
                  <a target="_blank" href={resourcesLinks.gitbook} rel="noreferrer">
                    <img src={Discord} alt="" style={{ height: 18 }} />
                  </a>
                </Col>
                <Col>
                  <a target="_blank" href={resourcesLinks.twitter} rel="noreferrer">
                    <TwitterOutlined style={{ fontSize: 25, marginBottom: -1, color: '#7F8FA4' }} />
                  </a>
                </Col>
                {/* <Col>
                  <a target="_blank" href={resourcesLinks.medium} rel="noreferrer">
                    <MediumOutlined style={{ fontSize: 31, marginBottom: -1, color: '#7F8FA4' }} />
                  </a>
                </Col> */}
              </Row>
            </div>

            <div>
              <Row gutter={[0, 48]}>
                <Col span={24}>
                  <Row
                    justify="center"
                    gutter={[0, 10]}
                    style={{ flexDirection: 'column', alignItems: 'center' }}
                  >
                    <Col>
                      <p className="header-audit-title">Audit by</p>
                    </Col>

                    <Col>
                      <Row justify="center" gutter={[35, 0]} align="middle">
                        <Col>
                          <a
                            href="https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-Tetu-v1.0.pdf"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img src={Audit1} alt="" height="20px" />
                          </a>
                        </Col>
                        <Col>
                          <a
                            href="https://defiyield.app/audit-database/tetu.io"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img src={Audit2} alt="" height="20px" />
                          </a>
                        </Col>
                        <Col>
                          <a
                            href="https://www.certik.com/projects/tetu"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img src={Audit3} alt="" height="20px" />
                          </a>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>

                <Col span={24}>
                  <Row
                    justify="center"
                    gutter={[0, 10]}
                    style={{ flexDirection: 'column', alignItems: 'center' }}
                  >
                    <Col>
                      <p className="header-audit-title">Bug Bounty program:</p>
                    </Col>
                    <Col>
                      <Row justify="center">
                        <Col>
                          <a
                            href="https://immunefi.com/bounty/tetu/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img src={Immunefi} alt="" height="20px" />
                          </a>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <p className="header-disclaimer disclaimer">
                By using this software, you understand, acknowledge and accept that Tetu and/or the
                underlying software are provided “as is” and “as available” basis and without
                warranties or representations of any kind either expressed or implied. Any use of
                this open source software released under the ISC Internet Systems Consortium license
                is done at your own risk to the fullest extent permissible pursuant to applicable
                law any and all liability as well as all warranties, including any fitness for a
                particular purpose with respect to Tetu and/or the underlying software and the use
                thereof are disclaimed"
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
})
