import { useState, useEffect } from 'react'
import { AAVE_MAI_BAL_Abi } from '../../../abi/AAVE_MAI_BAL'
import { formatUnits } from '@ethersproject/units'
import { useStores } from '../../../stores/hooks'
import { BigNumber } from 'ethers'
import { makeAutoObservable } from 'mobx'
import { web3Store } from '../../../stores'

export const AAVE_MAI_BAL_VAULTS_MATIC = [
  '0xF203B855B4303985b3dD3f35A9227828Cc8CB009',
  '0xeF7B706cA139dBd9010031a50de5509D890CE527',
  '0xf677eEE15118c02b706Ab60B29946133afA6e32E',
  '0xCA50152685aD90dC60fd8AAEa9394138db0f2BFE',
  '0x9C233cA476184e9aa4f2ff07E081D55f179964Fd',
]

class AaveMaiBalStore {
  private readonly web3Store = web3Store
  vault: any = null
  isFetching = false
  isFetched = false
  state: any = {}

  constructor() {
    makeAutoObservable(this)
  }

  setVault(vault: any) {
    if (!vault || this.vault?.addr === vault?.addr) {
      return
    }
    this.vault = vault
  }

  async loadData() {
    this.isFetching = true

    const contract = new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      AAVE_MAI_BAL_Abi,
      this.vault?.strategy,
    )

    const availableMai = await contract.methods.availableMai().call()
    const liquidationPrice = await contract.methods.liquidationPrice().call()
    const targetPercentage = await contract.methods.targetPercentage().call()
    const availableMaiValue = Number(formatUnits(availableMai))
    const liquidationPriceValue = Number(formatUnits(liquidationPrice, 8))

    this.state = {
      availableMai: availableMaiValue,
      liquidationPrice: liquidationPriceValue,
      targetPercentage: Number(targetPercentage),
      maxDepositUsd: (availableMaiValue / 100) * Number(targetPercentage),
    }

    this.isFetching = false
    this.isFetched = false
  }

  checkIsAaveMaiBalVault(addr: string) {
    const isAaveMaiBalVault = AAVE_MAI_BAL_VAULTS_MATIC.map((el) => el.toLowerCase()).includes(
      addr?.toLowerCase(),
    )
    return isAaveMaiBalVault
  }

  reset() {
    this.vault = null
    this.isFetching = false
    this.isFetched = false
    this.state = {}
  }
}

const aaveMaiBalStore = new AaveMaiBalStore()

export const useAaveMaiBalVault = (vault: any) => {
  const isAaveMaiBalVault = aaveMaiBalStore.checkIsAaveMaiBalVault(vault?.addr?.toLowerCase())

  useEffect(() => {
    if (!isAaveMaiBalVault || aaveMaiBalStore.isFetching || aaveMaiBalStore.isFetched) {
      return
    }
    aaveMaiBalStore.setVault(vault)
    aaveMaiBalStore.loadData()
    return () => {
      aaveMaiBalStore.reset()
    }
  }, [vault?.addr, isAaveMaiBalVault])

  return {
    isAaveMaiBalVault,
    state: aaveMaiBalStore.state,
    isFetching: aaveMaiBalStore.isFetching,
    isFetched: aaveMaiBalStore.isFetched,
  }
}
