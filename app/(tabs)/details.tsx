import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';

type DetailsScreenRouteProp = RouteProp<{ params: { repo: { full_name: string; name: string; description: string; stargazers_count: number } } }, 'params'>;

const Details: React.FC = () => {
  const route = useRoute<DetailsScreenRouteProp>();
  const { repo } = route.params;
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepoDetails();
  }, []);

  const fetchRepoDetails = async () => {
    try {
      const response = await axios.get(`https://api.github.com/repos/${repo.full_name}`);
      setDetails(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails :", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {details ? (
        <>
          <Text style={styles.title}>{details.name}</Text>
          <Text style={styles.author}>Author: {details.owner.login}</Text>
          <Text style={styles.description}>{details.description || 'No description available'}</Text>
          <Text style={styles.info}>⭐ Stars: {details.stargazers_count}</Text>
          <Text style={styles.info}>🍴 Forks: {details.forks_count}</Text>
          <Text style={styles.info}>📅 Created: {new Date(details.created_at).toDateString()}</Text>
          <Text style={styles.info}>🔄 Updated: {new Date(details.updated_at).toDateString()}</Text>
          <Text style={styles.info}>🔢 Open Issues: {details.open_issues_count}</Text>
        </>
      ) : (
        <Text>No details available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f9f9f9' },
  loader: { marginTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  author: { fontSize: 18, marginBottom: 5 },
  description: { fontSize: 16, color: '#555', marginVertical: 10 },
  info: { fontSize: 14, color: '#777', marginVertical: 2 },
});

export default Details;