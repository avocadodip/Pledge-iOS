import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Color } from "../GlobalStyles";
import Todo from "../components/Todo";

const Today = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Today</Text>
        <Text style={styles.subtitle}>Ends @ 9:00 PM</Text>
        <Todo />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 0,
    gap: 11,
    position: "absolute",
    width: 192,
    height: 66,
    left: 33,
    top: 87,
  },
  title: {
    color: Color.white,
    fontSize: 48,
    fontWeight: "bold",
  },
  subtitle: {
    color: Color.white,
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Today;
