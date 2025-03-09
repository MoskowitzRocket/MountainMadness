import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

export default function NoteDetails() {
  const params = useLocalSearchParams();

  const { id } = params

  console.log("Route ID:", id); // Debugging



  return (
    <View>
      <Text>Note ID: {id ?? "Not Found"}</Text>
    </View>
  );
}