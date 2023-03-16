import { getContractInfo } from '../../api/getContractInfo'
import { CollectionStore } from '../core/collection-fetch-resource'
import { FetchResource } from '../core/fetch-resource'

class ContractInfoStore extends FetchResource<any> {
  constructor() {
    super(getContractInfo)
  }
}

export const contracInfoCollectionStore = new CollectionStore(ContractInfoStore)
