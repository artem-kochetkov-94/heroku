import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { useStores } from '../../stores/hooks'
import { LoadingOutlined } from '@ant-design/icons'
import unknownIcon from '../../static/UNKNOWN.png'
import { getAssetsIconMap } from '../../static/tokens'
import { useForceUpdate } from '../../hooks'
import {
  formatVaultIcon,
  formatVaultManageName,
  getVaultSymbolName,
  getVaultSymbolNameByNetwork,
} from '../../utils/format'
import { useVaultSubStrategies } from '../../hooks'

import './style.css'

export const platformNameMap = {
  '0': 'Unknown',
  '1': 'Tetu',
  '2': 'Quick Swap',
  '3': 'Sushi Swap',
  '4': 'Wault Swap',
  '5': 'Iron Swap',
  '6': 'Cosmic Swap',
  '7': 'Curve',
  '8': 'Dino Swap',
  '9': 'Iron Lending',
  '10': 'Hermes',
  '11': 'Cafe Swap',
  '12': 'Tetu Swap',
  '13': 'Spooky Swap',
  '14': 'AAVE',
  '15': 'AAVE_MAI_BAL',
  '16': 'GEIST',
  '17': 'HARVEST',
  '18': 'SCREAM',
  '19': 'KLIMA',
  '20': 'VESQ',
  '21': 'QIDAO',
  '22': 'SUNFLOWER',
  '23': 'NACHO',
  '24': 'STRATEGY_SPLITTER',
  '25': 'TOMB',
  '26': 'TAROT',
  '27': 'BEETHOVEN',
  '28': 'IMPERMAX',
  '29': 'Tetu', // TETU_SF
  '30': 'ALPACA',
  '31': 'MARKET',
  '32': 'UNIVERSE',
  '33': 'MAI_BAL',
  '34': 'UMA',
  '35': 'SPHERE',
  '36': 'BALANCER',
  '37': 'OTTERCLAM',
  '38': 'MESH',
  '39': 'dFORCE',
  '40': 'DYSTOPIA',
  '41': 'CONE',
  '42': 'AURA',
}

export const otherPlatforms = ['4', '6', '10']

const vaultPlatformMap = {
  ['0x301204e50c4295fe38c87f774cbdf984a1b66e87'.toLowerCase()]: 'QuickSwap',
  ['0x51b0b58ff704b97e8d5aff911e2ffc9939e44bfc'.toLowerCase()]: 'SushiSwap',
  ['0x5b169bfd148175ba0bb1259b75978a847c75fe5b'.toLowerCase()]: 'QuickSwap',
  ['0xC68EE708679651fBe544972dc6034b8fcD34C1A4'.toLowerCase()]: 'QuickSwap',
  ['0x2fC753522260c2ee6bEf62d5800640f0a04C212C'.toLowerCase()]: 'SushiSwap',
  ['0x2cF25555b4f357E701d174F3E0c0c84D5f8a3595'.toLowerCase()]: 'FireBird',
  ['0xc8c69afe55C3AB9545c4081A1494394d6300cA4f'.toLowerCase()]: 'Dfyn',
  ['0xF91773C0811d97ecbAa72a2673ac089B8Bce871b'.toLowerCase()]: 'QuickSwap',
  ['0x26a72c88ec7483Ca96B95b8951059e0cf1Ffc5a3'.toLowerCase()]: 'QuickSwap',

  ['0x6C674c0f8459F8B6dDE1dDC7c6D1dC9699cE6cCb'.toLowerCase()]: 'SushiSwap',
  ['0x598f3647A586Be31fb9a6942c1f18ED44D5f8b0D'.toLowerCase()]: 'V2',
  ['0x3cD1DFa9bDF2d4b2c2fF1A0787A447Bc94097f0B'.toLowerCase()]: 'V2',
  ['0x9423D793A96B76BaAFD86776070f0e3B94A5d1Df'.toLowerCase()]: 'V2',
  ['0xFF0C285e1B6B8E7DA72950D7879b2d06ea084445'.toLowerCase()]: 'V2',
  ['0xDF92a95A7156A76D6a4319FBCFdCa5FeD3367425'.toLowerCase()]: 'V2',
  ['0xdc2504424478B510a179fe393d54950477B751A8'.toLowerCase()]: 'V2',
}

export const getVaultPlatform = (vaultAddr: string) => {
  const key = vaultAddr.toLowerCase()

  if (key in vaultPlatformMap) {
    return vaultPlatformMap[key]
  }

  return null
}

const excludeMap = {
  PS: {
    name: 'TETU Profit Share pool',
    assets: ['bPS'],
  },
}

