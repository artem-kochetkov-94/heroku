import { observer } from 'mobx-react'
import { useStores } from '../../../../../../stores/hooks'
import { Row, Col, Select } from 'antd'
import './styles.css'

export const ZapSelectToken = observer(() => {
  const { zapChainStore } = useStores()

  if (!zapChainStore.useZapContract) {
    return null
  }

  return (
    <Select
      className="select-token select-token-for-zapping"
      onChange={(value: string) => {
        zapChainStore.setTokenIn(value)
      }}
      value={zapChainStore.tokenIn}
    >
      {zapChainStore.tokenList.map((el: any) => {
        return (
          <Select.Option value={el.address} key={el.caption}>
            {el.caption}
          </Select.Option>
        )
      })}
    </Select>
  )
})
