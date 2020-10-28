import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Container = ({ children }) => {
  return (
    <LinearGradient
      colors={["#4655ef", "#5c69f2", "#8fb7f3"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>{children}</SafeAreaView>
    </LinearGradient>
  );
};

export default Container;

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  container: {
    flex: 1,
    marginHorizontal: 15
  }
});
