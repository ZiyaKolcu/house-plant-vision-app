import { Ionicons } from '@expo/vector-icons';
import * as Camera from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import FloatingActionButton from '../../components/FloatingActionButton';
import SubmissionCard from '../../components/SubmissionCard';
import useSubmissionActions from '../../hooks/useSubmissionActions';
import useSubmissions from '../../hooks/useSubmissions';
import { COLORS } from '../../styles/colors';
import { layout } from '../../styles/layout';
import { typography } from '../../styles/typography';

export default function SubmissionsScreen() {
  const router = useRouter();
  const { submissions, loading, error, triggerRefresh } = useSubmissions();
  const { uploading, handleDeleteSubmission, handleUploadPhoto } =
    useSubmissionActions({ triggerRefresh });

  const [permission, requestPermission] = Camera.useCameraPermissions();

  const handleCardPress = (submissionId: number) => {
    router.navigate({
      pathname: '/(details)/submission-detail' as any,
      params: { submissionId: String(submissionId) },
    });
  };

  const handleTakePhoto = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Permission required',
          'Camera permission is needed to take photos'
        );
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await handleUploadPhoto(result.assets[0].uri);
    }
  };

  const handleChooseFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await handleUploadPhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={layout.container}>
      {uploading && (
        <View
          style={[
            layout.centerContent,
            {
              backgroundColor: 'rgba(0,0,0,0.7)',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            },
          ]}>
          <ActivityIndicator
            size='large'
            color={COLORS.white}
          />
          <Text style={[typography.h2, { color: COLORS.white }]}>
            Uploading photo...
          </Text>
          <Text style={[typography.body, { color: COLORS.white }]}>
            Please wait while we process your image
          </Text>
        </View>
      )}
      {/* Main content container */}
      <View style={layout.container}>
        {loading ? (
          <View style={layout.centerContent}>
            <ActivityIndicator
              size='large'
              color={COLORS.primary}
            />
            <Text style={typography.body}>Loading submissions...</Text>
          </View>
        ) : error ? (
          <View style={layout.centerContent}>
            <Text style={[typography.body, { color: COLORS.errorBackground }]}>
              {error}
            </Text>
          </View>
        ) : (
          <>
            {submissions.length === 0 ? (
              <View style={layout.centerContent}>
                <Ionicons
                  name='leaf-outline'
                  size={64}
                  color={COLORS.border}
                />
                <Text style={typography.h2}>No plant submissions yet</Text>
                <Text style={typography.body}>
                  Take a photo of a plant to get started
                </Text>
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={submissions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <SubmissionCard
                    item={item}
                    onPress={handleCardPress}
                    onDelete={handleDeleteSubmission}
                  />
                )}
                contentContainerStyle={{
                  ...(submissions.length > 0 ? {} : { flex: 1 }),
                  paddingBottom: 80,
                }}
                refreshing={loading}
                onRefresh={() => triggerRefresh()}
              />
            )}
          </>
        )}
      </View>
      <FloatingActionButton
        onTakePhoto={handleTakePhoto}
        onOpenGallery={handleChooseFromGallery}
      />
    </View>
  );
}
