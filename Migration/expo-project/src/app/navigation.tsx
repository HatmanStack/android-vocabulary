import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';

// Import screens
import HomeScreen from '@/features/vocabulary/screens/HomeScreen';
import DifficultyScreen from '@/features/vocabulary/screens/DifficultyScreen';
import QuizScreen from '@/features/quiz/screens/QuizScreen';
import GraduationScreen from '@/features/quiz/screens/GraduationScreen';
import StatsScreen from '@/features/progress/screens/StatsScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
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
            title: 'Results',
            headerLeft: () => null, // Prevent back navigation
          }}
        />
        <Stack.Screen
          name="Stats"
          component={StatsScreen}
          options={{ title: 'Statistics' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
