import { StyleSheet, Text, View, Alert, SafeAreaView } from "react-native";
import React, { useState } from "react";
import {
  EmailAuthProvider,
  deleteUser,
  getIdToken,
  reauthenticateWithCredential,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { API_URL } from "../constants";
import { auth, db } from "../database/firebase";
import { doc, setDoc } from "firebase/firestore";
import TouchableRipple from "../components/TouchableRipple";
import * as SecureStore from "expo-secure-store";
import LeftChevronIcon from "../assets/icons/chevron-left.svg";
import { Color } from "../GlobalStyles";

const EmailVerification = ({ route, navigation }) => {
  const [isChecking, setIsChecking] = useState(false);
  const { userData } = route.params;
  const { email, fullName } = userData;
  const currentUser = auth.currentUser;

  const checkEmailVerification = async () => {
    setIsChecking(true);
    try {
      // Reload the user's information
      await reload(currentUser);

      if (currentUser.emailVerified) {
        await createFirebaseUserDoc();
      } else {
        // The user has not verified their email yet
        Alert.alert(
          "Email not verified",
          "Please verify your email before proceeding."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to check email verification status.");
    } finally {
      setIsChecking(false);
    }
  };

  const createFirebaseUserDoc = async () => {
    try {
      // Get user's local timezone
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Call the Firebase Cloud Function to create a new Stripe customer
      const idToken = await getIdToken(currentUser, true);

      // Send paymentMethod.id to Cloud Function
      const response = await fetch(`${API_URL}/createStripeCustomer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + idToken,
        },
        body: JSON.stringify({
          email: email,
          uid: currentUser.uid,
          name: fullName,
        }),
      });

      // Handle response from your server.
      if (!response.ok) {
        throw new Error("Failed to create Stripe customer.");
      }

      const result = await response.json();
      const stripeCustomerId = result.customerId;

      // Save full name, email and stripeCustomerId to Firestore
      await setDoc(doc(db, "users", currentUser.uid), {
        fullName: fullName,
        email: email,
        profilePhoto: 1,
        dayStart: "7:30",
        dayEnd: "9:00",
        daysActive: {
          Sunday: true,
          Monday: true,
          Tuesday: true,
          Wednesday: true,
          Thursday: true,
          Friday: true,
          Saturday: true,
        },
        vacationModeOn: false,
        theme: "Classic",
        missedTaskFine: 1,
        timezone: timeZone,
        isActiveUser: true,
        currency: "usd",
        stripeCustomerId: stripeCustomerId,
        isPaymentSetup: false,
        hasBeenChargedBefore: false,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create user.");
    } finally {
      // Sign user out and sign user back in to trigger onAuthStateChanged listener in App.js to navigate to Today
      try {
        await signOut(auth);
        try {
          const password = await SecureStore.getItemAsync("password");
          if (email && password) {
            await signInWithEmailAndPassword(auth, email, password);
            await SecureStore.deleteItemAsync("password");
          } else {
            throw new Error("Missing email or password in SecureStore");
          }
        } catch (signInError) {
          console.error("Error during sign in:", signInError);
        }
      } catch (signOutError) {
        console.error("Error during sign out:", signOutError);
      }
    }
  };

  const resendEmailVerification = async () => {
    try {
      await sendEmailVerification(currentUser);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      Alert.alert(
        "Error",
        "Failed to send verification email. Please try again."
      );
      return;
    }
  };

  const handleBackPress = async () => {
    try {
      await deleteUser(currentUser);
      await SecureStore.deleteItemAsync("password");
      navigation.navigate("Signup");
    } catch {
      try {
        const password = await SecureStore.getItemAsync("password");

        // Create the credential with the user's email and password
        const credential = EmailAuthProvider.credential(email, password);

        // Re-authenticate the user with the credential
        await reauthenticateWithCredential(currentUser, credential);

        // Delete the user account
        await deleteUser(currentUser);

        await SecureStore.deleteItemAsync("password");
        navigation.navigate("Signup");
      } catch (error) {
        console.error("Failed to delete user:", error);
        // Handle the error
      }
    }
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.header}>
        <TouchableRipple style={styles.backButton} onPress={handleBackPress}>
          <LeftChevronIcon width={24} height={24} color={Color.white} />
        </TouchableRipple>
        <Text style={styles.headerText}>Verify Email</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.promptText}>
          An email with a verification link has been sent to {email}
        </Text>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive a link?</Text>
          <TouchableRipple
            style={styles.resendButton}
            onPress={resendEmailVerification}
          >
            <Text style={styles.resendText}>Request again</Text>
          </TouchableRipple>
        </View>

        <TouchableRipple
          style={styles.verifyButton}
          onPress={checkEmailVerification}
          disabled={isChecking}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
};

export default EmailVerification;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    alignItems: "center",
  },

  // Header style
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    color: Color.white,
    fontSize: 18,
    fontWeight: "600",
  },

  promptText: {
    color: Color.white,
    fontSize: 16,
    marginBottom: 24,
  },

  // Resend line styles
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  resendText: {
    color: Color.white,
    fontSize: 16,
  },
  resendButton: {
    backgroundColor: Color.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  // Verify button styles
  verifyButton: {
    backgroundColor: Color.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: Color.white,
    fontSize: 16,
  },
});
