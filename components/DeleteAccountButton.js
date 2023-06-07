import { getAuth, deleteUser, signOut } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../database/firebase";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Color } from "../GlobalStyles";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const DeleteAccountButton = ({ currentUserID }) => {
  const auth = getAuth();

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Account Deletion',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        }, 
        { 
          text: 'OK', 
          onPress: async () => {
            try {
              const userRef = doc(db, "users", currentUserID);
              await deleteDoc(userRef);
  
              const user = auth.currentUser;
              if (user) {
                await deleteUser(user);
                
                // Show success prompt
                Alert.alert(
                  'Account Successfully Deleted',
                  'Your account has been deleted successfully.',
                  [
                    { 
                      text: 'OK'
                    },
                  ],
                  { cancelable: false },
                );
              }
            } catch (error) {
              if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                  'Reauthentication Required',
                  'Please log out and log back in before deleting your account.',
                  [
                    { 
                      text: 'OK', 
                      onPress: async () => {
                        await signOut(auth);
                      } 
                    },
                  ],
                  { cancelable: false },
                );
              } else {
                console.error("Error deleting user account: ", error);
              }
            }
          } 
        },
      ],
      { cancelable: false },
    );
  };
  

  return (
    <TouchableOpacity onPress={handleDelete}>
      <Text
        style={[styles.preferenceTitle, { textDecorationLine: "underline" }]}
      >
        Delete account.
      </Text>
    </TouchableOpacity>
  );
};

export default DeleteAccountButton;

const styles = StyleSheet.create({
  preferenceTitle: {
    color: Color.white,
    fontSize: 16,
  },
});
