import React from 'react'
import './styles.css'
import { formatUnits } from 'ethers/lib/utils'
import cn from 'classnames'
import { addSpace, millifyValue } from '../../utils'

export type AmountDailyProps = {
  formated?: boolean
  caption?: string
  currentValue: string | number
  valueOf24Hour: string | number
  prefix?: string
}

export const AmountDaily: React.FC<AmountDailyProps> = (props: any) => {
  const { caption, currentValue, valueOf24Hour, formated, prefix } = props

  const format = (value: number, isFormated: boolean) => {
    if (Number.isNaN(value)) {
      return ''
    }

    const float = parseFloat(parseFloat(String(value)).toFixed(2))

    return float
  }

  if (
    currentValue == undefined ||
    valueOf24Hour == undefined ||
    Number.isNaN(valueOf24Hour) ||
    valueOf24Hour === 'NaN'
  ) {
    if (currentValue != undefined) {
      const current = formated ? currentValue : formatUnits(currentValue)

      return (
        <div className="amount-daily">
          {caption && <div className="caption">{caption}</div>}
          <div className="wrapper">
            <div>
              <div className="current-value">
                {prefix}
                {addSpace(format(current, formated) + '')}
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const current = formated ? currentValue : formatUnits(currentValue)
  const valueOf24 = formated ? valueOf24Hour : formatUnits(valueOf24Hour)

  const diffValue = current - valueOf24
  const percent = (diffValue / valueOf24) * 100
  const isUp = Math.sign(diffValue) === 1
  const isDown = Math.sign(diffValue) === -1
  const hasNotChanged = Math.sign(diffValue) === 0

  return (
    <div className="amount-daily">
      <div className="caption">{caption}</div>
      <div className="wrapper">
        <div>
          <div className="current-value">
            {prefix}
            {addSpace(format(current, formated) + '')}
          </div>
          <div className="hour-diff">
            <div className="label">24h</div>
            <div className="diff-value">{millifyValue(diffValue + '', true)}</div>
            <div
              className={cn('diff-percent', {
                up: isUp,
                down: isDown,
                notChanged: hasNotChanged,
              })}
            >
              % {format(percent, formated)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
