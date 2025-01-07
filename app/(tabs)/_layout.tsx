import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function StackLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false, // This will remove the header for all screens
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: 'Details',
          headerShown: true, // Show the header for the details screen
          headerBackVisible: false, // Hide the back button
          headerTintColor: Colors[colorScheme ?? 'light'].tint, // Customize the back arrow color
        }}
      />
    </Stack>
  );
}