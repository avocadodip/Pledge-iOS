import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Color, SETTINGS_HORIZONTAL_PADDING } from "../GlobalStyles";
import LeftChevronIcon from "../assets/icons/chevron-left.svg";
import TouchableRipple from "./TouchableRipple";

const SettingsHeader = ({ navigation, header, altScreen }) => {
  const handlePress = () => {
    const screenName = altScreen || "SettingsScreen";
    navigation.navigate(screenName);
  };
  return (
    <View style={styles.headerContainer}>
      <View style={styles.buttonWrapper}>
        <TouchableRipple
          style={styles.backButton}
          onPress={handlePress}
        >
          <LeftChevronIcon width={24} height={24} color={Color.white} />
        </TouchableRipple>
      </View>
      <View style={styles.headerTitleWrapper}>
        <Text style={styles.headerTitle}>{header}</Text>
      </View>
    </View>
  );
};

export default SettingsHeader;

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 50,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitleWrapper: {
    flex: 1,
    alignItems: "center",
    marginLeft: "auto",
  },
  headerTitle: {
    color: Color.white,
    fontSize: 19,
    fontWeight: 600,
  },
  buttonWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    position: "absolute",
    left: 0,
  },
  backButton: {
    padding: 16,
  },
});
