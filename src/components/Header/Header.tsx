import React, { useState } from 'react'
import { Typography, Row } from 'antd'
import { Link } from 'react-router-dom'
import Logo from '../../static/logo/full-logo-dark-gradient.svg'
import LogoWithoutText from '../../static/logo/full-logo-dark.svg'
import { observer } from 'mobx-react'
import { useMediaQuery } from 'react-responsive'
import { DesctopMenu } from './DesktopMenu'
import { MobileMenu } from './MobileMenu'
import cn from 'classnames'

import './styles.css'

export const Header = observer(() => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1220px)' })
  const isTablet900 = useMediaQuery({ query: '(max-width: 900px)' })
  const isMobile600 = useMediaQuery({ query: '(max-width: 600px)' })
  const isMobile400 = useMediaQuery({ query: '(max-width: 400px)' })

  const [isShowMenu, setIsShowMenu] = useState(false)

  const showMenuToggle = () => {
    setIsShowMenu(!isShowMenu)
  }

  return (
    <>
      <div
        className={cn('header', {
          // 'show-menu': isShowMenu,
          'table-or-mobile-menu': isTabletOrMobile,
          'mobile-600': isMobile600,
          'mobile-400': isMobile400,
        })}
      >
        <div className="container">
          <Row align="middle">
            <div className="custom-switch">
              <Row align="middle">
                {!isTablet900 && (
                  <Link to="/">
                    <Typography.Title className="header-logo" level={3}>
                      <span>
                        <img src={Logo} alt="" />
                      </span>
                    </Typography.Title>
                  </Link>
                )}
              </Row>
            </div>
            {isTabletOrMobile ? (
              <MobileMenu isShowMenu={isShowMenu} showMenuToggle={showMenuToggle} />
            ) : (
              <DesctopMenu />
            )}
          </Row>
        </div>
      </div>
    </>
  )
})
