import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { lightTheme } from '@/shared/lib/theme';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={lightTheme}>{children}</PaperProvider>
    </SafeAreaProvider>
  );
}
