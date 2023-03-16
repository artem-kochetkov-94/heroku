import * as React from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Main as MainNew } from '../pages/_Main'
import { Main } from '../pages/Main'
import { Vault } from '../pages/Vault'
import { Stats } from '../pages/Stats'
import { TetuQi } from '../pages/TetuQi'
import { TetuBal } from '../pages/TetuBal'
import { TetuMesh } from '../pages/TetuMesh'
import { NotSupportedNetwork } from '../pages/NotSupportedNetwork'
import { Link, Switch, Route } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import { routes } from '../routes'
import useBreadcrumbs from 'use-react-router-breadcrumbs'
import { SwitchNetworkModal } from '../components/SwitchNetworkModal'
import { observer } from 'mobx-react'
import { useStores } from '../stores/hooks'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import cn from 'classnames'

import './App.css'
import './theme-light.css'

import { useChangeNetwork } from '../hooks/useChangeNetwork'
import { useMediaQuery } from 'react-responsive'

Sentry.init({
  dsn: 'https://0c41934f5fab498fbf60118c14d98ed2@o921102.ingest.sentry.io/5867347',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
})

export const BreadCrimbWrapper = () => {
  // @ts-ignore
  const breadcrumbs = useBreadcrumbs(Object.values(routes))

  return (
    <div className="container" style={{ marginTop: 30, marginBottom: 0 }}>
      <Breadcrumb>
        {breadcrumbs.map((breadcrumb: any, index: number) => {
          return (
            <Breadcrumb.Item key={breadcrumb.match.url}>
              {index === breadcrumbs.length - 1 ? (
                <span>{breadcrumb.breadcrumb}</span>
              ) : (
                <Link to={breadcrumb.match.url}>{breadcrumb.breadcrumb}</Link>
              )}
            </Breadcrumb.Item>
          )
        })}
      </Breadcrumb>
    </div>
  )
}

export const App = observer(() => {
  const { networkManager, metaMaskStore } = useStores()
  const handleChangeNetwork = useChangeNetwork()
  const isTablet900 = useMediaQuery({ query: '(max-width: 900px)' })

  React.useEffect(() => {
    metaMaskStore.on('connect', ({ chainId }: any) => {
      handleChangeNetwork(chainId)
    })
  }, [])

  const isLightTheme = false // process.env.REACT_APP_LIGHT_THEME === 'true'

  return (
    <div className={cn('app-wrapper', { 'theme-light': isLightTheme })}>
      <Header />

      {/* {isTablet900 && (
        <div className="container" style={{ marginTop: 20 }}>
          <Row align="middle" justify="end" gutter={[20, 20]}>
            <Col>
              <TetuPrice />
            </Col>
            <Col>
              <Network />
            </Col>
            <Col>
              <div className="menu-wallet">
                <Wallet />
              </div>
            </Col>
          </Row>
        </div>
      )} */}

      <>
        {networkManager.error ? (
          <NotSupportedNetwork />
        ) : (
          <div className="main" style={{ paddingTop: 0, position: 'relative' }}>
            <div
            // style={{
            //   position: 'absolute',
            //   top: 0,
            //   left: 0,
            //   right: 0,
            //   pointerEvents: 'none',
            //   height: '200vh',
            //   mixBlendMode: 'color',
            //   background:
            //     'radial-gradient(50% 50% at 50% 50%, rgb(33 114 228) 0%, rgba(255, 255, 255, 0) 100%)',
            //   transform: 'translateY(-150vh)',
            //   maxWidth: '100vw !important',
            // }}
            ></div>
            <Switch>
              <Route path={routes.mainPage.path} component={MainNew} exact />
              <Route path={routes.console.path} component={Main} exact />
              <Route path={routes.vault.path} component={Vault} />
              <Route path={routes.stats.path} component={Stats} />
              {networkManager.isMaticNetwork && (
                <>
                  <Route path={routes.tetuqi.path} component={TetuQi} />
                  <Route path={routes.tetumesh.path} component={TetuMesh} />
                  <Route path={routes.tetubal.path} component={TetuBal} />
                </>
              )}

              {/*<Route path={routes.faq.path} component={FAQ} />*/}
            </Switch>
          </div>
        )}
      </>

      <Footer />
      <SwitchNetworkModal />
    </div>
  )
})
