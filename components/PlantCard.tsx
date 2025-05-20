import React from 'react';
import { Image, Text, View } from 'react-native';
import { components } from '../styles/components';
import { typography } from '../styles/typography';

interface PlantCardProps {
  plant: {
    id: number;
    common_name: string;
    scientific_name: string;
    description: string;
    care_tips: string;
    image_url: string;
  };
}

const PlantCard: React.FC<PlantCardProps> = ({ plant }) => {
  return (
    <View
      key={plant.id}
      style={components.plantCard}>
      <Image
        source={{ uri: plant.image_url }}
        style={components.plantImage}
        resizeMode='cover'
      />
      <Text style={typography.h2}>{plant.common_name}</Text>
      <Text style={typography.bodySmall}>{plant.scientific_name}</Text>
      <Text style={typography.body}>{plant.description}</Text>
      <Text style={typography.h3}>Care Tips</Text>
      <Text style={typography.body}>{plant.care_tips}</Text>
    </View>
  );
};

export default PlantCard;
