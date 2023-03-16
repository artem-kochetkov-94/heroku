import React, { useState, useEffect } from 'react'
import { Promo as PromoUI } from '../../../../components/Promo'
import { useStores } from '../../../../stores/hooks'
import { observer } from 'mobx-react'
import Rinkeby from '../../../../networks/rinkeby.json'
import { Row, Col, Button } from 'antd'
import img1 from '../../../../static/images/new-year/new-year-image-0-0.svg'
import img2 from '../../../../static/images/new-year/new-year-image-0-1.svg'
import img3 from '../../../../static/images/new-year/new-year-image-0-2.svg'
import img4 from '../../../../static/images/new-year/new-year-image-1-0.svg'
import img5 from '../../../../static/images/new-year/new-year-image-1-1.svg'
import img6 from '../../../../static/images/new-year/new-year-image-1-2.svg'
import { useChangeNetwork } from '../../../../hooks/useChangeNetwork'
import { addressesMap } from '../../../../networks/Addresses'

import './styles.css'
import { useMediaQuery } from 'react-responsive'

// const FantomNetworkPromo = () => {
//   // const isTablet720 = useMediaQuery({ query: '(max-width: 720px)' })
//   const isTablet991 = useMediaQuery({ query: '(max-width: 991px)' })
//   const handleChangeNetwork = useChangeNetwork()

//   return (
//     <Row gutter={[20, 6]} align="middle" justify="space-around">
//       <Col style={{ fontSize: isTablet991 ? 18 : 24 }}>
//         We are now live on Fantom
//         <img
//           style={{
//             width: isTablet991 ? 22 : 32,
//             height: isTablet991 ? 22 : 32,
//             borderRadius: '50%',
//             marginLeft: 6,
//           }}
//           // @ts-ignore
//           src={addressesMap.aliases.fantom.config.network.logo}
//           alt=""
//         />
//       </Col>
//       <Col>
//         <Button
//           type="primary"
//           size="small"
//           onClick={() => {
//             // handleChangeNetwork(addressesMap.aliases.fantom.config.network.chainId)
//           }}
//         >
//           Switch to Fantom network
//         </Button>
//       </Col>
//     </Row>
//   )
// }

// const NewYearPromoText = () => {
//   const [show, setShow] = useState(false)
//   const isTablet720 = useMediaQuery({ query: '(max-width: 720px)' })

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setShow(!show)
//     }, 700)

//     return () => {
//       clearInterval(timer)
//     }
//   }, [show])

//   const cn1 = `part ${show ? 'show' : ''}`
//   const cn2 = `part ${!show ? 'show' : ''}`

//   return (
//     <Row justify="space-between" align="middle">
//       <Col>
//         <div className="new-year-image new-year-image-1">
//           <img className="main" src={img1} alt="" />
//           <img className={cn1} src={img2} alt="" />
//           <img className={cn2} src={img3} alt="" />
//         </div>
//       </Col>
//       <Col style={{ fontSize: isTablet720 ? 18 : 22 }}>Merry Christmas and Happy New Year</Col>
//       <Col>
//         <div className="new-year-image new-year-image-2">
//           <img className="main" src={img4} alt="" />
//           <img className={cn2} src={img5} alt="" />
//           <img className={cn1} src={img6} alt="" />
//         </div>
//       </Col>
//     </Row>
//   )
// }

export const Promo = observer(() => {
  const { networkManager, metaMaskStore, promoChainStore } = useStores()

  const btnText = metaMaskStore.walletAddress ? 'Claim' : 'Connect wallet'

  const handleClick = metaMaskStore.walletAddress
    ? () => promoChainStore.claim()
    : () => metaMaskStore.connectMetaMask()

  // if (networkManager.networkId === Rinkeby.networkId) {
  //   return (
  //     <PromoUI
  //       text="Faucet Contract for Rinkeby Tetu mock tokens"
  //       button={{
  //         text: btnText,
  //         onClick: handleClick,
  //       }}
  //       mb={0}
  //     />
  //   )
  // }

  // if (networkManager.isMaticNetwork) {
  //   return <PromoUI className="main-page" text={<FantomNetworkPromo />} mb={0} />
  // }

  return (
    <PromoUI
      className="main-page"
      text="All rewards are paid in xTETU and automatically deposited in the xTETU profit share (PS) pool that compounds TETU as the underlying asset."
      mb={0}
    />
  )
})
