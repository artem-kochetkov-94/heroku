import {contractReaderChainStore} from './contact-reader-store'
import {makeAutoObservable} from 'mobx'
import {web3Store} from '../web3-store'
import {VaultAbi} from '../../abi/Vault'
import {metaMaskStore} from '../meta-mask-store'
import {utils} from 'ethers'
import {retry} from '../../utils'
import {tetuServerResources} from '../../api/tetu-server'
import {networkManager} from './network-manager'
import axios from 'axios'

class VaultChainStore {
  constructor() {
    makeAutoObservable(this)
  }

  private readonly metaMaskStore = metaMaskStore
  private readonly web3Store = web3Store
  private readonly contractReaderChainStore = contractReaderChainStore
  private readonly networkManager = networkManager

  async getHardWorks(vaultAddr: string) {
    const response = await axios.get(
      tetuServerResources.earned +
      `${this.networkManager.network.other.urlParam}&vault=${vaultAddr}`,
    )
    return response.data
  }

  async depositAndInvest(vaultAddress: string, amount: number) {
    const decimals = await this.contractReaderChainStore.getVaultDecimals(vaultAddress)

    // @ts-ignore
    const amoutBigInt = utils.parseUnits(amount.toString(), decimals).toString()
    const depositAndInvestAbi = VaultAbi.find(
      (el) => el.type === 'function' && el.name === 'depositAndInvest',
    )

    // @ts-ignore
    const data = this.web3Store.web3.eth.abi.encodeFunctionCall(depositAndInvestAbi, [amoutBigInt])

    const transactionHash = await this.web3Store.sendTransaction({
      from: this.metaMaskStore.walletAddress!,
      to: vaultAddress,
      data,
      // gasPrice,
    })

    if (transactionHash) {
      return transactionHash
    }

    // const txHash = await window.ethereum
    // .request({
    // method: 'eth_sendTransaction',
    // params: [
    // {
    // from: this.metaMaskStore.walletAddress,
    // to: vaultAddress,
    // data,
    // gasPrice,
    // },
    // ],
    // })
    // .catch(console.log)

    // return txHash
  }

  async getPeriodFinishForToken(vaultAddress: string, tokes: string[]) {
    // @ts-ignore
    const vaultContract = new this.web3Store.web3.eth.Contract(VaultAbi, vaultAddress)

    const response = await Promise.allSettled(
      tokes.map((token) => {
        return retry({fn: vaultContract.methods.periodFinishForToken(token).call,}, 'getPeriodFinishForToken')()
      }),
    )

    return response.map((el: any) => el.value)
  }

  async balanceOf(vaultAddress: string, walletAddress: string) {
    // @ts-ignore
    const vaultContract = new this.web3Store.web3.eth.Contract(VaultAbi, vaultAddress)
    const response = await vaultContract.methods.balanceOf(walletAddress).call()
    return response
  }

  async getPricePerFullShare(vaultAddress: string, block?: number) {
    // @ts-ignore
    const vaultContract = new this.web3Store.web3.eth.Contract(VaultAbi, vaultAddress)
    const fn = retry({
      fn: async () => {
        return await vaultContract.methods.getPricePerFullShare().call({}, block)
      },
      defaultValue: '0',
    }, 'getPricePerFullShare')

    const response = await fn()
    return response
  }

  async withdraw(vaultAddress: string, amount: number) {
    const decimals = await this.contractReaderChainStore.getVaultDecimals(vaultAddress)
    // @ts-ignore
    const withdrawAbi = VaultAbi.find((el) => el.type === 'function' && el.name === 'withdraw')
    const amoutBigInt = utils.parseUnits(amount.toString(), decimals).toString()

    // @ts-ignore
    const data = this.web3Store.web3.eth.abi.encodeFunctionCall(withdrawAbi, [amoutBigInt])

    const transactionHash = await this.web3Store.sendTransaction({
      from: this.metaMaskStore.walletAddress!,
      to: vaultAddress,
      data,
      // gasPrice,
    })

    if (transactionHash) {
      return transactionHash
    }

    // const txHash = await window.ethereum
    // .request({
    // method: 'eth_sendTransaction',
    // params: [
    // {
    // from: this.metaMaskStore.walletAddress,
    // to: vaultAddress,
    // data,
    // gasPrice,
    // },
    // ],
    // })
    // .catch(console.log)

    // return txHash
  }

  async getAllRewards(vaultAddress: string) {
    const getAllRewardsAbi = VaultAbi.find(
      (el) => el.type === 'function' && el.name === 'getAllRewards',
    )
    // @ts-ignore
    const data = this.web3Store.web3.eth.abi.encodeFunctionCall(getAllRewardsAbi, [])

    const transactionHash = await this.web3Store.sendTransaction({
      from: this.metaMaskStore.walletAddress!,
      to: vaultAddress,
      data,
      // gasPrice,
    })

    if (transactionHash) {
      return transactionHash
    }

    // const txHash = await window.ethereum
    // .request({
    // method: 'eth_sendTransaction',
    // params: [
    // {
    // from: this.metaMaskStore.walletAddress,
    // to: vaultAddress,
    // data,
    // gasPrice,
    // },
    // ],
    // })
    // .catch(console.log)
    // return txHash
  }

  async exit(vaultAddress: string) {
    const exitAbi = VaultAbi.find((el) => el.type === 'function' && el.name === 'exit')
    // @ts-ignore
    const data = this.web3Store.web3.eth.abi.encodeFunctionCall(exitAbi, [])

    const transactionHash = await this.web3Store
      .sendTransaction({
        from: this.metaMaskStore.walletAddress!,
        to: vaultAddress,
        data,
        // gasPrice,
      })
      .catch(console.log)

    if (transactionHash) {
      return transactionHash
    }

    // const txHash = await window.ethereum
    //   .request({
    //     method: 'eth_sendTransaction',
    //     params: [
    //       {
    //         from: this.metaMaskStore.walletAddress,
    //         to: vaultAddress,
    //         data,
    //         gasPrice,
    //       },
    //     ],
    //   })
    //   .catch(console.log)
    //
    // return txHash
  }

  async getUserLockTs(vaultAddress: string, walletAddress: string) {
    const contract = new this.web3Store.web3.eth.Contract(
      // @ts-ignore
      VaultAbi,
      vaultAddress,
    )

    const lockAllowed = await contract.methods.lockAllowed().call()
    if (lockAllowed) {
      return await contract.methods.userLockTs(walletAddress).call()
    } else {
      return 0;
    }
  }
}

export const vaultChainStore = new VaultChainStore()
