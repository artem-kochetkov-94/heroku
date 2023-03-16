import { useEffect, useState } from "react"
import { useStores } from '../../stores/hooks'
import { useHistory, useLocation } from 'react-router'
import { metaMaskStore } from "../../stores"

export const useSearch = () => {
    const { mainPageStore, networkManager } = useStores()
    const [networkChecked, setNetworkChecked] = useState(false);
    const history = useHistory()
    const location = useLocation()

    useEffect(() => {
        // @ts-ignore
        let _params = new URL(document.location).searchParams
        let networkId = _params.get('networkId');

        if (networkManager.inited && metaMaskStore.inited) {
            networkManager.setNetworkId(networkId || networkManager.networkId, () => {
                setNetworkChecked(true);
            });
        }
    }, [networkManager.inited, metaMaskStore.inited])

    useEffect(() => {
        try {
            // @ts-ignore
            let _params = new URL(document.location).searchParams
            let networkId = _params.get('networkId');

            if (networkChecked) {
                networkId = networkManager.networkId
            }

            const newParams: { [key: string]: any } = {
                activeTab: mainPageStore.activeTab,
            };

            if (networkId) {
                newParams.networkId = networkId;
            }

            if (mainPageStore.vaultsFiltersStore.searchByName) {
                newParams.searchByName = mainPageStore.vaultsFiltersStore.searchByName;
            }
            if (mainPageStore.vaultsFiltersStore.selectedPlatform) {
                newParams.selectedPlatform = mainPageStore.vaultsFiltersStore.selectedPlatform;
            }
            if (mainPageStore.vaultsFiltersStore.selectedAsset.length) {
                newParams.selectedAsset = mainPageStore.vaultsFiltersStore.selectedAsset;
            }
            if (mainPageStore.vaultsFiltersStore.isOnlyDeposited) {
                newParams.isOnlyDeposited = mainPageStore.vaultsFiltersStore.isOnlyDeposited;
            }
            if (mainPageStore.vaultsFiltersStore.isNewVaultsFirst) {
                newParams.isNewVaultsFirst = mainPageStore.vaultsFiltersStore.isNewVaultsFirst;
            }
            if (mainPageStore.vaultsFiltersStore.isOnlyStablecoins) {
                newParams.isOnlyStablecoins = mainPageStore.vaultsFiltersStore.isOnlyStablecoins;
            }
            if (mainPageStore.vaultsFiltersStore.isOnlyBlueChips) {
                newParams.isOnlyBlueChips = mainPageStore.vaultsFiltersStore.isOnlyBlueChips;
            }
            if (mainPageStore.vaultsFiltersStore.isOnlySingleVault) {
                newParams.isOnlySingleVault = mainPageStore.vaultsFiltersStore.isOnlySingleVault;
            }
            if (mainPageStore.vaultsFiltersStore.isOnlyAutocompondVaults) {
                newParams.isOnlyAutocompondVaults = mainPageStore.vaultsFiltersStore.isOnlyAutocompondVaults;
            }
            if (mainPageStore.vaultsFiltersStore.selectedSort) {
                newParams.selectedSort = mainPageStore.vaultsFiltersStore.selectedSort;
            }

            const params = new URLSearchParams({
                activeTab: mainPageStore.activeTab,
                ...newParams,
            });

            history.replace({
                pathname: location.pathname,
                search: params.toString()
            });
        } catch (e) {
        }
    }, [
        mainPageStore.activeTab,

        mainPageStore.vaultsFiltersStore.isOnlyDeposited,
        mainPageStore.vaultsFiltersStore.isOnlyDeactivated,
        mainPageStore.vaultsFiltersStore.isNewVaultsFirst,
        mainPageStore.vaultsFiltersStore.isOnlyStablecoins,
        mainPageStore.vaultsFiltersStore.isOnlyBlueChips,
        mainPageStore.vaultsFiltersStore.isOnlySingleVault,
        mainPageStore.vaultsFiltersStore.isOnlyAutocompondVaults,
        mainPageStore.vaultsFiltersStore.searchByName,
        mainPageStore.vaultsFiltersStore.selectedPlatform,
        mainPageStore.vaultsFiltersStore.selectedAsset,
        mainPageStore.vaultsFiltersStore.selectedSort,
        networkManager.networkId,

        networkChecked,
    ]);

    return {
        networkChecked,
    }
}
