import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';

type Props = StackScreenProps<RootStackParamList, 'Quiz'>;

export default function QuizScreen({ navigation, route }: Props) {
  const { listId, levelId } = route.params;

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
          Quiz Screen
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          List: {listId.toUpperCase()}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Level: {levelId}
        </Text>
        <Text variant="bodyLarge" style={styles.placeholder}>
          Quiz questions will appear here
        </Text>
        <Button mode="contained" onPress={handleCompleteQuiz} style={styles.button}>
          Complete Quiz (Placeholder)
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
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholder: {
    marginVertical: 24,
    textAlign: 'center',
    opacity: 0.6,
  },
  button: {
    marginTop: 16,
  },
});
