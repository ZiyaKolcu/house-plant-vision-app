import * as Network from 'expo-network';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Alert } from 'react-native';
import { fetchData, uploadFile } from '../app/utils/api';

export default function useSubmissionActions({
  triggerRefresh,
}: {
  triggerRefresh: () => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleDeleteSubmission = async (submissionId: number) => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        Alert.alert(
          'Error',
          'Authentication token not found. Please sign in again.'
        );
        return;
      }

      Alert.alert(
        'Delete Submission',
        'Are you sure you want to delete this submission?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await fetchData(`http://192.168.1.101:8000/api/v1/submissions/${submissionId}`, {
                  method: 'DELETE',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                });

                triggerRefresh();
                Alert.alert('Success', 'Submission deleted successfully.');
              } catch (error) {
                console.error('Error deleting submission:', error);
                Alert.alert(
                  'Error',
                  `Failed to delete submission: ${
                    (error as Error)?.message || 'Unknown error'
                  }`
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error preparing deletion:', error);
      Alert.alert('Error', `An error occurred: ${(error as Error)?.message}`);
    }
  };

  const handleUploadPhoto = async (uri: string) => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      if (!networkState.isConnected) {
        Alert.alert(
          'No Internet',
          'Please check your internet connection and try again.'
        );
        return false;
      }

      let retryCount = 0;
      const maxRetries = 3;
      const baseDelay = 1000;

      while (retryCount <= maxRetries) {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        let controller: AbortController | null = null;

        try {
          const token = await SecureStore.getItemAsync('access_token');
          if (!token) {
            Alert.alert(
              'Error',
              'Authentication token not found. Please sign in again.'
            );
            return false;
          }

          setUploading(true);

          try {
            const delay =
              retryCount > 0 ? baseDelay * Math.pow(2, retryCount - 1) : 0;
            if (delay > 0) {
              await new Promise((resolve) => setTimeout(resolve, delay));
              console.log(`Retrying after ${delay}ms delay`);
            }

            const uriParts = uri.split('.');
            const fileType = uriParts[uriParts.length - 1];

            const formData = new FormData();
            formData.append('file', {
              uri,
              name: `photo_${Date.now()}.${fileType}`,
              type: `image/${fileType.toLowerCase()}`,
            } as any);

            controller = new AbortController();
            timeoutId = setTimeout(() => controller!.abort(), 15000);

            await uploadFile('http://192.168.1.101:8000/api/v1/submissions/', formData, {
              token,
              signal: controller.signal,
            });

            if (timeoutId) clearTimeout(timeoutId);
            setUploading(false);
            triggerRefresh();
            Alert.alert('Success', 'Photo uploaded successfully.');
            return true;
          } catch (err: any) {
            if (timeoutId) clearTimeout(timeoutId);

            console.error('Upload error details:', {
              message: err.message,
              status: err.response?.status,
              data: err.response?.data,
              stack: err.stack,
            });

            let errorMessage = 'Photo upload failed';
            if (err.name === 'AbortError') {
              errorMessage =
                'Upload timed out. Please check your connection and try again.';
            } else if (
              err.message?.includes('Network Error') ||
              err.response?.status === 0
            ) {
              if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying upload (attempt ${retryCount})`);
                continue;
              }
              errorMessage =
                'Network error. Please check your internet connection.';
            } else {
              errorMessage =
                err?.response?.data?.message || err?.message || errorMessage;
            }

            Alert.alert(
              'Upload Error',
              `${errorMessage}\n\nStatus: ${err.response?.status || 'Unknown'}`
            );
            return false;
          } finally {
            if (timeoutId) clearTimeout(timeoutId);
            setUploading(false);
          }
        } catch (error) {
          setUploading(false);
          console.error('Gallery error:', error);
          Alert.alert('Error', 'An error occurred: ' + (error as any)?.message);
          return false;
        }
      }

      return false;
    } catch (networkError) {
      console.error('Network check failed:', networkError);
      Alert.alert('Error', 'Could not check network status. Please try again.');
      return false;
    }
  };

  return {
    uploading,
    handleDeleteSubmission,
    handleUploadPhoto,
  };
}
