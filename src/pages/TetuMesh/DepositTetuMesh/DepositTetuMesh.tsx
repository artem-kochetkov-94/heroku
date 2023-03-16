import { useCallback, useState } from 'react'
import { Button, Col, Modal, Row } from 'antd'
import './styles.css'
import { getAssetsIconMap } from '../../../static/tokens'
import { Icon } from '../../../components/ui-kit'
import { tetuMeshVault } from '../TetuMesh'
import { Link, useHistory } from 'react-router-dom'
import { ArrowRightOutlined } from '@ant-design/icons'

type DepositSwapType = {
  data: any
}

export const DepositTetuMesh: React.FC<DepositSwapType> = (props) => {
  const { data } = props
  const history = useHistory()

  const assetsIconMap = getAssetsIconMap()

  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = useCallback(() => {
    setIsModalVisible(true)
  }, [setIsModalVisible])

  const hideModal = useCallback(() => {
    setIsModalVisible(false)
  }, [setIsModalVisible])

  const handleButtonClick = () => {
    if (data?.price && parseFloat(data?.price) < 1) {
      history.push('vault/' + tetuMeshVault)
      return
    }

    showModal()
  }

  if (!data) {
    return null
  }

  const sale = 100 - (1 / data.price) * 100

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
        className="tetuMesh-trade-modal"
      >
        <p className="tetuMesh-modal-title">Good Deal</p>
        {data.price > 1 && (
          <div className="tetuMesh-modal-content">
            <div className="tetuMesh-modal-content-text">
              <Row gutter={25}>
                <Col>TetuSwap</Col>
                <Col>
                  <ArrowRightOutlined style={{ color: '#7F8FA4' }} />
                </Col>
                <Col>Meshswap</Col>
              </Row>
            </div>
            <p className="tetuMesh-modal-content-label">
              <span>{parseFloat(sale + '').toFixed(2)}% discount</span>
            </p>
          </div>
        )}
        <div className="tetuMesh-modal-footer">
          <Row gutter={[0, 12]}>
            <Col span={24}>
              <Link to={'vault/' + tetuMeshVault} className="link-wrapper">
                <Button block>Continue deposit in a 1:1</Button>
              </Link>
            </Col>
            <Col span={24}>
              <a href="https://meshswap.fi/exchange/swap" target="_blank" className="link-wrapper">
                <Button type="primary" block>
                  Trade in meshswap
                </Button>
              </a>
            </Col>
          </Row>
        </div>

        {/* {data.price > 1.01 && (
          <>
            <Row justify="center" style={{ marginBottom: 18, paddingTop: 15 }}>
              <Col>
                <Icon name="info" width={32} height={32} style={{ color: '#26C3B1' }} />
              </Col>
            </Row>
            <p className="tetumesh-modal-description">
              You can buy up to <span>{data?.countToBuy}</span>{' '}
              <img
                src={assetsIconMap.tetuMESH}
                alt=""
                width="22"
                style={{ margin: '0 9px 0 7px' }}
              />
              tetuMESH with a <span>{parseFloat(sale + '').toFixed(2)}% discount</span>. Use
              MeshSwap for trade
            </p>
          </>
        )} */}
      </Modal>
    </>
  )
}
