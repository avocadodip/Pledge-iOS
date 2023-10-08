import { getAuth, deleteUser, signOut } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../database/firebase";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";

const DeleteAccountButton = ({ currentUserID }) => {
  const auth = getAuth();
  const { theme } = useThemes();
  const styles = getStyles(theme);
  console.log(currentUserID);

  const handleDelete = async () => {
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
                // Must delete doc before delete user due to firebase rules (only delete when auth is not null)
                const userRef = doc(db, "users", currentUserID);
                await deleteDoc(userRef);

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
      onPress={handleDelete}
    >
      <Text style={[styles.buttonText, { color: Color.white }]}>
        Delete Account
      </Text>
    </TouchableOpacity>
  );
};

export default DeleteAccountButton;

const getStyles = (theme) => StyleSheet.create({
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
