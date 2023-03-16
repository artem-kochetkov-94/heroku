import { BalancerLpData, TetuBalLpData, Ways } from '../types'
import { formatUnits } from '@ethersproject/units'
import { BigNumber } from 'bignumber.js'
import { calcAPY } from '../../../components/AprDetailedView'

type UseGetWay = () => {
  getWay: (balancer: any, tetuBalVault: any, tetuBalLpData: TetuBalLpData) => Ways
}

export const useGetWay: UseGetWay = () => {
  const getWay = (
    balancer: BalancerLpData,
    tetuBalVault: any,
    tetuBalLpData: TetuBalLpData,
  ): Ways => {
    const tetuBalPrice = new BigNumber(tetuBalLpData.price)
    const TVLWeight = new BigNumber(0.5)

    const balancerAPY = new BigNumber(calcAPY(balancer.apr))
    const balancerTVL = new BigNumber(balancer.tvl)

    const tetuBalAPY = new BigNumber(tetuBalVault.totalApy)
    const tetuBalTVL = new BigNumber(formatUnits(tetuBalVault.tvl))

    // console.log('getWay tetuBalPrice', tetuBalPrice.toString())
    // console.log('getWay TVLWeight', TVLWeight.toString())

    // console.log('getWay balancerAPY', balancerAPY.toString())
    // console.log('getWay balancerTVL', balancerTVL.toString())

    // console.log('getWay tetuBalAPY', tetuBalAPY.toString())
    // console.log('getWay tetuBalTVL', tetuBalTVL.toString())

    const way1_leftPart = balancerAPY.multipliedBy(tetuBalPrice.plus(1)).div(2)
    const way1_rightPart = tetuBalTVL.div(balancerTVL).minus(1).multipliedBy(TVLWeight).plus(1)
    const way1 = way1_leftPart.multipliedBy(way1_rightPart)
    // const way1 =
    // ((balancerAPY * (tetuBalPrice + 1)) / 2) * ((tetuBalTVL / balancerTVL - 1) * TVLWeight + 1)

    const way2_leftPart = balancerAPY
    const way2_rightPart = tetuBalTVL.div(balancerTVL).minus(1).multipliedBy(TVLWeight).plus(1)
    const way2 = way2_leftPart.multipliedBy(way2_rightPart)
    // const way2 = balancerAPY * ((tetuBalTVL / balancerTVL - 1) * TVLWeight + 1)

    const way3_leftPart = tetuBalAPY
    const way3_rightPart = balancerTVL.div(tetuBalTVL).minus(1).multipliedBy(TVLWeight).plus(1)
    const way3 = way3_leftPart.multipliedBy(way3_rightPart)
    // const way3 = tetuBalAPY * ((balancerTVL / tetuBalTVL - 1) * TVLWeight + 1)

    const way4_leftPart = tetuBalAPY.div(tetuBalPrice)
    const way4_rightPart = balancerTVL.div(tetuBalTVL).minus(1).multipliedBy(TVLWeight).plus(1)
    const way4 = way4_leftPart.multipliedBy(way4_rightPart)
    // const way4 = (tetuBalAPY / tetuBalPrice) * ((balancerTVL / tetuBalTVL - 1) * TVLWeight + 1)

    // console.log('getWay way1', way1.toString())
    // console.log('getWay way2', way2.toString())
    // console.log('getWay way2', way3.toString())
    // console.log('getWay way3', way4.toString())

    const ways = [way1, way2, way3, way4]

    const max = BigNumber.max.apply(null, ways)
    const indexOfMax = ways.findIndex((el) => el.toNumber() === max.toNumber())

    // console.log('getWay max', max)
    // console.log('getWay indexOfMax', indexOfMax)

    return indexOfMax
  }

  return {
    getWay,
  }
}
