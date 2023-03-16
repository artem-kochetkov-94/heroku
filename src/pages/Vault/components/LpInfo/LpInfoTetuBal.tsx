import { Button, Col, Row, Spin } from 'antd'
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'
import { useLoadData } from '../../../TetuBal/hooks/useLoadData'

export const LpInfoTetuBal = () => {
  const { tetuBalLpData, loading, loaded } = useLoadData()

  const Loader = (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 18, marginLeft: 5 }} spin />} />
  )

  return (
    <Col span={24}>
      <div className="app-paper">
        <Row gutter={[10, 10]} style={{ marginBottom: 32 }}>
          <Col>tetuBal price:</Col>
          <Col>
            {loading ? Loader : parseFloat(String(tetuBalLpData?.tetuBalPrice)).toFixed(4)}{' '}
            B-80BAL-20WETH
          </Col>
        </Row>
        <Row>
          <Button
            onClick={() => {
              window.open('https://polygon.balancer.fi/#/')
            }}
            type="primary"
          >
            {' '}
            Buy tetuBal
          </Button>
        </Row>
      </div>
    </Col>
  )
}
