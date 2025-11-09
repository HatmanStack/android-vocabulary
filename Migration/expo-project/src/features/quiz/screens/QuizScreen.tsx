import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, Dialog, Button as PaperButton } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';
import { getLevelWords, getListById } from '@/features/vocabulary/utils/vocabularyLoader';
import { QuizHeader } from '../components/QuizHeader';
import { QuestionDisplay } from '../components/QuestionDisplay';
import { AnswerFeedback } from '../components/AnswerFeedback';
import { Typography, Spacer } from '@/shared/ui';

type Props = StackScreenProps<RootStackParamList, 'Quiz'>;

export default function QuizScreen({ navigation, route }: Props) {
  const { listId, levelId } = route.params;
  const list = getListById(listId);
  const words = getLevelWords(listId, levelId);

  // Quiz state (placeholder for Phase 3)
  const [currentIndex] = useState(0);
  const [hintsUsed] = useState(0);
  const [wrongAnswers] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(true);

  // Get first word for placeholder display
  const currentWord = words[currentIndex];

  if (!list || !currentWord) {
    return (
      <View style={styles.container}>
        <Typography variant="body">
          Quiz data not found. Please return to home.
        </Typography>
      </View>
    );
  }

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    navigation.goBack();
  };

  const handleCancelExit = () => {
    setShowExitDialog(false);
  };

  // Test function for feedback animation (remove in Phase 3)
  const handleTestFeedback = (correct: boolean) => {
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  return (
    <View style={styles.container}>
      <QuizHeader
        listName={list.name}
        levelName={levelId.charAt(0).toUpperCase() + levelId.slice(1)}
        currentIndex={currentIndex}
        totalWords={words.length}
        hintsUsed={hintsUsed}
        wrongAnswers={wrongAnswers}
        onExit={handleExit}
      />

      <View style={styles.content}>
        <Spacer size="lg" />

        <QuestionDisplay
          questionText={currentWord.definition}
          type="multiple"
        />

        <Spacer size="lg" />

        <View style={styles.placeholderSection}>
          <Typography variant="body" color="secondary" align="center">
            Answer options will appear here
          </Typography>
          <Spacer size="md" />
          <Typography variant="caption" color="secondary" align="center">
            (MultipleChoice and FillInBlank components in Task 5)
          </Typography>
          <Spacer size="lg" />

          {/* Temporary test buttons for feedback animation */}
          <View style={styles.testButtons}>
            <PaperButton
              mode="outlined"
              onPress={() => handleTestFeedback(true)}
            >
              Test Correct
            </PaperButton>
            <Spacer size="sm" />
            <PaperButton
              mode="outlined"
              onPress={() => handleTestFeedback(false)}
            >
              Test Wrong
            </PaperButton>
          </View>
        </View>

        <AnswerFeedback
          isCorrect={isCorrect}
          isVisible={showFeedback}
          onAnimationEnd={() => setShowFeedback(false)}
        />
      </View>

      {/* Exit confirmation dialog */}
      <Portal>
        <Dialog visible={showExitDialog} onDismiss={handleCancelExit}>
          <Dialog.Title>Exit Quiz?</Dialog.Title>
          <Dialog.Content>
            <Typography variant="body">
              Your progress will be lost if you exit now. Are you sure?
            </Typography>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton onPress={handleCancelExit}>Cancel</PaperButton>
            <PaperButton onPress={handleConfirmExit}>Exit</PaperButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  placeholderSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  testButtons: {
    width: '100%',
    maxWidth: 300,
  },
});
