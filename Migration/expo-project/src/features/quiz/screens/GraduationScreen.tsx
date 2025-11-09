import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { Icon } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';
import { Card, Typography, Spacer, Button } from '@/shared/ui';

type Props = StackScreenProps<RootStackParamList, 'Graduation'>;

export default function GraduationScreen({ navigation, route }: Props) {
  const { listId, levelId, stats } = route.params;

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Celebration animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  // Get stats with defaults
  const hintsUsed = stats?.hints || 0;
  const wrongAnswers = stats?.wrong || 0;
  const bestHints = stats?.bestHints || 0;
  const bestWrong = stats?.bestWrong || 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Spacer size="xl" />

      {/* Celebration Header */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Icon source="trophy" size={80} color="#FFD700" />
        </View>
        <Spacer size="md" />
        <Typography variant="heading1" align="center" style={styles.title}>
          Congratulations!
        </Typography>
        <Spacer size="xs" />
        <Typography variant="body" color="secondary" align="center">
          You've completed this quiz
        </Typography>
      </Animated.View>

      <Spacer size="xl" />

      {/* Current Session Stats */}
      <Card elevation="medium" style={styles.card}>
        <Card.Content>
          <Typography variant="heading3" align="center">
            Your Performance
          </Typography>
          <Spacer size="md" />

          <View style={styles.statRow}>
            <Icon source="lightbulb-outline" size={24} color="#FF9800" />
            <Spacer size="sm" direction="horizontal" />
            <Typography variant="body">Hints used: {hintsUsed}</Typography>
          </View>

          <Spacer size="sm" />

          <View style={styles.statRow}>
            <Icon source="close-circle-outline" size={24} color="#F44336" />
            <Spacer size="sm" direction="horizontal" />
            <Typography variant="body">Wrong answers: {wrongAnswers}</Typography>
          </View>
        </Card.Content>
      </Card>

      <Spacer size="md" />

      {/* Best Scores (Placeholder for Phase 4) */}
      <Card elevation="low" style={styles.card}>
        <Card.Content>
          <Typography variant="heading3" align="center">
            Best Score
          </Typography>
          <Spacer size="sm" />
          <Typography variant="caption" color="secondary" align="center">
            (Tracking begins in Phase 4)
          </Typography>
          <Spacer size="md" />

          <View style={styles.statRow}>
            <Icon source="star-outline" size={20} color="#4CAF50" />
            <Spacer size="sm" direction="horizontal" />
            <Typography variant="caption" color="secondary">
              Best: {bestHints} hints, {bestWrong} wrong
            </Typography>
          </View>
        </Card.Content>
      </Card>

      <Spacer size="md" />

      {/* All-Time Stats (Placeholder for Phase 4) */}
      <Card elevation="low" style={styles.card}>
        <Card.Content>
          <Typography variant="heading3" align="center">
            All-Time Statistics
          </Typography>
          <Spacer size="sm" />
          <Typography variant="caption" color="secondary" align="center">
            (Coming in Phase 4)
          </Typography>
          <Spacer size="md" />

          <View style={styles.statRow}>
            <Typography variant="caption" color="secondary">
              Total words learned: 0
            </Typography>
          </View>
          <Spacer size="xs" />
          <View style={styles.statRow}>
            <Typography variant="caption" color="secondary">
              All-time hints: 0
            </Typography>
          </View>
          <Spacer size="xs" />
          <View style={styles.statRow}>
            <Typography variant="caption" color="secondary">
              All-time wrong: 0
            </Typography>
          </View>
        </Card.Content>
      </Card>

      <Spacer size="xl" />

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <Button
          variant="primary"
          onPress={() => navigation.navigate('Quiz', { listId, levelId })}
          fullWidth
        >
          Try Again
        </Button>

        <Spacer size="sm" />

        <Button
          variant="secondary"
          onPress={() => navigation.navigate('Difficulty', { listId })}
          fullWidth
        >
          Choose Another Level
        </Button>

        <Spacer size="sm" />

        <Button variant="text" onPress={() => navigation.navigate('Home')} fullWidth>
          Back to Home
        </Button>
      </View>

      <Spacer size="xl" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    color: '#4CAF50',
  },
  card: {
    marginHorizontal: 0,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
});
