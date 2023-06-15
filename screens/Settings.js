import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color } from "../GlobalStyles";
import RightChevronIcon from "../assets/icons/right-chevron.svg";
import UserCircleIcon from "../assets/icons/user-profile-circle.svg";
import HistoryIcon from "../assets/icons/history-icon.svg";
import CreditCardIcon from "../assets/icons/credit-card.svg";
import LogoutIcon from "../assets/icons/logout.svg";
import SunThemeIcon from "../assets/icons/sun-theme-icon.svg";

import OnboardingPopup from "../components/OnboardingPopup";
import TouchableRipple from "../components/TouchableRipple";
import React from "react";
import { auth } from "../database/firebase";
import ThemeToggle from "../components/ThemeToggle";

const Settings = ({ navigation }) => {
  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      {/* <OnboardingPopup
        texts={['Are you sure you want to logout?', 'You will be fined for unentered tasks each day.']}
        buttonTitle="Back to settings."
        secondButtonTitle="Log me out."
      /> */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.mainContainer}>
        <TouchableRipple
          style={styles.button}
          onPress={() => handlePress("Account")}
        >
          <View style={styles.leftSettingsButton}>
            <UserCircleIcon width={24} height={24} color={Color.white} />
            <Text style={styles.buttonTitle}>Account</Text>
          </View>
          <View style={styles.chevronContainer}>
            <RightChevronIcon width={24} height={24} color={Color.white} />
          </View>
        </TouchableRipple>
        <TouchableRipple
          style={styles.button}
          onPress={() => handlePress("Stats")}
        >
          <View style={styles.leftSettingsButton}>
            <HistoryIcon width={24} height={24} color={Color.white} />
            <Text style={styles.buttonTitle}>Past Bets</Text>
          </View>
          <View style={styles.chevronContainer}>
            <RightChevronIcon width={24} height={24} color={Color.white} />
          </View>
        </TouchableRipple>
        <TouchableRipple
          style={styles.button}
          onPress={() => handlePress("Billing")}
        >
          <View style={styles.leftSettingsButton}>
            <CreditCardIcon width={24} height={24} color={Color.white} />
            <Text style={styles.buttonTitle}>Billing</Text>
          </View>
          <View style={styles.chevronContainer}>
            <RightChevronIcon width={24} height={24} color={Color.white} />
          </View>
        </TouchableRipple>
        {/* THEME */}
        <View style={styles.button}>
          <View style={styles.leftSettingsButton}>
            <SunThemeIcon width={25} height={25} color={Color.white} />
            <Text style={styles.buttonTitle}>Theme</Text>
          </View>
          <View style={styles.rightSettingsButton}>
            <ThemeToggle />
          </View>
        </View>
        {/* LOGOUT */}
        <TouchableRipple style={styles.button} onPress={handleLogout}>
          <View style={styles.leftSettingsButton}>
            <LogoutIcon width={24} height={24} color={Color.white} />
            <Text style={styles.buttonTitle}>Logout</Text>
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 20,
    // borderWidth: 1,
    // borderColor: 'black',
  },
  headerContainer: {
    paddingTop: 20,
    paddingLeft: 20,
    width: "100%",
    flexDirection: "col",
    marginBottom: 20,
  },
  mainContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 16,
    width: "100%",
    overflow: "hidden",
  },
  chevronContainer: {
    marginRight: 7
  },
  button: {
    paddingLeft: 21,
    paddingRight: 15,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSettingsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: Color.white,
    fontSize: 30,
    fontWeight: "bold",
  },
  buttonTitle: {
    color: Color.white,
    fontSize: 18,
    marginLeft: 24,
    fontWeight: 500,
  },
});
