import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Assurez-vous d'installer ce package
import axios from 'axios';


export default function GitHubReposScreen() {
  const [language, setLanguage] = useState('javascript'); // Langage par défaut
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRepositories();
  }, [language]);

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=10`
      );
      setRepositories(response.data.items);
    } catch (error) {
      console.error("Erreur lors de la récupération des dépôts :", error);
    } finally {
      setLoading(false);
    }
  };

  const renderRepository = ({ item }: { item: { id: number; name: string; description: string; stargazers_count: number } }) => (
    <TouchableOpacity>
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description || 'Pas de description'}</Text>
      <Text style={styles.stars}>⭐ {item.stargazers_count}</Text>
    </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélectionnez un langage :</Text>
      <Picker
        selectedValue={language}
        onValueChange={(itemValue) => setLanguage(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="JavaScript" value="javascript" />
        <Picker.Item label="Python" value="python" />
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="C++" value="cpp" />
        <Picker.Item label="Go" value="go" />
        <Picker.Item label="Ruby" value="ruby" />
        <Picker.Item label="Swift" value="swift" />
      </Picker>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={repositories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRepository}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f9f9f9' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  picker: { height: 50, width: '100%', marginBottom: 20, backgroundColor: '#e0e0e0' },
  loader: { marginTop: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  description: { fontSize: 14, color: '#555', marginVertical: 5 },
  stars: { fontSize: 14, color: '#777' },
});
