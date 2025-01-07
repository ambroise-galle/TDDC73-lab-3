import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
      console.error("Error fetching repositories:", error);
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
        <Text style={styles.description}>{item.description || 'No description available'}</Text>
        <Text style={styles.stars}>⭐ {item.stargazers_count}</Text>
      </View>
    </TouchableOpacity>
  );

  const languages = ['Javascript', 'Python', 'Java', 'C++', 'Go', 'Ruby', 'Swift'];
  const dateFilters = ['Any', 'Today', 'This week', 'This month', 'This year'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a language and filter by last update:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        <View style={styles.buttonContainer}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[styles.button, language === lang && styles.selectedButton]}
              onPress={() => setLanguage(lang)}
            >
              <Text style={styles.buttonText}>{lang}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        <View style={styles.buttonContainer}>
          {dateFilters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.button, dateFilter === filter && styles.selectedButton]}
              onPress={() => setDateFilter(filter)}
            >
              <Text style={styles.buttonText}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  scrollContainer: {
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 100
  },
  button: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    margin: 5,
    height: 40
  },
  selectedButton: {
    backgroundColor: '#007bff'
  },
  buttonText: {
    color: '#000' ,
    fontWeight: 'bold'
  },
  loader: {
    marginTop: 20
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5
  },
  stars: {
    fontSize: 14,
    color: '#777'
  },
});