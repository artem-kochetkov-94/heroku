import * as React from 'react'
import { ErrorMessage } from '../../pages/ErrorMessage'

export class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorMessage />
    }

    return this.props.children
  }
}
