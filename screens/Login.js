import React, { useState, useEffect } from "react";
// import { Input as RNKTextInput } from '@ui-kitten/components'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,

} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color } from "../GlobalStyles";
import Globals from "../Globals";
import { checkAuthState, handleGoogleLogin } from "../utils/authHelper";
import GoogleLogoIcon from "../assets/icons/google-logo.svg";
import MailIcon from "../assets/icons/mail-icon.svg";

const Login = () => {
  const [isLoginPressed, setLoginPressed] = useState(false); // Add this state to handle the button pressed state

  const navigation = useNavigation();

  const handleLogin = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        {/* replace with app logo */}
        <GoogleLogoIcon />
        <Text style={styles.appNameText}>Fervo</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
          <GoogleLogoIcon />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <MailIcon width={24} height={24} color={`${Color.fervo_red}`} />
          <Text style={styles.buttonText}>Sign up with email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: "transparent",
              borderWidth: 2,
              borderColor: "rgba(255, 255, 255, 0.7)",
            },
          ]}
          onPress={handleLogin}
        >
          <Text style={[styles.buttonText, { color: Color.white }]}>
            Log in
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  appNameText: {
    fontSize: 69,
    color: "white",
    marginTop: 11,
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "col",
    gap: 15,
    width: "90%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    gap: 10,
    height: 52,
    borderRadius: 17,
    width: "100%",
  },
  buttonText: {
    color: Color.fervo_red,
    fontSize: 18,
    fontWeight: 600,
  },
  // alternativeButton: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: "transparent",
  //   gap: 10,
  //   height: 45,
  //   borderRadius: 50,
  //   width: 322,
  //   borderWidth: 3, // Set the border width
  //   borderColor: "#fff", // Set the border color
  // },
  // alternativeButtonText: {
  //   color: "white",
  //   fontSize: 16,
  //   fontWeight: 700,
  // },
});

export default Login;
