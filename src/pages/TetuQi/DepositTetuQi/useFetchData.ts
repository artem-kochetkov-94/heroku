import { parseUnits } from '@ethersproject/units/lib.esm'
import { utils } from 'ethers'
import { useEffect, useState } from 'react'
import { useStores } from '../../../stores/hooks'
import { tetuQi } from '../TetuQi'
import { formatUnits } from "@ethersproject/units";
import { DystopiaPair } from "../../../abi/DystopiaPair";

type UseFetchData = () => {
    data: {
        price: number;
        countToBuy: number;
    } | null
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
            DystopiaPair,
            '0x42c0cc5f1827C5d908392654389E5D93da426378',
        )

        // @ts-ignore
        const response = await Promise.allSettled([
            underlingContact.methods.reserve0().call(),
            underlingContact.methods.reserve1().call(),
            underlingContact.methods.token0().call(),
            underlingContact.methods.token1().call(),
            underlingContact.methods.getAmountOut(parseUnits('1'), tetuQi).call(),
        ])

        // @ts-ignore
        const [_reserve0, _reserve1, token0, token1, priceBN]: any = response.map((el: any) => el.value)
        const [token0Decimals, token1Decimals] = await contractUtilsChainStore.erc20Decimals([
            token0,
            token1,
        ])
        const targetToken = tetuQi // tetuQi

        // @ts-ignore
        const reserve0 = +utils.formatUnits(_reserve0 as string, token0Decimals)
        // @ts-ignore
        const reserve1 = +utils.formatUnits(_reserve1 as string, token1Decimals)

        const tokenStacked = targetToken === token1 ? reserve0 : reserve1
        const oppositeTokenStacked = targetToken === token1 ? reserve1 : reserve0
        const oppositeToken = targetToken === token1 ? token1 : token0

        let targetPrice = 1
        let countToBuy = oppositeTokenStacked - tokenStacked
        const price = +formatUnits(priceBN)
        console.log("useFetchData PRICE", priceBN, price)

        // countToBuy =
        //     2 *
        //     (Math.sqrt((oppositeTokenStacked * tokenStacked) / targetPrice) -
        //         tokenStacked -
        //         tokenStacked * 0.0001)

        return { price, countToBuy }
    }

    useEffect(() => {
        setLoading(true);

        fetchData().then((data: any) => {
            setData(data)
            setLoaded(true);
        }).catch(() => {
            setLoaded(false);
        }).finally(() => {
            setLoading(false);
        })
    }, [])


    return {
        data,
        loading,
        loaded
    }
}
