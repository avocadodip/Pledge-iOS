import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../database/firebase";
import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
} from "@firebase/auth";
import { APP_HORIZONTAL_PADDING, Color } from "../GlobalStyles";
import AuthFormInput from "../components/auth/AuthFormInput";
import AuthFormButton from "../components/auth/AuthFormButton";
import { useSettings } from "../hooks/SettingsContext";
import SettingsHeader from "../components/settings/SettingsHeader";
import { deleteDoc, doc } from "firebase/firestore";
import { useThemes } from "../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";

const DeleteAccount = () => {
  const { backgroundGradient } = useThemes();
  const navigation = useNavigation();
  const { currentUserEmail, currentUserID } = useSettings();
  const [password, setPassword] = useState("");

  const handlePasswordChange = (password) => {
    setPassword(password);
  };

  const reauthenticateUser = async () => {
    if (auth.currentUser) {
      const credential = EmailAuthProvider.credential(
        currentUserEmail,
        password
      );
      try {
        await reauthenticateWithCredential(auth.currentUser, credential);
        console.log("Reauthentication successful");
        confirmDeleteAccount();
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

  const confirmDeleteAccount = async () => {
    Alert.alert(
      "Confirm Account Deletion",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {

                // Delete Firestore document
                const userRef = doc(db, "users", currentUserID);
                await deleteDoc(userRef);

                // Delete user
                await deleteUser(user);

                // Show success prompt
                Alert.alert(
                  "Account Successfully Deleted",
                  "Your account has been deleted successfully.",
                  [
                    {
                      text: "OK",
                    },
                  ],
                  { cancelable: false }
                );
              }
            } catch (error) {
              if (error.code === "auth/requires-recent-login") {
                Alert.alert(
                  "Reauthentication Required",
                  "Please log out and log back in before deleting your account.",
                  [
                    {
                      text: "OK",
                    },
                  ],
                  { cancelable: false }
                );
              } else {
                console.error("Error deleting user account: ", error);
              }
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
      <SafeAreaView style={styles.pageContainer}>
        <SettingsHeader navigation={navigation} header={"Delete Account"} />

        <View style={styles.container}>
          <Text style={styles.promptText}>
            Re-enter your password to delete your account.
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
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default DeleteAccount;

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
