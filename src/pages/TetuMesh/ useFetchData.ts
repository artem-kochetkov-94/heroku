import { utils } from 'ethers'
import { useEffect, useState } from 'react'
import { meshTetuMesh } from '../../abi/meshTetuMesh'
import { useStores } from '../../stores/hooks'

type UseFetchData = () => {
  data: null | {
    tokenStacked: number;
    oppositeToken: any;
    oppositeTokenStacked: number
    price: number;
    tetuMeshPrice: number
    countToBuy: number
  }
  loading: boolean;
  loaded: boolean;
}

export const useFetchData: UseFetchData = () => {
  const { contractUtilsChainStore, web3Store } = useStores()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchData = async () => {
    const underlingContact = new web3Store.web3.eth.Contract(
      // @ts-ignore
      meshTetuMesh,
      '0xcf40352253de7a0155d700a937dc797d681c9867',
    )

    // @ts-ignore
    const response = await Promise.allSettled([
      underlingContact.methods.reserve0().call(),
      underlingContact.methods.reserve1().call(),
      underlingContact.methods.token0().call(),
      underlingContact.methods.token1().call(),
    ])

    // @ts-ignore
    const [_reserve0, _reserve1, token0, token1]: any = response.map((el: any) => el.value)
    const [token0Decimals, token1Decimals] = await contractUtilsChainStore.erc20Decimals([
      token0,
      token1,
    ])
    const targetToken = '0xDcB8F34a3ceb48782c9f3F98dF6C12119c8d168a' // tetuMesh

    // @ts-ignore
    const reserve0 = +utils.formatUnits(_reserve0 as string, token0Decimals)
    // @ts-ignore
    const reserve1 = +utils.formatUnits(_reserve1 as string, token1Decimals)

    const tokenStacked = targetToken === token1 ? reserve0 : reserve1
    const oppositeTokenStacked = targetToken === token1 ? reserve1 : reserve0
    const oppositeToken = targetToken === token1 ? token1 : token0

    let targetPrice = 1
    let currentPrice = null
    let countToBuy = null
    let price
    let tetuMeshPrice

    price = oppositeTokenStacked / tokenStacked
    tetuMeshPrice = tokenStacked / oppositeTokenStacked

    countToBuy =
      2 *
      (Math.sqrt((oppositeTokenStacked * tokenStacked) / targetPrice) -
        tokenStacked -
        tokenStacked * 0.0001)

    // if (token0 === targetToken) {
    //     price = oppositeTokenStacked / tokenStacked
    //     tetuMeshPrice = tokenStacked / oppositeTokenStacked
    //     currentPrice = reserve1 / reserve0;
    //     countToBuy = Math.sqrt((reserve1 * reserve0 / targetPrice)) - reserve0 - (reserve0 * 0.0001)
    // } else {
    //     price = tokenStacked / oppositeTokenStacked
    //     tetuMeshPrice = oppositeTokenStacked / tokenStacked
    //     currentPrice = reserve0 / reserve1;
    //     countToBuy = Math.sqrt((reserve0 * reserve1 / targetPrice)) - reserve1 - (reserve1 * 0.0001)
    // }
    // if (token0 === targetToken) {
    //     price = reserve0 / reserve1
    //     tetuMeshPrice = reserve1 / reserve0
    //     currentPrice = reserve1 / reserve0;
    //     countToBuy = Math.sqrt((reserve1 * reserve0 / targetPrice)) - reserve0 - (reserve0 * 0.0001)
    // } else {
    //     price = reserve1 / reserve0
    //     tetuMeshPrice = reserve0 / reserve1
    //     currentPrice = reserve0 / reserve1;
    //     countToBuy = Math.sqrt((reserve0 * reserve1 / targetPrice)) - reserve1 - (reserve1 * 0.0001)
    // }

    return { tokenStacked, oppositeToken, oppositeTokenStacked, price, tetuMeshPrice, countToBuy }
  }

  useEffect(() => {
    setLoading(true);

    fetchData().then((data: any) => {
      setData(data);
      setLoaded(true);
    }).catch(() => {
      setLoaded(false);
    }).finally(() => {
      setLoading(false);
    })
  }, [])

  // console.log('useFetchData data', data)

  return {
    data,
    loading,
    loaded
  }
}
