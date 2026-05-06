import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import { getData } from '../utils/storage';
import { hydrate, todosReducer } from './todosSlice';

export const loadTodosFromStorage = createAsyncThunk(
  'todos/loadFromStorage',
  async (_, { dispatch }) => {
    try {
      const items = await getData();
      dispatch(hydrate({ items }));
    } catch {
      dispatch(hydrate({ items: [] }));
    }
  },
);

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
