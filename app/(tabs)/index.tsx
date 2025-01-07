import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';

export default function GitHubReposScreen() {
  const [language, setLanguage] = useState('javascript');
  const [dateFilter, setDateFilter] = useState('any');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  type RootStackParamList = {
    details: { repo: { full_name: string; name: string; description: string; stargazers_count: number } };
  };
  
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchRepositories();
  }, [language, dateFilter]);

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      let dateQuery = '';
      if (dateFilter !== 'any') {
        const today = moment();
        switch (dateFilter) {
          case 'today':
            dateQuery = `pushed:>${today.subtract(1, 'days').format('YYYY-MM-DD')}`;
            break;
          case 'this_week':
            dateQuery = `pushed:>${today.subtract(1, 'weeks').format('YYYY-MM-DD')}`;
            break;
          case 'this_month':
            dateQuery = `pushed:>${today.subtract(1, 'months').format('YYYY-MM-DD')}`;
            break;
          case 'this_year':
            dateQuery = `pushed:>${today.subtract(1, 'years').format('YYYY-MM-DD')}`;
            break;
        }
      }
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=language:${language}${dateQuery ? `+${dateQuery}` : ''}&sort=stars&order=desc&per_page=10`
      );
      setRepositories(response.data.items);
    } catch (error) {
      console.error("Erreur lors de la récupération des dépôts :", error);
    } finally {
      setLoading(false);
    }
  };

  const renderRepository = ({ item }: { item: { id: number; full_name: string; name: string; description: string; stargazers_count: number } }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('details', { repo: item })}
    >
      <View>
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
      <Text style={styles.title}>Filtrer par dernière mise à jour :</Text>
      <Picker
        selectedValue={dateFilter}
        onValueChange={(itemValue) => setDateFilter(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Any" value="any" />
        <Picker.Item label="Today" value="today" />
        <Picker.Item label="This Week" value="this_week" />
        <Picker.Item label="This Month" value="this_month" />
        <Picker.Item label="This Year" value="this_year" />
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