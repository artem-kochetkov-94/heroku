import React from 'react'
import { Amount, AmountProps } from '../../../components/Amount'
import { Row, Spin, Card } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import './styles.css'

const antIcon = <LoadingOutlined style={{ fontSize: 35 }} spin />

type LabelProps = {
  value: string
  title: string
  amountProps?: AmountProps
  isLoading?: boolean
}

export const Label: React.FC<LabelProps> = (props) => {
  const { value, title, amountProps, isLoading } = props

  if (isLoading) {
    return (
      <div className="card-label">
        <Spin indicator={antIcon} />
      </div>
    )
  }

  return (
    <div className="card-label">
      <div className="card-label-value">
        <Amount
          {...amountProps}
          value={value}
          fontSize={30}
          style={{ lineHeight: '35px', color: '#fff', marginBottom: 1 }}
          showTooltip={false}
        />
      </div>
      <div className="card-label-title">{title}</div>
    </div>
  )

  // return (
  //   <Card className="card-label">
  //     <div className="inner">
  //       <Row justify="center">
  //         {isLoading ? (
  //           <Spin indicator={antIcon} style={{ marginLeft: 6 }} />
  //         ) : (
  //           <b>
  //             <Amount
  //               {...amountProps}
  //               value={value}
  //               fontSize={30}
  //               style={{ lineHeight: '35px', color: '#fff', marginBottom: 1 }}
  //               showTooltip={false}
  //             />
  //           </b>
  //         )}
  //       </Row>
  //       <Row justify="center">
  //         <span className="description">{title}</span>
  //       </Row>
  //     </div>
  //   </Card>
  // )
}
