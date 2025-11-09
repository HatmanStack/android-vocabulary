import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface, Divider } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';
import { getTotalWordCount, loadVocabularyLists } from '@/features/vocabulary/utils/vocabularyLoader';

type Props = StackScreenProps<RootStackParamList, 'Stats'>;

export default function StatsScreen({ navigation }: Props) {
  const totalWords = getTotalWordCount();
  const totalLists = loadVocabularyLists().length;

  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineMedium" style={styles.title}>
          Your Statistics
        </Text>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Vocabulary Database
          </Text>
          <View style={styles.stats}>
            <View style={styles.statRow}>
              <Text variant="bodyLarge">Total Vocabulary Lists:</Text>
              <Text variant="bodyLarge" style={styles.statValue}>
                {totalLists}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text variant="bodyLarge">Total Words Available:</Text>
              <Text variant="bodyLarge" style={styles.statValue}>
                {totalWords}
              </Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Your Progress
          </Text>
          <View style={styles.stats}>
            <View style={styles.statRow}>
              <Text variant="bodyLarge">Words Learned:</Text>
              <Text variant="bodyLarge" style={styles.statValue}>
                0
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text variant="bodyLarge">Lists Completed:</Text>
              <Text variant="bodyLarge" style={styles.statValue}>
                0
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text variant="bodyLarge">All-Time Hints:</Text>
              <Text variant="bodyLarge" style={styles.statValue}>
                0
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text variant="bodyLarge">All-Time Wrong:</Text>
              <Text variant="bodyLarge" style={styles.statValue}>
                0
              </Text>
            </View>
          </View>
        </View>

        <Text variant="bodySmall" style={styles.placeholder}>
          Progress tracking will be implemented in Phase 4
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
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  stats: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  placeholder: {
    marginTop: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
  button: {
    marginTop: 24,
  },
});
