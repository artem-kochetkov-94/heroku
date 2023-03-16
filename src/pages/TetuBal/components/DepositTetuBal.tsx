import { Button, Col, Modal, Row } from 'antd'
import React, { useCallback, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Amount } from '../../../components/Amount'
import { getAssetsIconMap } from '../../../static/tokens'
import { tetuBalVault } from '../TetuBal'
import { Icon } from '../../../components/ui-kit'
import { ArrowRightOutlined } from '@ant-design/icons'

export const DepositTetuBal = (props: any) => {
  const { vault, data } = props
  const assetsIconMap = getAssetsIconMap()
  const history = useHistory()

  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleButtonClick = () => {
    if (data?.price && parseFloat(data?.price) < 1) {
      history.push('vault/' + tetuBalVault)
      return
    }

    showModal()
  }

  const showModal = useCallback(() => {
    setIsModalVisible(true)
  }, [setIsModalVisible])

  const hideModal = useCallback(() => {
    setIsModalVisible(false)
  }, [setIsModalVisible])

  if (!data) {
    return null
  }

  const sale = (1 / data.tetuBalPrice - 1) * 100

  return (
    <>
      <div className="tetuBal__vault">
        <div className="tetuBal__vault-name">
          <div className="vault-row-wrapper">
            <div className="icon-group">
              <img src={assetsIconMap.veBAL} className={`icon`} />
            </div>

            <div className="vault-row-title">
              <div className="vault-row-title-name">tetuBAL</div>
              <div className="vault-row-title-platform">B-80BAL-20WETH</div>
            </div>
          </div>
        </div>
        <div className="tetuBal__vault-content">
          <div className="tetuBal__vault-content-table">
            <Row justify="space-between" align="middle">
              <Col span={12} className="tetuBal__label">
                <p style={{ marginBottom: 0 }}>Total locked</p>
              </Col>
              <Col span={12} className="tetuBal__tar">
                <Amount value={vault.vault.tvl} style={{ fontSize: 14, color: '#fff' }} />
              </Col>
            </Row>
          </div>

          <Button
            type="primary"
            block
            onClick={handleButtonClick}
            style={{ marginTop: 'auto' }}
            size="small"
          >
            Deposit
          </Button>
        </div>
      </div>

      <Modal
        width={375}
        visible={isModalVisible}
        onCancel={hideModal}
        footer={null}
        className="tetuBal-trade-modal"
      >
        <p className="tetuBal-modal-title">Good Deal</p>
        {data.price > 1 && (
          <div className="tetuBal-modal-content">
            <div className="tetuBal-modal-content-text">
              You can buy up to <b>{data.countToBuy.toFixed(0)}</b> tetuBAL on Balancer
            </div>
            <p className="tetuBal-modal-content-label">
              <span>{parseFloat(sale + '').toFixed(2)}% discount</span>
            </p>
          </div>
        )}
        <div className="tetuBal-modal-footer">
          <Row gutter={[0, 15]}>
            <Col span={24}>
              <Link to={'vault/' + tetuBalVault} className="link-wrapper">
                <Button block>Continue deposit in a 1:1</Button>
              </Link>
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
