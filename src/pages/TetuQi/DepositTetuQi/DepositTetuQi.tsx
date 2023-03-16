import { useCallback, useEffect, useState } from 'react'
import { Button, Col, Modal, Row } from 'antd'
import './styles.css'
import { getAssetsIconMap } from '../../../static/tokens'
import { Icon } from '../../../components/ui-kit'
import { tetuQi } from '../TetuQi'
import { Link, useHistory } from 'react-router-dom'
import { useStores } from '../../../stores/hooks'
import { useFetchData } from './useFetchData'
import { ArrowRightOutlined } from '@ant-design/icons'

export const DepositTetuQi: React.FC = () => {
  const { mainPageStore, metaMaskStore, networkManager, web3Store } = useStores()
  const history = useHistory()
  const assetsIconMap = getAssetsIconMap()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { data } = useFetchData()

  useEffect(() => {
    if (metaMaskStore.inited && networkManager.inited) {
      mainPageStore.fetchData()
    }
    web3Store.getGasPrice()
  }, [metaMaskStore.inited, metaMaskStore.walletAddress, networkManager.inited])

  const showModal = useCallback(() => {
    setIsModalVisible(true)
  }, [setIsModalVisible])

  const hideModal = useCallback(() => {
    setIsModalVisible(false)
  }, [setIsModalVisible])

  const handleButtonClick = () => {
    if (data!.price && data!.price > 1) {
      history.push('vault/' + tetuQi)
      return
    }

    showModal()
  }

  if (!data) {
    return null
  }

  const sale = (1 / data.price) * 100 - 100

  return (
    <>
      <Button
        type="primary"
        block
        onClick={handleButtonClick}
        style={{ marginTop: 'auto' }}
        size="small"
      >
        Deposit
      </Button>
      <Modal
        width={375}
        visible={isModalVisible}
        onCancel={hideModal}
        footer={null}
        className="tetuQi-trade-modal"
      >
        <p className="tetuQi-modal-title">Good Deal</p>
        {data.price < 1 && (
          <div className="tetuQi-modal-content">
            <div className="tetuQi-modal-content-text">
              You can buy up to <b>{data.countToBuy.toFixed(0)}</b> tetuQI on Dystopia
            </div>
            <p className="tetuQi-modal-content-label">
              <span>{parseFloat(sale + '').toFixed(2)}% discount</span>
            </p>
          </div>
        )}
        <div className="tetuQi-modal-footer">
          <Row gutter={[0, 12]}>
            <Col span={24}>
              <Link to={'vault/' + tetuQi} className="link-wrapper">
                <Button block>continue deposit in a 1:1</Button>
              </Link>
            </Col>
            <Col span={24}>
              <a href="https://dystopia.exchange/swap" target="_blank" className="link-wrapper">
                <Button type="primary" block>
                  Trade in Dystopia
                </Button>
              </a>
            </Col>
          </Row>
        </div>

        {/* {data.price < 1 && (
          <>
            <Row justify="center" style={{ marginBottom: 18, paddingTop: 15 }}>
              <Col>
                <Icon name="info" width={32} height={32} style={{ color: '#26C3B1' }} />
              </Col>
            </Row>
            <p className="tetuqi-modal-description">
              You can buy up to <span>{data?.countToBuy.toFixed()}</span>{' '}
              <img src={assetsIconMap.tetuQi} alt="" width="22" style={{ margin: '0 9px 0 7px' }} />
              tetuQi with a <span>{parseFloat(sale + '').toFixed(2)}% discount</span>. Use Dystopia
              for trade
            </p>
          </>
        )} */}
      </Modal>
    </>
  )
}
