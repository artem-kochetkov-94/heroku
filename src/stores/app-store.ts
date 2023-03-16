import { makeAutoObservable } from 'mobx'

class AppStore {
  constructor() {
    makeAutoObservable(this)
  }

  address: string | null = null

  setAddress(address: string | null) {
    this.address = address
  }
}

export const appStore = new AppStore()
