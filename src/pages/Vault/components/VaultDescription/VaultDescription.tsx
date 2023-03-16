import React from 'react'
import { Promo } from '../../../../components/Promo'
import { useParams } from 'react-router-dom'
import { addressesMap } from '../../../../networks/Addresses'
import { useCheckProtectionMode } from '../hooks'
import { AAVE_MAI_BAL_VAULTS_MATIC } from '../../hooks'

export const descriptionMap = {
  // dxTETU
  // [addressesMap.aliases.matic.config.addresses.vaults.dxTETU.toLowerCase()]: (
  //   <>
  //     <p style={{ marginBottom: 10 }}>
  //       <b style={{ color: '#f16868' }}>Caution:</b> dxTETU has an early withdraw penalty that
  //       scales linearly from 50% at the start to 0% at the end of the 90 day locking period.
  //       <br />
  //       Depositing additional funds or claiming rewards without withdrawing will not reset lock.
  //       <br />
  //       This penalty is not reversable and distributed to remaining dxTETU depositors.
  //       <a
  //         style={{ marginLeft: 6 }}
  //         href="https://docs.tetu.io/tetu-io/diamond-vault-dxtetu"
  //         target="_blank"
  //       >
  //         Read more
  //       </a>
  //       .<br />
  //     </p>
  //     <p style={{ marginBottom: 0 }}>
  //       Total dxTETU received from early withdraw = (Total Locked dxTETU / 2) + [(Days Locked / 90
  //       Days) * (Total Locked dxTETU / 2)]
  //     </p>
  //     {/*
  //     <p style={{ marginBottom: 0 }}>
  //       <span style={{ marginLeft: 6, color: '#f16868' }}>
  //         Warning! Any funds deposited into the dxTETU are locked for 90 days. While you will be
  //         able to withdraw funds prior to the 90-day lock period expiring, you will only receive 50%
  //         of your deposited funds plus (50% of remaining funds) multiplied by (days since first
  //         deposit or last withdrawal divided by 90 days). Any early withdrawal will lead to an
  //         automatic loss of at least part of your funds. The only way to avoid not losing any
  //         deposited funds is to wait the full 90-day lock period
  //       </span>
  //       <a
  //         style={{ marginLeft: 6 }}
  //         href="https://docs.tetu.io/tetu-io/diamond-vault-dxtetu"
  //         target="_blank"
  //       >
  //         More info.
  //       </a>
  //     </p>
  //     <br />
  //     <p style={{ marginBottom: 0 }}>
  //       Depositing additional funds will not reset the lock duration countdown.
  //     </p>
  //     */}
  //   </>
  // ),
  //  @ts-ignore
  [addressesMap.aliases.matic.config.addresses.vaults.tetuqi.toLowerCase()]: (
    <>
      <p style={{ marginBottom: 0 }}>
        Lock QI tokens permanently, receive QI airdrop rewards wrapped in tetuQi and bonus TETU
        rewards,
      </p>
      <p style={{ marginBottom: 0 }}>
        support Tetu's voting power in QiDao increasing the rewards distributed to the Tetu
        platform.
      </p>
    </>
  ),
  // @ts-ignore
  [addressesMap.aliases.matic.config.addresses.vaults.tetuBal.toLowerCase()]: (
    <>
      <p style={{ marginBottom: 0 }}>
        Lock BAL-ETH LP permanently, receive veBAL airdrop rewards wrapped in tetuBAL and bonus TETU
        rewards.
      </p>
    </>
  ),
  // @ts-ignore
  [addressesMap.aliases.matic.config.addresses.vaults.tetuMesh.toLowerCase()]: (
    <>
      <p style={{ marginBottom: 0 }}>
        Lock MESH tokens permanently, receive tetuMESH in a 1:1 ratio.
        {/*  Lock MESH tokens permanently, receive veMESH rewards wrapped in tetuMESH and bonus TETU rewards.*/}
      </p>
    </>
  ),
  //  @ts-ignore
  [addressesMap.aliases.matic.config.addresses.vaults.xtetuQi.toLowerCase()]: (
    <>
      <p style={{ marginBottom: 0 }}>
        Earn income in auto-compound with tetuQi tokens without any fees or vesting period.
      </p>
      <p style={{ marginBottom: 0 }}>
        TetuQi vault rewards will not stack with xTetuQi auto-compound income. You can only receive
        rewards/income from one vault.
      </p>
    </>
  ),
  //  @ts-ignore
  [addressesMap.aliases.matic.config.addresses.vaults.xtetuQi_QI.toLowerCase()]: (
    <>
      <p style={{ marginBottom: 0 }}>
        Provide liquidity and earn income through trading fees and TETU rewards,
      </p>
      <p style={{ marginBottom: 0 }}>
        50% of LP is automatically deposited into xtetuQi auto-compounding vault.
      </p>
    </>
  ),
  //  @ts-ignore
  ['0xfe700d523094cc6c673d78f1446ae0743c89586e'.toLowerCase()]: (
    <>
      <p style={{ marginBottom: 0 }}>
        Lock BAL-ETH LP permanently.
      </p>
    </>
  ),
  //  @ts-ignore
  ['0x8a571137da0d66c2528da3a83f097fba10d28540'.toLowerCase()]: (
    <>
      <p style={{ marginBottom: 0 }}>
        Provide liquidity and earn boosted auto-compounded income
      </p>
    </>
  ),
}

