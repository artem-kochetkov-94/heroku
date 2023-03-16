import {makeAutoObservable} from 'mobx'
import {web3Store} from '../web3-store'
import {balancerBoostCalculatorAbi} from '../../abi/balancerBoostCalculatorAbi'
import {formatUnits} from 'ethers/lib/utils'
import {contractReaderChainStore} from './contact-reader-store'
import {millifyValue, retry} from '../../utils'
import * as Sentry from '@sentry/react'
import BigNumber from 'bignumber.js'

class BalancerBoostCalculatorChainStore {
  constructor() {
    makeAutoObservable(this)
  }

  private readonly web3Store = web3Store

  private get CRContract() {
    const CRContract = new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      balancerBoostCalculatorAbi,
      "0xea22C04BC2aD994F73B7e4d537921a3D0f297B02",
    )
    return CRContract
  }

  async getBalancerBoostInfo(vaultAddress: string, vault: any) {
    const fn = retry({
      fn: this.CRContract.methods.getBalancerBoostInfo(vaultAddress).call,
    }, 'getBalancerBoostInfo')

    const data = await fn().catch(Sentry.captureException)
    const underlyingPrice = vault.tvlUsdc / vault.tvl;

    //@ts-ignore
    const ableToBoost = formatUnits(data.ableToBoost) * underlyingPrice
    console.log('vaultAddress', vault);
    console.log('underlyingPrice', underlyingPrice);
    console.log('ableToBoost', ableToBoost);
    console.log('formatUnits(data.derivedBalanceBoost)', formatUnits(data.derivedBalanceBoost));

    vault.underlyingPrice = underlyingPrice;
    vault.ableToBoost = data.ableToBoost;
    vault.ableToBoostUsd = millifyValue(ableToBoost.toString(), true);
    vault.balancerBoost = (+formatUnits(data.derivedBalanceBoost)).toFixed(2);

    return {
      ableToBoost,
    }
  }

}

export const balancerBoostCalculatorChainStore = new BalancerBoostCalculatorChainStore()
