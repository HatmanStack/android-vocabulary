import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineMedium" style={styles.title}>
          Home Screen
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Select a vocabulary list to begin
        </Text>
        <View style={styles.buttons}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Difficulty', { listId: 'list-a' })}
            style={styles.button}
          >
            Go to List A
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Stats')}
            style={styles.button}
          >
            View Stats
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Settings')}
            style={styles.button}
          >
            Settings
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
