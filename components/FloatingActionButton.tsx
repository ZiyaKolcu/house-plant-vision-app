import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../styles/colors';
import { components } from '../styles/components';
import { typography } from '../styles/typography';

interface FloatingActionButtonProps {
  onTakePhoto: () => void;
  onOpenGallery: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onTakePhoto,
  onOpenGallery,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <View style={components.fabContainer}>
      {isMenuOpen && (
        <View style={components.fabMenuContainer}>
          <TouchableOpacity
            style={components.fabMenuItem}
            onPress={() => {
              onTakePhoto();
              setIsMenuOpen(false);
            }}>
            <MaterialIcons
              name='camera-alt'
              size={24}
              color={COLORS.primary}
            />
            <Text style={[typography.body, { marginLeft: 8 }]}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={components.fabMenuItem}
            onPress={() => {
              onOpenGallery();
              setIsMenuOpen(false);
            }}>
            <MaterialIcons
              name='photo-library'
              size={24}
              color={COLORS.primary}
            />
            <Text style={[typography.body, { marginLeft: 8 }]}>Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={components.fab}
        onPress={toggleMenu}
        activeOpacity={0.8}>
        <MaterialIcons
          name={isMenuOpen ? 'close' : 'add-photo-alternate'}
          size={24}
          color={COLORS.white}
        />
        <Text style={[typography.body, { marginLeft: 8, fontWeight: '600' }]}>
          {isMenuOpen ? 'Close' : 'New Submission'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FloatingActionButton;
