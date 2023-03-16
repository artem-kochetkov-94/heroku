import React from 'react'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { useMediaQuery } from 'react-responsive'

export const ErrorMessage = () => {
  const isTablet = useMediaQuery({ query: '(max-width: 900px)' })

  return (
    <div className="app-wrapper">
      {/*<Header />*/}
      <div
        className="container"
        style={{
          margin: 'auto',
          fontWeight: 500,
          fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace',
        }}
      >
        <p style={{ fontSize: isTablet ? 24 : 38 }}>We're Sorry</p>
        <p style={{ fontSize: isTablet ? 18 : 24 }}>
          an error has occurred, we are working to eliminate it
        </p>
      </div>
      {/*<Footer />*/}
    </div>
  )
}
