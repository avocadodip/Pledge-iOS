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
