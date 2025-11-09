import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Portal, Dialog, Button as PaperButton } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';
import { getLevelWords, getListById } from '@/features/vocabulary/utils/vocabularyLoader';
import { QuizHeader } from '../components/QuizHeader';
import { QuestionDisplay } from '../components/QuestionDisplay';
import { AnswerFeedback } from '../components/AnswerFeedback';
import { MultipleChoiceQuestion } from '../components/MultipleChoiceQuestion';
import { FillInBlankQuestion } from '../components/FillInBlankQuestion';
import { Typography, Spacer, Button } from '@/shared/ui';

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

  // Demo: Toggle between question types
  const [questionType, setQuestionType] = useState<'multiple' | 'fillin'>('multiple');

  // Get first word and create dummy data
  const currentWord = words[currentIndex];

  // Create dummy multiple choice options (current word + 3 others)
  const dummyOptions = currentWord
    ? [
        currentWord.word,
        words[1]?.word || 'option2',
        words[2]?.word || 'option3',
        words[3]?.word || 'option4',
      ].sort(() => Math.random() - 0.5) // Shuffle
    : [];

  // Create dummy fill-in-blank sentence
  const dummySentence = currentWord?.fillInBlank || `The word is _____.`;

  if (!list || !currentWord) {
    return (
      <View style={styles.container}>
        <Typography variant="body">Quiz data not found. Please return to home.</Typography>
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

  const handleSelectAnswer = (answer: string) => {
    console.log('Selected answer:', answer);
    // Placeholder: Show feedback (Phase 3 will validate)
    setIsCorrect(answer === currentWord.word);
    setShowFeedback(true);
  };

  const handleSubmitAnswer = (answer: string) => {
    console.log('Submitted answer:', answer);
    // Placeholder: Show feedback (Phase 3 will validate)
    setIsCorrect(answer.toLowerCase() === currentWord.word.toLowerCase());
    setShowFeedback(true);
  };

  const handleUseHint = () => {
    console.log('Hint used');
    // Phase 3 will implement hint logic
  };

  const toggleQuestionType = () => {
    setQuestionType((prev) => (prev === 'multiple' ? 'fillin' : 'multiple'));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <QuizHeader
        listName={list.name}
        levelName={levelId.charAt(0).toUpperCase() + levelId.slice(1)}
        currentIndex={currentIndex}
        totalWords={words.length}
        hintsUsed={hintsUsed}
        wrongAnswers={wrongAnswers}
        onExit={handleExit}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Spacer size="md" />

        <QuestionDisplay
          questionText={
            questionType === 'multiple'
              ? currentWord.definition
              : `Fill in the blank: ${dummySentence}`
          }
          type={questionType}
        />

        <Spacer size="lg" />

        {/* Render appropriate question type */}
        {questionType === 'multiple' ? (
          <MultipleChoiceQuestion options={dummyOptions} onSelectAnswer={handleSelectAnswer} />
        ) : (
          <FillInBlankQuestion
            sentence={dummySentence}
            onSubmitAnswer={handleSubmitAnswer}
            onUseHint={handleUseHint}
          />
        )}

        <Spacer size="lg" />

        {/* Demo toggle button */}
        <View style={styles.toggleSection}>
          <Typography variant="caption" color="secondary" align="center">
            Demo: Toggle question type
          </Typography>
          <Spacer size="sm" />
          <Button variant="text" onPress={toggleQuestionType}>
            Switch to {questionType === 'multiple' ? 'Fill-in-Blank' : 'Multiple Choice'}
          </Button>
        </View>

        <Spacer size="xl" />
      </ScrollView>

      <AnswerFeedback
        isCorrect={isCorrect}
        isVisible={showFeedback}
        onAnimationEnd={() => setShowFeedback(false)}
      />

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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  toggleSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
});
