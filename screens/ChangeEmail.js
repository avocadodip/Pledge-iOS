import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../database/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from "@firebase/auth";
import { APP_HORIZONTAL_PADDING, Color } from "../GlobalStyles";
import AuthFormInput from "../components/auth/AuthFormInput";
import AuthFormButton from "../components/auth/AuthFormButton";
import { useSettings } from "../hooks/SettingsContext";
import SettingsHeader from "../components/settings/SettingsHeader";
import { doc, updateDoc } from "firebase/firestore";
import DeleteAccountButton from "../components/settings/DeleteAccountButton";
import { useThemes } from "../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";

const ChangeEmail = () => {
  const { theme, backgroundGradient } = useThemes();
  const navigation = useNavigation();
  const { currentUserEmail, currentUserID } = useSettings();
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [changeEmailStep, setChangeEmailStep] = useState("password");

  const handlePasswordChange = (password) => {
    setPassword(password);
    setIsValidPassword(password.length >= 8);
  };

  const handleEmailChange = (email) => {
    setNewEmail(email);
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  };

  const checkIfVerified = async () => {
    // If can't re-authenticate with old info, that means it was succesfully changes
    const credential = EmailAuthProvider.credential(currentUserEmail, password);
    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
      // Was able to reauthenticate; not verified yet
      Alert.alert("Please verify your new email before proceeding.");
    } catch (error) {
      // Successfully changed
      if (error.code == "auth/user-mismatch") {
        const userDoc = doc(db, "users", currentUserID);
        await updateDoc(userDoc, {
          email: newEmail,
        });
        Alert.alert(
          "Email successfully verified and updated.",
          "",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Settings"),
            },
          ],
          { cancelable: false }
        );
      } else {
        console.log(error.code);
      }
    }
  };

  const changeEmail = async () => {
    try {
      await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
      Alert.alert("Verification email sent.");
      setChangeEmailStep("verification");
    } catch (error) {
      if (error.code == "auth/email-already-in-use") {
        Alert.alert("Email already in use.");
      } else {
        console.error("Error updating email", error);
      }
    }
  };

  const reauthenticateUser = async () => {
    if (auth.currentUser) {
      const credential = EmailAuthProvider.credential(
        currentUserEmail,
        password
      );
      try {
        await reauthenticateWithCredential(auth.currentUser, credential);
        setChangeEmailStep("email");
        console.log("Reauthentication successful");
      } catch (error) {
        if (error.code == "auth/wrong-password") {
          Alert.alert("Incorrect password.");
        } else if (error.code == "auth/too-many-requests") {
          Alert.alert("Too many requests", "Please try again later.");
        } else {
          console.error("Error in reauthentication", error);
        }
      }
    } else {
      console.log("No user is signed in");
    }
  };

  return (
    <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
      <SafeAreaView style={styles.pageContainer}>
        <SettingsHeader navigation={navigation} header={"Change Email"} />

        {changeEmailStep === "password" && (
          <View style={styles.container}>
            <Text style={styles.promptText}>
              Re-enter your password in order to change your email.
            </Text>
            <View style={styles.formContainer}>
              <AuthFormInput
                action={handlePasswordChange}
                value={password}
                type="password"
              />
              <AuthFormButton
                action={reauthenticateUser}
                text={"Confirm"}
                disabledCondition={!isValidPassword}
              />
            </View>
          </View>
        )}

        {changeEmailStep === "email" && (
          <View style={styles.container}>
            <Text style={styles.promptText}>Enter your new email.</Text>
            <View style={styles.formContainer}>
              <AuthFormInput
                action={handleEmailChange}
                value={newEmail}
                type="email"
              />
              <AuthFormButton
                action={changeEmail}
                text={"Change Email"}
                disabledCondition={!isValidEmail}
              />
            </View>
          </View>
        )}

        {changeEmailStep === "verification" && (
          <View style={styles.container}>
            <Text style={styles.promptText}>
              An verification link was sent to {newEmail}
            </Text>
            <Text style={styles.promptText}>
              Once you have verified, click on the confirm button below.
            </Text>
            <AuthFormButton
              action={checkIfVerified}
              text={"Confirm Verification"}
            />
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ChangeEmail;

const styles = StyleSheet.create({
  pageContainer: {
    display: "flex",
    marginHorizontal: APP_HORIZONTAL_PADDING,
    flex: 1,
  },
  formContainer: {
    gap: 15,
  },
  promptText: {
    color: Color.white,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
});
