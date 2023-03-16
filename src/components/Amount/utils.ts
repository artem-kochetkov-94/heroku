export const formatName = (name: string | undefined) => {
  if (name?.slice(0, 2)?.toLowerCase() === 'V_'.toLowerCase()) {
    return name.slice(2)
  }
  return name
}
