import { formatUnits } from '@ethersproject/units'
import { BigNumber } from 'ethers'
import { networkManager } from '../stores'
import { getAssetsIconMap } from '../static/tokens'
import { ethereumAddresses } from '../networks/Addresses/EthereumAddresses'

export const getVaultSymbolName = (addr: string) => {
  const key = Object.keys(networkManager.addresses.vaultSymbolName).find(a => {
    return a.toLowerCase() === addr?.toLowerCase();
  })

  if (key) {
    return networkManager.addresses.vaultSymbolName[key];
  }

  return null;
}

export const getVaultSymbolNameByNetwork = (vault: any) => {
  const networkName = vault.network || vault.networkName;
  const addresses = networkManager.getVaultSymbolNameAddressesByNetworkName(networkName);

  const key = Object.keys(addresses).find(a => {
    return a.toLowerCase() === vault?.addr?.toLowerCase();
  })

  if (key) {
    return addresses[key];
  }

  return null;
}

export const formatTvlUsdc = (tvlUsdc: string) => {
  if (tvlUsdc === undefined) {
    return
  }
  return '$' + formatUnits(BigNumber.from(tvlUsdc))
}
//
export const formatVaultManageName = (vaultAddr: string) => {
  // if (vaultAddr.toLowerCase() === networkManager.addresses.vaults?.IS3USD?.toLowerCase()) {
  //   return 'IS3USD'
  // }

  // if (vaultAddr.toLowerCase() === networkManager.addresses.vaults?.aTricrypto3?.toLowerCase()) {
  //   return 'aTricrypto3'
  // }

  // if (vaultAddr.toLowerCase() === networkManager.addresses.vaults?.geist?.toLowerCase()) {
  //   return 'Geist'
  // }

  // if (vaultAddr.toLowerCase() === networkManager.addresses.vaults?.['2pool']?.toLowerCase()) {
  //   return '2Pool'
  // }

  // if (vaultAddr.toLowerCase() === networkManager.addresses.vaults?.crvAAVE?.toLowerCase()) {
  //   return 'crvAAVE'
  // }

  // @ts-ignore
  // if (vaultAddr!.toLowerCase() === networkManager.addresses.core?.PS?.toLowerCase()) {
  //   return 'xTETU (PS)'
  // }

  // if (vaultAddr!.toLowerCase() === networkManager.addresses.vaults?.dxTETU?.toLowerCase()) {
  //   return 'dxTETU'
  // }

  // if (vaultAddr!.toLowerCase() === networkManager.addresses.vaults?.tetuqi?.toLowerCase()) {
  //   return 'tetuQi'
  // }

  if (vaultAddr!.toLowerCase() === networkManager.addresses.vaults?.tetuBal?.toLowerCase()) {
    return '20WETH-80BAL'
  }

  // if (vaultAddr!.toLowerCase() === networkManager.addresses.vaults?.balTetuBal?.toLowerCase()) {
  //   return 'B-80BAL-20WETH - tetuBAL'
  // }

  // if (vaultAddr!.toLowerCase() === networkManager.addresses.vaults?.tetuMesh?.toLowerCase()) {
  //   return 'tetuMESH'
  // }

  // if (
  //   vaultAddr!.toLowerCase() === networkManager.addresses.vaults?.bethoven_USDC_DAI?.toLowerCase()
  // ) {
  //   return 'Steady Beets, Act II'
  // }

  // if (
  //   vaultAddr!.toLowerCase() ===
  //   networkManager.addresses.vaults?.bethoven_USDC_DAI_miMATIC?.toLowerCase()
  // ) {
  //   return 'Guqin Qi V2'
  // }

  // if (
  //   vaultAddr!.toLowerCase() === networkManager.addresses.vaults?.bethoven_USDC_WFTM?.toLowerCase()
  // ) {
  //   return 'Fantom Of The Opera'
  // }

  // if (
  //   vaultAddr!.toLowerCase() ===
  //   networkManager.addresses.vaults?.bethoven_WFTM_BTC_ETH?.toLowerCase()
  // ) {
  //   return 'The Grand Orchestra'
  // }

  // if (
  //   vaultAddr!.toLowerCase() ===
  //   networkManager.addresses.vaults?.bethoven_USDC_fUSDT_MIM?.toLowerCase()
  // ) {
  //   return 'Ziggy Stardust & Magic Internet Money'
  // }

  // if (
  //   vaultAddr!.toLowerCase() ===
  //   networkManager.addresses.vaults?.bethoven_USDC_WFTM_BTC_ETH?.toLowerCase()
  // ) {
  //   return 'A Late Quartet'
  // }

  // if (
  //   vaultAddr!.toLowerCase() === networkManager.addresses.vaults?.bethoven_WFTM_BEETS?.toLowerCase()
  // ) {
  //   return 'The Fidelio Duetto'
  // }

  // if (vaultAddr!.toLowerCase() === networkManager.addresses.vaults?.miMatic?.toLowerCase()) {
  //   return 'miMatic (MAI)'
  // }

  return null
}

