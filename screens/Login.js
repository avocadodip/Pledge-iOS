import React, { useState, useEffect } from "react";
// import { Input as RNKTextInput } from '@ui-kitten/components'
import {
  StyleSheet,
  Pressable,
  Text,
  TextInput,
  View,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, FontSize, Border, Color, Padding } from "../GlobalStyles";
import firebase from "../database/firebase";
import Globals from "../Globals";
import { checkAuthState } from "../helperFunctions";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginPressed, setLoginPressed] = useState(false); // Add this state to handle the button pressed state
  const [forgotPressed, setForgotPressed] = useState(false); // Add this state to handle the button pressed state

  const navigation = useNavigation();

  useEffect(() => {
    if (checkAuthState()) {
      navigation.navigate("Today");
    }
  }, []);

  // Handle login with Firebase
  const handleLogin = () => {
    let lowerCaseEmail = email.trim().toLowerCase();
    let lowerCasePassword = password.trim().toLowerCase();

    // Validate email and password inputs
    if (!lowerCaseEmail || !lowerCasePassword) {
      Alert.alert(
        "🤔 Whoops!",
        "Email and password are needed to login. Try again!"
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(lowerCaseEmail)) {
      Alert.alert(
        "📧 Email Error",
        "Make sure your email is formatted correctly!"
      );
      return;
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(lowerCaseEmail, lowerCasePassword)
      .then((userCredential) => {
        // Signed in successfully
        const user = userCredential.user;
        Globals.currentUserID = user.uid;

        // Get the user's document from Firestore
        firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              // Set the full name in Globals
              Globals.fullName = doc.data().fullName;
              Globals.email = doc.data().email;
              Globals.profileImageUrl = doc.data().profileImageUrl || "";
              Globals.phoneNumber = doc.data().phoneNumber || "";
            } else {
              console.log("No such document!");
            }
            // Navigate to the Today screen after retrieving the full name
            navigation.navigate("Today");
          })
          .catch((error) => {
            console.error("Error getting document:", error);
          });
      })
      .catch((error) => {
        // Handle login error
        const errorMessage = error.message;
        console.log(errorMessage);
        // Show an alert to the user with a friendly error message
        Alert.alert(
          "Oops! 🙈",
          "It looks like there was a typo in your login. Please double-check your email and password. 🌟"
        );
      });
  };

  // Function to handle password reset

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logins}>
        <View style={styles.frameParent}>
          <View style={styles.beaconlogo51Parent}>
            <Image
              style={styles.beaconlogo51Icon}
              resizeMode="cover"
              source={require("../assets/beaconlogo.png")}
            />
            <Text
              style={[styles.beacon, styles.loginTypo, { color: "#FF6422" }]}
            >
              Beacon
            </Text>
          </View>
          <TextInput
            style={styles.frameChild}
            placeholder="Email" // Change the placeholder to "Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#000"
            textStyle={styles.frameTextInputText}
            autoCorrect={false} // Disable auto-correction
            autoCapitalize="none" // Disable auto-capitalization
          />
          <TextInput
            style={styles.frameItem}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#000"
            textStyle={styles.frameTextInput1Text}
            autoCorrect={false} // Disable auto-correction
            autoCapitalize="none" // Disable auto-capitalization
            secureTextEntry={true} // Mask password input
          />
          <View style={styles.buttonContainer}>
            <LinearGradient
              style={[
                styles.wrapper,
                loginPressed && styles.wrapperPressed,
                { borderRadius: 50 },
              ]} // Add the "wrapperPressed" style when the button is pressed
              locations={[0, 1]}
              colors={
                loginPressed ? ["#cc501b", "#cc8353"] : ["#ff6422", "#ffa266"]
              } // Darken the colors when the button is pressed
            >
              <Pressable
                style={[styles.pressable]}
                onPress={handleLogin}
                onPressIn={() => setLoginPressed(true)} // Set "pressed" state to true when the button is pressed
                onPressOut={() => setLoginPressed(false)} // Set "pressed" state to false when the button is released
              >
                <Text style={[styles.login, styles.loginTypo]}>Login</Text>
              </Pressable>
            </LinearGradient>

            <LinearGradient
              style={[
                styles.wrapper,
                forgotPressed && styles.wrapperPressed,
                { borderRadius: 50 },
              ]} // Add the "wrapperPressed" style when the button is pressed
              locations={[0, 1]}
              colors={
                forgotPressed ? ["#cc501b", "#cc8353"] : ["#ff6422", "#ffa266"]
              } // Darken the colors when the button is pressed
            >
              <Pressable
                style={[styles.pressable, styles.roundedButton]}
                onPress={() => navigation.navigate("ForgotPassword")}
                onPressIn={() => setForgotPressed(true)} // Set "pressed" state to true when the button is pressed
                onPressOut={() => setForgotPressed(false)} // Set "pressed" state to false when the button is released
              >
                <Text style={[styles.login, styles.loginTypo]}>
                  Forgot Password?
                </Text>
              </Pressable>
            </LinearGradient>
          </View>
          <Pressable
            style={styles.dontHaveAnContainer}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={[styles.text, styles.textLayout]}>
              {`Don’t have an account? `}
              <Text style={styles.signUp}>Sign up</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    alignItems: "center",
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
  wrapperPressed: {
    opacity: 0.8, // Reduce the opacity of the button when pressed
  },
  frameTextInputText: {
    color: "#000",
  },
  frameTextInput1Text: {
    color: "#000",
  },
  loginTypo: {
    fontFamily: FontFamily.epilogueBold,
    fontWeight: "700",
    textAlign: "left",
  },
  textLayout: {
    lineHeight: 25,
    fontSize: FontSize.size_lg,
  },
  frameChild: {
    borderColor: "#c1c1c1",
    borderStyle: "solid",
    borderRadius: Border.br_8xs,
  },
  frameItem: {
    marginTop: 20,
    borderRadius: Border.br_8xs,
  },
  login: {
    color: Color.white,
    textAlign: "left",
    lineHeight: 25,
    fontSize: FontSize.size_lg,
  },
  pressable: {
    flexDirection: "row",
    paddingHorizontal: Padding.p_xl,
    paddingVertical: Padding.p_3xs,
    justifyContent: "center",
    backgroundColor: Color.papaya,
    alignItems: "center",
    width: "100%",
  },
  wrapper: {
    width: 322,
    marginTop: 20,
  },
  frameParent: {
    // alignItems: 'center',
  },
  signUp: {
    textDecorationLine: "underline",
  },
  text: {
    fontWeight: "500",
    fontFamily: FontFamily.epilogueMedium,
    color: Color.black,
    textAlign: "left",
  },
  dontHaveAnContainer: {
    alignSelf: "center",
    marginTop: 20, // Adjust the margin to position the "Sign up" component on the screen
  },
  beaconlogo51Icon: {
    width: 132,
    height: 135,
  },
  beacon: {
    fontSize: FontSize.size_31xl,
    lineHeight: 69,
    width: 195,
    marginTop: 11,
    textAlign: "left",
  },
  beaconlogo51Parent: {
    alignItems: "center",
    marginBottom: 20,
  },
  logins: {
    borderRadius: Border.br_11xl,
    backgroundColor: Color.white,
    flex: 1,
    // height: 896,
    overflow: "hidden",
    width: "100%",
    justifyContent: "center", // Center child components vertically
    alignItems: "center", // Center child components horizontally
  },
});

export default Login;
