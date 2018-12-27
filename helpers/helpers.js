export const findInList = (toBeFound, list) => {
  return list.find(item => item.username === toBeFound.username && item.password === toBeFound.password)
}