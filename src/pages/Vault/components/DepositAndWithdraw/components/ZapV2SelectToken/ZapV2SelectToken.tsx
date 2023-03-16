import { observer } from 'mobx-react'
import { useStores } from '../../../../../../stores/hooks'
import { Row, Col, Select } from 'antd'
import './styles.css'

export const ZapV2SelectToken = observer(() => {
  const { zapV2ChainStore } = useStores()

  /*if (!zapV2ChainStore.useZapContract) {
    return null
  }*/

  return (
    <Select
      className="select-token select-token-for-zapping-v2"
      onChange={(value: string) => {
        zapV2ChainStore.setTokenIn(value)
      }}
      value={zapV2ChainStore.tokenIn}
      // defaultOpen={true}
    >
      {zapV2ChainStore.tokenList.map((el: any) => {
        return (
          <Select.Option value={el.address} key={el.caption}>
              <img className="token-logo" src={el.logo} alt={el.caption} />
              <span className="token-caption">{el.caption}</span>
          </Select.Option>
        )
      })}
    </Select>
  )
})
