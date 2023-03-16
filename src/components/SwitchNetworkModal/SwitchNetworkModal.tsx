import { Modal, Button, Row, Col, Typography } from 'antd'
import { observer } from 'mobx-react'
import { useStores } from '../../stores/hooks'
import { addressesMap } from '../../networks/Addresses'
import { LogoutOutlined } from '@ant-design/icons'
import { useResetLabels } from '../../pages/Main/components/LabelGroup'

import './styles.css'
import { useChangeNetwork } from '../../hooks/useChangeNetwork'

const { Title, Text } = Typography

export const SwitchNetworkModal = observer(() => {
  const { metaMaskStore, networkManager } = useStores()
  const handleClose = () => {
    metaMaskStore.closeSwitchNetworkModal()

    window?.ethereum?.request({ method: 'eth_chainId' }).then((chainId: string) => {
      if (chainId !== networkManager?.networkId) {
        metaMaskStore.disconnect()
      }
    })
  }

  // @ts-ignore
  const chainName = addressesMap?.[networkManager?.networkId]?.config?.network?.chainName

  const handleChangeNetwork = useChangeNetwork()

  return (
    <Modal
      title=""
      // Switch network or disconnect wallet
      centered
      visible={metaMaskStore.isShowModalSwitchNetwork}
      width={695}
      footer={null}
      onCancel={handleClose}
      className="switch-network-modal"
    >
      <div>
        <p className="switch-network-title">Your network doesn't match of the application one</p>
        <p className="switch-network-description">
          To avoid the error, switch the {chainName} network{' '}
          {metaMaskStore.walletAddress && 'or disconnect the wallet'}
        </p>
      </div>
      <p className="switch-network-select-title">Choose network</p>
      <Row gutter={[0, 24]}>
        {/*{Object.keys({ matic: addressesMap.aliases.matic }).map((networkName) => {*/}
        {Object.keys(addressesMap.aliases).map((networkName) => {
          // @ts-ignore
          const { chainName, chainId, logo } = addressesMap.aliases[networkName].config.network

          return (
            <Col xs={24} sm={24}>
              <button
                className="switch-network-select-item "
                onClick={() => {
                  handleChangeNetwork(chainId)
                  networkManager.setNetworkId(chainId, () => {
                    metaMaskStore.closeSwitchNetworkModal()
                  })
                }}
                style={{}}
              >
                <Row align="middle" justify="start" gutter={14}>
                  <Col>
                    <img src={logo} alt="" height="24px" />
                  </Col>
                  <Col>{chainName}</Col>
                </Row>
              </button>
            </Col>
          )
        })}
        <Col>
          {/* <div className="app-modal">
            <Select
              value={networkManager.networkId}
              onChange={handleChangeNetwork}
              className="antd-select-small"
            >
              {Object.keys(addressesMap.aliases).map((networkName) => {
                // @ts-ignore
                const { chainName, chainId } = addressesMap.aliases[networkName].config.network
                return (
                  <Option key={chainId} value={chainId}>
                    {chainName}
                  </Option>
                )
              })}
            </Select>
          </div> */}
        </Col>
      </Row>

      {/* {metaMaskStore.walletAddress && (
        <Row gutter={[20, 20]} style={{ marginBottom: 40 }}>
          <Col span={12}>
            <Button
              onClick={handleClose}
              style={{ fontSize: 16, paddingLeft: 20 }}
              icon={<LogoutOutlined />}
            >
              Disconnect wallet
            </Button>
          </Col>
        </Row>
      )} */}
    </Modal>
  )
})
