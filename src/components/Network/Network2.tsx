import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { useStores } from '../../stores/hooks'
import { addressesMap } from '../../networks/Addresses'
import { Button, Row, Col, Modal, Typography, Popover, Spin } from 'antd'
import { useChangeNetwork } from '../../hooks/useChangeNetwork'
import MovrLogo from '../../static/Movr.svg'
import SoketLogo from '../../static/Socket-Logo-White.png'
import { formatUnits } from 'ethers/lib/utils'
import BungeeIcon from '../../static/bungee.png'
import MultichainIcon from '../../static/multichain.png'
import './styles.css'
import { LoadingOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const antIcon = <LoadingOutlined style={{ fontSize: 16 }} spin />

export const Network = observer(() => {
  const [isShowModal, setIsShowModal] = useState(false)
  const { networkManager, nativeCurrencyBalance } = useStores()

  // @ts-ignore
  const { chainName, logo } = addressesMap[networkManager.networkId].config.network

  const handleClose = () => {
    setIsShowModal(false)
  }

  const handleOpen = () => {
    setIsShowModal(true)
  }

  const toggleSelect = () => {
    setIsShowModal(!isShowModal)
  }

  return (
    <div
      className={`network-select ${isShowModal ? 'network-selelct-active' : ''}`}
      onClick={toggleSelect}
    >
      <div className="network-select-header">
        <Row gutter={[8, 0]} align="middle">
          <Col>
            <img src={logo} alt="" width="20px" />
          </Col>
          <Col>{chainName}</Col>
          <Col>
            {nativeCurrencyBalance.nativeCurrencyBalance == null ? (
              <Spin indicator={antIcon} />
            ) : (
              <span className="network-select-header-value">
                {parseFloat(
                  parseFloat(
                    formatUnits(
                      nativeCurrencyBalance.nativeCurrencyBalance,
                      networkManager.network.nativeCurrency.decimals,
                    ),
                  ).toFixed(3),
                )}
              </span>
            )}
          </Col>
        </Row>
      </div>
      <SelectNetworkPopover onClose={handleClose} />
    </div>
  )

  return (
    <div>
      <div className="header-btn network" onClick={handleOpen}>
        <Row gutter={[8, 0]} align="middle">
          <Col>
            <img src={logo} alt="" />
          </Col>
          <Col>{chainName}</Col>
        </Row>
      </div>
      <SelectNetworkModal isShow={isShowModal} onClose={handleClose} />
    </div>
  )
})

const SelectNetworkPopover = observer((props: any) => {
  const { onClose } = props
  const { networkManager } = useStores()
  const handleChangeNetwork = useChangeNetwork()

  // @ts-ignore
  const { chainName: chainNameSelected } = addressesMap[networkManager.networkId].config.network

  const handleSwitchNetwork = (chainId: string) => () => {
    const withResetApp = networkManager.networkId !== chainId
    const cb = () => {
      handleChangeNetwork(chainId, withResetApp)
      onClose()
    }
    networkManager.setNetworkId(chainId, cb)
  }

  return (
    <div className="network-select-content">
      <p className="network-select-content-title">SELECT NET:</p>
      <Row gutter={[0, { xs: 24, sm: 24, md: 6 }]} style={{ flexDirection: 'column' }}>
        {Object.keys(addressesMap.aliases).map((networkName) => {
          // @ts-ignore
          const { chainName, chainId, logo } = addressesMap.aliases[networkName].config.network

          return (
            <Col>
              <button
                className={`network-select-content-item ${
                  chainNameSelected === chainName ? 'network-select-content-item-active' : ''
                }`}
                onClick={handleSwitchNetwork(chainId)}
              >
                <Row align="middle" justify="start" gutter={8}>
                  <Col>
                    <img src={logo} alt="" width="20px" />
                  </Col>
                  <Col>{chainName}</Col>
                </Row>
              </button>
            </Col>
          )
        })}
      </Row>
      <div className="network-select-mobile-close" />
    </div>
  )

  // return (
  //   <div>
  //     {/* <Title level={4} style={{ marginBottom: 16 }}>
  //       Bridge
  //     </Title> */}
  //     {/* <Row gutter={[20, 20]} style={{ marginBottom: 48 }}>
  //       <Col span={12}>
  //         <a
  //           style={{ display: 'inline-block', color: '#fff' }}
  //           className="switch-network-select-item"
  //           href="https://www.socket.tech/"
  //           target="_blank"
  //         >
  //           <Row gutter={10} align="middle" justify="start">
  //             <Col>
  //               <img src={SoketLogo} alt="" style={{ width: '100%' }} />
  //             </Col>
  //             <Col>Socket</Col>
  //           </Row>
  //         </a>
  //       </Col>
  //     </Row> */}
  //   </div>
  // )
})

const SelectNetworkModal = observer((props: any) => {
  const { isShow, onClose } = props
  const { metaMaskStore, networkManager } = useStores()
  const handleChangeNetwork = useChangeNetwork()

  // @ts-ignore
  const { chainName } = addressesMap[networkManager.networkId].config.network

  const handleSwitchNetwork = (chainId: string) => () => {
    const withResetApp = networkManager.networkId !== chainId
    const cb = () => {
      handleChangeNetwork(chainId, withResetApp)
      onClose()
    }
    networkManager.setNetworkId(chainId, cb)
  }

  return (
    <Modal title="" centered visible={isShow} width={695} footer={null} onCancel={onClose}>
      <Title level={4} style={{ color: '#fff', marginBottom: 16 }}>
        Bridge
      </Title>
      <Row gutter={[20, 20]} style={{ marginBottom: 48 }}>
        <Col span={12}>
          <a
            style={{ display: 'inline-block', color: '#fff' }}
            className="switch-network-select-item"
            href="https://app.multichain.org/#/router/"
            target="_blank"
          >
            <Row align="middle" justify="start">
              <Col style={{ marginRight: 10 }}>
                <img src={MultichainIcon} alt="" />
              </Col>
              <Col>Multichain</Col>
            </Row>
          </a>
        </Col>
        <Col span={12}>
          <a
            style={{ display: 'inline-block', color: '#fff' }}
            className="switch-network-select-item"
            href="https://app.bungee.exchange/"
            target="_blank"
          >
            <Row align="middle" justify="start">
              <Col style={{ marginRight: 10 }}>
                <img src={BungeeIcon} alt="" />
              </Col>
              <Col>Bungee</Col>
            </Row>
          </a>
        </Col>
      </Row>
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ color: '#fff', marginBottom: 0 }}>
          Select a Network
        </Title>
        <Text style={{ color: 'rgb(196, 196, 223)' }}>
          You are currently browsing TETU on the <span style={{ color: '#fff' }}>{chainName}</span>{' '}
          network
        </Text>
      </div>
      <Row gutter={[20, 20]} style={{ marginBottom: 0 }}>
        {/*{Object.keys({ matic: addressesMap.aliases.matic }).map((networkName) => {*/}
        {Object.keys(addressesMap.aliases).map((networkName) => {
          // @ts-ignore
          const { chainName, chainId, logo } = addressesMap.aliases[networkName].config.network

          return (
            <Col xs={24} sm={12}>
              <button
                className="switch-network-select-item "
                onClick={handleSwitchNetwork(chainId)}
              >
                <Row align="middle" justify="start">
                  <Col>
                    <img src={logo} alt="" />
                  </Col>
                  <Col>{chainName}</Col>
                </Row>
              </button>
            </Col>
          )
        })}
      </Row>
    </Modal>
  )
})
