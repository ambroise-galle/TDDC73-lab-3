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
          title: 'Search',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: 'Details',
          headerShown: true, // Show the header for the details screen
          headerBackVisible: true, // Hide the back button
          headerTintColor: 'rgb(10, 126, 164)', // Customize the back arrow color
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}