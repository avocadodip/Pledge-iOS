import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Color } from "../GlobalStyles";
import Todo from "../components/todo/Todo";
import TimeButton from "../components/TimeButton";
import NextButton from "../components/NextButton";
import OnboardingPopup from "../components/OnboardingPopup";

const Today = () => {
  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Welcome to Fervo!</Text>
        <Text style={styles.descTitle}>Now, adjust your preferences so Fervo works best for you!</Text>
        <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceTitle}> Day Start </Text>
        <TimeButton defaultTime="9:00 AM" />
      </View>
      <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceTitle}> Day End </Text>
        <TimeButton defaultTime="11:00 PM" />
      </View>
      <NextButton title="Ready to go!" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 20,
  },
  headerContainer: {
    paddingTop: 20,
    paddingLeft: 20,
    width: "100%",
    flexDirection: "col",
    marginBottom: 20,
    gap: 20,
    // borderWidth: 1,
    // borderColor: 'black',
  },
  headerTitle: {
    color: Color.white,
    fontSize: 30,
    fontWeight: "bold",
  },
  descTitle: {
    color: Color.white,
    fontSize: 26,
    lineHeight: 44,
  },
  todoContainer: {
    marginTop: 20,
    gap: 22,
    width: "100%",
  },
  preferenceContainer: {
    paddingTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'black',
  },
  preferenceTitle: {
    color: Color.white,
    fontSize: 26,
  },
  nextButton: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    gap: 4,
    width: 187,
    height: 61,
    borderRadius: 20,
    backgroundColor: Color.white,
  },
  nextButtonTitle: {
    fontFamily: 'Epilogue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 20,
    color: '#DD4F4F',
  },
});

export default Today;
