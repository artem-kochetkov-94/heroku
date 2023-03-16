import React from 'react'
import { Row, Col, Button } from 'antd'

import './styles.css'

type PromoProps = {
  text: any
  mb?: number
  className?: string
  button?: {
    text: string
    onClick: () => void
  }
}

export const Promo: React.FC<PromoProps> = (props) => {
  const { text, button, mb, className } = props

  return (
    <div className={'promo-layout ' + className} style={{ marginBottom: mb }}>
      <Row gutter={[20, 15]} align="middle">
        <Col span={button?.text ? 18 : 24} className="text">
          {text}
        </Col>
        {button?.text && (
          <Col span={6}>
            <Button type="primary" className="btn" onClick={button?.onClick}>
              {button?.text}
            </Button>
          </Col>
        )}
      </Row>
    </div>
  )
}
