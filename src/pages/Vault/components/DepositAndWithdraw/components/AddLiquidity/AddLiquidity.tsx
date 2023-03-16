import React, { useState, useEffect } from 'react'
import { Button, Col } from 'antd'
import { getLinkAddLiquity } from '../../../../../Main/utils'
import { useStores } from '../../../../../../stores/hooks'
import { formatVaultManageName, getVaultSymbolName } from '../../../../../../utils'
import { getVaultDescriptionByPlatform } from '../../../../utils'

export const AddLiquidity = () => {
  const { networkManager, vaultDataPageStore, namesManagerStore } = useStores()

  const vault = vaultDataPageStore.data
  const [liquidityLink, setLiquidityLink] = useState<string | null>(null)
  const TETU_PS_ADDR = networkManager.networkAddresses?.core?.PS
  const vaultDescription = getVaultDescriptionByPlatform(vault)

  const isPSVault =
    (vault?.assets?.length === 1 && vault?.assets.includes(TETU_PS_ADDR)) ||
    vault?.addr === TETU_PS_ADDR

  useEffect(() => {
    if (vault) {
      getLinkAddLiquity(vault?.assets, vault?.platform, vault?.addr, vault).then(
        (link: string | null) => {
          setLiquidityLink(link)
        },
      )
    }
  }, [vault?.assets, vault?.platform, vault?.addr, vault])

  return (
    <>
      {isPSVault && (
        <Col span={24}>
          <div className="app-paper">
            <div style={{ marginBottom: 18 }}>{vaultDescription}</div>
            <Button
              onClick={() => {
                window.open(networkManager.buyTetu)
              }}
              type="primary"
            >
              Buy TETU
            </Button>
          </div>
        </Col>
      )}
      {vaultDescription && !liquidityLink && !isPSVault && (
        <Col span={24}>
          <div className="app-paper">{vaultDescription}</div>
        </Col>
      )}
      {liquidityLink && (
        <Col span={24}>
          <div className="app-paper">
            {vaultDescription && <div style={{ marginBottom: 16 }}>{vaultDescription}</div>}
            <Button
              onClick={() => {
                window.open(liquidityLink)
              }}
              type="primary"
            >
              Manage{' '}
              {formatVaultManageName(vault?.addr) ||
                getVaultSymbolName(vault?.addr) ||
                vault?.assets
                  ?.map((asset: string) => namesManagerStore.getAssetName(asset))
                  .join('-')}{' '}
              liquidity
            </Button>
          </div>
        </Col>
      )}
    </>
  )
}
