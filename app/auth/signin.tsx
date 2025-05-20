import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fetchData } from '../utils/api';
import { forms } from '../../styles/forms';
import { layout } from '../../styles/layout';
import { typography } from '../../styles/typography';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const data = await fetchData<any>('api/v1/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (data.access_token) {
        await SecureStore.setItemAsync('access_token', data.access_token);
        Alert.alert('Success', 'Sign in successful!');
        router.replace('/home/submissions');
      } else {
        Alert.alert('Error', data.detail || 'Sign in failed.');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not connect to the server.');
    }
  };

  return (
    <View style={layout.container}>
      <View style={[forms.container, { paddingTop: 48 }]}>
        <Text style={[typography.h1, { marginBottom: 8 }]}>Welcome back!</Text>
        <Text style={[typography.body, { marginBottom: 32 }]}>
          Sign in to continue
        </Text>
        <View style={forms.inputContainer}>
          <TextInput
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            style={forms.input}
            autoCapitalize='none'
            placeholderTextColor='#767676'
          />
        </View>
        <View style={forms.inputContainer}>
          <TextInput
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            style={forms.input}
            secureTextEntry
            placeholderTextColor='#767676'
          />
        </View>
        <TouchableOpacity
          style={forms.button}
          onPress={handleSignIn}>
          <Text style={forms.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
