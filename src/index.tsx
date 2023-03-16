import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as MobxProvider } from 'mobx-react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ErrorBoundary } from '@sentry/react'
import { ErrorMessage } from './pages/ErrorMessage'

import * as stores from './stores'

import './index.css'
import 'antd/dist/antd.min.css'

import { App } from './App'

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary fallback={ErrorMessage}>
      <MobxProvider {...stores}>
        <Router>
          <App />
        </Router>
      </MobxProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root'),
)
