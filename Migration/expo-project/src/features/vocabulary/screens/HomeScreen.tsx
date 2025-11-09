import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, Animated } from 'react-native';
import { Appbar } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';
import { loadVocabularyLists } from '../utils/vocabularyLoader';
import { ListCard } from '../components/ListCard';
import { Typography, Spacer } from '@/shared/ui';
import { useProgressStore } from '@/shared/store/progressStore';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const vocabularyLists = loadVocabularyLists();
  const { width } = useWindowDimensions();
  const progressStore = useProgressStore();

  // Determine number of columns based on screen width
  // Breakpoint: 600px (common tablet breakpoint)
  const numColumns = width >= 600 ? 2 : 1;

  // Animation values for fade-in effect
  const fadeAnims = useRef(vocabularyLists.map(() => new Animated.Value(0))).current;

  // Calculate progress for each list
  const getListProgress = (listId: string, totalWords: number) => {
    const progress = progressStore.listLevelProgress;
    let learnedWords = 0;

    // Count mastered words (state 3) across all levels in this list
    Object.values(progress).forEach((levelProgress) => {
      if (levelProgress.listId === listId) {
        const words = Object.values(levelProgress.wordProgress);
        learnedWords += words.filter((w) => w.state === 3).length;
      }
    });

    return learnedWords;
  };

  // Calculate completed lists count
  const completedListsCount = vocabularyLists.filter((list) =>
    progressStore.isListCompleted(list.id)
  ).length;

  // Fade-in animation on mount
  useEffect(() => {
    const animations = fadeAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 100, // Stagger animations
        useNativeDriver: true,
      })
    );
    Animated.parallel(animations).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Vocabulary Builder" />
        <Appbar.Action
          icon="chart-bar"
          onPress={() => navigation.navigate('Stats')}
          accessibilityLabel="View Statistics"
        />
        <Appbar.Action
          icon="cog"
          onPress={() => navigation.navigate('Settings')}
          accessibilityLabel="Open Settings"
        />
      </Appbar.Header>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Typography variant="heading1">Choose a List</Typography>
          <Spacer size="xs" />
          <Typography variant="body" color="secondary">
            {completedListsCount > 0
              ? `${completedListsCount} / ${vocabularyLists.length} lists completed`
              : 'Select a vocabulary list to begin learning'}
          </Typography>
        </View>

        <Spacer size="lg" />

        <View style={styles.listsContainer}>
          <View style={styles.grid}>
            {vocabularyLists.map((list, index) => {
              const totalWords = list.levels.reduce((sum, level) => sum + level.words.length, 0);
              const learnedWords = getListProgress(list.id, totalWords);

              return (
                <Animated.View
                  key={list.id}
                  style={[
                    numColumns === 2 ? styles.gridItemTwoColumn : styles.gridItemOneColumn,
                    { opacity: fadeAnims[index] },
                  ]}
                >
                  <ListCard
                    id={list.id}
                    name={list.name}
                    description={list.description}
                    progress={learnedWords}
                    max={totalWords}
                    onPress={() => navigation.navigate('Difficulty', { listId: list.id })}
                  />
                </Animated.View>
              );
            })}
          </View>
        </View>

        <Spacer size="xl" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  listsContainer: {
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItemOneColumn: {
    width: '100%',
    marginBottom: 16,
  },
  gridItemTwoColumn: {
    width: '48%',
    marginBottom: 16,
  },
});
