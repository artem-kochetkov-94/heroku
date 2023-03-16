import { makeAutoObservable } from 'mobx'
import { FetchResource } from '../core'
import { tetuServerResources } from '../../api/tetu-server'
import axios from 'axios'
import { web3Store } from '../web3-store'

class VaultService {
  constructor() {
    makeAutoObservable(this)
  }

  async getVaultInfos(url: string) {
    const response: any = await axios.get(url)

    const formated = response.data.map((el: any) => {
      const {
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
        buyBackRatio,
        ...rest
      } = el

      const elMap = {
        networkName: web3Store.getNetworkName(),
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
        buyBackRatio,
        strategy: {
          strategy,
          strategyCreated,
          platform,
          assets,
          strategyRewards,
          strategyOnPause,
        },
        ...rest,
      }

      return { vault: elMap, user: null }
    })

    return formated
  }

  async getVaultInfosSeveral(urls: string[]) {
    var _results: any[] = await Promise.all(urls.map(async (url): Promise<any> => {
      const result = await axios.get(url);
      return result.data;
    }));

    const results = _results.flat();

    const formated = results.map((el: any) => {
      const {
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
        buyBackRatio,
        ...rest
      } = el

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
        buyBackRatio,
        strategy: {
          strategy,
          strategyCreated,
          platform,
          assets,
          strategyRewards,
          strategyOnPause,
        },
        ...rest,
      }

      return { vault: elMap, user: null }
    })

    return formated
  }
}

export const vaultService = new VaultService()

// resource stores
class VaultInfosFromTetuReaderServer extends FetchResource<any> {
  constructor() {
    super((params: string | string[]) => {
      if (typeof params === 'string') {
        return vaultService.getVaultInfos(params)
      }

      return vaultService.getVaultInfosSeveral(params);
    })
  }
}

export const vaultInfosFromTetuReaderServer = new VaultInfosFromTetuReaderServer()
