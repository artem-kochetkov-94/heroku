import {makeAutoObservable} from 'mobx'
import {ContractReaderAbi} from '../../abi/ContractReader'
import {metaMaskStore} from '../meta-mask-store'
import {web3Store} from '../web3-store'
import {BigNumber} from 'ethers'
import {UserInfo, VaultInfo} from './types'
import {networkManager} from '../chain-stores/network-manager'
import * as Sentry from '@sentry/react'
import {arrayChunkBySize} from 'array-chunk-split'
import {retry} from '../../utils'

import 'reflect-metadata'
import {calcAmount} from '../../utils/amount'

class ContractReaderChainStore {
  constructor() {
    makeAutoObservable(this)
    import('../views/main-page').then((module: any) => {
      this.mainPageStore = module.mainPageStore
    })
  }

  private readonly metaMaskStore = metaMaskStore
  private readonly web3Store = web3Store
  private readonly networkManager = networkManager
  private mainPageStore = null

  private get CRContract() {
    const CRContract = new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      ContractReaderAbi,
      this.networkManager.contractReaderAddr,
    )
    return CRContract
  }

  async getVaultName(vaultAddress: string) {
    return await retry({
      fn: this.CRContract.methods.vaultName(vaultAddress).call,
    }, 'getVaultName')();
  }

  async getPrice(vaultAddress: string, block?: number) {
    if (!vaultAddress) {
      return BigNumber.from(0)
    }

    // const price = await this.CRContract.methods
    //   .getPrice(vaultAddress)
    //   .call({}, block)
    //   .catch(Sentry.captureException)
    return await retry({
      fn: this.CRContract.methods.getPrice(vaultAddress).call, args: [block]
    }, 'getPrice')();
  }

  async getVaultsInfo() {
    const vaults = await this.getVaults()

    const vaultsRequests = vaults.map((vaultAddr: string) => {
      return retry({fn: this.CRContract.methods.vaultInfo(vaultAddr).call,}, 'getVaultsInfo')()
    })

    const response = await Promise.allSettled(vaultsRequests)

    // @ts-ignore
    const formated = Array.from(response)
      .filter((el: any) => el.status === 'fulfilled')
      .map((el: any) => ({vault: {...el.value}, user: null}))

    return formated
  }

  async getVaultWithUserInfos(walletAddress: string, vaultsAddresses: string[]) {
    // const response = await this.CRContract.methods
    //   .vaultWithUserInfos(walletAddress, vaultsAddresses)
    //   .call()

    let response;

    if(vaultsAddresses.length > 1) {
      response = await retry({fn: this.CRContract.methods.vaultWithUserInfos(walletAddress, vaultsAddresses).call,}, 'getVaultWithUserInfos')()
    }  else {
      const responseUser = await retry({fn: this.CRContract.methods.userInfo(walletAddress, vaultsAddresses[0]).call,}, 'getVaultWithUserInfos')()
      const responseVault = await retry({fn: this.CRContract.methods.vaultInfos(vaultsAddresses).call,}, 'vaultInfos')()

      if(!responseUser || !responseVault) {
        console.log('Error fetch vaultWithUserInfos for ', walletAddress, vaultsAddresses)
        return null;
      }

      response = [{
        user: responseUser,
        vault: responseVault[0],
      }];
    }



    if(!response) {
      console.log('Error fetch vaultWithUserInfos for ', response, walletAddress, vaultsAddresses)
      return null;
    }

    return response.map(({user, vault}: any) => {
      const [
        wallet,
        _vault,
        underlyingBalance,
        underlyingBalanceUsdc,
        depositedUnderlying,
        depositedUnderlyingUsdc,
        depositedShare,
        _rewardTokens,
        rewards,
        rewardsUsdc,
        rewardsBoost,
        rewardsBoostUsdc,
      ] = user

      const userDataMap = {
        wallet,
        vault: _vault,
        underlyingBalance,
        underlyingBalanceUsdc,
        depositedUnderlying,
        depositedUnderlyingUsdc,
        depositedShare,
        rewardTokens: _rewardTokens,
        rewards,
        rewardsUsdc,
        rewardsBoost,
        rewardsBoostUsdc,
      }

      const [
        addr,
        name,
        created,
        active,
        tvl,
        tvlUsdc,
        decimals,
        underlying,
        rewardTokens,
        rewardTokensBal,
        rewardTokensBalUsdc,
        duration,
        rewardsApr,
        ppfsApr,
        users,
        strategy,
        strategyCreated,
        platform,
        assets,
        strategyRewards,
        strategyOnPause,
        earned,
      ] = vault

      const vaultDataMap = {
        addr,
        name,
        created,
        active,
        tvl,
        tvlUsdc,
        decimals,
        underlying,
        rewardTokens,
        rewardTokensBal,
        rewardTokensBalUsdc,
        duration,
        rewardsApr,
        ppfsApr,
        users,
        strategy,
        strategyCreated,
        platform,
        assets,
        strategyRewards,
        strategyOnPause,
        earned,
        networkName: web3Store.getNetworkName()
      }
      return {user: userDataMap, vault: vaultDataMap}
    })
  }

  // async getVaultWithUserInfoPages(page: number = 0, limit: number = 30) {
  //   let response: any
  //
  //   try {
  //     response = await this.CRContract.methods
  //       .vaultWithUserInfoPagesLight(this.metaMaskStore.walletAddress, page, limit) // contract will return maximum vaults
  //       .call()
  //   } catch (error) {
  //     console.error('fetch full vault info failed', error)
  //     // return this.getVaultWithUserInfoPagesOneByOne()
  //   }
  //   return response?.map(({ user, vault }: any) => ({
  //     user: { ...user },
  //     vault: { ...vault },
  //   }))
  // }

  async getVaults(): Promise<string[]> {
    const fn = retry({
      fn: this.CRContract.methods.vaults().call,
    }, 'getVaults')

    const vaults = await fn()

    return vaults
  }

  async getVaultWithUserInfoPagesOneByOne() {
    const vaults = await this.getVaults()

    let calls = []
    const batchSize = 1000 // move to env file
    const results = []

    for (let v of vaults) {
      try {
        const fn = retry({
          fn: this.CRContract.methods.vaultWithUserInfos(this.metaMaskStore.walletAddress, [v])
            .call,
        }, 'getVaultWithUserInfoPagesOneByOne')

        calls.push(fn())
      } catch (error) {
        console.error('fetch vault info failed', v, error)
        // todo handle vault fields one by one
      }

      if (calls.length >= batchSize) {
        results.push(await Promise.all(calls))
        calls = []
      }
    }
    results.push(await Promise.all(calls))

    return results
      .reduce((acc, val) => acc.concat(val), [])
      .map((v) => v[0])
      .map(({user, vault}: any) => {
        return {
          user: {...user},
          vault: {...vault},
        }
      })
  }

  async getUnderlying(vaultAddress: string) {
    const fn = retry({
      fn: this.CRContract.methods.vaultUnderlying(vaultAddress).call,
    }, 'getUnderlying')

    const underlying = await fn().catch(Sentry.captureException)
    return underlying
  }

  async userUnderlyingBalance(userAddress: string, vaultAddress: string): Promise<number> {
    const fn = retry({
      fn: this.CRContract.methods.userUnderlyingBalance(userAddress, vaultAddress).call,
    }, 'userUnderlyingBalance')

    // @ts-ignore
    const response = await fn().catch(Sentry.captureException)
    return response
  }

  async userUnderlyingBalanceUsdc(userAddress: string, vaultAddress: string): Promise<number> {
    const underlying = await this.getUnderlying(vaultAddress)

    const fn = retry({
      fn: this.CRContract.methods.userUnderlyingBalanceUsdc(userAddress, underlying).call,
    }, 'userUnderlyingBalanceUsdc')

    // @ts-ignore
    const response = await fn().catch(Sentry.captureException)
    return response
  }

  async getVaultDecimals(vaultAddress: string) {
    const fn = retry({
      fn: this.CRContract.methods.vaultDecimals(vaultAddress).call,
    }, 'getVaultDecimals')

    const decimals = await fn().catch(Sentry.captureException)
    return decimals
  }

  // @deprecated
  async getVaultRewardsApr(vaultAddress: string): Promise<string[]> {
    const fn = retry({
      fn: this.CRContract.methods.vaultRewardsApr(vaultAddress).call,
    }, 'getVaultRewardsApr')
    const vaultRewardsApr = await fn().catch(Sentry.captureException)
    return vaultRewardsApr
  }

  // @deprecated
  async getVaultPpfsApr(vaultAddress: string, block?: number): Promise<string> {
    const fn = retry({
      fn: async () => {
        return await this.CRContract.methods.vaultPpfsApr(vaultAddress).call({}, block)
      },
    }, 'getVaultPpfsApr')
    const vaultPpfsApr = await fn().catch(Sentry.captureException)
    return vaultPpfsApr
  }

  // @deprecated
  async getVaultApr(vaultAddress: string) {
    const promises = await Promise.allSettled([
      this.getVaultRewardsApr(vaultAddress),
      this.getVaultPpfsApr(vaultAddress),
    ])

    const [rewarsdApr, ppfsApr] = promises.map((el: any) => el.value)
    const rewardsApr = rewarsdApr.reduce((sum: BigNumber, apr: string) => {
      return sum.add(BigNumber.from(apr))
    }, BigNumber.from('0'))

    const sum = BigNumber.from(rewardsApr).add(BigNumber.from(ppfsApr)).toString()
    return sum
  }

  async getVaultInfos(vaultAddresses: string[]) {
    const fn = retry({
      fn: this.CRContract.methods.vaultInfos(vaultAddresses).call,
    }, 'getVaultInfos')

    const response: VaultInfo[] = await fn().catch(Sentry.captureException)

    const formated = response.map((el: any) => {
      const [
        addr,
        name,
        created,
        active,
        tvl,
        tvlUsdc,
        decimals,
        underlying,
        rewardTokens,
        rewardTokensBal,
        rewardTokensBalUsdc,
        duration,
        rewardsApr,
        ppfsApr,
        users,
        // strategy
        strategy,
        strategyCreated,
        platform,
        assets,
        strategyRewards,
        strategyOnPause,
        earned,
      ] = el

      const elMap = {
        addr,
        name,
        created,
        active,
        tvl,
        tvlUsdc,
        decimals,
        underlying,
        rewardTokens,
        rewardTokensBal,
        rewardTokensBalUsdc,
        duration,
        rewardsApr,
        ppfsApr,
        users,
        strategyOnPause,
        earned,
        assets,
        platform,
        strategy: {
          strategy,
          strategyCreated,
          platform,
          assets,
          strategyRewards,
          strategyOnPause,
        },
      }

      return {vault: elMap, user: null}
    })

    return formated
  }

  async getVaultInfo(vaultAddress: string) {
    const fn = retry({
      fn: this.CRContract.methods.vaultInfo(vaultAddress).call,
    }, 'getVaultInfo')

    const response: VaultInfo = await fn().catch(Sentry.captureException)

    const [
      addr,
      name,
      created,
      active,
      tvl,
      tvlUsdc,
      decimals,
      underlying,
      rewardTokens,
      rewardTokensBal,
      rewardTokensBalUsdc,
      duration,
      rewardsApr,
      ppfsApr,
      users,
      // strategy
      strategy,
      strategyCreated,
      platform,
      assets,
      strategyRewards,
      strategyOnPause,
      earned,
    ] = response

    const responseMap = {
      addr,
      name,
      created,
      active,
      tvl,
      tvlUsdc,
      decimals,
      underlying,
      rewardTokens,
      rewardTokensBal,
      rewardTokensBalUsdc,
      duration,
      rewardsApr,
      ppfsApr,
      users,
      strategyOnPause,
      earned,
      platform,
      assets,
      strategy: {
        strategy,
        strategyCreated,
        platform,
        assets,
        strategyRewards,
        strategyOnPause,
      },
    }

    return responseMap
  }

  async getUserInfosLight(walletAdress: string, vaultsAdressess: string[]) {
    const fn = retry({
      fn: this.CRContract.methods.userInfosLight(walletAdress, vaultsAdressess).call,
    }, 'getUserInfosLight')
    const response = await fn()
    return response
  }

  async getUserInfo(walletAddress: string, vaultAddress: string) {
    const fn = retry({
      fn: this.CRContract.methods.userInfo(walletAddress, vaultAddress).call,
    }, 'getUserInfo')
    // const underlyingBalance = await retry({fn: this.CRContract.methods.userUnderlyingBalance(walletAddress, vaultAddress).call,})();
    // const underlyingBalanceUsdc = await retry({fn: this.CRContract.methods.userUnderlyingBalanceUsdc(walletAddress, vaultAddress).call,})();
    // const depositedUnderlying = await retry({fn: this.CRContract.methods.userDepositedUnderlying(walletAddress, vaultAddress).call,})();
    // const depositedUnderlyingUsdc = await retry({fn: this.CRContract.methods.userDepositedUnderlyingUsdc(walletAddress, vaultAddress).call,})();
    // const depositedShare = await retry({fn: this.CRContract.methods.userDepositedShare(walletAddress, vaultAddress).call,})();
    // const rewardTokens = await retry({fn: this.CRContract.methods.vaultRewardTokens(vaultAddress).call,})();
    // const rewards = await retry({fn: this.CRContract.methods.userRewards(walletAddress, vaultAddress).call,})();
    // const rewardsUsdc = await retry({fn: this.CRContract.methods.userRewardsUsdc(walletAddress, vaultAddress).call,})();
    // const rewardsBoost = await retry({fn: this.CRContract.methods.userRewardsBoost(walletAddress, vaultAddress).call,})();
    // const rewardsBoostUsdc = await retry({fn: this.CRContract.methods.userRewardsBoostUsdc(walletAddress, vaultAddress).call,})();

    const response: UserInfo = await fn()
    // .catch(Sentry.captureException)

    const [
      wallet,
      vault,
      underlyingBalance,
      underlyingBalanceUsdc,
      depositedUnderlying,
      depositedUnderlyingUsdc,
      depositedShare,
      rewardTokens,
      rewards,
      rewardsUsdc,
      // @ts-ignore
      rewardsBoost,
      // @ts-ignore
      rewardsBoostUsdc,
    ] = response

    const responseMap = {
      walletAddress,
      vaultAddress,
      underlyingBalance,
      underlyingBalanceUsdc,
      depositedUnderlying,
      depositedUnderlyingUsdc,
      depositedShare,
      rewardTokens,
      rewards,
      rewardsUsdc,
      rewardsBoost,
      rewardsBoostUsdc,
    }

    return responseMap
  }

  async getTetuTokenValues(block?: number) {
    const fn = retry({
      fn: async () => {
        return await this.CRContract.methods.tetuTokenValues().call({}, block)
      },
      defaultValue: [BigNumber.from(0), BigNumber.from(0)]
    }, 'getTetuTokenValues')
    const response = await fn()
    return response
  }

  async getTotalTvlUsdc(addresses: string[], block?: number): Promise<any> {
    // console.log("getTotalTvlUsdc")
    return 0;
    const module = await import('../views/main-page')

    const excludeVaultList = module.mainPageStore.currentNetworkData
      .filter((el: any) => ['12', '29'].includes(el.vault.platform))
      .map((el: any) => el.vault.addr.toLowerCase())

    const filtredVaults = addresses.filter((el: string) => {
      return !excludeVaultList.includes(el.toLowerCase())
    })

    const chanks = arrayChunkBySize(filtredVaults, 10)

    let response: any = []

    try {
      response = await Promise.allSettled(
        chanks.map((chank: string[]) => {
          // console.log('Call vault info', chank)
          return retry({fn: this.CRContract.methods.totalTvlUsdc(chank).call, args: [{block}]}, 'getTotalTvlUsdc')()
          // return this.CRContract.methods.totalTvlUsdc(chank).call({}, block).catch(console.log)
        }, ),
      )
    } catch (err) {
      console.log(err)
    }

    let MAX_RETRY_COUNT = 3

    // @ts-ignore
    const checkAndRetry = async (promiseResult: any, index: number, retryCount: number) => {
      if (promiseResult.status === 'rejected' || promiseResult.value === undefined) {
        console.log('Retrying', retryCount, ' with error', promiseResult)
        if (retryCount > MAX_RETRY_COUNT) {
          return null
        }

        try {
          const [resp] = await Promise.allSettled([
            // this.CRContract.methods.totalTvlUsdc(chanks[index]).call({}, block),
            retry({fn: this.CRContract.methods.totalTvlUsdc(chanks[index]).call, args: [{block}]}, 'getTotalTvlUsdc on block')()
          ])

          return await checkAndRetry(resp, index, retryCount + 1)
        } catch (error) {
          console.log(error)
          return await checkAndRetry({status: 'rejected'}, index, retryCount + 1)
        }
      }

      return promiseResult.value
    }

    const items: any = []

    for (let i = 0; i < chanks.length; i++) {
      // console.log('vault info', response[i], i)
      // @ts-ignore
      const value = await checkAndRetry(response[i], i, 1)
      if (value) {
        items.push(value)
      }
    }
    // console.log('items', items)
    // @ts-ignore
    return calcAmount(items)
  }

  async getStrateges() {
    const fn = retry({
      fn: this.CRContract.methods.strategies().call,
    }, 'getStrateges')

    const response = await fn()
    return response
  }

  async getTotalUsers(vaults: string[], block?: number) {
    const fn = retry({
      fn: async () => {
        return await this.CRContract.methods.totalUsers(vaults).call({}, block)
      },
    }, 'getTotalUsers')
    const response = await fn()
    return response
  }

  async getTotalTetuBoughBack(addresses: string[], block?: number) {
    const chanks = arrayChunkBySize(addresses, 50)

    const response = await Promise.allSettled(
      chanks.map((chank: string[]) => {
        const fn = retry({
          fn: async () => {
            return await this.CRContract.methods.totalTetuBoughBack2(chank).call({}, block)
          },
        }, 'getTotalTetuBoughBack')

        return fn()
      }),
    )

    // @ts-ignore
    return calcAmount(response.map((el: any) => el.value))
  }

  async getVaultTvlUsdc(address: string, block?: number) {
    const fn = retry({
      fn: async () => {
        return await this.CRContract.methods.vaultTvlUsdc(address).call({}, block)
      },
    }, 'getVaultTvlUsdc')
    const response = await fn()
    return response
  }

  async getVaultTvl(address: string, block?: number) {
    const fn = retry({
      fn: async () => {
        return await this.CRContract.methods.vaultTvl(address).call({}, block)
      },
      defaultValue: BigNumber.from(0)
    }, 'getVaultTvl')
    const response = await fn()
    return response
  }

  async getVaultUsers(address: string, block?: number) {
    const fn = retry({
      fn: async () => {
        return await this.CRContract.methods.vaultUsers(address).call({}, block)
      },
    }, 'getVaultUsers')
    const response = await fn()
    return response
  }

  async getComputeRewardApr(vaultAddr: string, tokenAddr: string, block?: number) {
    const fn = retry({
      fn: async () => {
        return await this.CRContract.methods.computeRewardApr(vaultAddr, tokenAddr).call({}, block)
      },
      defaultValue: '0',
    }, 'getComputeRewardApr')
    const response = await fn()
    return response
  }
}

export const contractReaderChainStore = new ContractReaderChainStore()
