import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRouter, useLocalSearchParams } from 'expo-router';
import { Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Product } from '../models/product.model';
import { Unit } from '../models/unit.model';
import { CartModel } from '../models/cart.model';
import { useGetAppData } from '../hooks/useGetAppData';
import { Screens } from '../enum/screens';
import { useHandleRouteChange } from '../hooks/useHandleRouteChange';
import ChatBubble from '../components/ChatBubble';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [quantities, setQuantities] = useState<{ [productId: number]: number }>({});
  const { categoryId } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const navIconSize = 32;

  const getAppData = useGetAppData();
  const handleRouteChange = useHandleRouteChange();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await fetch('http://192.168.100.139:3000' + `/products/category/${categoryId}`);
        const data = await response.json();

        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Błąd podczas pobierania produktów:', error);
      }
    };

    const fetchUnits = async () => {
      try {
        const response = await fetch('http://192.168.100.139:3000' + `/units`);
        const data = await response.json();

        setUnits(data);
      } catch (error) {
        console.error('Błąd podczas pobierania jednostek:', error);
      }
    };

    fetchUnits();
    fetchProductsByCategory();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    const filteredData = products.filter((product: Product) => product.name.toLowerCase().includes(text.toLowerCase()));
    setFilteredProducts(filteredData);
  };

  const getUnitSymbol = (unitId: number): string => {
    const productUnit = units.find((unit: Unit) => unit.unit_id === unitId);

    return productUnit ? productUnit.unit_symbol : '-';
  };

  const handleQuantityChange = (productId: number, value: number) => {
    if (value >= 0) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: value,
      }));
    }
  };

  const increaseQuantity = (productId: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
  };

  const decreaseQuantity = (productId: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max((prevQuantities[productId] || 0) - 1, 0),
    }));
  };

  const addToCart = async (product: Product) => {
    const quantity = quantities[product.product_id] || 0;

    if (quantity <= 0) {
      Alert.alert('Enter amount greater than 0');
      return;
    }

    if (product.amount < quantity) {
      Alert.alert(`Available amount for product "${product.name}" is ${product.amount}`);
      return;
    }

    try {
      const carts = await fetch('http://192.168.100.139:3000' + `/carts`);
      const cartsData = await carts.json();
      const userId = await getAppData('userId');
      const userCart = cartsData.find((cart: CartModel) => cart.user_id === userId);

      const newCartItem = {
        cart_id: userCart.cart_id,
        product_id: product.product_id,
        quantity: quantity,
      };

      const response = await fetch('http://192.168.100.139:3000' + '/cart-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCartItem),
      });

      if (response.ok) {
        Alert.alert(`"${product.name}" has been added to your cart`);
      } else {
        throw new Error(`Błąd podczas dodawania do koszyka: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Błąd:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ChatBubble />
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search products" value={searchQuery} onChangeText={handleSearch} selectionColor="#013b3d" />
        <FontAwesome5 name="search" size={22} color="#013b3d" style={styles.searchIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {filteredProducts.map((product: Product, index: number) => (
          <View key={index} style={styles.gridItem}>
            <View style={styles.productNameContainer}>
              <Text style={styles.productText}>{product.name}</Text>
            </View>
            <Text style={styles.productText}>{product.price + ' $ / ' + getUnitSymbol(product.unit_id)}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => decreaseQuantity(product.product_id)}>
                <Feather name="minus" size={26} color="#013b3d" />
              </TouchableOpacity>
              <TextInput
                style={styles.quantityInput}
                keyboardType="numeric"
                value={(quantities[product.product_id] || 0).toString()}
                selectionColor="#013b3d"
                onChangeText={(text) => handleQuantityChange(product.product_id, Number(text))}
              />
              <TouchableOpacity onPress={() => increaseQuantity(product.product_id)}>
                <Feather name="plus" size={26} color="#013b3d" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => addToCart(product)}>
              <Feather name="shopping-cart" size={16} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.Categories)}>
          <FontAwesome5 name="th-list" size={navIconSize} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/')}>
          <FontAwesome5 name="home" size={navIconSize} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleRouteChange(Screens.Cart)}>
          <FontAwesome5 name="shopping-basket" size={navIconSize} color="#013b3d" />
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
  scrollView: {
    flex: 1,
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
    height: 180,
    margin: 15,
    backgroundColor: '#e8fefd',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  productNameContainer: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#013b3d',
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#013b3d',
    backgroundColor: '#e8fefd',
    borderRadius: 10,
    textAlign: 'center',
    width: 50,
    height: 30,
    marginHorizontal: 10,
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#013b3d',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#013b3d',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 15,
    marginBottom: 5,
  },
  addButtonText: {
    fontSize: 16,
    color: '#e8fefd',
    marginLeft: 8,
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
