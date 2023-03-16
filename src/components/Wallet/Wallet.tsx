import React, { useState, useEffect } from 'react'
import { useStores } from '../../stores/hooks'
import { observer } from 'mobx-react'
import { Button, Select, Spin, Row, Col } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { UserSwitchOutlined } from '@ant-design/icons'
import { PendingTransactions } from '../PendingTransactions'
import { formatAdress } from '../../utils/format'
import { useChangeNetwork } from '../../hooks/useChangeNetwork'
import { useMediaQuery } from 'react-responsive'
import { LoadingOutlined } from '@ant-design/icons'
import { formatUnits } from 'ethers/lib/utils'
import walletImg from '../../static/wallet.svg'
import { ReactComponent as ExitSvg } from '../../static/wallet.svg'
import Icon from '@ant-design/icons'

import './styles.css'

const antIcon = <LoadingOutlined style={{ fontSize: 16 }} spin />

export const Wallet = observer(() => {
  const { metaMaskStore, networkManager, mainPageStore, nativeCurrencyBalance } = useStores()

  const [isShowModal, setIsShowModal] = useState(false)
  const isMobile600 = useMediaQuery({ query: '(max-width: 600px)' })
  const isMobile400 = useMediaQuery({ query: '(max-width: 480px)' })

  const location = useLocation()
  const history = useHistory()

  const formatAddress = (address: string) => {
    return address.substr(0, 4) + '...' + address.substr(address.length - 3)
  }

  const handleChangeNetwork = useChangeNetwork()

  useEffect(() => {
    if (metaMaskStore.walletAddress && metaMaskStore.inited && networkManager.inited) {
      nativeCurrencyBalance.getBalance()
    }
  }, [
    metaMaskStore.walletAddress,
    metaMaskStore.inited,
    networkManager.inited,
    networkManager.networkId,
  ])

  return (
    <div className="wallet">
      {metaMaskStore.walletAddress === null ? (
        <div className="wallet-wrapper">
          <div
            onClick={() => {
              metaMaskStore.connectMetaMask().then(() => {
                window?.ethereum?.request({ method: 'eth_chainId' }).then((chainId: string) => {
                  handleChangeNetwork(chainId)
                  mainPageStore.fetchUserInfo()
                })
              })
            }}
          >
            <span className="wallet-connect">Connect wallet</span>
          </div>
        </div>
      ) : (
        <div className="wallet-wrapper">
          {/* <Row className="wallet-currency">
            <div className="symbol">{networkManager.network.nativeCurrency.symbol}</div>
            <div className="balance">
              {nativeCurrencyBalance.nativeCurrencyBalance == null ? (
                <Spin indicator={antIcon} />
              ) : (
                parseFloat(
                  parseFloat(
                    formatUnits(
                      nativeCurrencyBalance.nativeCurrencyBalance,
                      networkManager.network.nativeCurrency.decimals,
                    ),
                  ).toFixed(3),
                )
              )}
            </div>
          </Row> */}

          <div
            className={`wallet-address ${metaMaskStore.walletAddress ? 'connected' : ''}`}
            onClick={() => setIsShowModal(true)}
          >
            {!isMobile600 && (
              <span style={{ display: 'inline-block', marginRight: 8 }}>
                <Icon
                  component={ExitSvg}
                  style={{ color: '#04A8F0', fontSize: 18, marginTop: 5, display: 'inline-flex' }}
                />
                {/* <img src={walletImg} alt="" width="20px" style={{  }} /> */}
              </span>
            )}
            {formatAdress(metaMaskStore.walletAddress)}
          </div>
        </div>
      )}
      <PendingTransactions visible={isShowModal} onClose={() => setIsShowModal(false)} />
    </div>
  )
})
