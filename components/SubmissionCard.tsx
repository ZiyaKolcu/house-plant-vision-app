import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import AuthenticatedImage from '../components/AuthenticatedImage';
import { COLORS } from '../styles/colors';
import { components } from '../styles/components';
import { layout } from '../styles/layout';
import { typography } from '../styles/typography';

interface SubmissionCardProps {
  item: {
    id: number;
    submitted_at: string;
    status: string;
  };
  onPress: (id: number) => void;
  onDelete?: (id: number) => void;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({
  item,
  onPress,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(item.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <TouchableOpacity
      style={components.submissionCard}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}>
      <AuthenticatedImage
        submissionId={item.id}
        style={components.submissionImage}
      />
      <View
        style={[
          layout.row,
          {
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          },
        ]}>
        <Text
          style={[typography.bodySmall, { padding: 8 }]}
          numberOfLines={1}>
          {new Date(item.submitted_at).toLocaleString()}
        </Text>
        {isDeleting ? (
          <ActivityIndicator
            size='small'
            color='#FF6B6B'
          />
        ) : (
          <TouchableOpacity
            onPress={handleDelete}
            style={{ padding: 12 }}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Ionicons
              name='trash-outline'
              size={18}
              color={COLORS.errorBackground}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={{ padding: 8 }}>
        <Text
          style={[
            typography.bodySmall,
            {
              color:
                item.status === 'completed'
                  ? COLORS.success
                  : item.status === 'processing'
                  ? COLORS.primary
                  : COLORS.textSecondary,
              fontSize: 14,
              fontWeight: '600',
            },
          ]}
          numberOfLines={1}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SubmissionCard;
