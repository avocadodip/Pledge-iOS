import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import React from "react";
import {
  APP_HORIZONTAL_PADDING,
  Color,
  SETTINGS_HORIZONTAL_PADDING,
} from "../../GlobalStyles";
import LeftChevronIcon from "../../assets/icons/chevron-left.svg";
import TouchableRipple from "../TouchableRipple";

const SettingsHeader = ({ navigation, header, altScreen }) => {
  const handlePress = () => {
    const screenName = altScreen || "SettingsScreen";
    navigation.navigate(screenName);
  };
  return (
    <View style={(header !== "Change Email" && header !== "Delete Account") ? styles.outerContainer : {}}>
      <View style={styles.headerContainer}>
        <View style={styles.buttonWrapper}>
          <TouchableHighlight
            style={styles.backButton}
            onPress={handlePress}
            underlayColor="#00000023"
          >
            <LeftChevronIcon width={24} height={24} color={Color.white} />
          </TouchableHighlight>
        </View>
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>{header}</Text>
        </View>
      </View>
    </View>
  );
};

export default SettingsHeader;

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: APP_HORIZONTAL_PADDING,
    borderBottomColor: "#ffffff18",
    borderBottomWidth: 1,
  },
  headerContainer: {
    marginTop: 30,
    marginBottom: 25,
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
    fontWeight: "600",
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
