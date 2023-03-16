import { Button, Col, Modal, Row } from 'antd'
import { useState } from 'react'
import { useStores } from '../../../../../../../stores/hooks'
import { useFetchData } from '../../../../../../TetuQi/DepositTetuQi/useFetchData'
import { ArrowRightOutlined } from '@ant-design/icons'

type DepositTetuQiButtonProps = {
  handleClickDeposit: VoidFunction
  isFetchingDeposit: boolean
  isPendingDeposit: boolean
}

export const DepositTetuQiButton: React.FC<DepositTetuQiButtonProps> = (props) => {
  const { handleClickDeposit, isPendingDeposit, isFetchingDeposit } = props
  const { userInfoOfVaultStore, vaultDataPageStore } = useStores()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const showModal = () => setIsModalVisible(true)
  const hideModal = () => setIsModalVisible(false)

  const userInfo = userInfoOfVaultStore.value
  const vault = vaultDataPageStore.data

  const { data, loading, loaded } = useFetchData()

  const handleButtonClick = () => {
    if (data!.price && data!.price > 1) {
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

  const sale = (1 / data.price) * 100 - 100

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
              <div onClick={handleClickDeposit} className="link-wrapper">
                <Button block>continue deposit in a 1:1</Button>
              </div>
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
      </Modal>
    </>
  )
}
