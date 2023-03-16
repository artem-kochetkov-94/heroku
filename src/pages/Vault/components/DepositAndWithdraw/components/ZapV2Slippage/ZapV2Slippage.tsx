import { useState } from 'react'
import { observer } from 'mobx-react'
import { Modal } from './Modal'
import './styles.css'
import { useStores } from '../../../../../../stores/hooks'
import { Col, Row } from 'antd'
import { Icon } from '../../../../../../components/ui-kit'

const arrowStyle = {
  width: 5,
  height: 5,
  marginLeft: 5,
  borderRight: '2px solid #7F8FA4',
  borderBottom: '2px solid #7F8FA4',
  transform: 'rotate(45deg)',
}

export const ZapV2Slippage = observer(() => {
  const [activeModal, setActiveModal] = useState(false)
  const { zapV2ChainStore } = useStores()

  return (
    <div className="slippage">
      <div className="label" onClick={() => setActiveModal(true)}>
        <Row gutter={5} align="middle">
          <Col>Slippage</Col>
          <Col>
            <Icon
              className="slippage-icon"
              name="info"
              width={13}
              height={13}
              style={{ marginBottom: 7 }}
            />
          </Col>
          <Col>
            <span
              style={{
                position: 'relative',

                top: 1,

                marginLeft: 7,

                fontFamily: 'Source Sans Pro',
                fontWeight: 600,
                fontSize: 14,
                lineHeight: '20px',

                color: '#fff',
              }}
            >
              {zapV2ChainStore.slippageTolerance}%
            </span>
          </Col>
          <Col>
            <div style={arrowStyle}></div>
          </Col>
        </Row>
      </div>
      <Modal visible={activeModal} onClose={() => setActiveModal(false)} />
    </div>
  )
})
