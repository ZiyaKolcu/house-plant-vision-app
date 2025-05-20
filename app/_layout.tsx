import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='home'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='auth/signin'
        options={{
          headerShadowVisible: false,
          title: '',
          headerBackground: () => (
            <View style={{ backgroundColor: 'transparent' }} />
          ),
        }}
      />
      <Stack.Screen
        name='auth/signup'
        options={{
          headerShadowVisible: false,
          title: '',
          headerBackground: () => (
            <View style={{ backgroundColor: 'transparent' }} />
          ),
        }}
      />
    </Stack>
  );
}
