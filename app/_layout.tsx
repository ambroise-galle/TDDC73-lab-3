import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff',
        contentStyle: { backgroundColor: '#f9f9f9' },
      }}
    />
  );
}
