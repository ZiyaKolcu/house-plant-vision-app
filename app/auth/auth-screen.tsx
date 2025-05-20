import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { components } from '../../styles/components';
import { forms } from '../../styles/forms';
import { layout } from '../../styles/layout';
import { typography } from '../../styles/typography';

export default function AuthScreen() {
  const router = useRouter();
  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('access_token');
      if (token) {
        router.replace('/home/submissions');
      }
    };
    checkToken();
  }, []);
  return (
    <View style={[layout.container, layout.centerContent]}>
      <Image
        source={require('../../assets/images/auth-flower.png')}
        style={components.authImage}
        resizeMode='contain'
      />
      <Text style={typography.h1}>Hello</Text>
      <Text style={[typography.body, { marginBottom: 32 }]}>
        Welcome to House Plant Vision
      </Text>
      <View style={{ gap: 16, width: '100%', paddingHorizontal: 16 }}>
        <TouchableOpacity
          style={forms.button}
          onPress={() => router.push('/auth/signin')}
          activeOpacity={0.8}>
          <Text style={forms.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[forms.button, forms.buttonOutline]}
          onPress={() => router.push('/auth/signup')}
          activeOpacity={0.8}>
          <Text style={forms.buttonOutlineText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
