import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Alert } from "react-native";
// import { Input as RNKTextInput } from '@ui-kitten/components'
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Padding, Border, FontFamily, FontSize, Color } from "../GlobalStyles";
import firebase, { auth, db } from "../database/firebase";
import "firebase/firestore";
import Globals from "../Globals";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "@firebase/auth";

const Login = () => {
  const [fullName, setFullName] = useState();
  const [email, setEmail] = useState(); // New state for email input
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [loginPressed, setLoginPressed] = useState(false); // Add this state to handle the button pressed state
  const navigation = useNavigation();

  const handleLogin = async () => {
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

    signInWithEmailAndPassword(auth, lowerCaseEmail, lowerCasePassword)
      .then((userCredential) => {
        // Signed in successfully
        const user = userCredential.user;
        Globals.currentUserID = user.uid;

        // Get the user's document from Firestore
        const userDoc = doc(db, "users", user.uid);

        getDoc(userDoc)
          .then((docSnap) => {
            if (docSnap.exists()) {
              // Set the full name in Globals
              Globals.fullName = docSnap.data().fullName;
              Globals.email = docSnap.data().email;
              Globals.profileImageUrl = docSnap.data().profileImageUrl || "";
            } else {
              console.log("No such document!");
            }
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

  return (
    <SafeAreaView style={styles.container}>
      {/* <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    > */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/FervoWhite.png")}
          style={{ width: 150, height: 150 }}
        />
        <Text style={styles.appNameText}>Fervo</Text>
      </View>
      <View style={[styles.buttonContainer]}>
        {loading ? <ActivityIndicator size="small" color="white" /> : null}
        <TextInput
          style={[styles.inputField]}
          placeholder="Email" // Email input field
          placeholderTextColor={Color.white}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCorrect={false} // Disable auto-correction
          autoCapitalize="none" // Disable auto-capitalization
        />
        <TextInput
          style={[styles.inputField]}
          placeholder="Password"
          placeholderTextColor={Color.white}
          value={password}
          onChangeText={setPassword}
          autoCorrect={false} // Disable auto-correction
          autoCapitalize="none" // Disable auto-capitalization
          secureTextEntry={true} // Mask password input
        />
        <TouchableOpacity
          style={[styles.button]}
          onPress={handleLogin} // Invoke the handleSignup function when the button is pressed
          onPressIn={() => setLoginPressed(true)} // Set "pressed" state to true when the button is pressed
          onPressOut={() => setLoginPressed(false)} // Set "pressed" state to false when the button is released
        >
          <Text style={[styles.buttonText, styles.signupTypo]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.goBackToContainer}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={[styles.text, styles.textLayout]}>
            {`Go back to `}
            <Text style={styles.login}>Signup</Text>
          </Text>
        </TouchableOpacity>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appNameText: {
    fontSize: 60,
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
    fontFamily: FontFamily.epilogueBold,
    fontWeight: "700",
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
    fontWeight: "500",
    fontFamily: FontFamily.epilogueMedium,
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
  },
  buttonText: {
    color: Color.fervo_red,
    fontSize: 18,
  },
});

export default Login;
