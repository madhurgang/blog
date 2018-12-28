import { AsyncStorage } from 'react-native'

export const findInList = (toBeFound, list) => {
  return list.find(item => item.username === toBeFound.username && item.password === toBeFound.password)
}

export const saveDataToLocal = async (key, value) => {
  try {
    const serialisedData = JSON.stringify(value)
    await AsyncStorage.setItem(key, serialisedData);
    console.log('successfully saved on user key with value', value)
  } catch (error) {
    console.log('error while storing async data:', error)
  }
}

export const getDataFromLocal = async (key) => {
  try {
    const existing = await AsyncStorage.getItem(key)
    return JSON.parse(existing)
  } catch (error) {
    console.log('error while getting async data:', error)
  }
}

export const removeDataFromLocal = async (key) => {
  try {
    await AsyncStorage.removeItem(key, console.log('user removed successfully'))
  } catch (error) {
    console.log('error while getting async data:', error)
  }
}