const defaultDescription = (
  <>
    <p style={{ marginBottom: 0 }}>
      Partially depositing or withdrawing will not reset the reward boost countdown.
    </p>
    <p style={{ marginBottom: 0 }}>
      However, if you full withdraw and redeposit the counter will be reset.
      <a
        href="https://docs.tetu.io/tetu-io/reward-boosting-system"
        target="_blank"
        style={{ marginLeft: 8 }}
      >
        More info.
      </a>
    </p>
  </>
)

const AAVE_MAI_BAL_Description = (
  <>
    <p style={{ marginBottom: 0 }}>
      This is a complex vault with specific risks. Please read the documentation before using this
      vault:{' '}
      <a
        href="https://docs.tetu.io/tetu-io/yield-farm/strategies/aave-mai-balancer-amb"
        target="_blank"
      >
        doc
      </a>
      .
    </p>
    <p style={{ marginBottom: 0 }}>
      A deposit fee of 0.3% is taken to cover the MAI loan repayment fee.
    </p>
    {/*
    <p style={{ marginBottom: 0 }}>
      <span style={{ color: '#f16868' }}>Warning!</span>
    </p>
    <p style={{ marginBottom: 0 }}>
      It is a complex vault with specific risks. Please read before using this vault:{' '}
      <a
        href="https://docs.tetu.io/tetu-io/yield-farm/strategies/aave-mai-balancer-amb"
        target="_blank"
      >
        doc
      </a>
      <a href="https://medium.com/@tetu.finance/aave-mai-balancer-multi-strategy-2c46a9192a58">
        medium
      </a>
      ,{' '}
      <a href="https://www.publish0x.com/yjn58/low-risk-passive-income-strategies-with-qidao-on-polygon-xrnpdxo">
        publish0x
      </a>.
    </p>
    <p style={{ marginBottom: 0 }}>A deposit fee of 0.3% takes to cover MAI repay commission.</p>
    */}
  </>
)

const protecktionModeText = (
  <>
    <p style={{ marginBottom: 0 }}>Protection Mode is enabled for this vault.</p>
    <p style={{ marginBottom: 0 }}>
      This means that your initial reward boost will start from 0% and you will not able to withdraw
      without claiming rewards.
    </p>
    <p style={{ marginBottom: 0 }}>
      Be aware that withdrawal action with claim rewards without a 100% boost will lead to partially
      lost earned rewards!
    </p>
  </>
)

export const VaultDescription = () => {
  const { address } = useParams<{ address: string }>()

  const hasProtecktionMode = useCheckProtectionMode(address)

  if (hasProtecktionMode) {
    return <Promo text={protecktionModeText} mb={30} />
  }

  if (Object.keys(descriptionMap).includes(address.toLowerCase())) {
    // @ts-ignore
    const text = descriptionMap[address.toLowerCase()]
    return <Promo text={text} mb={30} />
  }

  if (AAVE_MAI_BAL_VAULTS_MATIC.map((el) => el.toLowerCase()).includes(address.toLowerCase())) {
    return <Promo text={AAVE_MAI_BAL_Description} mb={30} />
  }

  return <Promo text={defaultDescription} mb={30} />
}
