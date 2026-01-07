import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '../contexts/AuthContext';

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="classroom-detail" options={{ headerShown: false }} />
          <Stack.Screen name="lecture-detail" options={{ headerShown: false }} />
          <Stack.Screen name="exercise-submit" options={{ headerShown: false }} />
          <Stack.Screen name="classroom-chat" options={{ headerShown: false }} />
          <Stack.Screen name="chat-room" options={{ headerShown: false }} />
          <Stack.Screen name="payment" options={{ headerShown: false }} />
          <Stack.Screen name="payment-history" options={{ headerShown: false }} />
          <Stack.Screen name="my-join-requests" options={{ headerShown: false }} />
          <Stack.Screen name="quiz-attempt" options={{ headerShown: false }} />
          <Stack.Screen name="quiz-result" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
