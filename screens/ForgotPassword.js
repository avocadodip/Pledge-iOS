import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Color } from "../GlobalStyles";
import TouchableRipple from "../components/TouchableRipple";
import LeftChevronIcon from "../assets/icons/chevron-left.svg";
import AuthFormButton from "../components/auth/AuthFormButton";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../database/firebase";
import { useState } from "react";
import AuthFormInput from "../components/auth/AuthFormInput";
import { useNavigation } from "@react-navigation/native";
import SignInSignUpSwitch from "../components/auth/SignInSignUpSwitch";
import { useThemes } from "../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";

const ForgotPassword = () => {
  const { theme, backgroundGradient } = useThemes();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const checkEmailVerification = async () => {
    setIsChecking(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Check your email for a link to reset your password.");
    } catch (error) {
      if (error.code === "auth/missing-email") {
        Alert.alert("Error", "Invalid email address.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email address.");
      } else {
        console.log(error);
        Alert.alert("Error", error.message);
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleBackPress = async () => {
    navigation.navigate("Login");
  };

  return (
    <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
      <SafeAreaView style={styles.pageContainer}>
        <TouchableRipple style={styles.backButton} onPress={handleBackPress}>
          <LeftChevronIcon width={24} height={24} color={Color.white} />
        </TouchableRipple>

        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Forgot Password</Text>
          </View>
          <Text style={styles.promptText}>
            Enter the email address associated with your account and we'll send
            you a link to reset your password.
          </Text>
          <AuthFormInput action={setEmail} value={email} type="email" />
          <AuthFormButton
            action={checkEmailVerification}
            text={"Send"}
            disabledCondition={isChecking}
          />

          <SignInSignUpSwitch
            navigation={navigation}
            prompt={""}
            navigateTo={"Login"}
            buttonText={"Back to login"}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  pageContainer: {
    display: "flex",
    marginHorizontal: 20,
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    flex: 1,
    gap: 20,
  },

  // Back button
  backButton: {
    borderRadius: 10,
    overflow: "hidden",
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  // Header style
  header: {
    flexDirection: "col",
    alignItems: "center",
    gap: 10,
    marginTop: 60,
    marginBottom: 10,
  },
  headerText: {
    color: Color.white,
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 10,
  },

  promptText: {
    color: Color.white,
    fontSize: 16,
    marginBottom: 20,
  },
});
