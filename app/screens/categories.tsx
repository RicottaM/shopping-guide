import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Category } from '../models/category.model';
import * as SecureStore from 'expo-secure-store';
import { useNavigation, useRouter } from 'expo-router';
import { Screens } from '../enum/screens';
import { useHandleRouteChange } from '../hooks/useHandleRouteChange';
import { useGetAppData } from '../hooks/useGetAppData';
import ChatBubble from '../components/ChatBubble';

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const navigation = useNavigation();

  const handleRouteChange = useHandleRouteChange();
  const getAppData = useGetAppData();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const storeId = await getAppData('selectedStoreId');
        const response = await fetch(`http://172.20.10.3:3000/stores/${storeId}/categories`);
        const data = await response.json();

        setCategories(data);
        setFilteredCategories(data);
      } catch (error) {
        console.error('Błąd podczas pobierania kategorii:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    const filteredData = categories.filter((category: Category) => category.category_name.toLowerCase().includes(text.toLowerCase()));

    setFilteredCategories(filteredData);
  };

  const handleCategoryPress = (categoryId: number) => {
    router.push(`/screens/products?categoryId=${categoryId}`);
  };

  return (
    <View style={styles.container}>
      <ChatBubble />
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search categories" value={searchQuery} onChangeText={handleSearch} selectionColor="#013b3d" />
        <FontAwesome5 name="search" size={26} color="#013b3d" style={styles.searchIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {filteredCategories.length > 0 &&
          filteredCategories.map((category: Category, index: number) => (
            <TouchableOpacity key={index} style={styles.gridItem} onPress={() => handleCategoryPress(category.category_id)}>
              <Text style={styles.categoryText}>{category.category_name}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.Map)}>
          <FontAwesome5 name="map-marked-alt" size={32} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/')}>
          <FontAwesome5 name="home" size={32} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.Cart)}>
          <FontAwesome5 name="shopping-basket" size={32} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.User)}>
          <FontAwesome name="user" size={32} color="#013b3d" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a0cbb3',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8fefd',
    width: 330,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    marginTop: 80,
    marginHorizontal: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    color: '#013b3d',
    backgroundColor: '#e8fefd',
    borderWidth: 1,
    borderColor: '#e8fefd',
  },
  searchIcon: {
    marginLeft: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridItem: {
    width: 150,
    height: 150,
    margin: 15,
    backgroundColor: '#e8fefd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  categoryText: {
    fontSize: 18,
    color: '#013b3d',
    textAlign: 'center',
    fontWeight: '600',
    padding: 10,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 30,
    paddingBottom: 50,
    paddingTop: 30,
  },
  navButton: {
    alignItems: 'center',
    backgroundColor: '#e8fefd',
    padding: 15,
    borderRadius: 15,
    width: 66,
    height: 62,
  },
});
