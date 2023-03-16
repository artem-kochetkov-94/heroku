import React from 'react'
import { observer } from 'mobx-react'
import { useStores } from '../../stores/hooks'
import { useMediaQuery } from 'react-responsive'

export const NotSupportedNetwork = observer(() => {
  const { networkManager, metaMaskStore } = useStores()
  const isTablet = useMediaQuery({ query: '(max-width: 900px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

  return (
    <div style={{ margin: 'auto', fontSize: isTablet ? 24 : 38, fontWeight: 500 }}>
      <div className="container">
        {isMobile ? (
          <p>{networkManager?.error?.replace('${name}', metaMaskStore.networkName)}</p>
        ) : (
          <pre>{networkManager?.error?.replace('${name}', metaMaskStore.networkName)}</pre>
        )}
      </div>
    </div>
  )
})
