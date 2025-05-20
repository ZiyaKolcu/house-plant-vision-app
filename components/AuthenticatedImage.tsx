import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ImageProps, Text, View } from "react-native";
import { COLORS } from "../styles/colors";
import { layout } from "../styles/layout";
import { typography } from "../styles/typography";

interface AuthenticatedImageProps extends ImageProps {
  submissionId: number;
}

const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({
  submissionId,
  ...props
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("access_token");
        setToken(storedToken);
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      if (!token) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);

        const imageBlob = await fetch(
          `http://192.168.1.101:8000/api/v1/submissions/image/${submissionId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const reader = new FileReader();
        reader.readAsDataURL(await imageBlob.blob());
        reader.onloadend = () => {
          if (isMounted) {
            const base64data = reader.result as string;
            setImageData(base64data);
            setLoading(false);
          }
        };
      } catch (err) {
        console.error("Error loading image:", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    if (token) {
      fetchImage();
    }

    return () => {
      isMounted = false;
    };
  }, [submissionId, token]);

  if (error) {
    return (
      <View
        style={[
          props.style,
          layout.centerContent,
          { backgroundColor: COLORS.cardBackground },
        ]}
      >
        <Ionicons name="image-outline" size={24} color={COLORS.textSecondary} />
        <Text style={[typography.bodySmall, { color: COLORS.textSecondary }]}>
          Image Error
        </Text>
      </View>
    );
  }

  if (loading || !imageData) {
    return (
      <View
        style={[
          props.style,
          layout.centerContent,
          { backgroundColor: COLORS.cardBackground },
        ]}
      >
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Image
      style={[{ width: "100%", height: "100%" }, props.style]}
      source={{ uri: imageData }}
      {...props}
    />
  );
};

export default AuthenticatedImage;
