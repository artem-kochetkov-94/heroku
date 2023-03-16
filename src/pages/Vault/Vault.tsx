import React, { useEffect, useState } from 'react'
import { DepositAndWithdraw } from './components/DepositAndWithdraw'
import { VaultInfo } from './components/VaultInfo'
import { Nav } from './components/Nav'
import { useStores } from '../../stores/hooks'
import { observer } from 'mobx-react'
import { VaultDescription } from './components/VaultDescription'
import { HardWorks } from './components/HardWorks'

import './styles.css'

export enum PageTabs {
  DepositAndWithdraw = 'DepositAndWithdraw',
  VaultInfo = 'VaultInfo',
  DuneVaultStats = 'DuneVaultStats',
  Insurance = 'Insurance',
  HardWorks = 'HardWorks',
  // TVL = 'TVL',
  // SharePrice = 'SharePrice',
}

export const Vault = observer(() => {
  const { vaultDataPageStore, networkManager, metaMaskStore, mainPageStore, web3Store } =
    useStores()

  const [activeTab, setActiveTab] = useState<PageTabs>(PageTabs.DepositAndWithdraw)
  const vault = vaultDataPageStore.data

  useEffect(
    () => () => {
      vaultDataPageStore.reset()
    },
    [],
  )

  useEffect(() => {
    if (
      activeTab === PageTabs.DuneVaultStats ||
      activeTab === PageTabs.Insurance
      // activeTab === PageTabs.TVL ||
      // activeTab === PageTabs.SharePrice
    ) {
      setTimeout(() => {
        setActiveTab(PageTabs.DepositAndWithdraw)
      }, 500)
    }
  }, [activeTab])

  let excludedHardWorks = networkManager.addresses.hardWorksExclude
    .map((el: string) => el.toLowerCase())
    // @ts-ignore
    .includes(vault?.addr.toLowerCase())

  return (
    <div className="page container vault-page">
      <Nav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        excludedHardWorks={excludedHardWorks}
      />

      <VaultDescription />

      <div className="tabs-wrapper">
        {activeTab === PageTabs.DepositAndWithdraw && <DepositAndWithdraw />}
        {activeTab === PageTabs.VaultInfo && <VaultInfo />}
        {activeTab === PageTabs.DuneVaultStats && <DepositAndWithdraw />}
        {activeTab === PageTabs.Insurance && <DepositAndWithdraw />}
        {activeTab === PageTabs.HardWorks && !excludedHardWorks && <HardWorks />}
      </div>
    </div>
  )
})
