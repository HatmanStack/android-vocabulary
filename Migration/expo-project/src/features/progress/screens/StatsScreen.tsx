import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';

type Props = StackScreenProps<RootStackParamList, 'Stats'>;

export default function StatsScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineMedium" style={styles.title}>
          Your Statistics
        </Text>
        <View style={styles.stats}>
          <Text variant="bodyLarge">Total Words Learned: 0</Text>
          <Text variant="bodyLarge">Lists Completed: 0</Text>
          <Text variant="bodyLarge">All-Time Hints: 0</Text>
          <Text variant="bodyLarge">All-Time Wrong: 0</Text>
        </View>
        <Text variant="bodyMedium" style={styles.placeholder}>
          Detailed statistics will appear here
        </Text>
        <Button mode="contained" onPress={() => navigation.navigate('Home')} style={styles.button}>
          Back to Home
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
  stats: {
    marginVertical: 24,
    gap: 12,
  },
  placeholder: {
    marginVertical: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
  button: {
    marginTop: 16,
  },
});
