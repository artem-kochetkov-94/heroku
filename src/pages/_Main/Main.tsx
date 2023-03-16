import { Col, Row } from 'antd'
import { UserStat } from '../../components/UserStat'
import { News, Cases, BestVaults } from './components'
import { useMediaQuery } from 'react-responsive'

export const Main: React.FC = () => {
  const isMobile575 = useMediaQuery({ query: '(max-width: 575px)' })

  return (
    <div style={{ paddingTop: 20 }}>
      <Row gutter={[0, 25]}>
        {/* <Col span={24}>
          <div className="container">
            <Row justify="end">
              {isMobile575 ? (
                <Col span={24}>
                  <UserStat />
                </Col>
              ) : (
                <Col>
                  <UserStat />
                </Col>
              )}
            </Row>
          </div>
        </Col> */}
        <Col span={24}>
          <BestVaults />
        </Col>
        <Col span={24}>
          <News />
        </Col>
        <Col span={24}>
          <Cases />
        </Col>
      </Row>
    </div>
  )
}
