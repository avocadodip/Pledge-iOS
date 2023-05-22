import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Alert } from "react-native";
// import { Input as RNKTextInput } from '@ui-kitten/components'
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Padding, Border, FontFamily, FontSize, Color } from "../GlobalStyles";
import firebase from "../database/firebase";
import "firebase/firestore";
import Globals from "../Globals";

const Login = () => {
  const [fullName, setFullName] = useState();
  const [email, setEmail] = useState(); // New state for email input
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [SignupPressed, setSignupPressed] = useState(false); // Add this state to handle the button pressed state
  const navigation = useNavigation();

  const handleSignup = async () => {
    // Check if the inputPhoneNumber field is empty or invalid
    // Check if all fields are filled
    if (!fullName || !email || !phoneNumber || !password) {
      Alert.alert("Oops! 🙈", "Please fill in all fields");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Uh-oh! 📧", "Please enter a valid email address");
      return;
    }

    // Validate phone number
    const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
      Alert.alert("Oops! 📱", "Please enter a valid phone number");
      return;
    }

    // Search for users with the matching phone number in Firestore
    const usersRef = firebase.firestore().collection("users");
    const querySnapshot = await usersRef
      .where("phoneNumber", "==", phoneNumber)
      .get();

    if (!querySnapshot.empty) {
      // If a user with the same phone number is found, show an error alert
      Alert.alert("Error", "A user with this phone number already exists.");
      return;
    }

    // Search for users with the matching email in Firestore
    const emailQuerySnapshot = await usersRef
      .where("email", "==", email.toLowerCase())
      .get();

    // If a user with the same email is found, show an error alert
    if (!emailQuerySnapshot.empty) {
      Alert.alert("Error", "A user with this email address already exists.");
      return;
    }

    // Sign up the user using Firebase Authentication
    const lowerCaseEmail = email.toLowerCase();
    const lowerCasePassword = password.toLowerCase();

    setLoading(true);

    try {
      firebase
        .auth()
        .createUserWithEmailAndPassword(lowerCaseEmail, lowerCasePassword)
        .then((userCredential) => {
          // User successfully signed up
          const user = userCredential.user;
          Globals.currentUserID = user.uid;
          Globals.fullName = fullName;

          // Save full name and phone number to Firestore
          return firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .set({
              fullName: fullName,
              phoneNumber: phoneNumber,
              email: lowerCaseEmail, // Storing email for later searching
              profilePhoto: 1, // Default to stock image
              location: { latitude: null, longitude: null }, // Default to null
              beaconOn: false, // Default to false (beacon is off)
              friends: [], // Empty list of friends
              friendRequests: [], // Empty list of friend requests
              status: "Offline", // Default status
              statusMessage: "", // Default status message
            })
            .then(() => {
              setLoading(false);
              navigation.navigate("Today");
            });
        })
        .catch((error) => {
          // Handle sign up errors (e.g., show error message)
          console.error(error.message);
          Alert.alert("Sign Up Failed", errorMessage);
        });
    } catch (error) {
      console.error(error.message);
      Alert.alert("Sign Up Failed", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.signups}>
        <View style={[styles.image2]} />
        <View style={[styles.frameParent, styles.parentFlexBox]}>
          {loading ? <ActivityIndicator size="small" color="white" /> : null}
          <View style={styles.beaconContainer}>
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
            <TextInput
              style={[styles.frameChild, styles.frameSpaceBlock]}
              placeholder="Full name"
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor="#000"
              textStyle={styles.frameTextInputText}
              autoCorrect={false} // Disable auto-correction
              autoCapitalize="none" // Disable auto-capitalization
            />
            <TextInput
              style={[styles.frameItem, styles.frameSpaceBlock]}
              placeholder="Email" // Email input field
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#000"
              textStyle={styles.frameTextInput1Text}
              autoCorrect={false} // Disable auto-correction
              autoCapitalize="none" // Disable auto-capitalization
            />
            <TextInput
              style={[styles.frameItem, styles.frameSpaceBlock]}
              placeholder="Phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholderTextColor="#000"
              textStyle={styles.frameTextInput1Text}
              autoCorrect={false} // Disable auto-correction
              autoCapitalize="none" // Disable auto-capitalization
              keyboardType="phone-pad" // Set the keyboard to show phone number input
            />
            <TextInput
              style={[styles.frameItem, styles.frameSpaceBlock]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#000"
              textStyle={styles.frameTextInput2Text}
              autoCorrect={false} // Disable auto-correction
              autoCapitalize="none" // Disable auto-capitalization
              secureTextEntry={true} // Mask password input
            />
          </View>
          <LinearGradient
            style={[
              styles.wrapper,
              { borderRadius: 50, marginBottom: 20 }, // Apply borderRadius to LinearGradient
            ]}
            locations={[0, 1]}
            colors={
              SignupPressed ? ["#cc501b", "#cc8353"] : ["#ff6422", "#ffa266"]
            }
          >
            <Pressable
              style={[styles.pressable]}
              onPress={handleSignup} // Invoke the handleSignup function when the button is pressed
              onPressIn={() => setSignupPressed(true)} // Set "pressed" state to true when the button is pressed
              onPressOut={() => setSignupPressed(false)} // Set "pressed" state to false when the button is released
            >
              <Text style={[styles.signup, styles.signupTypo]}>Signup</Text>
            </Pressable>
          </LinearGradient>
          <Pressable
            style={styles.goBackToContainer}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={[styles.text, styles.textLayout]}>
              {`Go back to `}
              <Text style={styles.login}>Signup</Text>
            </Text>
          </Pressable>
        </View>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  beaconContainer: {
    alignItems: "center", // Center contents horizontally
    // marginTop: -150, // Move container up by 50 pixels
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
    color: Color.black,
    textAlign: "left",
  },
  goBackToContainer: {
    alignSelf: "center", // Center the text within the parent view
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
    fontFamily: FontFamily.epilogueBold,
    fontWeight: "700",
    textAlign: "left",
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
});

export default Login;
