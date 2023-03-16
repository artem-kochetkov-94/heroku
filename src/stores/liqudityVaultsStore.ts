import { makeAutoObservable } from 'mobx'

// todo refactoring loading price data

class LiqudityVaultsStore {
  tetuMeshData: null = null;
  tetuQiData: null = null;
  tetuBalData: null = null;

  constructor() {
    makeAutoObservable(this)
  }

  clearStore() {
    this.tetuMeshData = null;
    this.tetuQiData = null;
    this.tetuBalData = null;
  }

  setTetuMeshData(data: any) {
    this.tetuMeshData = data;
  }

  setTetuQiData(data: any) {
    this.tetuQiData = data;
  }

  setTetuBalData(data: any) {
    this.tetuBalData = data;
  }
}

export const liqudityVaultsStore = new LiqudityVaultsStore()
