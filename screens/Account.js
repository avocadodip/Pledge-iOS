import { StyleSheet, Text, TextInput, View } from "react-native";
import {
  Color,
  SETTINGS_HORIZONTAL_PADDING,
  settingsPageStyles,
} from "../GlobalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import LeftChevronIcon from "../assets/icons/chevron-left.svg";

import { TouchableOpacity } from "react-native-gesture-handler";
import DaysActiveToggle from "../components/DaysActiveToggle";
import OnboardingPopup from "../components/OnboardingPopup";
import { useSettings } from "../hooks/SettingsContext";
import VacationToggle from "../components/VacationToggle";
import ThemeToggle from "../components/ThemeToggle";
import TimezoneSelector from "../components/TimezoneSelector";
import DeleteAccountButton from "../components/DeleteAccountButton";
import SettingsHeader from "../components/SettingsHeader";
import LogoutButton from "../components/LogoutButton";
import AuthFormButton from "../components/auth/AuthFormButton";

const Account = ({ navigation }) => {
  const {
    currentUserID,
    currentUserFullName,
    currentUserEmail,
    settings: { dayStart, dayEnd, vacationModeOn, theme, daysActive, timezone },
  } = useSettings();

  return (
    <SafeAreaView style={settingsPageStyles.pageContainer}>
      {/* <OnboardingPopup
        texts={['Are you sure you want to delete your account?', 'Progress takes time and failure is a vital part of the process!','If you are struggling to complete tasks, try setting smaller tasks each day. It will pay off over time!']}
        buttonTitle="Let's give this one more go!"
        secondButtonTitle="Yes, delete my account."
      /> */}
      <SettingsHeader navigation={navigation} header={"Account"} />
      <View style={styles.preferenceContainer}>
        <TextInput
          value={currentUserEmail}
          style={styles.preferenceInput}
          placeholder="email@domain.com"
          placeholderTextColor={Color.faint_white}
          autoCorrect={false}
          autoCapitalize="none"
        ></TextInput>

      </View>

      <TouchableOpacity onPress={() => navigation.navigate("ChangeEmail")}>
        <Text style={styles.signInButtonText}>Change email</Text>
      </TouchableOpacity>

      <LogoutButton />
      <DeleteAccountButton currentUserID={currentUserID} />
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SETTINGS_HORIZONTAL_PADDING,
  },
  preferenceContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  preferenceRightContainer: {
    width: 250,
    flexDirection: "row",
  },
  preferenceTitle: {
    color: Color.white,
    fontSize: 16,
  },
  preferenceInput: {
    color: Color.white,
    fontSize: 16,
    borderWidth: 1,
    width: 250,
    borderColor: Color.white,
    padding: 10,
    borderRadius: 10,
  },

  signInText: {
    color: Color.white,
    fontSize: 17,
  },
  signInButtonText: {
    color: Color.white,
    fontSize: 17,
    fontWeight: 500,
  },
});
