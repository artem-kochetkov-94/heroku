import { observer } from 'mobx-react'
import { useStores } from '../../../../../../stores/hooks'
import { Modal as AntdModal, Row, Col } from 'antd'
import { Routes } from '../../../../../../stores/chain-stores/zapv2-store'
import { namesManagerStore } from '../../../../../../stores/utils/names-manager-store'
import { getAssetsIconMap } from '../../../../../../static/tokens'
import unknownIcon from '../../../../../../static/UNKNOWN.png'
import { maticAddresses } from '../../../../../../networks/Addresses/MaticAddresses/MaticAddresses'

const isMaticVault = (vault: any) => {
  return (
    vault.network === maticAddresses.config.network.other.networkName ||
    vault.networkName === maticAddresses.config.network.other.networkName ||
    vault.networkName === 'Polygon (Matic)'
  )
}

const RoutesComponent: React.FC<{ routes: Routes; firstChild?: any; vault: any }> = (props) => {
  const { routes, firstChild, vault } = props

  if (!routes) {
    return null
  }

  return (
    <Row wrap={!firstChild} align="middle" gutter={16}>
      {routes.map((item, index) => {
        if (Array.isArray(item)) {
          return (
            <Col flex="1 1 0px">
              <div className={`zapRouteWrapper ${index === 0 ? 'zapRouteWrapperFirstChild' : ''} `}>
                <RoutesComponent routes={item} vault={vault} />
              </div>
            </Col>
          )
        }

        let name = ''

        if (
          item.toTokenAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' &&
          isMaticVault(vault)
        ) {
          name = 'MATIC'
        } else {
          name = namesManagerStore.getAssetName(item.toTokenAddress)
        }

        return (
          <Col span={24}>
            {index === 0 && (
              <div className="zapRouteItemToken">
                <img
                  // @ts-ignore
                  width="20px"
                  height="20px"
                  style={{ marginRight: 8, borderRadius: '50%' }}
                  src={getAssetsIconMap()[name] ?? unknownIcon}
                />
                <div>{name}</div>
              </div>
            )}
            <div className="zapRouteItem">
              <div className="zapRouteItemPart">{item.part}%</div>
              <div className="zapRouteItemName">{item.name}</div>
            </div>
          </Col>
        )
      })}
    </Row>
  )
}

export const Modal = observer((props: any) => {
  const { onClose, visible, vault } = props
  const { zapV2ChainStore } = useStores()

  return (
    <AntdModal
      title=""
      centered
      visible={visible}
      width={720}
      footer={null}
      onCancel={onClose}
      className="zap-routes-modal"
    >
      <div className="">
        <div className="zap-routes-modal-title">1inch Router</div>
        <div className="zap-routes-modal-body">
          {Object.keys(zapV2ChainStore.buildedTx).map((key: string) => {
            const item = zapV2ChainStore.buildedTx[key]

            const tokenInName = namesManagerStore.getAssetName(item.fromToken.address)
            const tokenToName = namesManagerStore.getAssetName(item.toToken.address)

            return (
              <div className="oneInchRouter">
                <img
                  width="32px"
                  height="32px"
                  src={getAssetsIconMap()[tokenInName] ?? unknownIcon}
                  className={`icon`}
                />
                <div className="zapRoutesWrapper">
                  <Row>
                    {item?.protocols?.map((item: any) => (
                      <Col span={24}>
                        <RoutesComponent routes={item} firstChild={true} vault={vault} />
                      </Col>
                    ))}
                  </Row>
                </div>
                <img
                  width="32px"
                  height="32px"
                  src={getAssetsIconMap()[tokenToName] ?? unknownIcon}
                  className={`icon`}
                />
              </div>
            )
          })}
        </div>
      </div>
    </AntdModal>
  )
})
