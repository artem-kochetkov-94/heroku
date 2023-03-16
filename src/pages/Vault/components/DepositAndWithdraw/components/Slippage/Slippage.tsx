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
  borderRight: '1px solid #7F8FA4',
  borderBottom: '1px solid #7F8FA4',
  transform: 'rotate(45deg)',
}

export const Slippage = observer(() => {
  const [activeModal, setActiveModal] = useState(false)
  const { zapChainStore } = useStores()

  return (
    <div className="slippage">
      <div className="label" onClick={() => setActiveModal(true)}>
        <Row gutter={4} align="middle">
          <Col>Slippage:</Col>
          <Col>
            <Icon
              className="slippage-icon"
              name="info"
              width={12}
              height={12}
              style={{ marginBottom: 9 }}
            />
          </Col>
          <Col>
            <span style={{ marginLeft: 8, position: 'relative', top: 1, color: '#fff' }}>
              {zapChainStore.slippageTolerance}%
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
