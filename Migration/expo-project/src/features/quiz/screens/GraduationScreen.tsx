import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';

type Props = StackScreenProps<RootStackParamList, 'Graduation'>;

export default function GraduationScreen({ navigation, route }: Props) {
  const { listId, levelId, stats } = route.params;

  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineLarge" style={styles.title}>
          🎉 Quiz Complete!
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          List: {listId.toUpperCase()} - Level: {levelId}
        </Text>
        <View style={styles.stats}>
          <Text variant="bodyLarge">Hints Used: {stats.hints}</Text>
          <Text variant="bodyLarge">Wrong Answers: {stats.wrong}</Text>
          <Text variant="bodyMedium" style={styles.best}>
            Best: {stats.bestHints} hints, {stats.bestWrong} wrong
          </Text>
        </View>
        <View style={styles.buttons}>
          <Button mode="contained" onPress={() => navigation.navigate('Home')} style={styles.button}>
            Back to Home
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Stats')}
            style={styles.button}
          >
            View All Stats
          </Button>
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
    marginBottom: 16,
    textAlign: 'center',
  },
  stats: {
    marginVertical: 24,
    gap: 8,
  },
  best: {
    marginTop: 8,
    opacity: 0.7,
  },
  buttons: {
    gap: 12,
    marginTop: 16,
  },
  button: {
    marginVertical: 4,
  },
});
