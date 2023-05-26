import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color } from "../GlobalStyles";
import Globals from "../Globals";
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

import { ThemeContext } from "../ThemeContext";
import { classicTheme, darkTheme, lightTheme } from "../Themes";
import React, { useContext, useEffect, useState } from "react";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const { chosenTheme, setChosenTheme } = useContext(ThemeContext);

  const getStyles = () => {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: chosenTheme.accent,
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
        fontSize: 60,
        color: chosenTheme.primary,
        marginTop: 0,
        fontWeight: "bold",
      },
      inputField: {
        height: 40,
        width: "100%",
        borderColor: chosenTheme.primary,
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 5,
        color: chosenTheme.primary,
        backgroundColor: chosenTheme.accent,
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
        backgroundColor: chosenTheme.primary,
        gap: 15,
        height: 52,
        borderRadius: 17,
        width: "100%",
      },
      buttonText: {
        color: chosenTheme.accent,
        fontSize: 18,
        fontWeight: 600,
      },
    })
  };

  const styles = getStyles();  

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
      Globals.currentUserID = user.uid;
      Globals.fullName = fullName;

      // Save full name and email to Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: lowerCaseEmail,
        profilePhoto: 1,
        dayStart: "7:30",
        dayEnd: "9:00",
        dayStartEndLastUpdated: getTodayDateTime(),
        daysActive: {
          Sunday: true,
          Monday: true,
          Tuesday: true,
          Wednesday: true,
          Thursday: true,
          Friday: true,
          Saturday: true,
        },
        vacationMode: false,
        theme: "Classic",
        missedTaskFine: 1,
        totalAmountDue: 0,
      });
      setLoading(false);
    } catch (error) {
      // Handle sign up errors (e.g., show error message)
      console.error(error.message);
      Alert.alert("Sign Up Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        {/* replace with app logo */}
        <Image
          source={require("../assets/FervoWhite.png")}
          style={{ width: 150, height: 150 }}
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

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          {/* <MailIcon width={24} height={24} color={`${chosenTheme.accent}`} /> */}
          <Text style={styles.buttonText}>Sign up</Text>
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
          <Text style={[styles.buttonText, { color: chosenTheme.primary }]}>
            Log in
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
