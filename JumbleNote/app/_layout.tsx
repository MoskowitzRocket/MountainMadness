import React from "react";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="JumbleNote" 
      options={{
        headerTitle: "JumbleNote",
      }}/>
      {/* <Stack.Screen name="About" 
      options={{
        headerTitle: "AboutScreen",
      }}/> */}
    </Stack>
  );
} 