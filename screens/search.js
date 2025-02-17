import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Container from "./container";
import { TextInput } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const Search = ({ navigation }) => {
  const [inputText, setInputText] = useState();
  return (
    <View style={styles.rootContainer}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Ionicons
          onPress={() => navigation.goBack()}
          name="ios-arrow-back"
          size={24}
          color="black"
          style={styles.backArrow}
        />
        <GooglePlacesAutocomplete
          ref={(input) => {
            let textInput = input;
            setInputText(textInput?.getAddressText());
          }}
          placeholder="Search"
          minLength={2}
          debounce={200}
          autoFocus={true}
          enablePoweredByContainer={false}
          fetchDetails={true}
          query={{
            key: "AIzaSyBhJVg447OqHMs2BUbhzM-Ohs1mkySZLfA",
            language: "en",
            types: "(cities)",
            components: "country:us",
          }}
          onPress={(data, details = null) => {
            navigation.navigate("Home", {
              locationDetail: {
                lon: details.geometry.location.lng,
                lat: details.geometry.location.lat,
                city: details.name,
              },
            });
          }}
          onFail={(error) => console.error(error)}
        />
      </View>
      {!inputText ? (
        <Text style={styles.statusText}>Enter a location name.</Text>
      ) : null}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  rootContainer: {
    margin: 10,
    paddingTop: 50,
    flex: 1,
    justifyContent: "flex-start",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 5,
    borderColor: "rgb(246, 248, 250)",
  },
  backArrow: {
    alignSelf: "flex-start",
    paddingTop: 9,
    color: "#5d5d5dd6",
    paddingLeft: 7,
  },
  statusText: {
    alignSelf: "center",
    paddingTop: 150,
    fontSize: 18,
    color: "#5d5d5dd6",
  },
});
