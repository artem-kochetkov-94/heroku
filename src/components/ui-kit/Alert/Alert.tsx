import * as React from 'react'
import { Icon } from '../Icon'
import { Row, Col } from 'antd'

import './styles.css'

type AlertProps = {
  message: string
  mb?: number
}

export const Alert: React.FC<AlertProps> = (props) => {
  const { message, mb } = props

  return (
    <div className="tetu-ui-Alert" style={{ marginBottom: mb }}>
      <div className="tetu-ui-Alert__wrapper">
        <div className="tetu-ui-Alert__icon">
          <Icon name="info" />
        </div>
        <div className="tetu-ui-Alert__message">{message}</div>
      </div>
    </div>
  )
}
