import { observable, action, makeObservable } from 'mobx'

export class FetchResource<T> {
  @observable
  error: unknown = null

  @observable
  value: T | null = null

  @observable
  isFetching = false

  @observable
  isFetched = false

  protected fetchFn?: Function

  protected responseHandler?: Function

  constructor(
    fetchFn: Function,
    responseHandler?: Function,
    private readonly lazyLoadRequest?: boolean,
  ) {
    makeObservable(this)
    if (fetchFn) {
      this.fetchFn = fetchFn
      this.responseHandler = responseHandler
    }
  }

  @action.bound
  private setError(error: unknown) {
    this.error = error
  }

  @action.bound
  private setIsFetching(isFetching: boolean) {
    this.isFetching = isFetching
  }

  @action.bound
  private setIsFetched(isFetched: boolean) {
    this.isFetched = isFetched
  }

  @action.bound
  private setValue(value: T) {
    if (this.lazyLoadRequest && Array.isArray(value)) {
      // @ts-ignore
      this.value = [...(this.value || []), ...value]
      return
    }
    // @ts-ignore
    if (this.lazyLoadRequest && value.constructor === Object) {
      this.value = { ...(this.value || {}), ...value }
      return
    }

    this.value = value
  }

  @action.bound
  reset() {
    this.error = null
    this.value = null
    this.isFetching = false
    this.isFetched = false
  }

  async fetch(...params: any) {
    if (this.error) {
      this.setError(null)
    }

    this.setIsFetching(true)

    try {
      if (!this.fetchFn) {
        console.warn('[FetchResource.fetchFn] fetchFn must be defined')
      } else {
        const response = await this.fetchFn(...params)
        if (this.responseHandler) {
          this.responseHandler(params, response)
        }
        this.setValue(response)
      }
    } catch (error) {
      console.log('Fetch error', error)
      // @ts-ignore
      this.setError(error)
    } finally {
      this.setIsFetching(false)
      this.setIsFetched(true)
    }
  }
}
