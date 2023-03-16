import { makeAutoObservable } from 'mobx'

export class LocalStorage<T> {
  private id = ''

  data: { [key: string]: T } = {}

  constructor(id: string) {
    makeAutoObservable(this)
    this.id = id
  }

  updateData() {
    const data = localStorage.getItem(this.id)
    const isUpdated = JSON.stringify(this.data) !== data

    if (isUpdated) {
      if (data !== null) {
        try {
          this.data = JSON.parse(data)
        } catch (error) {
          console.log('error', error)
        }
      }
    }
  }

  getData() {
    this.updateData()
    return this.data
  }

  setItem(key: string, value: object) {
    const nextData = {
      ...this.data,
      [key]: value,
    }
    localStorage.setItem(this.id, JSON.stringify(nextData))
    this.updateData()
  }

  getItem(key: string) {
    return this.data?.[key]
  }

  deleteItem(key: string) {
    const prevData = { ...this.getData() }
    if (key in prevData) {
      // @ts-ignore
      delete prevData[key]
      localStorage.setItem(this.id, JSON.stringify(prevData))
      this.updateData()
    }
  }

  reset() {
    localStorage.setItem(this.id, JSON.stringify({}))
    this.updateData()
  }
}
