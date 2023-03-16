import { formatUnits } from '@ethersproject/units'

import { BigNumber } from 'bignumber.js'
import { BigNumberish } from 'ethers'
import { parseUnits } from '@ethersproject/units/lib.esm'

export const validateInput = (value: string) => {
  const numbers = '0123456789'
  let hasDot = false
  const val = Array.from(value)
    .filter((el) => {
      if (el === '.' && !hasDot) {
        hasDot = true
        return true
      }
      return numbers.includes(el)
    })
    .join('')

  return val
}

export const fromInputStr = (value: string) => {
  return formatUnits(parseUnits(value).toString())
}

export const formatInt = (value: number, decimals: number = 18) => {
  return new BigNumber(value ?? 0).toFixed(decimals)
}

export const formatToString = (value: string) => {
  if (value[value.length - 1] === '.') {
    return value
  }

  if (value.includes('.')) {
    const [whole, fractional] = value.split('.')
    if (fractional.length >= 18) {
      const formated = new BigNumber(value ?? 0).toFixed(18)
      return formated
    }
  }

  const formated = new BigNumber(value ?? 0).toFixed()

  if ((value.length > 2 && formated === '0') || formated.length < value.length) {
    return value
  }

  return formated
}

// iss a amount more b amount
export const compareAmount = (a: string, b: string): boolean => {
  const A = new BigNumber(a)
  const B = new BigNumber(b)
  const isAMoreB = A.minus(B).isPositive()
  return isAMoreB
}

export const formatAmout = (value: BigNumberish) => {
  return parseFloat(parseFloat(formatUnits(value, 18)).toFixed(9))
}

export const formatAmount = (value: BigNumberish, decimals: string|BigNumberish) => {
  return parseFloat(parseFloat(formatUnits(value, decimals)).toFixed(9))
}

export const formatUnit = (value: BigNumberish) => {
  // @ts-ignore
  return parseFloat(parseFloat(formatUnits(value, 18)))
}

export const formatAmountUsdc = (value: BigNumberish) => {
  return formatUnits(value, 18).split('.')[0]
}
