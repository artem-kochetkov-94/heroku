import { Button, Col, Row, Spin } from 'antd'
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'
import { useFetchData } from '../../../TetuMesh/ useFetchData'

export const LpInfoTetuMesh = () => {
  const { data, loading, loaded } = useFetchData()

  const Loader = (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 18, marginLeft: 5 }} spin />} />
  )

  return (
    <Col span={24}>
      <div className="app-paper">
        <Row gutter={[10, 10]} style={{ marginBottom: 32 }}>
          <Col>tetuMesh price:</Col>
          <Col>{loading ? Loader : parseFloat(String(data?.tetuMeshPrice)).toFixed(2)} MESH</Col>
        </Row>
        <Row>
          <Button
            onClick={() => {
              window.open('https://meshswap.fi/exchange/swap')
            }}
            type="primary"
          >
            {' '}
            Buy tetuMesh
          </Button>
        </Row>
      </div>
    </Col>
  )
}
