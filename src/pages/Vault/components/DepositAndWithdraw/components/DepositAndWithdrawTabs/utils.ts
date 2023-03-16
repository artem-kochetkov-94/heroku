export const formatDecimals = (val: string) => {
  const [a, b] = val.split('.')
  return [a, b.slice(0, 18)].join('.')
}
