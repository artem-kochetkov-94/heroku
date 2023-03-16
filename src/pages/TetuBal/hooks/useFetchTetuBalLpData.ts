import { tetuBalVault } from '..'
import { useStores } from '../../../stores/hooks'
import { TetuBalLpData } from '../types'
import { balancerAbi } from '../../../abi/balancer'
import * as utils from 'ethers/lib/utils'
import * as balancerUtils from '@georgeroman/balancer-v2-pools/dist/src/pools/stable/math'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'

type UsefetchTetuBalLpData = () => {
  fetchTetuBalLpData: () => Promise<TetuBalLpData>
}

export const useFetchTetuBalLpData: UsefetchTetuBalLpData = () => {
  const { web3Store, contractUtilsChainStore } = useStores()

  const fetchTetuBalLpData = async () => {
    const contract = new web3Store.web3.eth.Contract(
      // @ts-ignore
      balancerAbi,
      '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    )

    const response = await contract.methods
      .getPoolTokens('0xb797adfb7b268faeaa90cadbfed464c76ee599cd0002000000000000000005ba')
      .call()

    const token0 = response[0][0]
    const token1 = response[0][1]
    const balances = response[1]

    // @ts-ignore
    const [token0Decimals, token1Decimals] = await contractUtilsChainStore.erc20Decimals([
      token0,
      token1,
    ])

    const targetToken = tetuBalVault

    // @ts-ignore
    const reserve0 = +utils.formatUnits(balances[1] as string, token0Decimals)
    // @ts-ignore
    const reserve1 = +utils.formatUnits(balances[0] as string, token1Decimals)

    const tokenStacked = targetToken === token0 ? reserve0 : reserve1
    const oppositeTokenStacked = targetToken === token0 ? reserve1 : reserve0
    const oppositeToken = targetToken === token0 ? token1 : token0
    let countToBuy = ((oppositeTokenStacked - tokenStacked) / 2) * 0.97

    const token20WETH80BAL = '0x3d468AB2329F296e1b9d8476Bb54Dd77D8c2320f'
    const tetuBAL = '0x7fC9E0Aa043787BFad28e29632AdA302C790Ce33'

    const price = balancerUtils
      ._calcOutGivenIn(
        new BigNumber('500000'),
        [new BigNumber(balances[0]), new BigNumber(balances[1])],
        token0 === token20WETH80BAL ? 0 : 1,
        token0 === token20WETH80BAL ? 1 : 0,
        new BigNumber(parseUnits('1').toString()),
        {
          swapFeePercentage: new BigNumber(parseUnits('0.00309').toString()),
          tokenInDecimals: 18,
        },
      )
      .toString()

    const tetuBalPrice = balancerUtils
      ._calcOutGivenIn(
        new BigNumber('500000'),
        [new BigNumber(balances[0]), new BigNumber(balances[1])],
        token0 === tetuBAL ? 0 : 1,
        token0 === tetuBAL ? 1 : 0,
        new BigNumber(parseUnits('1').toString()),
        {
          swapFeePercentage: new BigNumber(parseUnits('0.00309').toString()),
          tokenInDecimals: 18,
        },
      )
      .toString()
    console.log('>>> balances', balances)
    console.log('>>> price', price)
    console.log('>>> tetuBalPrice', tetuBalPrice)
    // console.log('---', {
    //   token0,
    //   token1,
    //   balances,
    //   tetuBalVault
    // })

    // console.log('----', {
    //   '20WETH80BALprice': formatUnits(price),
    //   tetuBalPrice: formatUnits(tetuBalPrice)
    // })

    return {
      tokenStacked,
      oppositeToken,
      oppositeTokenStacked,
      price: formatUnits(price),
      tetuBalPrice: formatUnits(tetuBalPrice),
      countToBuy,
    }
  }

  return {
    fetchTetuBalLpData,
  }
}
