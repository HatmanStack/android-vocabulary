import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';
import { getListById } from '../utils/vocabularyLoader';

type Props = StackScreenProps<RootStackParamList, 'Difficulty'>;

export default function DifficultyScreen({ navigation, route }: Props) {
  const { listId } = route.params;
  const list = getListById(listId);

  if (!list) {
    return (
      <View style={styles.container}>
        <Text>List not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineMedium" style={styles.title}>
          Select Difficulty Level
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {list.name}
        </Text>
        <View style={styles.buttons}>
          {list.levels.map((level) => (
            <Button
              key={level.id}
              mode="contained"
              onPress={() => navigation.navigate('Quiz', { listId, levelId: level.id })}
              style={styles.button}
            >
              {level.name}
            </Button>
          ))}
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  surface: {
    padding: 24,
    borderRadius: 8,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  buttons: {
    gap: 12,
  },
  button: {
    marginVertical: 4,
  },
});
