import { retry } from '../utils/retry'

const mockRetryFNRes = () => {
  return new Promise((res, rej) => {
    setTimeout(() => res(2), 1000)
  })
}

const mockRetryFNRej = () => {
  return new Promise((res, rej) => {
    setTimeout(rej, 1000)
  })
}

const mockFnWithRetry = () => {
  throw new Error('123')
}

test('test retry fn 1', async () => {
  const fn = retry({ fn: mockRetryFNRes, args: [1, 2, 3] }, 'test')
  const res = await fn()
  expect(res).toBe(2)
})

test('test retry fn 2', async () => {
  const fn = retry({ fn: mockRetryFNRej, args: [1, 2, 3] }, 'test')
  const res = await fn()
  expect(res).toBe(null)
})

test('test retry fn 3', async () => {
  const fn = retry({ fn: mockFnWithRetry, args: [] }, 'test')
  const res = await fn()
  expect(res).toBe(null)
})
