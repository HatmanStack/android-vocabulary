import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import { Card, Typography, Spacer } from '@/shared/ui';

/**
 * Converts a color to a translucent background color.
 * Handles hex colors by appending opacity, falls back to default for other formats.
 *
 * @param color - Color string (preferably hex format like "#2196F3")
 * @returns Translucent version of the color
 */
function getTranslucentBackgroundColor(color: string): string {
  // Check if it's a valid hex color (3 or 6 digits)
  const hexPattern = /^#([0-9A-Fa-f]{3}){1,2}$/;

  if (hexPattern.test(color)) {
    // For hex colors, append opacity (15 = ~8% opacity in hex)
    return `${color}15`;
  }

  // For non-hex colors (rgb, named colors, etc.), return a safe default
  // This maintains functionality while preventing invalid color values
  return 'rgba(33, 150, 243, 0.08)'; // Default blue with 8% opacity
}

/**
 * StatCard Component
 *
 * Displays a single metric with an icon, label, and value
 * in a visually appealing card format.
 *
 * @example
 * ```tsx
 * <StatCard
 *   icon="book-outline"
 *   label="Words Learned"
 *   value="0"
 *   iconColor="#4CAF50"
 * />
 * ```
 */

interface StatCardProps {
  /** Icon name from Material Community Icons */
  icon: string;
  /** Label/description of the metric */
  label: string;
  /** Value to display */
  value: string | number;
  /** Optional icon color (hex format preferred, e.g. "#4CAF50") */
  iconColor?: string;
}

export function StatCard({ icon, label, value, iconColor = '#2196F3' }: StatCardProps) {
  const backgroundColor = getTranslucentBackgroundColor(iconColor);

  return (
    <Card elevation="medium" style={styles.card}>
      <Card.Content>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor }]}>
            <Icon source={icon} size={32} color={iconColor} />
          </View>
          <Spacer size="sm" />
          <Typography variant="heading2" align="center">
            {value}
          </Typography>
          <Spacer size="xs" />
          <Typography variant="caption" color="secondary" align="center">
            {label}
          </Typography>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 0,
    minHeight: 120,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
