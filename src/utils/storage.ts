import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'task_data';

export const saveData = async (data: any[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.log('Failed to save data', error);
  }
};

export const getData = async () => {
  try {
    const response = await AsyncStorage.getItem(STORAGE_KEY);
    if (response)  return JSON.parse(response);
    return [];
  } catch (error) {
    console.log('Failed to load data', error);
    return [];
  }
};

export const clearData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.log('Failed to clear data', error);
  }
};