import { observer } from 'mobx-react'
import React from 'react'
import { Amount } from '../../../components/Amount'
import { getAssetsIconMap } from '../../../static/tokens'
import unknownIcon from '../../../static/UNKNOWN.png'
import { useStores } from '../../../stores/hooks'
import { useForceUpdate } from '../../../hooks'

type RewardsIconsMap = {
  rewardTokens: string[]
}

export const RewardsIcon: React.FC<RewardsIconsMap> = observer((props) => {
  const forceUpdate = useForceUpdate()
  const { rewardTokens } = props
  const { namesManagerStore } = useStores()

  if (rewardTokens.length === 0) {
    return <div>-</div>
  }

  const renderList = (tokens: string[]) => {
    return tokens?.map((token: string, index: number) => {
      const name = namesManagerStore.getAssetName(token)

      if (name === null) {
        setTimeout(forceUpdate, 1000)
      }

      return (
        <div className="rewards-icons-list-item">
          <Amount
            address={token}
            // @ts-ignore
            style={{ display: 'inline-block' }}
            key={token}
          >
            <div style={{ display: 'inline-block' }}>
              <img
                style={{ height: 20 }}
                // @ts-ignore
                src={getAssetsIconMap()?.[name] ?? unknownIcon}
                alt={name}
              />{' '}
            </div>
          </Amount>
        </div>
      )
    })
  }

  // TODO: implement a design with a large number of icons
  return <div className="rewards-icons-list">{renderList(rewardTokens)}</div>
})
