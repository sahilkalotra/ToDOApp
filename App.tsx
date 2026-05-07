import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';

import { store } from './src/store/store';
import type { AppDispatch, RootState } from './src/store/store';

import { TodoScreen } from './src/screens/TodoScreen';
import { loadTodosFromStorage } from './src/store/store';
import { saveData } from './src/utils/storage';
import { SafeAreaView } from 'react-native-safe-area-context';

function MainApp() {
  const dispatch = useDispatch<AppDispatch>();

  const todos = useSelector((state: RootState) => state.todos.items);
  const isLoaded = useSelector((state: RootState) => state.todos.isLoaded);

  useEffect(() => {
    dispatch(loadTodosFromStorage());
  }, []);

  useEffect(() => {
    if (isLoaded) saveData(todos);
  }, [todos, isLoaded]);

  return (
    <>
      <TodoScreen />
      <StatusBar style="auto" />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1, paddingTop: 10 }}>
        <MainApp />
      </SafeAreaView>
    </Provider>
  );
}