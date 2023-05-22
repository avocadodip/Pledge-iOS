import React, { useEffect, useState } from "react";
// import { Input as RNKTextInput } from '@ui-kitten/components'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color } from "../GlobalStyles";
import Globals from "../Globals";
import { checkAuthState, handleGoogleLogin } from "../utils/authHelper";
import { auth, db } from "../database/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import GoogleLogoIcon from "../assets/icons/google-logo.svg";
import MailIcon from "../assets/icons/mail-icon.svg";

const Signup = () => {
  const [firstLastName, setFirstLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginPressed, setLoginPressed] = useState(false);
  const [forgotPressed, setForgotPressed] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (checkAuthState()) {
      navigation.navigate("Map");
    }
  }, []);

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
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        {/* replace with app logo */}
        <GoogleLogoIcon />
        <Text style={styles.appNameText}>Fervo</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          placeholderTextColor="#fff"
          // textStyle={styles.frameTextInputText}
          autoCorrect={false} // Disable auto-correction
          autoCapitalize="none" // Disable auto-capitalization
        />
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          placeholderTextColor="#fff"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          textStyle={styles.frameTextInput1Text}
          autoCorrect={false} // Disable auto-correction
          autoCapitalize="none" // Disable auto-capitalization
        />

        {/* <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
          <GoogleLogoIcon />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
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
          onPress={() => navigation.navigate("Login")}
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
  inputField: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 15,
    borderRadius: 5,
    color: "white",
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

export default Signup;
