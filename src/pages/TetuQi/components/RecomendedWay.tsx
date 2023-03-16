import React from 'react'
import { Row, Col } from 'antd'
import { getAssetsIconMap } from '../../../static/tokens'
import PercentIcon from '../../../static/percent.svg'

const arrowBottom = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.12438 7.93649C6.86712 7.68784 6.44903 7.68782 6.19186 7.93651C5.93608 8.18383 5.93603 8.58393 6.19182 8.83132L9.53379 12.0635C9.66194 12.1874 9.83081 12.25 9.99998 12.25C10.169 12.25 10.338 12.1875 10.4662 12.0636L13.808 8.83146C14.0639 8.5841 14.064 8.18404 13.8081 7.93669C13.551 7.68798 13.1328 7.68793 12.8755 7.93666L9.99998 10.7178L7.12438 7.93649Z"
        fill="#C4C4DF"
      />
    </g>
  </svg>
)

export const RecomendedWay: React.FC<{ way: number }> = (props) => {
  const assetsIconMap = getAssetsIconMap()
  const { way } = props

  return (
    <>
      {/* it 0 */}

      {way === 0 && (
        <div className="tetuQi__ways">
          <Row className="tetuQi__way-card-wrapper">
            <Col md={14} xs={24} className="tetuQi__way-card-left">
              <Row justify="center">
                <div className="tetuQi__way-column">
                  <div className="tetuQi__way-column-item">
                    <div>
                      <img src={assetsIconMap.QI} alt="" />
                    </div>
                    <div>
                      permanently deposit <br /> your QI in a 1:1 ratio
                    </div>
                  </div>
                  <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                  <div className="tetuQi__way-column-item">
                    <div className="tetuQi__way-column-item-vault">
                      <img src={assetsIconMap.QI} alt="" />
                      <div className="name">tetuQi</div>
                      <div className="label">vault</div>
                    </div>
                  </div>
                  <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                  <div className="tetuQi__way-column-item">
                    <div>
                      <img src={assetsIconMap.tetuQi} alt="" />
                    </div>
                    <div>hold your TetuQi</div>
                  </div>
                </div>
              </Row>
            </Col>
            <Col md={10} xs={24} className="tetuQi__way-card-right">
              <div className="tetuQi__way-card-right-container">
                <div className="tetuQi__way-sub-title">Earn</div>
                <div className="tetuQi__way-rewards">
                  <div className="tetuQi__way-rewards-item">
                    <div className="name">QI airdrop wrapped to tetuQi</div>
                    <img src={assetsIconMap.tetuQi} alt="" className="icon" />
                  </div>
                  <div className="tetuQi__way-rewards-item">
                    <div className="name">TETU rewards</div>
                    <img src={assetsIconMap.xTETU} alt="" className="icon" />
                  </div>
                </div>
                <div className="tetuQi__way-separator tetuQi__divider"></div>
                <div className="tetuQi__way-text">
                  With tetuQi we can use QiDAO voting power to benefit our own Tetu Vaults
                </div>
                <div className="tetuQi__way-separator tetuQi__divider"></div>
                <div className="tetuQi__way-sub-title">Exit</div>
                <div className="tetuQi__way-text">Swap tetuQi for QI by Dystopia</div>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* it 1 */}

      {way === 1 && (
        <div className="tetuQi__ways">
          <Row className="tetuQi__way-card-wrapper">
            <Col md={14} xs={24} className="tetuQi__way-card-left">
              <div className="tetuQi__way-column">
                <div className="tetuQi__way-column-item">
                  <img src={assetsIconMap.QI} alt="" style={{ marginBottom: 8 }} />
                  <div className="tac">divide your Qi tokens in half </div>
                </div>
                <div style={{ position: 'relative', left: -64 }}>
                  <div className="tetuQi__way-2-arrow-down">
                    <div className="it-1"></div>
                    <div className="it-2">{arrowBottom}</div>
                  </div>
                  <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                  <div className="tetuQi__way-column-item">
                    <div style={{ textAlign: 'center' }}>
                      permanently deposit this part <br /> of your QI in a 1:1 ratio
                    </div>
                  </div>
                  <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                  <div className="tetuQi__way-column-item">
                    <div className="tetuQi__way-column-item-vault">
                      <img src={assetsIconMap.QI} alt="" />
                      <div className="name">tetuQi</div>
                      <div className="label">vault</div>
                    </div>
                  </div>
                  <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                </div>
                <div className="tetuQi__way-column-item">
                  <div className="tetuQi__way-column-item-row" style={{ marginBottom: 5 }}>
                    <img src={assetsIconMap.tetuQi} alt="" style={{ marginBottom: 0 }} />
                    <span style={{ marginLeft: 36, marginRight: 36 }}>+</span>
                    <img src={assetsIconMap.QI} alt="" style={{ marginBottom: 0 }} />
                  </div>
                  <div className="tac">add assets in tetuQi-Qi LP by Dystopia</div>
                </div>
                <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                <div className="tetuQi__way-column-item">
                  <div className="tetuQi__way-column-item-vault">
                    <img src={assetsIconMap.tetuQi} alt="" style={{ marginRight: 6 }} />
                    <img src={assetsIconMap.QI} alt="" />
                    <div className="name">tetuQi-Qi</div>
                    <div className="label">vault</div>
                  </div>
                  <div className="tac" style={{ marginTop: 8 }}>
                    stake the received LP_tetuQi_Qi
                  </div>
                </div>
              </div>
            </Col>
            <Col md={10} xs={24} className="tetuQi__way-card-right">
              <div className="tetuQi__way-card-right-container">
                <div className="tetuQi__way-sub-title">Earn</div>
                <div className="tetuQi__way-rewards">
                  <div className="tetuQi__way-rewards-item">
                    <div className="name">Autocompounded tetuQi rewards</div>
                    <img src={assetsIconMap.tetuQi} alt="" className="icon" />
                  </div>
                  <div className="tetuQi__way-rewards-item">
                    <div className="name">Autocompounded tradings fees</div>
                    <img src={PercentIcon} alt="" className="icon" />
                  </div>
                  <div className="tetuQi__way-rewards-item">
                    <div className="name">TETU rewards</div>
                    <img src={assetsIconMap.xTETU} alt="" className="icon" />
                  </div>
                </div>
                <div className="tetuQi__way-separator tetuQi__divider"></div>
                <div className="tetuQi__way-text">
                  With tetuQi we can use QiDAO voting power to benefit our own Tetu Vaults
                </div>
                <div className="tetuQi__way-separator tetuQi__divider"></div>
                <div className="tetuQi__way-sub-title">Exit</div>
                <div className="tetuQi__way-text" style={{ marginBottom: 12 }}>
                  Remove your tetuQi-QI LP
                </div>
                <div className="tetuQi__way-text">Swap tetuQi for QI by Dystopia</div>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* it 2 */}

      {way === 2 && (
        <div className="tetuQi__ways">
          <Row className="tetuQi__way-card-wrapper">
            <Col md={14} xs={24} className="tetuQi__way-card-left">
              <div className="tetuQi__way-column">
                <div className="tetuQi__way-column-item">
                  <img src={assetsIconMap.QI} alt="" style={{ marginBottom: 8 }} />
                  <div className="tac">divide your Qi tokens in half </div>
                </div>
                <div style={{ position: 'relative', left: -64 }}>
                  <div className="tetuQi__way-2-arrow-down tetuQi__way-2-arrow-down--2">
                    <div className="it-1"></div>
                    <div className="it-2">{arrowBottom}</div>
                  </div>
                  <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                  <div className="tetuQi__way-column-item">
                    <div style={{ textAlign: 'center' }}>
                      swap that half of QI <br />
                      to tetuQi by Dystopia
                    </div>
                  </div>
                  <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                </div>
                <div className="tetuQi__way-column-item">
                  <div className="tetuQi__way-column-item-row" style={{ marginBottom: 5 }}>
                    <img src={assetsIconMap.tetuQi} alt="" style={{ marginBottom: 0 }} />
                    <span style={{ marginLeft: 36, marginRight: 36 }}>+</span>
                    <img src={assetsIconMap.QI} alt="" style={{ marginBottom: 0 }} />
                  </div>
                  <div className="tac">add assets in tetuQi-Qi LP by Dystopia</div>
                </div>
                <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                <div className="tetuQi__way-column-item">
                  <div className="tetuQi__way-column-item-vault">
                    <img src={assetsIconMap.tetuQi} alt="" style={{ marginRight: 6 }} />
                    <img src={assetsIconMap.QI} alt="" />
                    <div className="name">tetuQi-Qi</div>
                    <div className="label">vault</div>
                  </div>
                  <div className="tac" style={{ marginTop: 8 }}>
                    stake the received LP_tetuQi_Qi
                  </div>
                </div>
              </div>
            </Col>
            <Col md={10} xs={24} className="tetuQi__way-card-right">
              <div className="tetuQi__way-card-right-container">
                <div className="tetuQi__way-sub-title">Earn</div>
                <div className="tetuQi__way-rewards">
                  <div className="tetuQi__way-rewards-item">
                    <div className="name">Autocompounded tetuQi rewards</div>
                    <img src={assetsIconMap.tetuQi} alt="" className="icon" />
                  </div>
                  <div className="tetuQi__way-rewards-item">
                    <div className="name">Autocompounded tradings fees</div>
                    <img src={PercentIcon} alt="" className="icon" />
                  </div>
                  <div className="tetuQi__way-rewards-item">
                    <div className="name">TETU rewards</div>
                    <img src={assetsIconMap.xTETU} alt="" className="icon" />
                  </div>
                </div>
                <div className="tetuQi__way-separator tetuQi__divider"></div>
                <div className="tetuQi__way-text">
                  With tetuQi we can use QiDAO voting power to benefit our own Tetu Vaults
                </div>
                <div className="tetuQi__way-separator tetuQi__divider"></div>
                <div className="tetuQi__way-sub-title">Exit</div>
                <div className="tetuQi__way-text" style={{ marginBottom: 12 }}>
                  Remove your tetuQi-QI LP
                </div>
                <div className="tetuQi__way-text">Swap tetuQi for QI by Dystopia</div>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* it 3 */}

      {way === 3 && (
        <div className="tetuQi__ways">
          <Row className="tetuQi__way-card-wrapper">
            <Col md={14} xs={24} className="tetuQi__way-card-left">
              <Row justify="center">
                <div className="tetuQi__way-column">
                  <div className="tetuQi__way-column-item">
                    <div>
                      <img src={assetsIconMap.QI} alt="" />
                    </div>
                    <div className="tac">
                      swap your QI to tetuQi <br />
                      by Dystopia
                    </div>
                  </div>
                  <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                  <div className="tetuQi__way-column-item">
                    <div className="tetuQi__way-text tac">
                      get more TetuQi <br />
                      when the exchange rate is less than 1:1
                    </div>
                  </div>
                  <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                  <div className="tetuQi__way-column-item">
                    <div className="tetuQi__way-text">
                      <img src={assetsIconMap.tetuQi} alt="" />
                    </div>
                    <div>hold your TetuQi</div>
                  </div>
                </div>
              </Row>
            </Col>
            <Col md={10} xs={24} className="tetuQi__way-card-right">
              <div className="tetuQi__way-card-right-container">
                <div className="tetuQi__way-sub-title">Earn</div>
                <div className="tetuQi__way-rewards">
                  <div className="tetuQi__way-rewards-item">
                    <div className="name">QI airdrop wrapped to tetuQi</div>
                    <img src={assetsIconMap.tetuQi} alt="" className="icon" />
                  </div>
                  <div className="tetuQi__way-rewards-item">
                    <div className="name">TETU rewards</div>
                    <img src={assetsIconMap.xTETU} alt="" className="icon" />
                  </div>
                </div>
                <div className="tetuQi__way-separator tetuQi__divider"></div>
                <div className="tetuQi__way-text">
                  With tetuQi we can use QiDAO voting power to benefit our own Tetu Vaults
                </div>
                <div className="tetuQi__way-separator tetuQi__divider"></div>
                <div className="tetuQi__way-sub-title">Exit</div>
                <div className="tetuQi__way-text">Swap tetuQi for QI by Dystopia</div>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* it 4 */}

      {way === 4 && (
        <div className="tetuQi__ways">
          <Row className="tetuQi__way-card-wrapper">
            <Col md={14} xs={24} className="tetuQi__way-card-left">
              <Row justify="center">
                <div className="tetuQi__way-column">
                  <div className="tetuQi__way-column-item">
                    <div>
                      <img src={assetsIconMap.QI} alt="" />
                    </div>
                    <div>
                      permanently deposit <br /> your QI in a 1:1 ratio
                    </div>
                  </div>
                  <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                  <div className="tetuQi__way-column-item">
                    <div className="tetuQi__way-column-item-vault">
                      <img src={assetsIconMap.QI} alt="" />
                      <div className="name">tetuQi</div>
                      <div className="label">vault</div>
                    </div>
                  </div>
                  <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                  <div className="tetuQi__way-column-item">
                    <div>
                      <img src={assetsIconMap.tetuQi} alt="" />
                    </div>
                    <div>deposit received TetuQi</div>
                  </div>
                  <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                  <div className="tetuQi__way-column-item">
                    <div className="tetuQi__way-column-item-vault">
                      <img src={assetsIconMap.tetuQi} alt="" />
                      <div className="name">xtetuQi</div>
                      <div className="label">vault</div>
                    </div>
                  </div>
                </div>
              </Row>
            </Col>
            <Col md={10} xs={24} className="tetuQi__way-card-right">
              <div className="tetuQi__way-card-right-container">
                <div className="tetuQi__way-sub-title">Earn</div>
                <div className="tetuQi__way-rewards">
                  <div className="tetuQi__way-rewards-item">
                    <div className="name">Autocompounded QI airdrop wrapped to tetuQi</div>
                    <img src={assetsIconMap.tetuQi} alt="" className="icon" />
                  </div>
                </div>
                <div className="tetuQi__way-separator tetuQi__divider"></div>
                <div className="tetuQi__way-text">
                  With tetuQi we can use QiDAO voting power to benefit our own Tetu Vaults
                </div>
                <div className="tetuQi__way-separator tetuQi__divider"></div>
                <div className="tetuQi__way-sub-title">Exit</div>
                <div className="tetuQi__way-text" style={{ marginBottom: 12 }}>
                  Withdraw from xtetuQi vault
                </div>
                <div className="tetuQi__way-text">Swap tetuQi for QI by Dystopia</div>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* it 5 */}

      {way === 5 && (
        <div className="tetuQi__ways">
          <Row className="tetuQi__way-card-wrapper">
            <Col md={14} xs={24} className="tetuQi__way-card-left">
              <Row justify="center">
                <div className="tetuQi__way-column">
                  <div className="tetuQi__way-column-item">
                    <div>
                      <img src={assetsIconMap.QI} alt="" />
                    </div>
                    <div className="tetuQi__way-text tac">
                      swap your QI to <br />
                      tetuQi by Dystopia
                    </div>
                  </div>
                  <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                  <div className="tetuQi__way-column-item">
                    <div className="tetuQi__way-text tac">
                      get more tetuQi when the exchange
                      <br /> rate is less than 1:1
                    </div>
                  </div>
                  <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                  <div className="tetuQi__way-column-item">
                    <div>
                      <img src={assetsIconMap.tetuQi} alt="" />
                    </div>
                    <div>deposit received TetuQi</div>
                  </div>
                  <div className="tetuQi__way-column-item-arrow">{arrowBottom}</div>
                  <div className="tetuQi__way-column-item">
                    <div className="tetuQi__way-column-item-vault">
                      <img src={assetsIconMap.tetuQi} alt="" />
                      <div className="name">xtetuQi</div>
                      <div className="label">vault</div>
                    </div>
                  </div>
                </div>
              </Row>
            </Col>
            <Col md={10} xs={24} className="tetuQi__way-card-right">
              <div className="tetuQi__way-card-right-container">
                <div className="tetuQi__way-sub-title">Earn</div>
                <div className="tetuQi__way-rewards">
                  <div className="tetuQi__way-rewards-item">
                    <div className="name">Autocompounded QI airdrop wrapped to tetuQi</div>
                    <img src={assetsIconMap.tetuQi} alt="" className="icon" />
                  </div>
                </div>
                <div className="tetuQi__way-separator tetuQi__divider"></div>
                <div className="tetuQi__way-text">
                  With tetuQi we can use QiDAO voting power to benefit our own Tetu Vaults
                </div>
                <div className="tetuQi__way-separator tetuQi__divider"></div>
                <div className="tetuQi__way-sub-title">Exit</div>
                <div className="tetuQi__way-text" style={{ marginBottom: 12 }}>
                  Withdraw from xtetuQi vault
                </div>
                <div className="tetuQi__way-text">Swap tetuQi for QI by Dystopia</div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </>
  )
}
