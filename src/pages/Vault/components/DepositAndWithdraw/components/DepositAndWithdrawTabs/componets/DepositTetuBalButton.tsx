import { Button, Col, Modal, Row } from 'antd'
import { useStores } from '../../../../../../../stores/hooks'
import { useLoadData } from '../../../../../../TetuBal/hooks/useLoadData'
import { ArrowRightOutlined } from '@ant-design/icons'
import { useState } from 'react'

type DepositTetuBalButtonProps = {
  handleClickDeposit: VoidFunction
  isFetchingDeposit: boolean
  isPendingDeposit: boolean
}

export const DepositTetuBalButton: React.FC<DepositTetuBalButtonProps> = (props) => {
  const { handleClickDeposit, isPendingDeposit, isFetchingDeposit } = props
  const { userInfoOfVaultStore, vaultDataPageStore } = useStores()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const showModal = () => setIsModalVisible(true)
  const hideModal = () => setIsModalVisible(false)

  const userInfo = userInfoOfVaultStore.value
  const vault = vaultDataPageStore.data

  const { tetuBalLpData, loaded, loading } = useLoadData()

  const handleButtonClick = () => {
    if (tetuBalLpData?.price && parseFloat(tetuBalLpData?.price) < 1) {
      handleClickDeposit()
      return
    }

    showModal()
  }

  if (!tetuBalLpData || !loaded) {
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

  const sale = (1 / tetuBalLpData.tetuBalPrice - 1) * 100

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
        className="tetuBal-trade-modal"
      >
        <p className="tetuBal-modal-title">Good Deal</p>
        {tetuBalLpData.price > 1 && (
          <div className="tetuBal-modal-content">
            <div className="tetuBal-modal-content-text">
              You can buy up to <b>{tetuBalLpData.countToBuy.toFixed(0)}</b> tetuBAL on Balancer
            </div>
            <p className="tetuBal-modal-content-label">
              <span>{parseFloat(sale + '').toFixed(2)}% discount</span>
            </p>
          </div>
        )}
        <div className="tetuBal-modal-footer">
          <Row gutter={[0, 15]}>
            <Col span={24}>
              <div onClick={handleClickDeposit} className="link-wrapper">
                <Button block>Continue deposit in a 1:1</Button>
              </div>
            </Col>
            <Col span={24}>
              <a
                href="https://polygon.balancer.fi/#/"
                target="_blank"
                className="link-wrapper"
                rel="noreferrer"
              >
                <Button type="primary" block>
                  Trade in balancer
                </Button>
              </a>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  )
}
