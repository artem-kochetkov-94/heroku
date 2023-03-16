import React, {useEffect, useState} from 'react'
import {
    ZapV2DepositAndWithdrawTabs
} from "../../../Vault/components/DepositAndWithdraw/components/ZapV2DepositAndWithdrawTabs";
import {useStores} from "../../../../stores/hooks";
import {observer} from "mobx-react";
import {userInfosStore, zapV2Methods} from "../../../../stores";

import './styles-zap.css'
import {formatVaultIcon} from "../../../../utils";

export const ZapTetuBal = observer((props: any) => {
    const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit')

    const { vault } = props;
    const address = vault?.addr

    const {
        metaMaskStore,
        tokenChainStore,
        networkManager,
        vaultDataPageStore,
        vaultOperationPageStore,
        zapV2ChainStore,
        vaultUserLockTSStore,
        userInfoOfVaultStore,
    } = useStores()

    vaultDataPageStore.vault = address

    useEffect(() => {
        if (metaMaskStore.inited && networkManager.inited) {
            vaultDataPageStore.fetchData()
        }
    }, [
        metaMaskStore.inited,
        networkManager.inited,
        metaMaskStore.walletAddress,
        tokenChainStore.transactionStorage.data,
        networkManager.networkId,
        zapV2ChainStore.transactionStorage.data,
    ])

    /*useEffect(() => {
        vaultOperationPageStore.checkShowLoaders()
    }, [
        isShowLoader,
        tokenChainStore.transactionStorage.data,
        isCheckingApprove,
        networkManager.networkId,
        zapChainStore.transactionStorage.data,
    ])*/

    useEffect(() => {
        vaultOperationPageStore.checkPendingTransactions()
    }, [tokenChainStore.pendingTranscations, vault, networkManager.networkId])

    useEffect(() => {
        if (address) {
            zapV2ChainStore.init(
                address,
                zapV2ChainStore.getZapV2Assets(vault, zapV2Methods.BalancerWethBalTetuBal)
            )
            if (metaMaskStore.walletAddress) {
                vaultUserLockTSStore.fetch(address, metaMaskStore.walletAddress)
            }
        }


        return () => {
            zapV2ChainStore.reset()
            vaultUserLockTSStore.reset()
            userInfosStore.update(address)
        }
    }, [address, metaMaskStore.walletAddress])

    if (!networkManager.inited) {
        return null
    }

    return (
        <div className="zap-v2-wrapper">
            <div className="zap-v2">
            {zapV2ChainStore.vaultAddress &&
                <>
                    <ZapV2DepositAndWithdrawTabs
                        vaultSymbol={'BAL-WETH/tetuBAL Vault'}
                        vaultIcon={<span className="icon-group icon-group-2 icon-group-small">
                            {formatVaultIcon(address!, 'matic').map((img: string) => {
                                return (
                                    <img
                                        // @ts-ignore
                                        src={img}
                                        className={`icon`}
                                        alt=""
                                    />
                                )
                            })}
                        </span>}
                        tab={tab}
                        // @ts-ignore
                        setTab={setTab}
                        isShowZap={false}
                    />
                </>
            }
            </div>
        </div>
    )
})