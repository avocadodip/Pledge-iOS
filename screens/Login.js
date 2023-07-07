import React, { useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../database/firebase";
import "firebase/firestore";
import { signInWithEmailAndPassword } from "@firebase/auth";
import LogoAppName from "../components/auth/LogoAppName";
import FormInput from "../components/auth/AuthFormInput";
import LoginButton from "../components/auth/AuthFormButton";
import SignInSignUpSwitch from "../components/auth/SignInSignUpSwitch";
import { Color } from "../GlobalStyles";
import { useThemes } from "../hooks/ThemesContext";

const Login = () => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const [email, setEmail] = useState(); // New state for email input
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Validate email and password
    if (!email?.trim() || !password?.trim()) {
      Alert.alert(
        "Whoops!",
        "Email and password are needed to login. Try again!"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(
        "Email Error",
        "Make sure your email is formatted correctly!"
      );
      return;
    }

    // 2. Sign user in
    try {
      // Triggers auth state change in App.js to navigate user to Today
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code == "auth/wrong-password") {
        Alert.alert("Login error", "Incorrect email or password.");
      } else {
        // Show an alert to the user with a friendly error message
        Alert.alert(
          "Oops!",
          "It looks like there was a typo in your login. Please double-check your email and password."
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.pageContainer}
    >
      <LogoAppName />
      <View style={[styles.formContainer]}>
        {loading ? <ActivityIndicator size="small" color="white" /> : null}
        <FormInput action={setEmail} value={email} type="email" />
        <FormInput action={setPassword} value={password} type="password" />

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPasswordButtonText}>Forgot Password?</Text>
        </TouchableOpacity>
        <LoginButton action={handleLogin} text={"Login"} />
      </View>

      <SignInSignUpSwitch
        navigation={navigation}
        prompt={"Don't have an account?"}
        navigateTo={"Signup"}
        buttonText={"Sign up"}
      />
    </KeyboardAvoidingView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
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

    forgotPasswordButton: {
      alignItems: "flex-end",
      width: "100%",
    },
    forgotPasswordButtonText: {
      color: theme.textHigh
    },
  });

export default Login;
