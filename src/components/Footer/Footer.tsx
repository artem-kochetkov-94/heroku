import { Row, Col } from 'antd'
import { GithubOutlined, TwitterOutlined, MediumOutlined } from '@ant-design/icons'
import Discord from '../../static/discord.svg'
import GitBook from '../../static/gitbook.svg'
import Telegram from '../../static/telegram.svg'
import { useMediaQuery } from 'react-responsive'
import Audit1 from '../../static/audit-1.png'
import Audit2 from '../../static/audit-2.png'
import Audit3 from '../../static/audit-3.svg'
import Immunefi from '../../static/immunefi.svg'
import { resourcesLinks } from '../../App/constants'
import { Network } from '../Network'
import { Wallet } from '../Wallet'

import './styles.css'

export const Footer = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 500px)' })
  const isLaptop = useMediaQuery({ query: '(max-width: 767px)' })
  const isTablet900 = useMediaQuery({ query: '(max-width: 900px)' })

  const desktopAudit = (
    <div className="audit">
      <Row gutter={[20, 20]} justify="space-between" align="bottom">
        <Col>
          <Row justify="start" gutter={40} align="middle">
            <Col>
              <p className="audit-title">Audit by</p>
            </Col>
            <Col>
              <Row gutter={40}>
                <Col>
                  <a
                    href="https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-Tetu-v1.0.pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={Audit1} alt="" width="147" />
                  </a>
                </Col>
                <Col>
                  <a
                    href="https://defiyield.app/audit-database/tetu.io"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={Audit2} alt="" width="129" />
                  </a>
                </Col>
                <Col>
                  <a href="https://www.certik.com/projects/tetu" target="_blank" rel="noreferrer">
                    <img src={Audit3} alt="" width="134" />
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>

        <Col>
          <Row justify="end" align="middle">
            <Col>
              <Row gutter={40} align="middle">
                <Col>
                  <p className="audit-title">Bug Bounty program</p>
                </Col>
                <Col>
                  <a href="https://immunefi.com/bounty/tetu/" target="_blank" rel="noreferrer">
                    <img src={Immunefi} alt="" width="149" />
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )

  const mobileAudit = (
    <div className="audit">
      <Row gutter={[0, 48]}>
        <Col span={24}>
          <Row
            justify="center"
            gutter={[0, 10]}
            style={{ flexDirection: 'column', alignItems: 'center' }}
          >
            <Col>
              <p className="audit-title">Audit by</p>
            </Col>

            <Col>
              <Row justify="center" gutter={[35, 0]} align="middle">
                <Col>
                  <a
                    href="https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-Tetu-v1.0.pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={Audit1} alt="" />
                  </a>
                </Col>
                <Col>
                  <a
                    href="https://defiyield.app/audit-database/tetu.io"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={Audit2} alt="" />
                  </a>
                </Col>
                <Col>
                  <a href="https://www.certik.com/projects/tetu" target="_blank" rel="noreferrer">
                    <img src={Audit3} alt="" />
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Row
            justify="center"
            gutter={[0, 10]}
            style={{ flexDirection: 'column', alignItems: 'center' }}
          >
            <Col>
              <p className="audit-title">Bug Bounty program:</p>
            </Col>
            <Col>
              <Row justify="center">
                <Col>
                  <a href="https://immunefi.com/bounty/tetu/" target="_blank" rel="noreferrer">
                    <img src={Immunefi} alt="" />
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )

  return (
    <div className="footer">
      <div className="container">
        <div className="footer__inner">
          {isLaptop ? mobileAudit : desktopAudit}

          <p className="disclaimer">
            By using this software, you understand, acknowledge and accept that Tetu and/or the
            underlying software are provided “as is” and “as available” basis and without warranties
            or representations of any kind either expressed or implied. Any use of this open source
            software released under the ISC Internet Systems Consortium license is done at your own
            risk to the fullest extent permissible pursuant to applicable law any and all liability
            as well as all warranties, including any fitness for a particular purpose with respect
            to Tetu and/or the underlying software and the use thereof are disclaimed"
          </p>

          {/* <Row justify="space-between" gutter={} align={isMobile ? 'bottom' : 'middle'}> */}
          {/* <Col className="links" xs={7} sm={14} md={16} lg={12}>
              <Row gutter={[32, 15]} style={{ flexDirection: isMobile ? 'column' : 'row' }}>
                <Col>
                  <a target="_blank" href={resourcesLinks.about} rel="noreferrer">
                    About
                  </a>
                </Col>
                <Col>
                  <a target="_blank" href={resourcesLinks.team} rel="noreferrer">
                    Team
                  </a>
                </Col>
                <Col>
                  <a target="_blank" href={resourcesLinks.faq} rel="noreferrer">
                    FAQ
                  </a>
                </Col>
              </Row>
            </Col> */}
          {/* <Col className="socials" xs={17} sm={10} md={8} lg={12}> */}
          <Row gutter={54} align="middle" className="footer-socials-row">
            <Col>
              <a target="_blank" href={resourcesLinks.github} rel="noreferrer">
                <GithubOutlined style={{ fontSize: 23, color: '#fff' }} />
              </a>
            </Col>
            <Col>
              <a target="_blank" href={resourcesLinks.gitbook} rel="noreferrer">
                <img src={GitBook} alt="" style={{ height: 24, marginBottom: 1 }} />
              </a>
            </Col>
            {/* <Col>
              <a target="_blank" href={resourcesLinks.telegram} rel="noreferrer">
                <img src={Telegram} alt="" style={{ height: 36, marginBottom: 4 }} />
              </a>
            </Col> */}
            <Col>
              <a target="_blank" href={resourcesLinks.discord} rel="noreferrer">
                <img src={Discord} alt="" style={{ height: 17, marginBottom: 4 }} />
              </a>
            </Col>
            <Col>
              <a target="_blank" href={resourcesLinks.twitter} rel="noreferrer">
                <TwitterOutlined style={{ fontSize: 23, color: '#fff' }} />
              </a>
            </Col>
            {/* <Col>
              <a target="_blank" href={resourcesLinks.medium} rel="noreferrer">
                <MediumOutlined style={{ fontSize: 23, color: '#fff' }} />
              </a>
            </Col> */}
          </Row>
          {/* </Col> */}
          {/* </Row> */}
        </div>

        {isTablet900 && (
          <Row justify="space-between" align="middle">
            <Col>
              <Network />
            </Col>
            <Col>
              <Wallet />
            </Col>
          </Row>
        )}
      </div>
    </div>
  )
}
