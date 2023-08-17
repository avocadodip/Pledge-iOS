import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  KeyboardAvoidingView,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../database/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import LogoAppName from "../components/auth/LogoAppName";
import FormInput from "../components/auth/AuthFormInput";
import SignUpButton from "../components/auth/AuthFormButton";
import SignInSignUpSwitch from "../components/auth/SignInSignUpSwitch";
import { useThemes } from "../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";
import { redGradientValues } from "../themes";

const Signup = () => {
  const { theme, backgroundGradient } = useThemes();
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    // Validate fields
    if (!firstName?.trim()) {
      Alert.alert("Whoops!", "First name is needed to sign up. Try again!");
      return;
    }
    if (!lastName?.trim()) {
      Alert.alert("Whoops!", "Last name is needed to sign up. Try again!");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Password Error",
        "Password needs to be at least 8 characters long. Try again!"
      );
      return;
    }

    const fullName = `${firstName} ${lastName}`;

    // Create user, send verif email, & navigate to verif page
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send email verification
      try {
        await sendEmailVerification(user);

        // Securely store password to auto re-authenticate user after email verification
        await SecureStore.setItemAsync("password", password);

        // If the verification email was sent successfully, navigate to the verification page
        navigation.navigate("EmailVerification", {
          userData: {
            fullName: fullName,
            email: email,
          },
        });
      } catch (error) {
        console.error("Failed to send verification email:", error);
        Alert.alert(
          "Error",
          "Failed to send verification email. Please try again."
        );
        return;
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "A user with this email address already exists.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email address.");
      } else if (error.code === "auth/missing-password") {
        Alert.alert("Error", "Please enter a password.");
      } else {
        console.log(error);
        Alert.alert("Error", "Failed to sign up. Please try again later.");
      }
    }
  };

  return (
    <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.pageContainer}
      >
        <LogoAppName />

        <View style={styles.formContainer}>
          <View style={styles.firstLastContainer}>
            <View style={styles.textInputContainer}>
              <FormInput action={setFirstName} value={firstName} type="first" />
            </View>
            <View style={styles.textInputContainer}>
              <FormInput action={setLastName} value={lastName} type="last" />
            </View>
          </View>
          <FormInput action={setEmail} value={email} type="email" />
          <FormInput action={setPassword} value={password} type="password" />

          <SignUpButton action={handleSignup} text={"Sign up"} />
        </View>

        <SignInSignUpSwitch
          navigation={navigation}
          prompt={"Already have an account?"}
          navigateTo={"Login"}
          buttonText={"Sign In"}
        />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexDirection: "col",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },

  formContainer: {
    gap: 15,
    width: "100%",
  },
  firstLastContainer: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
    justifyContent: "space-between",
  },
  textInputContainer: {
    flex: 1,
  },
});

export default Signup;
