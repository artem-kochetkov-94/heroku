import { getAssetsIconMap } from './tokens'
import { platformNameMap } from '../components/VaultRow'

export const platformIconsMap = {
  [platformNameMap['0']]: getAssetsIconMap().TETU,
  [platformNameMap['1']]: getAssetsIconMap().TETU,
  [platformNameMap['3']]: getAssetsIconMap().SUSHI,
  [platformNameMap['2']]: getAssetsIconMap().QUICK,
  [platformNameMap['4']]: getAssetsIconMap().wault,
}
