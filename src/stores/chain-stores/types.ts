import { TransactionReceipt } from "@alch/alchemy-web3"

export enum TokenTransactionType {
  approveDeposit = 'Approve deposit',
  deposit = 'Deposit',
  withdraw = 'Withdraw',
  withdrawAllAndClaim = 'Withdraw all and claim',
  claim = 'Claim',
  // strategy splitter
  withdrawRequest = 'Withdraw request',
  withdrawProcess = 'Withdraw process',
}

export enum TokenZapTransactionType {
  approveDepositZap = 'Approve deposit zap',
  approveWithdrawZap = 'Approve withdraw zap',
  depositZap = 'Deposit zap',
  withdrawZap = 'Withdraw zap',

  withdrawAllAndClaimZap = 'Withdraw all and claim zap',
  claimZap = 'Claim zap',
}

export type TxChache = {
  txHash: string
  txType: TokenTransactionType | TokenZapTransactionType
  vaultAddress: string
}

export type TxHistoryChache = {
  txHash: string
  txType: TokenTransactionType | TokenZapTransactionType
  vaultAddress: string
  data?: TransactionReceipt
  date: string;
}

export type VaultInfo = [
  string, // address addr;
  string, // string name;
  string, // uint256 created;
  boolean, // bool active;
  string, // uint256 tvl;
  string, // uint256 tvlUsdc;
  string, // uint256 decimals;
  string, // string // address underlying;
  string[], // address[] rewardTokens;
  string[], // uint256[] rewardTokensBal;
  string[], // uint256[] rewardTokensBalUsdc;
  string, // uint256 duration;
  string[], // uint256[] rewardsApr;
  string, // uint256 ppfsApr
  string, // uint256 earned

  // strategy
  string, // address strategy;
  string, // uint256 strategyCreated;
  string, // string platform;
  string[], // address[] assets;
  string[], // address[] strategyRewards;
  boolean, // bool strategyOnPause;
  string, // uint256 earned
]

export type UserInfo = [
  string, // { internalType: 'address', name: 'wallet', type: 'address' },
  string, // { internalType: 'address', name: 'vault', type: 'address' },
  string, // { internalType: 'uint256', name: 'underlyingBalance', type: 'uint256' },
  string, // { internalType: 'uint256', name: 'underlyingBalanceUsdc', type: 'uint256' },
  string, // { internalType: 'uint256', name: 'depositedUnderlying', type: 'uint256' },
  string, // { internalType: 'uint256', name: 'depositedUnderlyingUsdc', type: 'uint256' },
  string, // { internalType: 'uint256', name: 'depositedShare', type: 'uint256' },
  // string, // { internalType: 'uint256', name: 'depositedShareUsdc', type: 'uint256' },
  string[], // { internalType: 'address[]', name: 'rewardTokens', type: 'address[]' },
  string[], // { internalType: 'uint256[]', name: 'rewards', type: 'uint256[]' },
  string[], // { internalType: 'uint256[]', name: 'rewardsUsdc', type: 'uint256[]' },
]
