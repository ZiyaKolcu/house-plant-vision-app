import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../styles/colors";
import { components } from "../../styles/components";
import { forms } from "../../styles/forms";
import { layout } from "../../styles/layout";
import { typography } from "../../styles/typography";
import { fetchData } from "../utils/api";

interface ProfileData {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await SecureStore.getItemAsync("access_token");
        if (!token) {
          setError("No access token found.");
          setLoading(false);
          return;
        }
        const data = await fetchData<ProfileData>(
          "http://192.168.1.101:8000/api/v1/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProfile(data);
      } catch (e: any) {
        setError("Network or server error.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (!token) {
        Alert.alert("Error", "No access token found.");
        setSigningOut(false);
        return;
      }
      try {
        await fetchData("http://192.168.1.101:8000/api/v1/auth/signout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        await SecureStore.deleteItemAsync("access_token");
        router.replace("/");
      } catch (err: any) {
        Alert.alert("Sign Out Failed", err?.message || "Could not sign out.");
      }
    } catch (e: any) {
      Alert.alert("Sign Out Failed", "Network or server error.");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <View style={layout.container}>
      {loading && (
        <View style={layout.centerContent}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 24 }}
          />
        </View>
      )}
      {error && (
        <View style={layout.centerContent}>
          <Text style={[typography.body, { color: COLORS.errorBackground }]}>
            {error}
          </Text>
        </View>
      )}
      {profile && !loading && !error && (
        <View style={components.profileSection}>
          <View style={components.profileAvatar}>
            <Text style={components.profileAvatarText}>
              {profile.username?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={[layout.row, { marginBottom: 16 }]}>
            <Text style={[typography.bodySmall, { width: 80 }]}>Username</Text>
            <Text style={typography.body}>{profile.username}</Text>
          </View>
          <View style={[layout.row, { marginBottom: 16 }]}>
            <Text style={[typography.bodySmall, { width: 80 }]}>Email</Text>
            <Text style={typography.body}>{profile.email}</Text>
          </View>
          <View style={[layout.row, { marginBottom: 16 }]}>
            <Text style={[typography.bodySmall, { width: 80 }]}>Created</Text>
            <Text style={typography.body}>
              {new Date(profile.created_at).toLocaleString()}
            </Text>
          </View>
          <View style={[layout.row, { marginBottom: 16 }]}>
            <Text style={[typography.bodySmall, { width: 80 }]}>Updated</Text>
            <Text style={typography.body}>
              {new Date(profile.updated_at).toLocaleString()}
            </Text>
          </View>
        </View>
      )}
      <TouchableOpacity
        style={[forms.button, signingOut && forms.buttonDisabled]}
        onPress={handleSignOut}
        disabled={signingOut}
        activeOpacity={0.85}
      >
        <Text style={forms.buttonText}>
          {signingOut ? "Signing Out..." : "Sign Out"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
