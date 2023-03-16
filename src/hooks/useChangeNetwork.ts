import { useHistory, useLocation } from 'react-router-dom'
import { ethereumAddresses } from '../networks/Addresses/EthereumAddresses/EthereumAddresses'
import { maticAddresses } from '../networks/Addresses/MaticAddresses'
import { useResetLabels } from '../pages/Main/components/LabelGroup'
import { useStores } from '../stores/hooks'

export const useChangeNetwork = () => {
  const {
    metaMaskStore,
    networkManager,
    mainPageStore,
    totalStats2Store,
    nativeCurrencyBalance,
    web3Store,
  } = useStores()

  const location = useLocation()
  const history = useHistory()

  const resetLabels = useResetLabels()

  const handleChangeNetwork = (value: string, withReset: boolean = false) => {
    if ((value && value !== networkManager.networkId) || withReset === true) {
      networkManager.setNetworkId(value, () => {
        if (location.pathname.includes('vault') || location.pathname.includes('tetuqi')) {
          history.push('/')
        }
        resetLabels()
        mainPageStore.resetData()
        mainPageStore.resetFilters()
        if (location.pathname === '/') {
          mainPageStore.fetchData([
            maticAddresses.config.network.other.networkName,
            ethereumAddresses.config.network.other.networkName,
          ])
        } else {
          mainPageStore.fetchData()
        }
        mainPageStore.setActiveTab('All')
        totalStats2Store.reset()
        nativeCurrencyBalance.reset()
        totalStats2Store.fetch()
        web3Store.getGasPrice()
        // statsPageStore.reset()
        // statsPageStore.loadData()
      })
    }
  }

  return handleChangeNetwork
}
