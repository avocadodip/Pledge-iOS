import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color } from "../GlobalStyles";
import { auth, db } from "../database/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import MailIcon from "../assets/icons/mail-icon.svg";
import FervoWhite from "../assets/FervoWhite.png";
import { getTodayDateTime } from "../utils/currentDate";
import { useSettings } from "../hooks/SettingsContext";
import TouchableRipple from "../components/TouchableRipple";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUserID, setCurrentUserFullName } = useSettings();

  const navigation = useNavigation();

  const handleSignup = async () => {
    // Check if the inputPhoneNumber field is empty or invalid
    // Check if all fields are filled
    if (!fullName || !email || !password) {
      Alert.alert("Oops! 🙈", "Please fill in all fields");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Uh-oh! 📧", "Please enter a valid email address");
      return;
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    // If a user with the same email is found, show an error alert
    if (!querySnapshot.empty) {
      Alert.alert("Error", "A user with this email address already exists.");
      return;
    }

    // Sign up the user using Firebase Authentication
    const lowerCaseEmail = email.toLowerCase();
    const lowerCasePassword = password.toLowerCase();

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        lowerCaseEmail,
        lowerCasePassword
      );
      // User successfully signed up
      const user = userCredential.user;
      setCurrentUserID(user.uid);
      setCurrentUserFullName(fullName);

      // get user's local timezone
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Save full name and email to Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: lowerCaseEmail,
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
        stripeCustomerId: null
      });
      setLoading(false);
    } catch (error) {
      // Handle sign up errors (e.g., show error message)
      console.error(error.message);
      Alert.alert("Sign Up Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        {/* replace with app logo */}
        <Image
          source={require("../assets/FervoWhite.png")}
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
          // textStyle={styles.frameTextInputText}
          autoCorrect={false} // Disable auto-correction
          autoCapitalize="none" // Disable auto-capitalization
        />
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
        <TouchableRipple style={styles.button} onPress={handleSignup}>
          {/* <MailIcon width={24} height={24} color={`${Color.fervo_red}`} /> */}
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
