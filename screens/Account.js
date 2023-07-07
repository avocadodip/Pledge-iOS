import { StyleSheet, Text, View } from "react-native";
import {
  Color,
  SETTINGS_HORIZONTAL_PADDING,
  settingsPageStyles,
} from "../GlobalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import OnboardingPopup from "../components/OnboardingPopup";
import { useSettings } from "../hooks/SettingsContext";
import DeleteAccountButton from "../components/DeleteAccountButton";
import SettingsHeader from "../components/SettingsHeader";
import LogoutButton from "../components/LogoutButton";
import AuthFormButton from "../components/auth/AuthFormButton";

const Account = ({ navigation }) => {
  const {
    currentUserID,
    currentUserEmail,
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
        <Text style={styles.emailText}>{currentUserEmail}</Text>

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
  emailText: {
    color: "white"
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
