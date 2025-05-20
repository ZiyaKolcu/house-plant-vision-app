import { Stack, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import PlantCard from "../../components/PlantCard";
import { components } from "../../styles/components";
import { layout } from "../../styles/layout";
import { typography } from "../../styles/typography";
import { fetchData } from "../utils/api";

const PredictionDetailScreen: React.FC = () => {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Plant Prediction",
        }}
      />
      <PredictionDetailContent />
    </>
  );
};

const PredictionDetailContent: React.FC = () => {
  const { submissionId } = useLocalSearchParams<{ submissionId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [plant, setPlant] = useState<any>(null);

  useEffect(() => {
    const fetchPredictionAndPlant = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");
        if (!token) {
          setError("Authentication token not found. Please sign in again.");
          setLoading(false);
          return;
        }

        const predictions = await fetchData<any[]>(
          "http://192.168.1.101:8000/api/v1/predictions/my",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Predictions data:", predictions);

        const foundPrediction = predictions.find(
          (p: any) => p.submission_id === Number(submissionId)
        );

        if (!foundPrediction) {
          setError("Prediction not found for this submission.");
          setLoading(false);
          return;
        }
        setPrediction(foundPrediction);

        const plantData = await fetchData<any>(
          `http://192.168.1.101:8000/api/v1/plants/id/${foundPrediction.species_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Plant data:", plantData);
        setPlant(plantData);
        setLoading(false);
      } catch (e: any) {
        console.error("Error fetching prediction or plant info:", e);
        setError(`Failed to load data: ${e.message || "Unknown error"}`);
        setLoading(false);
      }
    };
    fetchPredictionAndPlant();
  }, [submissionId]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={layout.container}>
      <ScrollView>
        {prediction && (
          <View style={components.submissionCard}>
            {plant && (
              <>
                <Text style={typography.h2}>Plant Information</Text>
                <PlantCard plant={plant} />
              </>
            )}
            <Text style={typography.body}>
              Confidence:{" "}
              {prediction.confidence_score.toString().split(".")[1].slice(0, 2)}
              %
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PredictionDetailScreen;
