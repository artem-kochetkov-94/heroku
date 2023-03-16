const MAX_REQUEST_RETRY = Number(process.env.REACT_APP_MAX_REQUEST_RETRY)

type RetryArgs = {
  fn: (...args: any[]) => Promise<any>
  args?: any[]
  defaultValue?: any
}

export const retry = ({fn, args, defaultValue}: RetryArgs, comment: string) => {
  let retryCount = 0
  // @ts-ignore
  const wrappedFn = async () => {
    try {
      // @ts-ignore
      const response = args ? await fn(...args) : await fn()
      return response
    } catch (err) {
      retryCount++
      if (retryCount > MAX_REQUEST_RETRY) {
        console.info(comment+ ' Error retry', fn, args);
        return defaultValue ?? null
      } else {
        console.log(comment + ' call retry fn ' + retryCount, fn, args, defaultValue)
        return await wrappedFn()
      }
    }
  }

  return wrappedFn
}
