import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

type DetailsScreenRouteProp = RouteProp<{ params: { repo: { name: string; description: string; stargazers_count: number } } }, 'params'>;

const Details: React.FC = () => {
  const route = useRoute<DetailsScreenRouteProp>();
  const { repo } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{repo.name}</Text>
      <Text style={styles.description}>{repo.description || 'Pas de description'}</Text>
      <Text style={styles.stars}>⭐ {repo.stargazers_count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, color: '#555', marginVertical: 10 },
  stars: { fontSize: 14, color: '#777' },
});

export default Details;