import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CreditCardIcon from '../assets/icons/credit-card.svg';
import ProfileIcon from '../assets/icons/user-profile-circle.svg';
import LibraryIcon from '../assets/icons/library-outline.svg';
import RightChevronIcon from '../assets/icons/right-chevron.svg';

import React from "react";

const Settings = ({ navigation }) => {
  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.divider} />
      </View>
      <TouchableOpacity
        style={styles.settingsItemContainer}
        onPress={() => handlePress("Account")}
      >
        <View style={styles.settingsItem}>
          <ProfileIcon size={24} color="white" style={styles.icon} />
          <Text style={styles.settingsItemText}>Account</Text>
        </View>
        <RightChevronIcon size={24} color="white" style={styles.chevronIcon} />
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity
        style={styles.settingsItemContainer}
        onPress={() => handlePress("Stats")}
      >
        <View style={styles.settingsItem}>
          <LibraryIcon size={24} color="white" style={styles.icon} />
          <Text style={styles.settingsItemText}>Stats</Text>
        </View>
        <RightChevronIcon size={24} color="white" style={styles.chevronIcon} />
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity
        style={styles.settingsItemContainer}
        onPress={() => handlePress("Billing")}
      >
        <View style={styles.settingsItem}>
          <CreditCardIcon size={24} color="white" style={styles.icon} />
          <Text style={styles.settingsItemText}>Billing</Text>
        </View>
        <RightChevronIcon size={24} color="white" style={styles.chevronIcon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 20,
  },
  headerContainer: {
    marginTop: 10,
    width: "100%",
    flexDirection: "column",
  },
  headerTitle: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    width: "100%",
    marginVertical: 10,
  },
  settingsItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    width: "100%",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  settingsItemText: {
    fontSize: 20,
    color: "white",
  },
  chevronIcon: {
    marginLeft: 10,
  },
});