export const formatVaultIcon = (vaultAddr: string, networkName?: string) => {
  if (vaultAddr.toLowerCase() === '0x96afb62d057f7e0dca987c503812b12bee14f5e5'.toLowerCase()) {
    return getAssetsIconMap().curve
  }

  // tetuBal
  if (networkName) {
    const addresess = networkManager.getAddressesByNetworkName(networkName);

    //@ts-ignore
    if (vaultAddr.toLowerCase() === addresess?.vaults?.tetuBal?.toLowerCase()) {
      return getAssetsIconMap().tetuBAL
    }
  } else {
    if (vaultAddr.toLowerCase() === networkManager.addresses.vaults?.tetuBal?.toLowerCase()) {
      return getAssetsIconMap().tetuBAL
    }
  }

  // balTetuBAl
  if (vaultAddr.toLowerCase() === '0xBD06685a0e7eBd7c92fc84274b297791F3997ed3'.toLowerCase()) {
    return [getAssetsIconMap().veBAL, getAssetsIconMap().tetuVeBAL]
  }

  // xbb-am-usd
  if (vaultAddr.toLowerCase() === '0xf2fb1979c4bed7e71e6ac829801e0a8a4efa8513'.toLowerCase()) {
    return [getAssetsIconMap()["xbb-am-usd"]]
  }

  // xB-stMATIC-Stable
  if (vaultAddr.toLowerCase() === '0xa8fab27b7d41ff354f0034addc2d6a53b5e31356'.toLowerCase()) {
    return [getAssetsIconMap().stMATIC, getAssetsIconMap().WMATIC]
  }

  // MATICX-WMATIC BPT
  if (vaultAddr.toLowerCase() === '0x1e8a077d43A963504260281E73EfCA6292d48A2f'.toLowerCase()) {
    return [getAssetsIconMap().MaticX, getAssetsIconMap().WMATIC]
  }

  // bbaUSD BPT
  if (vaultAddr.toLowerCase() === '0x5Dc1c173587aA562179b03dB9d643fF5fF2e4660'.toLowerCase()) {
    return [getAssetsIconMap().bbaUSD]
  }

  // qi-tetuQi BPT
  if (vaultAddr.toLowerCase() === '0x190ca39f86ea92eaaf19cb2acca17f8b2718ed58'.toLowerCase()) {
    return [getAssetsIconMap().tetuQi, getAssetsIconMap().QI]
  }

  // wUSDR-USDC BPT
  if (vaultAddr.toLowerCase() === '0x65be5bd1745a9871a5f042385db869e78e9a1693'.toLowerCase()) {
    return [getAssetsIconMap().wUSDR, getAssetsIconMap().USDC]
  }

  if (vaultAddr.toLowerCase() === '0x8A571137DA0d66c2528DA3A83F097fbA10D28540'.toLowerCase()) {
    return [getAssetsIconMap().wstETH, getAssetsIconMap().bbaUSD]; // wwstETH-bbaUSD
  }
  if (vaultAddr.toLowerCase() === '0xc6f6e9772361a75988c6cc248a3945a870fb1272'.toLowerCase()) {
    return [getAssetsIconMap().rETH, getAssetsIconMap().WETH]; // rETH-WETH
  }
  if (vaultAddr.toLowerCase() === '0x46e8e75484ee655c374b608842acd41b2ec3f11c'.toLowerCase()) {
    return [getAssetsIconMap().BADGER, getAssetsIconMap().rETH]; // BADGER-rETH
  }
  if (vaultAddr.toLowerCase() === '0x7f52d49c8a9779e93613fb14cf07be1500ab9c3a'.toLowerCase()) {
    return [getAssetsIconMap().wstETH, getAssetsIconMap().WETH];
  }

  return null
}

export const formatETHVaultIcon = (vaultAddr: string) => {
  if (vaultAddr.toLowerCase() === '0x8A571137DA0d66c2528DA3A83F097fbA10D28540'.toLowerCase()) {
    return [getAssetsIconMap().wstETH, getAssetsIconMap().bbaUSD]; // wwstETH-bbaUSD
  }
  if (vaultAddr.toLowerCase() === '0xc6f6e9772361a75988c6cc248a3945a870fb1272'.toLowerCase()) {
    return [getAssetsIconMap().rETH, getAssetsIconMap().WETH]; // rETH-WETH
  }
  if (vaultAddr.toLowerCase() === '0x46e8e75484ee655c374b608842acd41b2ec3f11c'.toLowerCase()) {
    return [getAssetsIconMap().BADGER, getAssetsIconMap().rETH]; // BADGER-rETH
  }
  if (vaultAddr.toLowerCase() === '0x7f52d49c8a9779e93613fb14cf07be1500ab9c3a'.toLowerCase()) {
    return [getAssetsIconMap().wstETH, getAssetsIconMap().WETH];
  }

  return null;
}

export const formatAdress = (adress: string) => {
  if (!adress) {
    return null
  }
  return adress.slice(0, 6) + '...' + adress.slice(adress.length - 4, adress.length)
}

export const formatShareName = (name: string) => {
  const nameMap = {
    TETU_IRON_LOAN_USDC: 'TETU_USDC',
    TETU_IRON_LOAN_USDT: 'TETU_USDT',
    TETU_IRON_LOAN_WETH: 'TETU_WETH',
    TETU_IRON_LOAN_WBTC: 'TETU_WBTC',
    TETU_IRON_LOAN_WMATIC: 'TETU_WMATIC',
    xIRON_LOAN_USDC: 'xUSDC',
    xIRON_LOAN_USDT: 'xUSDT',
    xIRON_LOAN_WETH: 'xWETH',
    xIRON_LOAN_WBTC: 'xWBTC',
    xIRON_LOAN_WMATIC: 'xWMATIC',
  }

  if (name in nameMap) {
    // @ts-ignore
    return nameMap[name]
  } else {
    return name
  }
}
