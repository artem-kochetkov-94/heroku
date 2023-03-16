import { FetchResource } from './fetch-resource'
import { action, observable } from 'mobx'

type sn = string | number

export class CollectionStore<T extends typeof FetchResource> {
  @observable
  storeMap: any = new Map()

  private Store: T | null = null

  constructor(Store: T) {
    this.Store = Store
  }

  @action.bound
  async callStore(...params: sn[]) {
    const key = params.reduce((acc, item) => acc + `_${item}`, '')

    if (key in this.storeMap) {
      return this.storeMap[key]
    } else {
      //@ts-ignore
      const store = new this.Store()
      this.storeMap[key] = store
      await store.fetch(...params)
      return this.storeMap[key]
    }
  }
}
