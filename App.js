import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import Home from "./screens/home";
import Search from "./screens/search";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTransparent: true,
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation, route }) => ({
            title: "",
            headerRight: () => (
              <Ionicons
                name="ios-search"
                size={22}
                color="white"
                style={styles.icons}
                onPress={() => navigation.navigate("Search")}
              />
            ),
          })}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: "white",
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icons: {
    padding: 20,
  },
});
