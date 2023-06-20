import { StyleSheet, Text, TextInput, View } from "react-native";
import { Color } from "../GlobalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import LeftArrowIcon from "../assets/icons/arrow-left.svg";

import { TouchableOpacity } from "react-native-gesture-handler";
import DaysActiveToggle from "../components/DaysActiveToggle";
import OnboardingPopup from "../components/OnboardingPopup";
import { useSettings } from "../hooks/SettingsContext";
import VacationToggle from "../components/VacationToggle";
import ThemeToggle from "../components/ThemeToggle";
import TimezoneSelector from "../components/TimezoneSelector";
import DeleteAccountButton from "../components/DeleteAccountButton";

const Account = ({ navigation }) => {
  const {
    currentUserID,
    currentUserFullName,
    currentUserEmail,
    settings: { dayStart, dayEnd, vacationModeOn, theme, daysActive, timezone },
  } = useSettings();



  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      {/* <OnboardingPopup
        texts={['Are you sure you want to delete your account?', 'Progress takes time and failure is a vital part of the process!','If you are struggling to complete tasks, try setting smaller tasks each day. It will pay off over time!']}
        buttonTitle="Let's give this one more go!"
        secondButtonTitle="Yes, delete my account."
      /> */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => handlePress("SettingsScreen")}>
          <LeftArrowIcon width={24} height={24} color={Color.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
      </View>
      {/* <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceTitle}> Name </Text>
        <TextInput
          style={styles.preferenceInput}
          placeholder="First Last"
          placeholderTextColor={Color.faint_white}
          autoCorrect={false}
          autoCapitalize="none"
          value={currentUserFullName}
        ></TextInput>
      </View> */}
      <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceTitle}> Email </Text>
        <TextInput
          value={currentUserEmail}
          style={styles.preferenceInput}
          placeholder="email@domain.com"
          placeholderTextColor={Color.faint_white}
          autoCorrect={false}
          autoCapitalize="none"
        ></TextInput>
      </View>

      <View style={styles.preferenceContainer}>
        <DeleteAccountButton currentUserID={currentUserID} />
      </View>
    </SafeAreaView>
  );
};

export default Account;

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
    flexDirection: "row",
    marginBottom: 20,
    // borderWidth: 1,
    // borderColor: 'black',
  },
  headerTitle: {
    color: Color.white,
    fontSize: 20,
    marginLeft: 24,
    // borderWidth: 1,
    // borderColor: 'black',
  },
  preferenceContainer: {
    paddingLeft: 10,
    paddingTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: 'black',
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
});
