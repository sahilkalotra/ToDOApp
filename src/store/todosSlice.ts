import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  AddTodoPayload,
  DeleteTodoPayload,
  EditTodoPayload,
  Todo,
  ToggleTodoPayload,
  UndoDeletePayload,
} from '../types';

type TodosState = {
  items: Todo[];
  isLoaded: boolean;
  lastDeleted: Todo | null;
  lastDeletedAt: number | null;
  lastDeletedIndex: number | null;
};

const initialState: TodosState = {
  items: [],
  isLoaded: false,
  lastDeleted: null,
  lastDeletedAt: null,
  lastDeletedIndex: null,
};

function now() {
  return Date.now();
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<{ items: Todo[] }>) {
      state.items = action.payload.items;
      state.isLoaded = true;
    },
    addTodo(state, action: PayloadAction<AddTodoPayload>) {
      const t = now();
      state.items.unshift({
        id: makeId(),
        title: action.payload.title.trim(),
        isDone: false,
        createdAt: t,
        updatedAt: t,
      });
    },
    toggleTodo(state, action: PayloadAction<ToggleTodoPayload>) {
      const item = state.items.find((x) => x.id === action.payload.id);
      if (!item) return;
      item.isDone = !item.isDone;
      item.updatedAt = now();
    },
    editTodo(state, action: PayloadAction<EditTodoPayload>) {
      const item = state.items.find((x) => x.id === action.payload.id);
      if (!item) return;
      item.title = action.payload.title.trim();
      item.updatedAt = now();
    },
    deleteTodo(state, action: PayloadAction<DeleteTodoPayload>) {
      const idx = state.items.findIndex((x) => x.id === action.payload.id);
      if (idx < 0) return;
      state.lastDeleted = state.items[idx] ?? null;
      state.lastDeletedAt = now();
      state.lastDeletedIndex = idx;
      state.items.splice(idx, 1);
    },
    clearUndo(state) {
      state.lastDeleted = null;
      state.lastDeletedAt = null;
      state.lastDeletedIndex = null;
    },
    undoDelete(state, action: PayloadAction<UndoDeletePayload>) {
      if (!state.lastDeleted || !state.lastDeletedAt || state.lastDeletedIndex == null) return;
      const age = now() - state.lastDeletedAt;
      if (age > action.payload.maxTime) {
        state.lastDeleted = null;
        state.lastDeletedAt = null;
        state.lastDeletedIndex = null;
        return;
      }
      const insertAt = Math.min(Math.max(state.lastDeletedIndex, 0), state.items.length);
      state.items.splice(insertAt, 0, state.lastDeleted);
      state.lastDeleted = null;
      state.lastDeletedAt = null;
      state.lastDeletedIndex = null;
    },
  },
});

export const { hydrate, addTodo, toggleTodo, editTodo, deleteTodo, undoDelete, clearUndo } =
  todosSlice.actions;

export const todosReducer = todosSlice.reducer;
