import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Row, Spin, SpinProps } from 'antd'

type LoaderProps = {
  size?: number
  padding?: number
}

export const Loader: React.FC<LoaderProps> = (props) => {
  const { size = 90, padding = 30 } = props
  const antIcon = <LoadingOutlined style={{ fontSize: size }} spin />

  return (
    <Row justify="center" style={{ padding }}>
      <div className="spin loader">
        <Spin indicator={antIcon} />
      </div>
    </Row>
  )
}
