import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Platform } from 'react-native';
import type { AppDispatch, RootState } from '../store/store';
import { TodoList } from '../components/TodoList';
import { TodosProgress } from '../components/TodosProgress';
import {
  addTodo,
  clearUndo,
  deleteTodo,
  editTodo,
  toggleTodo,
  undoDelete,
} from '../store/todosSlice';
import type { Todo } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

const UNDO_TIME = 5000;

export function TodoScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: todos, isLoaded, lastDeleted } = useSelector((s: RootState) => s.todos);

  const [text, setText] = React.useState('');
  const [editOpen, setEditOpen] = React.useState(false);
  const [editTodoId, setEditTodoId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');

  React.useEffect(() => {
    if (!lastDeleted) return;
    const t = setTimeout(() => dispatch(clearUndo()), UNDO_TIME);
    return () => clearTimeout(t);
  }, [dispatch, lastDeleted]);

  const onAdd = React.useCallback(() => {
    const title = text.trim();
    if (!title) return;
    dispatch(addTodo({ title }));
    setText('');
  }, [dispatch, text]);

  const onToggle = React.useCallback(
    (id: string) => dispatch(toggleTodo({ id })),
    [dispatch],
  );

  const onDelete = React.useCallback(
    (id: string) => dispatch(deleteTodo({ id })),
    [dispatch],
  );

  const onEdit = React.useCallback((todo: Todo) => {
    setEditTodoId(todo.id);
    setEditTitle(todo.title);
    setEditOpen(true);
  }, []);

  const onSaveEdit = React.useCallback(() => {
    const title = editTitle.trim();
    if (!editTodoId || !title) return;
    dispatch(editTodo({ id: editTodoId, title }));
    setEditOpen(false);
    setEditTodoId(null);
    setEditTitle('');
  }, [dispatch, editTodoId, editTitle]);

  const onUndo = React.useCallback(() => {
    dispatch(undoDelete({ maxTime: UNDO_TIME }));
  }, [dispatch]);

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
      <SafeAreaView >
        <View style={styles.header}>
          <Text style={styles.title}>ToDoApp</Text>
          {isLoaded ? <TodosProgress /> : <Text style={styles.subTitle}>Loading...</Text>}
        </View>

        <View style={styles.composer}>
          <TextInput value={text} onChangeText={setText}
            placeholder="Add a todo" style={styles.input}
            returnKeyType="done" onSubmitEditing={onAdd} />
          <Pressable onPress={onAdd} style={styles.addBtn}>
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>

        <View style={styles.listWrap}>
          <TodoList todos={todos} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
        </View>

        {lastDeleted ? (
          <View style={styles.undoBar}>
            <Text style={styles.undoText}>Todo deleted</Text>
            <Pressable onPress={onUndo} style={styles.undoBtn}>
              <Text style={styles.undoBtnText}>Undo</Text>
            </Pressable>
          </View>
        ) : null}

        <Modal transparent visible={editOpen}
          animationType="fade" onRequestClose={() => setEditOpen(false)} >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Edit todo</Text>
              <TextInput value={editTitle} onChangeText={setEditTitle} style={styles.modalInput} />
              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => {
                    setEditOpen(false);
                    setEditTodoId(null);
                    setEditTitle('');
                  }}  style={styles.modalBtn} >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </Pressable>
                <Pressable onPress={onSaveEdit} style={[styles.modalBtn, styles.modalBtnPrimary]}>
                  <Text style={[styles.modalBtnText, styles.modalBtnPrimaryText]}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  safe: {
    // flex: 1,
    // backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  subTitle: {
    color: '#6b7280',
    fontWeight: '600',
  },
  composer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  addBtn: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '800',
  },
  listWrap: {
    flex: 1,
    paddingHorizontal: 8,
  },
  undoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#111827',
  },
  undoText: {
    color: '#fff',
    fontWeight: '700',
  },
  undoBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#2563eb',
    borderRadius: 10,
  },
  undoBtnText: {
    color: '#fff',
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  modalBtnText: {
    fontWeight: '800',
    color: '#111827',
  },
  modalBtnPrimary: {
    backgroundColor: '#111827',
  },
  modalBtnPrimaryText: {
    color: '#fff',
  },
});

