import { maticAddresses } from "./Addresses"
import { ethereumAddresses } from "./Addresses/EthereumAddresses"
import { bestVaults as ethBestVaults } from "./Addresses/EthereumAddresses/constants"
import { bestVaults as maticBestVaults } from "./Addresses/MaticAddresses/constants"

const isMaticVault = (vault: any) => {
    return (
        vault.network === maticAddresses.config.network.other.networkName ||
        vault.networkName === maticAddresses.config.network.other.networkName
    )
}

const isEthVault = (vault: any) => {
    return (
        vault.network === ethereumAddresses.config.network.other.networkName ||
        vault.networkName === ethereumAddresses.config.network.other.networkName
    )
}

export const bestVaultsFilter = (item: any) => {
    if (isMaticVault(item.vault) && maticBestVaults.find(addr => addr.toLowerCase() === item.vault.addr.toLowerCase())) {
        return true;
    }

    if (isEthVault(item.vault) && ethBestVaults.find(addr => addr.toLowerCase() === item.vault.addr.toLowerCase())) {
        return true;
    }

    return false;
}
