import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';

// Import screens
import HomeScreen from '@/features/vocabulary/screens/HomeScreen';
import DifficultyScreen from '@/features/vocabulary/screens/DifficultyScreen';
import QuizScreen from '@/features/quiz/screens/QuizScreen';
import GraduationScreen from '@/features/quiz/screens/GraduationScreen';
import StatsScreen from '@/features/progress/screens/StatsScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

// Default screen options with horizontal slide transition
const defaultScreenOptions: StackNavigationOptions = {
  headerShown: false, // We're using custom headers in screens
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
};

// Modal screen options with vertical slide transition
const modalScreenOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
  gestureEnabled: true,
  gestureDirection: 'vertical',
  presentation: 'modal',
};

// Fade transition for graduation screen
const fadeScreenOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
  gestureEnabled: false, // No back gesture on graduation
};

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={defaultScreenOptions}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Vocabulary' }}
        />
        <Stack.Screen
          name="Difficulty"
          component={DifficultyScreen}
          options={{ title: 'Select Level' }}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ title: 'Quiz' }}
        />
        <Stack.Screen
          name="Graduation"
          component={GraduationScreen}
          options={{
            ...fadeScreenOptions,
            title: 'Results',
          }}
        />
        <Stack.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            ...modalScreenOptions,
            title: 'Statistics',
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            ...modalScreenOptions,
            title: 'Settings',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
