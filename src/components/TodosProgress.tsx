import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import * as Progress from 'react-native-progress';

import type { RootState } from '../store/store';

export const TodosProgress = () => {
  const todos = useSelector((state: RootState) => state.todos.items);

  const total = todos.length;
  const done = todos.filter(item => item.isDone).length;

  const progress = total === 0 ? 0 : done / total;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.text}>
          {total === 0
            ? 'Nothing completed'
            : `${Math.round(progress * 100)}% completed`}
        </Text>

        <Text style={styles.text}>
          {done}/{total}
        </Text>
      </View>

      <Progress.Bar progress={progress} width={null}
        height={10} borderRadius={8} color="#22c55e"
        unfilledColor="#e5e7eb" borderWidth={0} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  text: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
});