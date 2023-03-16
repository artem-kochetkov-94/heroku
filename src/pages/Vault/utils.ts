import { platformNameMap } from '../../components/VaultRow/VaultRow'
import { networkManager } from '../../stores/chain-stores/network-manager'
import { namesManagerStore } from '../../stores/utils/names-manager-store'
import { formatVaultManageName, getVaultSymbolName } from '../../utils/format'

export const getVaultDescriptionByPlatform = (vault?: any) => {
  if (!vault) {
    return null
  }
  const { platform, addr, network } = vault

  const assets =
    formatVaultManageName(vault?.addr!) ||
    getVaultSymbolName(vault?.addr) ||
    vault?.assets?.map((asset: string) => namesManagerStore.getAssetName(asset)).join('-')

  if (addr && addr?.toLowerCase() === networkManager.addresses.core.PS?.toLowerCase()) {
    return 'Tetu (PS) - Profit Sharing Vault, the profits of the entire platform are distributed to the TETU deposited in this vault.'
  }

  if (addr && addr?.toLowerCase() === networkManager.addresses.vaults.dxTETU?.toLowerCase()) {
    return 'Tetu (dxTETU) - deprecated solution for locking TETU. Please migrate to veTETU. Any Withdraw penalties were disabled.'
  }

  if (addr && addr?.toLowerCase() === networkManager.addresses.vaults.tetuqi?.toLowerCase()) {
    return "tetuQi - Liquid eQi (stake locked Qi), deposit QI into tetuQi vault or buy from tetuQi-Qi LP and tetu will continously lock it forever for max rewards/vote power, giving liquid tetuQi in return. After 10% is sold as performance fee, weekly Qi staking rewards are wrapped as tetuQi and distributed along with TETU rewards. dxTETU holders will control the voting rights that tetuQi's eQi position provides."
  }

  if (addr && addr?.toLowerCase() === networkManager.addresses.vaults.xtetuQi?.toLowerCase()) {
    return 'Earn auto-compound income in tetuQi without any fees or vesting period.'
  }

  if (addr && addr?.toLowerCase() === networkManager.addresses.vaults.meshTetuMesh?.toLowerCase()) {
    return 'You can create MSLP (liquidity tokens) on the MeshSwap.fi page.'
  }

  if (addr && addr?.toLowerCase() === '0xbd06685a0e7ebd7c92fc84274b297791f3997ed3'.toLowerCase()) {
    return 'This vault is a destination of all possible rewards from tetuBAL and tetuBAL-ETH/BAL gauge.'
  }

  if (addr && addr?.toLowerCase() === networkManager.addresses.vaults.tetuBal?.toLowerCase()) {
    return 'You can create B-80BAL-20WETH (LP tokens) on the Balancer.fi page'
  }

  if (addr && addr?.toLowerCase() === '0xa8fab27b7d41ff354f0034addc2d6a53b5e31356'.toLowerCase()) {
    return 'Strategy wrap 92% of the profit to xbb-am-usd vault and provide it as rewards for this vault.'
  }

  if (network && network === 'ETH' && platform && platform === '36' && addr && addr?.toLowerCase() !== networkManager.addresses.vaults.balTetuBal?.toLowerCase()) {
    return 'Strategy deposit BPT to Balancer gauge with a boost from tetuBAL. Periodically autocompound the profit to the underlying asset.'
  }

  if (platform === '14') {
    return `AAVE - This vault uses a folding strategy that Supplies and borrows ${assets} on AAVE simultaneously to earn rewards. Earned rewards are harvested, sold for tetu and bought back to be distributed to the users`
  }

  if (platform === '29') {
    return `This vault is deposit assets to similar Tetu vault and claim periodically rewards for autocompound to the underlying asset. APR suppose to be ~70% of the linked Tetu vault but can fluctuate.`
  }

  // if (platform === '15') {
  //   return 'AAVE MAI BAL (AMB) - This is a complex strategy, in a simplified way it supplies assets on aave in order to create a vault on qi-dao to borrow mai and deposit on balancer to farm rewards. Rewards are harvested once a week and sold to buyback tetu'
  // }

  if (platform === '7') {
    if (networkManager.isMaticNetwork) {
      return 'Curve - This vault has 99% autocompound, 1% of fees are used to buyback tetu from the market'
    }
    // if (networkManager.isFantomNetwork) {
    //   return 'Curve - This vault has 99% autocompound, 1% of fees are used to buyback tetu from the market and distribute it to the PS(profit sharing) vault'
    // }
  }
  if (platform === '8') {
    const WETH_DINO = '0xff0c285e1b6b8e7da72950d7879b2d06ea084445'.toLowerCase()
    const USDC_DINO = '0x598f3647a586be31fb9a6942c1f18ed44d5f8b0d'.toLowerCase()
    if (addr && [WETH_DINO, USDC_DINO].includes(addr.toLowerCase())) {
      return 'Dino - 99% compound vault , 1% of  fees are used to buyback tetu'
    }
  }
  if (platform === '5') {
    return 'Iron Swap - This vault works in a classic way, following the current PS ratio'
  }
  if (platform === '19') {
    return 'Klima – Strategy deposits klima into KlimaDAO and sells rebase for tetu'
  }
  if (platform === '2') {
    return 'Quickswap - This vault has 99% autocompound, 1% of fees are used to buyback tetu from the market'
  }
  if (platform === '3') {
    return 'Sushi Swap - This vault has 99% autocompound, 1% of fees are used to buyback tetu from the market and distribute it to the PS(profit sharing) vault'
  }
  if (platform === '12') {
    return 'Tetu Swap - TetuSwap Strategies deposit LP assets into Tetu yield farming vaults and earns rewards for users . When a swap occours , its withdraws the sufficient amount of assets to execute the swap'
  }
  if (platform === '20') {
    return 'VESQ – Deposits VSQ into VESQ and sells rebase for tetu'
  }
  if (platform === '18') {
    return `SCREAM - This vault uses a folding strategy that Supplies and borrows ${assets} on SCREAM simultaneously to earn rewards. Earned rewards are harvested, sold for more ${assets} and deposits it into the strategy.this vault has 90% auto-compound and 10% fees is used to buyback tetu and build protocol owned liquidity`
  }
  if (platform === '13') {
    return 'Spooky Swap - This vault has 99% autocompound, 1% of fees are used to buyback tetu from the market'
  }

  // if (platform === '') {
  //     return ''
  // }
  // if (platform === '') {
  //     return ''
  // }
  // if (platform === '') {
  //     return ''
  // }
  // if (platform === '') {
  //     return ''
  // }
  // if (platform === '') {
  //     return ''
  // }

  return null
}
