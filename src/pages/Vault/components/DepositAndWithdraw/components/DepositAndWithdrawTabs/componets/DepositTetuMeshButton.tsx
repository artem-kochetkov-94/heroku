import { Button, Col, Modal, Row } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useStores } from '../../../../../../../stores/hooks'
import { useFetchData } from '../../../../../../TetuMesh/ useFetchData'

type DepositTetuMeshButtonProps = {
  handleClickDeposit: VoidFunction
  isFetchingDeposit: boolean
  isPendingDeposit: boolean
}

export const DepositTetuMeshButton: React.FC<DepositTetuMeshButtonProps> = (props) => {
  const { handleClickDeposit, isPendingDeposit, isFetchingDeposit } = props
  const { userInfoOfVaultStore, vaultDataPageStore } = useStores()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const showModal = () => setIsModalVisible(true)
  const hideModal = () => setIsModalVisible(false)

  const userInfo = userInfoOfVaultStore.value
  const vault = vaultDataPageStore.data

  const { data, loading, loaded } = useFetchData()

  const handleButtonClick = () => {
    //@ts-ignore
    if (data?.price && parseFloat(data?.price) < 1) {
      handleClickDeposit()
      return
    }

    showModal()
  }

  if (!data || !loaded) {
    return (
      <Button
        shape="round"
        onClick={handleClickDeposit}
        loading={isPendingDeposit || isFetchingDeposit || loading}
        disabled={
          vault?.active === false || userInfo?.underlyingBalance?.toString() === '0' || loading
        }
        className="btn-deposit"
        type="primary"
      >
        <strong>Deposit</strong>
      </Button>
    )
  }

  const sale = 100 - (1 / data.price) * 100

  return (
    <>
      <Button
        shape="round"
        onClick={handleButtonClick}
        loading={isPendingDeposit || isFetchingDeposit}
        disabled={vault?.active === false || userInfo?.underlyingBalance?.toString() === '0'}
        className="btn-deposit"
        type="primary"
      >
        <strong>Deposit</strong>
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
              <div onClick={handleClickDeposit} className="link-wrapper">
                <Button block>Continue deposit in a 1:1</Button>
              </div>
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
      </Modal>
    </>
  )
}
