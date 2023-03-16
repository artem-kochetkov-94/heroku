import { Button } from 'antd'
import { useStores } from '../../../../../../../stores/hooks'
import { tetuBalVault } from '../../../../../../TetuBal'
import { tetuMeshVault } from '../../../../../../TetuMesh'
import { tetuQi } from '../../../../../../TetuQi'
import { DepositTetuBalButton } from './DepositTetuBalButton'
import { DepositTetuMeshButton } from './DepositTetuMeshButton'
import { DepositTetuQiButton } from './DepositTetuQiButton'

type DepositButtonProps = {
  handleClickDeposit: VoidFunction
  isFetchingDeposit: boolean
  isPendingDeposit: boolean
}

export const DepositButton: React.FC<DepositButtonProps> = (props) => {
  const { handleClickDeposit, isPendingDeposit, isFetchingDeposit } = props

  const { userInfoOfVaultStore, vaultDataPageStore } = useStores()

  const userInfo = userInfoOfVaultStore.value
  const vault = vaultDataPageStore.data

  if (vault?.addr?.toLowerCase() === tetuBalVault.toLowerCase()) {
    return <DepositTetuBalButton {...props} />
  }

  if (vault?.addr?.toLowerCase() === tetuMeshVault.toLowerCase()) {
    return <DepositTetuMeshButton {...props} />
  }

  if (vault?.addr?.toLowerCase() === tetuQi.toLowerCase()) {
    return <DepositTetuQiButton {...props} />
  }

  return (
    <Button
      shape="round"
      onClick={handleClickDeposit}
      loading={isPendingDeposit || isFetchingDeposit}
      disabled={vault?.active === false || userInfo?.underlyingBalance?.toString() === '0'}
      className="btn-deposit"
      type="primary"
    >
      <strong>Deposit</strong>
    </Button>
  )
}
