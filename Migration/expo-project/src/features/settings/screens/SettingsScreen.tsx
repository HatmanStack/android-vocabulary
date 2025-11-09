import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface, Switch } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';

type Props = StackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [hapticsEnabled, setHapticsEnabled] = React.useState(true);

  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineMedium" style={styles.title}>
          Settings
        </Text>
        <View style={styles.settings}>
          <View style={styles.setting}>
            <Text variant="bodyLarge">Sound Effects</Text>
            <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
          </View>
          <View style={styles.setting}>
            <Text variant="bodyLarge">Haptic Feedback</Text>
            <Switch value={hapticsEnabled} onValueChange={setHapticsEnabled} />
          </View>
        </View>
        <Text variant="bodyMedium" style={styles.placeholder}>
          More settings will be added here
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
  settings: {
    marginVertical: 24,
    gap: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