const antSmallIcon = <LoadingOutlined style={{ fontSize: 18 }} spin />

type VaultRowProps = {
  assets: string[]
  fontSize?: number
  platform?: string
  small?: boolean
  address?: string
  deactivated?: boolean
  className?: string
  vault?: any
  vaultName?: string | null
  networkName?: string
}

export const checkIsTETUUSDC = (assets: string[]): boolean => {
  const TETU_USDC = new Set([
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'.toLowerCase(),
    '0x255707B70BF90aa112006E1b07B9AeA6De021424'.toLowerCase(),
  ])

  if (assets.length !== 2) {
    return false
  }

  return TETU_USDC.has(assets[0].toLowerCase()) && TETU_USDC.has(assets[1].toLowerCase())
}

export const checkIsIron3USD = (assets: string[]): boolean => {
  return true
}

export const VaultRow: React.FC<VaultRowProps> = observer((props) => {
  const forceUpdate = useForceUpdate()

  const { namesManagerStore, networkManager } = useStores()
  const {
    assets,
    platform,
    small,
    deactivated = true,
    className,
    vault,
    address,
    networkName,
  } = props
  const multiPlatforms = useVaultSubStrategies(vault)

  useEffect(() => {
    forceUpdate()
  }, [vault, vault?.addr])

  const getPlatformName = () => {
    if (
      checkIsTETUUSDC(assets) &&
      address!.toLowerCase() !== '0xca870d6575ef0b872f60e7fa63774258c523027f'.toLowerCase()
    ) {
      if (address?.toLowerCase() === '0x301204E50C4295FE38c87F774Cbdf984a1B66e87'.toLowerCase()) {
        return platformNameMap['1']
      }
      return platformNameMap['1']
    }

    return (
      <>
        {/* @ts-ignore */}
        {platformNameMap[platform]}
      </>
    )
  }

  const vaultPlatform = getVaultPlatform(address!)
  const is_BEETHOVEN_platform = platform === '27'

  // const isSymbolName = networkManager.addresses.vaultSymbolName
  //   .map((el: any) => el.toLowerCase())
  //   .includes(vault?.addr?.toLowerCase())
  // const formatedName = formatVaultManageName(address!)

  // let vaultName = networkManager.addresses.vaultSymbolName[vault?.addr?.toLowerCase()]
  // let resultVaultName = undefined
  let resultVaultName = networkName
    ? getVaultSymbolNameByNetwork(vault)
    : getVaultSymbolName(vault?.addr)

  if (!resultVaultName) {
    resultVaultName = assets
      .map((asset) => namesManagerStore.getAssetName(asset, networkName))
      .join('-')
  }

  return (
    <div style={{ width: '100%' }}>
      <div className={`vault-row-wrapper ${deactivated ? 'deactivated' : ''} ${className}`}>
        <span
          className={`icon-group icon-group-${
            formatVaultIcon(address!, networkName)
              ? Array.isArray(formatVaultIcon(address!, networkName))
                ? formatVaultIcon(address!, networkName).length
                : '1'
              : assets.length
          } ${small ? 'icon-group-small' : ''}`}
        >
          {formatVaultIcon(address!, networkName) ? (
            <>
              {Array.isArray(formatVaultIcon(address!, networkName)) ? (
                <>
                  {formatVaultIcon(address!, networkName).map((img: string) => {
                    return (
                      <img
                        // @ts-ignore
                        src={img}
                        className={`icon`}
                        alt=""
                      />
                    )
                  })}
                </>
              ) : (
                <img
                  // @ts-ignore
                  src={formatVaultIcon(address!, networkName)}
                  className={`icon`}
                  alt=""
                />
              )}
            </>
          ) : (
            <>
              {assets.map((asset, index) => {
                const name = namesManagerStore.getAssetName(asset, networkName)

                if (name === null) {
                  setTimeout(forceUpdate, 1000)
                }

                return (
                  <img
                    // @ts-ignore
                    src={getAssetsIconMap()[name] ?? unknownIcon}
                    className={`icon`}
                    alt={name}
                  />
                )
              })}
            </>
          )}
        </span>
        <div className="vault-row-title">
          <div
            className="vault-row-title-name"
            style={
              is_BEETHOVEN_platform
                ? {
                    fontSize: 15,
                    lineHeight: '20px',
                  }
                : {}
            }
          >
            {resultVaultName}
          </div>
          <div className="vault-row-title-platform">
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
          <div className="vault-row-title-platform"></div>
        </div>
      </div>
    </div>
  )
})
