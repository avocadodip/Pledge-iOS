import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Color } from "../GlobalStyles";
import LeftChevronIcon from "../assets/icons/chevron-left.svg";

const SettingsHeader = ({ navigation, header }) => {
  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => handlePress("SettingsScreen")}
      >
        <LeftChevronIcon width={24} height={24} color={Color.white} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{header}</Text>
    </View>
  );
};

export default SettingsHeader;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 20,
    paddingLeft: 20,
    width: "100%",
    flexDirection: "row",
    marginBottom: 20,
  },
  headerTitle: {
    color: Color.white,
    fontSize: 20,
    marginLeft: 24,
  },
  backButton: {
    padding: 1
  },
});
