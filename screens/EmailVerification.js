import {
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
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
import { API_URL } from "@env";
import { auth, db } from "../database/firebase";
import { doc, setDoc } from "firebase/firestore";
import TouchableRipple from "../components/TouchableRipple";
import * as SecureStore from "expo-secure-store";
import LeftChevronIcon from "../assets/icons/chevron-left.svg";
import { Color } from "../GlobalStyles";
import AuthFormButton from "../components/auth/AuthFormButton";
import MailIcon from "../assets/icons/mail-icon.svg";

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
        isOnboarded: false,
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
      Alert.alert("Success", "Resent.");
    } catch (error) {
      if (error.code === "auth/too-many-requests") {
        Alert.alert("Error", "Please wait a moment and try again.");
      } else {
        console.error("Failed to send verification email:", error);
        Alert.alert(
          "Error",
          "Failed to send verification email. Please try again."
        );
      }
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
      <TouchableRipple style={styles.backButton} onPress={handleBackPress}>
        <LeftChevronIcon width={24} height={24} color={Color.white} />
      </TouchableRipple>

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <MailIcon width={60} height={60} color={Color.white} />
          <Text style={styles.headerText}>Check your email</Text>
        </View>
        <Text style={styles.promptText}>
          An email with a verification link has been sent to
        </Text>
        <Text style={styles.emailText}>{email}</Text>

        <AuthFormButton
          action={checkEmailVerification}
          text={"Confirm"}
          disabledCondition={isChecking}
        />
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive a link?</Text>
          <TouchableOpacity
            style={styles.resendButton}
            onPress={resendEmailVerification}
          >
            <Text style={styles.resendButtonText}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmailVerification;

const styles = StyleSheet.create({
  pageContainer: {
    display: "flex",
    marginHorizontal: 20,
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    flex: 1,
  },

  // Back button
  backButton: {
    borderRadius: 10,
    overflow: "hidden",
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  // Header style
  header: {
    flexDirection: "col",
    alignItems: "center",
    gap: 10,
    marginTop: 60,
    marginBottom: 40,
  },
  headerText: {
    color: Color.white,
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 10,
  },

  promptText: {
    color: Color.white,
    fontSize: 16,
    marginBottom: 5,
  },
  emailText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 50,
  },

  // Resend line styles
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    gap: 8,
  },
  resendText: {
    color: Color.white,
    fontSize: 16,
  },
  resendButton: {
    borderRadius: 8,
  },
  resendButtonText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 500,
  },

  // Verify button styles
  verifyButton: {
    backgroundColor: "#7d1818",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: Color.white,
    fontSize: 16,
  },
});
