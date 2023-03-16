export enum Ways {
  First = 0,
  Second = 1,
  Third = 2,
  Fourth = 3,
}

export type TetuBalLpData = {
  tokenStacked: any
  oppositeToken: any
  oppositeTokenStacked: any
  price: any
  tetuBalPrice: any
  countToBuy: number;
}

export type BalancerLpData = {
  tvl: any
  apr: any
}
