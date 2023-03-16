import {formatUnits} from '@ethersproject/units'
import {BigNumber} from 'ethers'
import {platformNameMap} from '../../components/VaultRow'
import {networkManager} from '../../stores'
import {beethoven_strategy_abi} from '../../abi/beethoven_strategy_abi'
import {web3Store} from '../../stores/web3-store'

export const calcTotal = (values: string[] = []) => {
  const result = values.reduce((acc: BigNumber, item: string) => {
    return acc.add(BigNumber.from(item))
  }, BigNumber.from('0'))

  return result.toString()
}

export const calcMarketCap = (price: string, totalSupply: string) => {
  return Number(formatUnits(price)) * Number(totalSupply) + ''
}

export const getLinkAddLiquity = async (
  assets: string[],
  platform: keyof typeof platformNameMap,
  vaultAddr: string,
  vault?: any,
) => {
  const platformName = platformNameMap[platform]

  if (vaultAddr.toLowerCase() === networkManager.addresses.vaults?.balTetuBal?.toLowerCase()) {
    return 'https://polygon.balancer.fi/#/pool/0xb797adfb7b268faeaa90cadbfed464c76ee599cd0002000000000000000005ba'
  }

  if (vaultAddr.toLowerCase() === '0x7fc9e0aa043787bfad28e29632ada302c790ce33'.toLowerCase()) {
    return 'https://polygon.balancer.fi/#/pool/0x3d468ab2329f296e1b9d8476bb54dd77d8c2320f000200000000000000000426'
  }

  if (vaultAddr.toLowerCase() === '0xFE700D523094Cc6C673d78F1446AE0743C89586E'.toLowerCase()) {
    return 'https://app.balancer.fi/#/pool/0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014' // todo
  }

  // curve
  if (platformName === platformNameMap['7']) {
    // matic
    if (vaultAddr.toLowerCase() === '0x96afb62d057f7e0dca987c503812b12bee14f5e5'.toLowerCase()) {
      return 'https://polygon.curve.fi/atricrypto3'
    }
    if (vaultAddr.toLowerCase() === '0xb760f7162e865946598228b29a3fc6804de65449'.toLowerCase()) {
      return 'https://polygon.curve.fi/aave/'
    }
    if (vaultAddr.toLowerCase() === '0x98c879fe2a22297dabe1559247525d5269d87b61'.toLowerCase()) {
      return 'https://polygon.curve.fi/ren/'
    }

    // fantom
    if (vaultAddr.toLowerCase() === '0x847CD9a79B19462Bd9548488353C888F1Bdeda91'.toLowerCase()) {
      return 'https://ftm.curve.fi/2pool/'
    }
    if (vaultAddr.toLowerCase() === '0x1Be28F67996eaB29270fCfa2D2815d96d94590AB'.toLowerCase()) {
      return 'https://ftm.curve.fi/geist'
    }
    if (vaultAddr.toLowerCase() === '0xCf6497A647b3A5b7c5b36B96aa835deD7F4eC84D'.toLowerCase()) {
      return 'https://ftm.curve.fi/ren'
    }
    if (vaultAddr.toLowerCase() === '0x178bE46EdE386fcd4066dAB380b8Bb68a313Ab1C'.toLowerCase()) {
      return 'https://ftm.curve.fi/3crypto'
    }
  }

  if (assets === undefined || (assets?.length === 1 && platform)) {
    return null
  }

  if (vaultAddr?.toLowerCase() === '0x301204E50C4295FE38c87F774Cbdf984a1B66e87'.toLowerCase()) {
    return `https://quickswap.exchange/#/add/${assets[0]}/${assets[1]}`
  }

  if (vaultAddr?.toLowerCase() === '0xADC56043BFf96e2F3394bFd5719cd6De0a734257'.toLowerCase()) {
    return `https://meshswap.fi/exchange/pool/detail/0xcf40352253de7a0155d700a937dc797d681c9867`
  }

  if (platformName === platformNameMap['1']) {
    return `https://app.sushi.com/add/${assets[0]}/${assets[1]}`
  }

  if (platformName === platformNameMap['2']) {
    return `https://quickswap.exchange/#/add/${assets[0]}/${assets[1]}`
  }

  if (platformName === platformNameMap['3']) {
    return `https://app.sushi.com/add/${assets[0]}/${assets[1]}`
  }

  if (platformName === platformNameMap['4']) {
    return `https://swap.wault.finance/polygon/index.html#/add/${assets[0]}/${assets[1]}`
  }

  if (platformName === platformNameMap['12']) {
    return `https://swap.tetu.io/#/add/${assets[0]}/${assets[1]}`
  }

  if (platformName === platformNameMap['13']) {
    return `https://spookyswap.finance/add/${assets[0]}/${assets[1]}`
  }

  // Fantom
  if (platformName === platformNameMap['12']) {
    return `https://spookyswap.finance/swap?inputCurrency=FTM&outputCurrency=${assets[0]}`
  }

  if (platformName === platformNameMap['11']) {
    return `https://polygondex.cafeswap.finance/#/add/${assets[0]}/${assets[1]}`
  }

  if (platformName === platformNameMap['40']) {
    return `https://www.dystopia.exchange/liquidity/${vault.underlying}`
  }

  if (platformName === platformNameMap['27']) {
    const contract = new web3Store.web3.eth.Contract(
      // @ts-ignore
      beethoven_strategy_abi,
      vault.strategy,
    )
    const poolId = await contract.methods.beethovenPoolId().call()
    return `https://beets.fi/#/pool/${poolId}`
  }

  if (networkManager.networkId === '0xfa') {
    return `https://app.sushi.com/add/${assets[0]}/${assets[1]}`
  }


  // balancer

  // network
  if (networkManager.networkId === '0x1') {
    if (vaultAddr?.toLowerCase() === '0x8a571137da0d66c2528da3a83f097fba10d28540'.toLowerCase()) {
      return `https://app.balancer.fi/#/ethereum/pool/0x25accb7943fd73dda5e23ba6329085a3c24bfb6a000200000000000000000387`
    }

    if (vaultAddr?.toLowerCase() === '0x7f52D49C8A9779E93613Fb14cF07be1500ab9C3A'.toLowerCase()) {
      return `https://app.balancer.fi/#/ethereum/pool/0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080`
    }

    if (vaultAddr?.toLowerCase() === '0xc6f6e9772361a75988c6cc248a3945a870fb1272'.toLowerCase()) {
      return `https://app.balancer.fi/#/ethereum/pool/0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112`
    }

    if (vaultAddr?.toLowerCase() === '0x5dc1c173587aa562179b03db9d643ff5ff2e4660'.toLowerCase()) {
      return `https://app.balancer.fi/#/ethereum/pool/0xa13a9247ea42d743238089903570127dda72fe4400000000000000000000035d`
    }

    if (vaultAddr?.toLowerCase() === '0x46e8e75484ee655c374b608842acd41b2ec3f11c'.toLowerCase()) {
      return `https://app.balancer.fi/#/ethereum/pool/0xe340ebfcaa544da8bb1ee9005f1a346d50ec422e000200000000000000000396`
    }
  } else if (networkManager.networkId === '0x89') {

    if (vaultAddr?.toLowerCase() === '0xa8fab27b7d41ff354f0034addc2d6a53b5e31356'.toLowerCase()) {
      return `https://app.balancer.fi/#/polygon/pool/0x8159462d255c1d24915cb51ec361f700174cd99400000000000000000000075d`
    }

    if (vaultAddr?.toLowerCase() === '0xf2fb1979c4bed7e71e6ac829801e0a8a4efa8513'.toLowerCase()) {
      return `https://app.balancer.fi/#/polygon/pool/0x48e6b98ef6329f8f0a30ebb8c7c960330d64808500000000000000000000075b`
    }

    if (vaultAddr?.toLowerCase() === '0x1e8a077d43a963504260281e73efca6292d48a2f'.toLowerCase()) {
      return `https://app.balancer.fi/#/polygon/pool/0xb20fc01d21a50d2c734c4a1262b4404d41fa7bf000000000000000000000075c`
    }

    if (vaultAddr?.toLowerCase() === '0x08d88dd2bba2898c72a180bd8023fec9f0cb9799'.toLowerCase()) {
      return `https://app.balancer.fi/#/polygon/pool/0x34a81e8956bf20b7448b31990a2c06f96830a6e4000200000000000000000a14`
    }

    if (vaultAddr?.toLowerCase() === '0x190ca39f86ea92eaaf19cb2acca17f8b2718ed58'.toLowerCase()) {
      return `https://app.balancer.fi/#/polygon/pool/0x05f21bacc4fd8590d1eaca9830a64b66a733316c00000000000000000000087e`
    }

    if (vaultAddr?.toLowerCase() === '0x873B46600f660dddd81B84aeA655919717AFb81b'.toLowerCase()) {
      return `https://app.balancer.fi/#/polygon/pool/0xf3312968c7d768c19107731100ece7d4780b47b2000200000000000000000a50`
    }

  }

  return null
}
