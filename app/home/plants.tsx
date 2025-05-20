import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import PlantCard from "../../components/PlantCard";
import { COLORS } from "../../styles/colors";
import { layout } from "../../styles/layout";
import { typography } from "../../styles/typography";
import { fetchData } from "../utils/api";

type Plant = {
  id: number;
  scientific_name: string;
  common_name: string;
  description: string;
  care_tips: string;
  image_url: string;
};

export default function PlantsScreen() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData<Plant[]>("http://192.168.1.101:8000/api/v1/plants")
      .then((data) => {
        setPlants(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Data could not be retrieved.");
        setLoading(false);
      });
  }, []);

  return (
    <View style={layout.container}>
      <FlatList
        contentContainerStyle={{
          padding: 16,
          gap: 16,
        }}
        data={plants}
        renderItem={({ item }) => <PlantCard plant={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? null : (
            <View style={layout.centerContent}>
              <Text style={typography.body}>No plants found</Text>
            </View>
          )
        }
      >
        {loading && (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 24 }}
          />
        )}
        {error && (
          <Text
            style={[
              typography.body,
              { color: COLORS.errorBackground, marginVertical: 20 },
            ]}
          >
            {error}
          </Text>
        )}
      </FlatList>
    </View>
  );
}
