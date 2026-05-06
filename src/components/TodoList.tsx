import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { TodoListProps, Todo } from '../types';

const TodoRow = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}) => {
  return (
    <View style={styles.row}>
      <Pressable onPress={() => onToggle(todo.id)}
        style={styles.checkbox} >
        <View
          style={[
            styles.checkboxInner,
            todo.isDone && styles.checkboxDone,
          ]}
        />
      </Pressable>

      <Pressable onPress={() => onEdit(todo)}
        style={styles.titleWrap} >
        <Text numberOfLines={2}
          style={[styles.title, todo.isDone && styles.titleDone]} >
          {todo.title}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onEdit(todo)}
        style={styles.actionBtn}
      >
        <Text style={styles.actionText}>Edit</Text>
      </Pressable>

      <Pressable
        onPress={() => onDelete(todo.id)}
        style={styles.actionBtn}
      >
        <Text style={[styles.actionText, styles.deleteText]}>
          Del
        </Text>
      </Pressable>
    </View>
  );
};

export const TodoList = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
}: TodoListProps) => {
  const renderItem = ({ item }: { item: Todo }) => {
    return (
      <TodoRow todo={item} onToggle={onToggle}
        onDelete={onDelete} onEdit={onEdit}/>
    );
  };

  return (
    <FlatList data={todos} renderItem={renderItem}
      keyExtractor={(item) => item.id} keyboardShouldPersistTaps="handled"
      contentContainerStyle={
        todos.length === 0
          ? styles.emptyContainer
          : styles.container
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>
          Nothing here yet
        </Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },

  emptyContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },

  emptyText: {
    color: '#6b7280',
    fontSize: 15,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },

  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },

  checkboxDone: {
    backgroundColor: '#22c55e',
  },

  titleWrap: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    fontSize: 16,
    color: '#111827',
  },

  titleDone: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },

  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  actionText: {
    fontWeight: '600',
    color: '#2563eb',
  },

  deleteText: {
    color: '#dc2626',
  },
});