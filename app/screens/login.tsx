import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleLogin = async () => {
    //try {
    // const response = await fetch("http://localhost:3000/auth/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email: login,
    //     password,
    //   }),
    //   credentials: "include",
    // });

    // const data = await response.json();

    //if (data.success) {
    router.push("/screens/categories");
    // } else {
    //   Alert.alert("Invalid login or password.");
    // }
    // } catch (error) {
    //   console.error("Błąd podczas logowania:", error);
    //   Alert.alert("Error during login. Please try again.");
    // }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Sign in</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Login"
            keyboardType="email-address"
            autoCapitalize="none"
            selectionColor="#013b3d"
            value={login}
            onChangeText={setLogin}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            selectionColor="#013b3d"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push("/screens/register")}>
        <Text style={styles.signupText}>Don't have an account? Sign up!</Text>
      </TouchableOpacity>

      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.navigate("/screens/map")}
        >
          <FontAwesome5 name="map-marked-alt" size={32} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.navigate("/")}
        >
          <FontAwesome5 name="home" size={32} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.navigate("/screens/cart")}
        >
          <FontAwesome5 name="shopping-basket" size={32} color="#013b3d" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/screens/categories")}
        >
          <FontAwesome5 name="th-list" size={32} color="#013b3d" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 100,
    marginBottom: 10,
    fontWeight: "bold",
  },
  headerText: {
    fontSize: 36,
    color: "#013b3d",
    fontWeight: "600",
  },
  container: {
    flex: 1,
    backgroundColor: "#a0cbb3",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "70%",
    marginTop: 20,
  },
  inputContainer: {
    backgroundColor: "#e8fefd",
    borderRadius: 15,
    paddingTop: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    fontSize: 20,
    marginBottom: 15,
    color: "#013b3d",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#013b3d",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "500",
    borderRadius: 10,
    paddingVertical: 5,
  },
  signupText: {
    color: "#013b3d",
    fontWeight: "500",
    fontSize: 16,
    marginTop: 15,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 30,
    paddingBottom: 50,
    paddingTop: 30,
    bottom: -200,
  },
  navButton: {
    alignItems: "center",
    backgroundColor: "#e8fefd",
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 15,
    width: 66,
    height: 62,
  },
});
