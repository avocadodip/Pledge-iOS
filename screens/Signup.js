import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color } from "../GlobalStyles";
import { auth } from "../database/firebase";
import TouchableRipple from "../components/TouchableRipple";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import * as SecureStore from "expo-secure-store";

const Signup = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    // Validate name
    if (!fullName?.trim()) {
      Alert.alert(
        "🤔 Whoops!",
        "Name is needed to login. Try again!"
      );
      return;
    }

    try {
      // Create user
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
        console.log(error)
        Alert.alert("Error", "Failed to sign up. Please try again later.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/icons/FervoWhite.png")}
          style={{ width: 100, height: 100 }}
        />
        <Text style={styles.appNameText}>Fervo</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Full name"
          onChangeText={setFullName}
          value={fullName}
          placeholderTextColor="#fff"
          textStyle={styles.frameTextInputText}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          placeholderTextColor="#fff"
          textStyle={styles.frameTextInputText}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          placeholderTextColor="#fff"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          textStyle={styles.frameTextInput1Text}
          autoCorrect={false}
          autoCapitalize="none"
        />

        <TouchableRipple style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableRipple>

        <TouchableRipple
          style={[
            styles.button,
            {
              backgroundColor: "transparent",
              borderWidth: 2,
              borderColor: "rgba(255, 255, 255, 0.7)",
            },
          ]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={[styles.buttonText, { color: Color.white }]}>
            Log in
          </Text>
        </TouchableRipple>
      </View>
    </KeyboardAvoidingView>
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
    // borderColor:'black',
    // borderWidth: 1
  },
  appNameText: {
    fontSize: 50,
    color: Color.white,
    marginTop: 0,
    fontWeight: "bold",
  },
  inputField: {
    height: 40,
    width: "100%",
    borderColor: Color.white,
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    color: Color.white,
    backgroundColor: Color.fervo_red,
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
    backgroundColor: Color.white,
    gap: 15,
    height: 52,
    borderRadius: 17,
    width: "100%",
    overflow: "hidden",
  },
  buttonText: {
    color: Color.fervo_red,
    fontSize: 18,
    fontWeight: 600,
  },
});

export default Signup;
