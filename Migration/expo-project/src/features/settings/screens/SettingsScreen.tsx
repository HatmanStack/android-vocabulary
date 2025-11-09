import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Appbar } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';
import { SettingItem } from '../components/SettingItem';
import { Card, Typography, Spacer } from '@/shared/ui';

type Props = StackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  // Setting states (non-functional in Phase 2, functionality in Phase 5)
  const [theme] = useState('Light');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const handleThemeChange = () => {
    // Phase 5 will implement theme switching
    console.log('Theme setting tapped');
  };

  const handleSoundToggle = (value: boolean | string) => {
    setSoundEnabled(value as boolean);
    // Phase 5 will implement sound effects
  };

  const handleHapticsToggle = (value: boolean | string) => {
    setHapticsEnabled(value as boolean);
    // Phase 5 will implement haptic feedback
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Spacer size="md" />

        {/* Appearance Section */}
        <View style={styles.section}>
          <Typography variant="heading3">Appearance</Typography>
          <Spacer size="sm" />

          <Card elevation="low" style={styles.card}>
            <SettingItem
              label="Theme"
              type="select"
              value={theme}
              onChange={handleThemeChange}
              showDivider={false}
            />
          </Card>

          <Spacer size="xs" />
          <Typography variant="caption" color="secondary" style={styles.hint}>
            Theme switching coming in Phase 5
          </Typography>
        </View>

        <Spacer size="lg" />

        {/* Audio & Haptics Section */}
        <View style={styles.section}>
          <Typography variant="heading3">Audio & Haptics</Typography>
          <Spacer size="sm" />

          <Card elevation="low" style={styles.card}>
            <SettingItem
              label="Sound Effects"
              type="toggle"
              value={soundEnabled}
              onChange={handleSoundToggle}
              showDivider={Platform.OS !== 'web'}
            />

            {Platform.OS !== 'web' && (
              <SettingItem
                label="Haptic Feedback"
                type="toggle"
                value={hapticsEnabled}
                onChange={handleHapticsToggle}
                showDivider={false}
              />
            )}
          </Card>

          <Spacer size="xs" />
          <Typography variant="caption" color="secondary" style={styles.hint}>
            Audio and haptics functionality coming in Phase 5
          </Typography>
        </View>

        <Spacer size="lg" />

        {/* About Section */}
        <View style={styles.section}>
          <Typography variant="heading3">About</Typography>
          <Spacer size="sm" />

          <Card elevation="low" style={styles.card}>
            <View style={styles.infoRow}>
              <Typography variant="body">App Version</Typography>
              <Typography variant="body" color="secondary">
                2.0.0
              </Typography>
            </View>
          </Card>

          <Spacer size="sm" />

          <Card elevation="low" style={styles.card}>
            <SettingItem
              label="Privacy Policy"
              type="button"
              value=""
              onChange={() => console.log('Privacy policy tapped')}
              showDivider
            />
            <SettingItem
              label="Terms of Service"
              type="button"
              value=""
              onChange={() => console.log('Terms of service tapped')}
              showDivider={false}
            />
          </Card>
        </View>

        <Spacer size="xl" />
      </ScrollView>
    </View>
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
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  section: {
    width: '100%',
  },
  card: {
    marginHorizontal: 0,
  },
  hint: {
    paddingHorizontal: 16,
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
});
