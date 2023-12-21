import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";
import { auth, db } from "../../database/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useSettings } from "../../hooks/SettingsContext";
import { deleteUser } from "@firebase/auth";

const DeleteAccountButton = () => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  const { currentUserID } = useSettings();

  const confirmDeleteAccount = async () => {
    Alert.alert(
      "⚠️ Delete Account?",
      "This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const user = auth.currentUser;
            if (user) {
              // If the user last logged in more than 5 minutes ago, show an alert
              const lastLoggedIn = auth.currentUser.metadata.lastSignInTime;

              if (lastLoggedIn) {
                const lastLoggedInDate = new Date(lastLoggedIn);
                const currentDate = new Date();
                const timeDifference = currentDate - lastLoggedInDate;
                const minutesDifference = timeDifference / 1000 / 60;
                console.log(minutesDifference);
                if (minutesDifference > 5) {
                  Alert.alert(
                    "Reauthentication required",
                    "Please sign out and sign in again to delete your account.",
                    [
                      {
                        text: "OK",
                      },
                    ],
                    { cancelable: false }
                  );
                  return;
                }
              }

              const userRef = doc(db, "users", currentUserID);

              try {
                // Delete user doc
                await deleteDoc(userRef);
              } catch (error) {
                console.log(error);
                Alert.alert(
                  "Error",
                  "There was an error deleting your account. Please try again later.",
                  [
                    {
                      text: "OK",
                    },
                  ],
                  { cancelable: false }
                );
                return;
              }
              try {
                // Delete user doc auth
                await deleteUser(user);
              } catch (error) {
                if (error.code === "auth/requires-recent-login") {
                  return;
                }
              }

              // Show success prompt
              Alert.alert(
                "Account deleted",
                "Your account has been deleted.",
                [
                  {
                    text: "OK",
                  },
                ],
                { cancelable: false }
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: "transparent",
          borderBottomWidth: 2,
          borderColor: "rgba(255, 255, 255, 0.7)",
        },
      ]}
      onPress={confirmDeleteAccount}
    >
      <Text style={[styles.buttonText, { color: Color.white }]}>
        Delete Account
      </Text>
    </TouchableOpacity>
  );
};

export default DeleteAccountButton;

const getStyles = (theme) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.textMedium,
      gap: 15,
      height: 25,
      overflow: "hidden",
      margin: 8,
      marginTop: 16,
      width: 100,
    },
    buttonText: {
      color: theme.textMedium,
      opacity: 0.8,
      fontSize: 14,
      textAlign: "left",
    },
  });
