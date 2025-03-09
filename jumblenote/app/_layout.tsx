import React from "react";
import { Stack } from "expo-router";

import { useFonts } from "expo-font";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Mohave: require("../assets/fonts/Mohave-VariableFont_wght.ttf"),
    // You can add more variants as needed
  });
  return (
    <Stack screenOptions={{ headerShown: false,}}>
      {/* <Stack.Screen name="index" options = {{title}} /> */}
    </Stack>
  );
} 