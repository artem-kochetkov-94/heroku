import React, { useState } from 'react'
import { useStores } from '../../stores/hooks'
import { Button, Select } from 'antd'
import { observer } from 'mobx-react'
import { addressesMap } from '../../networks/Addresses'
import { useChangeNetwork } from '../../hooks/useChangeNetwork'

const { Option } = Select

export const Network = observer(() => {
  const { metaMaskStore, networkManager } = useStores()
  const [isOpenNetworkList, setIsOpenNetworkList] = useState(false)
  const handleChangeNetwork = useChangeNetwork()

  return (
    <div className="wallet">
      <div className="wallet-wrapper">
        <div className="wallet-network">
          {metaMaskStore.walletAddress === null ? (
            <Select
              value={networkManager.networkId}
              onChange={(val: string) => handleChangeNetwork(val)}
            >
              {Object.keys(addressesMap.aliases).map((networkName) => {
                // @ts-ignore
                const { chainName, chainId } = addressesMap.aliases[networkName].config.network
                return (
                  <Option key={chainId} value={chainId}>
                    {chainName}
                  </Option>
                )
              })}
            </Select>
          ) : (
            <Select
              className={`network-list ${isOpenNetworkList ? 'network-list-open' : ''}`}
              value={networkManager.networkId}
              onChange={(val: string) => handleChangeNetwork(val)}
              onDropdownVisibleChange={(open) => {
                setIsOpenNetworkList(open)
              }}
            >
              {Object.keys(addressesMap.aliases).map((networkName) => {
                // @ts-ignore
                const { chainName, chainId } = addressesMap.aliases[networkName].config.network
                return (
                  <Option key={chainId} value={chainId}>
                    {chainName}
                  </Option>
                )
              })}
            </Select>
          )}
        </div>
      </div>
    </div>
  )
})
