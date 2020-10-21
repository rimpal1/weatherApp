import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Container from "./container";

const Search = () => {
  return (
    <Container>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Text>Search page</Text>
      </View>
    </Container>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
