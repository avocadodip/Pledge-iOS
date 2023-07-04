import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Padding, Border, FontSize, Color } from "../GlobalStyles";
import { auth } from "../database/firebase";
import "firebase/firestore";
import { signInWithEmailAndPassword } from "@firebase/auth";
import TouchableRipple from "../components/TouchableRipple";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(); // New state for email input
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Validate email and password
    if (!email?.trim() || !password?.trim()) {
      Alert.alert(
        "🤔 Whoops!",
        "Email and password are needed to login. Try again!"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(
        "📧 Email Error",
        "Make sure your email is formatted correctly!"
      );
      return;
    }


    // 2. Sign user in
    try {
      // Triggers auth state change in App.js to navigate user to Today
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    } catch (error) {
      // Handle login error
      const errorMessage = error.message;
      console.log("Login error: " + errorMessage);

      // Show an alert to the user with a friendly error message
      Alert.alert(
        "Oops! 🙈",
        "It looks like there was a typo in your login. Please double-check your email and password. 🌟"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    > */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/icons/FervoWhite.png")}
          style={{ width: 100, height: 100 }}
        />
        <Text style={styles.appNameText}>Fervo</Text>
      </View>
      <View style={[styles.buttonContainer]}>
        {loading ? <ActivityIndicator size="small" color="white" /> : null}
        <TextInput
          style={[styles.inputField]}
          placeholder="Email"
          placeholderTextColor={Color.white}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.inputField]}
          placeholder="Password"
          placeholderTextColor={Color.white}
          value={password}
          onChangeText={setPassword}
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry={true}
        />
        <TouchableRipple style={[styles.button]} onPress={handleLogin}>
          <Text style={[styles.buttonText, styles.signupTypo]}>Login</Text>
        </TouchableRipple>
        <TouchableRipple
          style={styles.goBackToContainer}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={[styles.text, styles.textLayout]}>
            {`Go back to `}
            <Text style={styles.login}>Signup</Text>
          </Text>
        </TouchableRipple>
      </View>
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: semi-transparent background
          }}
        >
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      {/* </KeyboardAvoidingView> */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  frameTextInputText: {
    color: "#000",
  },
  frameTextInput1Text: {
    color: "#000",
  },
  frameTextInput2Text: {
    color: "#000",
  },
  parentFlexBox: {
    alignItems: "center",
  },
  frameSpaceBlock: {
    borderRadius: Border.br_8xs,
  },
  signupTypo: {
    // fontFamily: FontFamily.epilogueBold,
    // fontWeight: "700",
    textAlign: "left",
  },
  textLayout: {
    fontSize: FontSize.size_lg,
  },
  image2: {
    transform: [
      {
        rotate: "-90deg",
      },
    ],
  },
  frameChild: {
    width: 322,
    borderWidth: 1,
    borderColor: "#c1c1c1",
    borderStyle: "solid",
    borderRadius: Border.br_8xs,
  },
  frameItem: {
    marginTop: 10,
    width: 322,
    borderWidth: 1,
    borderColor: "#c1c1c1",
    borderStyle: "solid",
    flexDirection: "row",
    borderRadius: Border.br_8xs,
  },
  signup: {
    color: Color.white,
    textAlign: "left",
    lineHeight: 25,
    fontSize: FontSize.size_lg,
  },
  pressable: {
    justifyContent: "center",
    backgroundColor: Color.papaya,
    paddingHorizontal: Padding.p_xl,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 40, // Height for the button to look good
  },
  wrapper: {
    marginTop: 20,
    width: 322,
  },
  frameParent: {
    alignItems: "center",
  },
  login: {
    textDecorationLine: "underline",
  },
  text: {
    // fontWeight: "500",
    // fontFamily: FontFamily.epilogueMedium,
    color: Color.white,
    textAlign: "left",
  },
  goBackToContainer: {
    alignSelf: "center", // Center the text within the parent view
  },
  beaconlogo51Icon: {
    width: 132,
    height: 135,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
    // borderColor:'black',
    // borderWidth: 1
  },
  beaconlogo51Parent: {
    alignItems: "center",
  },
  signups: {
    borderRadius: Border.br_11xl,
    backgroundColor: Color.white,
    flex: 1,
    overflow: "hidden",
    width: "100%",
    justifyContent: "center", // Center child components vertically
    alignItems: "center", // Center child components horizontally
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
  },
});

export default Login;
