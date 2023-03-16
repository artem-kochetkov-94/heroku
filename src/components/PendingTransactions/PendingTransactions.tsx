import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useStores } from '../../stores/hooks'
import { Modal, Button, Row, Col } from 'antd'
import { formatAdress } from '../../utils/format'
import LinkIcon from '../../static/link.svg'
import { LogoutOutlined, ArrowUpOutlined, BlockOutlined, CheckOutlined } from '@ant-design/icons'
import ExitIcon from '../../static/exit.svg'
import './styles.css'

import PendingImg from '../../static/pending.svg'
import SuccessImg from '../../static/success.svg'
import ErrorImg from '../../static/error.svg'
import { TxHistoryChache } from '../../stores/chain-stores/types'
import dayjs from 'dayjs'

type PendingTransactionsProps = {
  visible: boolean
  onClose(): void
}

export const PendingTransactions: React.FC<PendingTransactionsProps> = observer((props) => {
  const { tokenChainStore, txHistoryStore, networkManager, metaMaskStore, zapChainStore } =
    useStores()
  const { visible, onClose } = props
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    txHistoryStore.startPoolingCheckPendingTransactions()

    return () => {
      txHistoryStore.stopPoolingCheckPendingTransactions()
    }
  }, [txHistoryStore])

  const list: TxHistoryChache[] | [] = Object.values(txHistoryStore.data)

  const listSorted = list.sort((a, b) => {
    return +new Date(b.date) - +new Date(a.date)
  })

  const clearAll = () => {
    txHistoryStore.clearHistory()
    tokenChainStore.clearPendingTranscations()
    zapChainStore.clearPendingTranscations()
  }

  const handleClickCopy = (e: any, text: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text ?? '')
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  const deleteItem = (tx: string) => {
    txHistoryStore.removeTx(tx)
    tokenChainStore.removeTx(tx)
    zapChainStore.removeTx(tx)
  }

  return (
    <Modal
      title="Account"
      centered
      visible={visible}
      width={720}
      footer={null}
      onCancel={() => {
        onClose()
      }}
      className="transaction-modal-wrapper"
    >
      <div className="account-modal">
        <Row justify="space-between" align="middle">
          <Col style={{ fontSize: 18 }}>
            {/* <span className="user-address">
              <UserSwitchOutlined />
            </span> */}
            <div className="ant-modal-account-address">
              {formatAdress(metaMaskStore.walletAddress)}
            </div>
          </Col>
          <Col>
            <Row gutter={8}>
              <Col>
                {!copied ? (
                  <button
                    className="ant-modal-account-button ant-modal-account-copy"
                    onClick={(e) => handleClickCopy(e, metaMaskStore.walletAddress)}
                  >
                    <BlockOutlined />
                  </button>
                ) : (
                  <button
                    className="ant-modal-account-button ant-modal-account-copied"
                    onClick={(e) => handleClickCopy(e, metaMaskStore.walletAddress)}
                  >
                    <CheckOutlined />
                  </button>
                )}
              </Col>
              <Col>
                <a
                  href={`${networkManager.network?.blockExplorerUrls?.[0]}/address/${metaMaskStore.walletAddress}`}
                  className="ant-modal-account-button ant-modal-account-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ArrowUpOutlined />
                </a>
              </Col>
              <Col>
                <button
                  className="ant-modal-account-button ant-modal-account-exit"
                  onClick={() => {
                    metaMaskStore.disconnect()
                    onClose()
                  }}
                >
                  <img src={ExitIcon} height="20px" />
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div className="transactions-modal">
        {listSorted.length === 0 ? (
          <p className="transactions-modal-title">Your transactions will appear here...</p>
        ) : (
          <div className="transactions-modal-content">
            <div className="transactions-modal-content-header">
              <Row justify="space-between" align="middle">
                <Col>
                  <div className="transaction-title">Transactions</div>
                </Col>
                <Col>
                  <button onClick={clearAll} className="trasactions-clear-all">
                    Clear all
                  </button>
                </Col>
              </Row>
            </div>

            {/* <div className="transaction-header">
              <Row justify="space-between">
                <Col span={8}>
                  <div>Operation</div>
                </Col>
                <Col span={10}>
                  <div>Hash</div>
                </Col>
                <Col span={6}>
                  <div>Status</div>
                </Col>
              </Row>
            </div> */}

            {listSorted.map((el: any, index: number) => {
              return (
                <div key={index} className="transaction-item">
                  <Row align="middle" gutter={25}>
                    <Col flex={1}>
                      <div className="transaction-item-name">{el.txType}</div>
                    </Col>
                    <Col>
                      <div>
                        <a
                          href={`${networkManager.network.blockExplorerUrls?.[0]}/tx/${el.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ArrowUpOutlined style={{ transform: 'rotate(45deg)', fontSize: 16 }} />
                          {/* <img src={LinkIcon} alt="" className="icon-link" /> */}
                          {/* {formatAdress(el.txHash)} */}
                        </a>
                      </div>
                    </Col>
                    <Col>
                      <div className="transaction-item-date">
                        {dayjs(el.date).format('DD.MM.YYYY')}
                      </div>
                    </Col>
                    <Col>
                      <div className="transaction-item-status">
                        {!el.data && <img src={PendingImg} />}
                        {el.data?.status === true && <img src={SuccessImg} />}
                        {el.data?.status === false && <img src={ErrorImg} />}
                      </div>
                    </Col>
                    <Col>
                      <div
                        className="transaction-item-delete"
                        onClick={() => deleteItem(el.txHash)}
                      ></div>
                    </Col>
                  </Row>
                </div>
              )
            })}
            {/* <div className="transaction-footer">
              <Row justify="end">
                
              </Row>
            </div> */}
          </div>
        )}
      </div>
    </Modal>
  )
})

/* <div className="transaction-item">
  <Row>
    <Col span={8}>
      <div>Аавыавыаываыв</div>
    </Col>
    <Col span={10}>
      <div>
        <a
          href={`${networkManager.network.blockExplorerUrls?.[0]}/tx/`}
          target="_blank"
          rel="noreferrer"
        >
          <img src={LinkIcon} alt="" className="icon-link" />
          123
        </a>
      </div>
    </Col>
    <Col span={6}>
      <div>pending...</div>
    </Col>
  </Row>
</div> */
