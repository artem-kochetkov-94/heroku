import React, { useEffect, useState } from 'react'
import { useStores } from '../../../../stores/hooks/useStores'
import { observer } from 'mobx-react'
import { Table, Row, Spin, Col } from 'antd'
import moment from 'moment'
import { Amount } from '../../../../components/Amount/Amount'
// import LinkIcon from '../../../../static/link.svg'
import LinkIcon from '../../../../static/arrow-link.svg'
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'
import './style.css'

const antIcon = <LoadingOutlined style={{ fontSize: 60, marginLeft: 6 }} spin />

export const HardWorks = observer(() => {
  const [data, setData] = useState<any>(null)
  const { vaultDataPageStore, userInfoOfVaultStore, vaultChainStore, networkManager } = useStores()
  const vault = vaultDataPageStore.data
  const userInfo = userInfoOfVaultStore.value

  useEffect(() => {
    if (!vaultDataPageStore.isLoading && vault?.addr) {
      vaultChainStore.getHardWorks(vault.addr).then((res: any) => {
        setData(res)
      })
    }
  }, [vaultDataPageStore.isLoading, vault?.addr])

  const formatAddress = (address: string) => {
    return address.substr(0, 6) + '...' + address.substr(address.length - 4)
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'blockTimeStamp',
      key: 'blockTimeStamp',
      width: '25%',
      render: (value: any) => {
        let leftPart = moment(new Date(value * 1000).toString()).format('DD MMM YYYY')
        let rightPart = moment(new Date(value * 1000).toString()).format('HH:mm')

        return (
          <Row gutter={8}>
            <Col>
              <span style={{ color: '#fff' }}>{leftPart}</span>
            </Col>
            <Col>
              <span style={{ color: '#7C8CA5' }}>{rightPart}</span>
            </Col>
          </Row>
        )
      },
    },
    {
      title: 'Block number',
      dataIndex: 'blockNumber',
      width: '25%',
      key: 'blockNumber',
    },
    {
      title: 'Tetu BoughtBack',
      dataIndex: 'amount',
      key: 'amount',
      width: '25%',
      render: (amount: string) => {
        return (
          <Amount
            value={amount + ''}
            showTooltip
            style={{ display: 'inline-block' }}
            standartWidth
          />
        )
      },
    },
    {
      title: 'Transaction hash',
      dataIndex: 'transactionHash',
      key: 'transactionHash',
      width: '25%',
      render: (hash: string) => {
        const url = `${networkManager.network.blockExplorerUrls?.[0]!}tx/${hash}`
        return (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-flex', width: 110 }}
          >
            <Row justify="space-between" wrap={false} style={{ width: '100%' }}>
              <Col>{formatAddress(hash)}</Col>
              <Col>
                <img src={LinkIcon} alt="" style={{ marginLeft: 7, marginBottom: 3 }} />
              </Col>
            </Row>
          </a>
        )
      },
    },
  ]

  if (data === null) {
    return (
      <Row justify="center">
        <Spin indicator={antIcon} />
      </Row>
    )
  }

  return (
    <div className="app-paper vault-info show-header hard-works">
      {data && (
        <Table
          columns={columns}
          dataSource={data.sort((a: any, b: any) => {
            return b.blockTimeStamp - a.blockTimeStamp
          })}
          size="large"
          pagination={{ pageSize: 12, showSizeChanger: false }}
        />
      )}
    </div>
  )
})
