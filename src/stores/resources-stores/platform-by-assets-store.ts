import { FetchResource } from '../core/fetch-resource'
import { getPlatformAssets } from '../../api'

class PlatformByAssetsStore extends FetchResource<any> {
  constructor() {
    super(getPlatformAssets)
  }
}

export const platformByAssetsStore = new PlatformByAssetsStore()
