import React from 'react'
import { iconMap } from './constants'
import './styles.css'

type IconProps = {
  name: keyof typeof iconMap
  width?: number
  height?: number
  style?: any
  className?: any
}

export const Icon: React.FC<IconProps> = (props) => {
  const { width = 16, height = 16, name, style, className } = props

  return (
    <div
      className={className ? `${className} tetu-ui-Icon` : 'tetu-ui-Icon'}
      style={{ width, height, ...style }}
    >
      <img src={iconMap[name]} alt="" />
    </div>
  )
}
