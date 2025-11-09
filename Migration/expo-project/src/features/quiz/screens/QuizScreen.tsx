import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface, Chip } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';
import { getLevelWords, getListById } from '@/features/vocabulary/utils/vocabularyLoader';

type Props = StackScreenProps<RootStackParamList, 'Quiz'>;

export default function QuizScreen({ navigation, route }: Props) {
  const { listId, levelId } = route.params;
  const list = getListById(listId);
  const words = getLevelWords(listId, levelId);

  const handleCompleteQuiz = () => {
    navigation.navigate('Graduation', {
      listId,
      levelId,
      stats: {
        hints: 2,
        wrong: 1,
        bestHints: 1,
        bestWrong: 0,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineMedium" style={styles.title}>
          Quiz Mode
        </Text>
        <View style={styles.info}>
          <Chip icon="book" style={styles.chip}>
            {list?.name}
          </Chip>
          <Chip icon="trophy" style={styles.chip}>
            {levelId.charAt(0).toUpperCase() + levelId.slice(1)}
          </Chip>
        </View>
        <Text variant="bodyLarge" style={styles.wordCount}>
          {words.length} words to master
        </Text>
        <Text variant="bodyMedium" style={styles.placeholder}>
          Quiz functionality will be implemented in Phase 3
        </Text>
        <Text variant="bodySmall" style={styles.note}>
          This screen will feature:
        </Text>
        <Text variant="bodySmall" style={styles.note}>
          • Multiple choice questions
        </Text>
        <Text variant="bodySmall" style={styles.note}>
          • Fill-in-the-blank exercises
        </Text>
        <Text variant="bodySmall" style={styles.note}>
          • Adaptive difficulty
        </Text>
        <Button mode="contained" onPress={handleCompleteQuiz} style={styles.button}>
          Skip to Results (Placeholder)
        </Button>
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
    marginBottom: 16,
    textAlign: 'center',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginHorizontal: 4,
  },
  wordCount: {
    textAlign: 'center',
    marginBottom: 16,
  },
  placeholder: {
    marginVertical: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  note: {
    marginVertical: 4,
    opacity: 0.6,
  },
  button: {
    marginTop: 24,
  },
});
