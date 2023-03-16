import { makeAutoObservable } from 'mobx'
import axios from 'axios'
import { FetchResource } from '../core'

class TetuApi {
  apiUrl = 'https://api.tetu.io/api/v1/info'

  constructor() {
    makeAutoObservable(this)
  }

  async circulationSupply() {
    const response = await axios.get(this.apiUrl + '/circulationSupply')

    if (response?.status === 200) {
      return response.data
    }
    return 0
  }
}

export const tetuApi = new TetuApi()

// ------------------------ resource stores ----------------------------
class CirculationSupplyStore extends FetchResource<string> {
  constructor() {
    super(() => tetuApi.circulationSupply())
  }
}

export const circulationSupplyStore = new CirculationSupplyStore()
