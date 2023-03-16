import React, { useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { observer } from 'mobx-react'
import { Amount } from '../../../../../../components/Amount'
import { getAssetsIconMap } from '../../../../../../static/tokens'
import unknownIcon from '../../../../../../static/UNKNOWN.png'
import { useStores } from '../../../../../../stores/hooks'
import {
  checkIsTETUUSDC,
  getVaultPlatform,
  platformNameMap,
} from '../../../../../../components/VaultRow'
import { useForceUpdate } from '../../../../../../hooks'
import { formatVaultIcon, getVaultSymbolName } from '../../../../../../utils/format'
import { useVaultSubStrategies } from '../../../../../../hooks'

import './styles.css'

type VaultTitleProps = {}

export const VaultTitle: React.FC<VaultTitleProps> = observer((props) => {
  const forceUpdate = useForceUpdate()
  const [symbol, setSymbol] = useState(null)

  const { namesManagerStore, vaultDataPageStore, networkManager, contractUtilsChainStore } =
    useStores()

  useEffect(() => {
    if (vaultDataPageStore.data?.addr) {
      contractUtilsChainStore.erc20Symbols([vaultDataPageStore.data?.addr]).then((res: any) => {
        setSymbol(res[0])
      })
    }
  }, [vaultDataPageStore.data?.addr])

  if (vaultDataPageStore.data === null) {
    return null
  }

  const { assets, platform, addr: address } = vaultDataPageStore.data

  if (typeof assets === 'string') {
    return null
  }

  const isLoading =
    assets?.map((asset: string) => namesManagerStore.getAssetName(asset))?.includes(null) ?? false

  if (isLoading) {
    setTimeout(forceUpdate, 1000)
  }

  const getPlatformName = () => {
    if (
      checkIsTETUUSDC(assets) &&
      address.toLowerCase() !== '0xca870d6575ef0b872f60e7fa63774258c523027f'.toLowerCase()
    ) {
      if (address?.toLowerCase() === '0x301204E50C4295FE38c87F774Cbdf984a1B66e87'.toLowerCase()) {
        return platformNameMap['1']
      }
      return platformNameMap['1']
    }

    // @ts-ignore
    return platformNameMap[platform]
  }

  const vaultPlatform = getVaultPlatform(address)
  const multiPlatforms = useVaultSubStrategies(vaultDataPageStore.data)

  // const isSymbolName = networkManager.addresses.vaultSymbolName
  //   .map((el: any) => el.toLowerCase())
  //   .includes(vaultDataPageStore.data?.addr?.toLowerCase())
  // const formatedName = formatVaultName(address!)

  const vault = vaultDataPageStore.data

  let vaultName = getVaultSymbolName(vaultDataPageStore.data?.addr)

  if (!vaultName) {
    vaultName = assets.map((asset: string) => namesManagerStore.getAssetName(asset)).join('-')
  }

  return (
    <div className="vault-title-wrapper">
      <div className="vault-title">
        <div className="images">
          {isLoading ? (
            <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
          ) : (
            <>
              {formatVaultIcon(address!, vault?.networkName) ? (
                <>
                  {Array.isArray(formatVaultIcon(address!, vault?.networkName)) ? (
                    <>
                      {formatVaultIcon(address!, vault?.networkName).map((img: string) => {
                        return (
                          <div style={{ display: 'inline-block' }}>
                            <img
                              className="image"
                              // @ts-ignore
                              src={img}
                              alt=""
                            />{' '}
                          </div>
                        )
                      })}
                    </>
                  ) : (
                    <div style={{ display: 'inline-block' }}>
                      <img
                        className="image"
                        // @ts-ignore
                        src={formatVaultIcon(address!, vault?.networkName)}
                        alt=""
                      />{' '}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {assets?.map((asset: string, index: number) => {
                    const name = namesManagerStore.getAssetName(asset)

                    if (name === null) {
                      setTimeout(forceUpdate, 1000)
                    }

                    return (
                      <Amount
                        address={asset}
                        // @ts-ignore
                        style={{ display: 'inline-block' }}
                        key={asset}
                      >
                        <div style={{ display: 'inline-block' }}>
                          <img
                            className="image"
                            // @ts-ignore
                            src={getAssetsIconMap()?.[name] ?? unknownIcon}
                            alt=""
                          />{' '}
                        </div>
                      </Amount>
                    )
                  })}
                </>
              )}
            </>
          )}
        </div>
        <div className="text-wrapper">
          <div className="name">{vaultName}</div>
          <div className="platform">
            {multiPlatforms?.length > 0 ? (
              <>
                {multiPlatforms
                  .map((el: any) => {
                    // if (multiPlatforms.length > 1) {
                    //   // @ts-ignore
                    //   return platformNameMap[el.platform] + ` (${el.ratio}%)`
                    // }

                    // @ts-ignore
                    return platformNameMap[el.platform]
                  })
                  .join(' / ')}
              </>
            ) : (
              <>
                {getPlatformName()} {vaultPlatform && `(${vaultPlatform})`}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
