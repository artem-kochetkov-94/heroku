import React from 'react'
import { Amount } from '../../../components/Amount'
import { VaultRow } from '../../../components/VaultRow'
import { Row, Col, Button } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { formatUnits } from '@ethersproject/units'
import { APRView } from '../../Main/APRView'
import { UserBalance } from '../../Main/components/UserBalance'
import { ClaimButton } from '../../Main/components/ClaimButton'

import './styles.css'

type VaultItemProps = {
  vault: any
  hideButton?: boolean
  buttonContent?: JSX.Element
}

export const VaultItem: React.FC<VaultItemProps> = (props) => {
  const { vault, hideButton, buttonContent } = props
  const history = useHistory()

  return (
    <div className="tetuBal__vault-content">
      <div className="tetuBal__vault-content-table">
        <div className="tetuBal__vault-tvl">
          <Row align="middle" style={{ marginBottom: 15 }}>
            <Col span={12} className="tetuBal__label">
              TVL
            </Col>
            <Col span={12} className="tetuBal__tar tetuBal__vaultlItem">
              <Amount
                standartWidth
                prefix="$"
                value={vault.tvlUsdc}
                fontSize={14}
                tooltipInner={
                  <div>
                    <div>TVL USDC: ${formatUnits(vault.tvlUsdc)}</div>
                    <div>TVL underlying: {formatUnits(vault.tvl)}</div>
                  </div>
                }
              />
            </Col>
          </Row>
        </div>
        <div className="tetuBal__vault-apy">
          <Row align="middle" style={{ marginBottom: 15 }}>
            <Col
              span={12}
              className="tetuBal__label"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              APY
            </Col>
            <Col span={12} className="tetuBal__tar">
              <APRView vault={vault} />
            </Col>
          </Row>
        </div>
        <div className="tetuBal__vault-balance">
          <Row align="middle" style={{ marginBottom: 15 }}>
            <Col span={12} className="tetuBal__label">
              Balance
            </Col>
            <Col span={12} className="tetuBal__tar">
              <UserBalance vaultAddr={vault.addr} vaultDecimals={vault.decimals} />
            </Col>
          </Row>
        </div>
        <div className="tetuBal__vault-rewards">
          <Row align="middle" justify="space-between">
            <Col className="tetuBal__label">Rewards</Col>
            <Col className="tetuBal__tar">
              {vault.rewardTokens.length === 0 ? (
                <div style={{ width: '100%' }}>-</div>
              ) : (
                <div>
                  <ClaimButton vault={vault} padding={0} />
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
      {hideButton !== true && (
        <div>
          <Button
            type="primary"
            style={{ width: '100%', marginTop: 'auto' }}
            onClick={() => {
              history.push('/vault/' + vault.addr)
            }}
          >
            Deposit
          </Button>
        </div>
      )}
      {buttonContent && buttonContent}
    </div>
  )
}
