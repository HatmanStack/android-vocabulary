import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Appbar, Dialog, Portal } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/shared/types';
import { SettingItem } from '../components/SettingItem';
import { Card, Typography, Spacer, Button } from '@/shared/ui';
import { useProgressStore } from '@/shared/store/progressStore';

type Props = StackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  // Setting states (non-functional in Phase 2, functionality in Phase 5)
  const [theme] = useState('Light');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [resetDialogVisible, setResetDialogVisible] = useState(false);

  const progressStore = useProgressStore();

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

  const handleResetAllProgress = () => {
    setResetDialogVisible(true);
  };

  const confirmResetAllProgress = () => {
    progressStore.resetAllProgress();
    setResetDialogVisible(false);
    navigation.navigate('Home');
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

        {/* Data Section */}
        <View style={styles.section}>
          <Typography variant="heading3">Data</Typography>
          <Spacer size="sm" />

          <Card elevation="low" style={styles.card}>
            <View style={styles.dangerZone}>
              <Typography variant="body" style={styles.dangerTitle}>
                Danger Zone
              </Typography>
              <Spacer size="sm" />
              <Typography variant="caption" color="secondary">
                Resetting your progress will delete all saved data including word states, best
                scores, and statistics. This action cannot be undone.
              </Typography>
              <Spacer size="md" />
              <Button variant="text" onPress={handleResetAllProgress} style={styles.dangerButton}>
                Reset All Progress
              </Button>
            </View>
          </Card>
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

      {/* Reset Confirmation Dialog */}
      <Portal>
        <Dialog visible={resetDialogVisible} onDismiss={() => setResetDialogVisible(false)}>
          <Dialog.Title>Reset All Progress?</Dialog.Title>
          <Dialog.Content>
            <Typography variant="body">
              This will permanently delete all your learning progress, including:
            </Typography>
            <Spacer size="sm" />
            <Typography variant="body">• All word states across all lists</Typography>
            <Typography variant="body">• Best scores for all levels</Typography>
            <Typography variant="body">• All-time statistics</Typography>
            <Spacer size="sm" />
            <Typography variant="body" style={styles.warningText}>
              This action cannot be undone. Are you absolutely sure?
            </Typography>
          </Dialog.Content>
          <Dialog.Actions>
            <Button variant="text" onPress={() => setResetDialogVisible(false)}>
              Cancel
            </Button>
            <Button variant="text" onPress={confirmResetAllProgress} style={styles.dangerButton}>
              Yes, Reset Everything
            </Button>
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
  dangerZone: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: 8,
  },
  dangerTitle: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  dangerButton: {
    color: '#F44336',
  },
  warningText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
});
