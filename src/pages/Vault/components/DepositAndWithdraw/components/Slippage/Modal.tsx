import { observer } from 'mobx-react'
import { useStores } from '../../../../../../stores/hooks'
import { Modal as AntdModal, Row, Col, InputNumber, Button } from 'antd'
import { useEffect, useState } from 'react'

export const Modal = observer((props: any) => {
  const { onClose, visible } = props
  const { zapChainStore } = useStores()

  const [value, setValue] = useState(0)

  useEffect(() => {
    if (zapChainStore.slippageTolerance) {
      setValue(zapChainStore.slippageTolerance)
    }
  }, [])

  console.log('zapChainStore', zapChainStore.slippageTolerance)

  return (
    <AntdModal
      title=""
      centered
      visible={visible}
      width={448}
      footer={null}
      onCancel={onClose}
      className="slippage-modal"
    >
      <div className="slippage-modal-wrapper">
        <p className="slippage-title">Сhoose Slippage</p>
        <div className="slippage-content">
          {/* <div className="slippage-close-button" onClick={onClose} /> */}
          <div className="slippage-controls">
            <Row gutter={{ xs: 10, sm: 12 }}>
              <Col span={5}>
                <div
                  className={`slippage-control ${value === 0.1 ? 'active' : ''}`}
                  onClick={() => setValue(0.1)}
                >
                  0.1%
                </div>
              </Col>
              <Col span={5}>
                <div
                  className={`slippage-control ${value === 0.5 ? 'active' : ''}`}
                  onClick={() => setValue(0.5)}
                >
                  0.5%
                </div>
              </Col>
              <Col span={5}>
                <div
                  className={`slippage-control ${value === 1 ? 'active' : ''}`}
                  onClick={() => setValue(1)}
                >
                  1%
                </div>
              </Col>
              <Col span={5}>
                <div
                  className={`slippage-control ${value === 5 ? 'active' : ''}`}
                  onClick={() => setValue(5)}
                >
                  5%
                </div>
              </Col>
              <Col span={5}>
                <div className="input-slippage-wrapper">
                  <InputNumber
                    className="input-slippage"
                    value={value}
                    onChange={(value: any) => setValue(value)}
                    placeholder="Custom"
                  />
                </div>
              </Col>
            </Row>
          </div>

          <Button
            onClick={() => {
              zapChainStore.setSlippageTolerance(value > 100 ? 100 : value)
              onClose()
            }}
            type="primary"
          >
            Accept
          </Button>
        </div>
      </div>
    </AntdModal>
  )
})
