import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Surface, Divider } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';
import { loadVocabularyLists } from '../utils/vocabularyLoader';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const vocabularyLists = loadVocabularyLists();

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header} elevation={0}>
        <Text variant="headlineLarge" style={styles.title}>
          Vocabulary App
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Select a vocabulary list to begin
        </Text>
      </Surface>

      <View style={styles.content}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Vocabulary Lists ({vocabularyLists.length})
        </Text>

        {vocabularyLists.map((list) => (
          <Button
            key={list.id}
            mode="contained"
            onPress={() => navigation.navigate('Difficulty', { listId: list.id })}
            style={styles.listButton}
            contentStyle={styles.listButtonContent}
          >
            {list.name}
          </Button>
        ))}

        <Divider style={styles.divider} />

        <View style={styles.bottomButtons}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Stats')}
            style={styles.button}
            icon="chart-bar"
          >
            View Statistics
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Settings')}
            style={styles.button}
            icon="cog"
          >
            Settings
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  listButton: {
    marginBottom: 12,
  },
  listButtonContent: {
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 24,
  },
  bottomButtons: {
    gap: 12,
  },
  button: {
    marginVertical: 4,
  },
});
