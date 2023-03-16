import React from 'react'
import { Amount } from '../../../components/Amount'
import { VaultRow } from '../../../components/VaultRow'
import { Row, Col, Button } from 'antd'
import { formatUnits } from '@ethersproject/units'
import { APRView } from '../../Main/APRView'
import { UserBalance } from '../../Main/components/UserBalance'
import { ClaimButton } from '../../Main/components/ClaimButton'
import { useHistory } from 'react-router-dom'

type VaultItemProps = {
  vault: any
  depositEl?: React.ReactElement
}

export const VaultItem: React.FC<VaultItemProps> = (props) => {
  const { vault, depositEl } = props
  const history = useHistory()

  return (
    <div className="tetuQi__vault">
      <div className="tetuQi__vault-name">
        <Amount
          assets={vault.assets}
          address={vault.addr}
          placement="topLeft"
          showTooltip={false}
          // @ts-ignores
          name={
            <VaultRow
              assets={vault.assets}
              platform={vault.platform}
              small
              address={vault.addr}
              deactivated={!vault.active}
              vault={vault}
              networkName={vault.networkName}
            />
          }
          style={{ fontSize: 12, fontWeight: 500 }}
        >
          {vault.active === false && <span style={{ marginLeft: 8 }}> deactivated</span>}
        </Amount>
      </div>
      <div className="tetuQi__vault-content">
        <div className="tetuQi__vault-content-table">
          <div className="tetuQi__vault-tvl">
            <Row align="middle" className="tetuQi__vault-content-table-row">
              <Col span={12} className="tetuQi__label">
                TVL
              </Col>
              <Col span={12} className="tetuQi__tar">
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
          <div className="tetuQi__vault-apy">
            <Row align="middle" className="tetuQi__vault-content-table-row">
              <Col span={12} className="tetuQi__label">
                APY
              </Col>
              <Col span={12} className="tetuQi__tar">
                <APRView vault={vault} />
              </Col>
            </Row>
          </div>
          <div className="tetuQi__vault-balance">
            <Row align="middle" className="tetuQi__vault-content-table-row">
              <Col span={12} className="tetuQi__label">
                Balance
              </Col>
              <Col span={12} className="tetuQi__tar">
                <UserBalance vaultAddr={vault.addr} vaultDecimals={vault.decimals} />
              </Col>
            </Row>
          </div>
          <div className="tetuQi__vault-rewards">
            <Row align="middle" justify="space-between" wrap={false}>
              <Col className="tetuQi__label">Rewards</Col>
              <Col className="tetuQi__tar">
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
        {depositEl ? (
          depositEl
        ) : (
          <Button
            style={{
              width: '100%',
              marginTop: 'auto',
            }}
            size="small"
            type="primary"
            onClick={() => {
              history.push('/vault/' + vault.addr)
            }}
          >
            Deposit
          </Button>
        )}
      </div>
    </div>
  )
}
