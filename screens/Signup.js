import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  KeyboardAvoidingView,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../database/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
} from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import LogoAppName from "../components/auth/LogoAppName";
import FormInput from "../components/auth/AuthFormInput";
import SignUpButton from "../components/auth/AuthFormButton";
import SignInSignUpSwitch from "../components/auth/SignInSignUpSwitch";
import { useThemes } from "../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";
import { redGradientValues } from "../themes";
import theme from "../themes";
import Animated, { FadeIn, FadeOutUp } from "react-native-reanimated";
import * as Linking from "expo-linking";

const PLACEHOLDER_TEXT_COLOR = "rgba(255, 255, 255, 0.6)";

export const AnimatedComponent = ({ isFirstStep = false, children }) => {
  return (
    <Animated.View
      entering={isFirstStep ? undefined : FadeIn.duration(400).delay(300)}
      exiting={FadeOutUp.duration(400)}
    >
      {children}
    </Animated.View>
  );
};

export const PromptText = ({ text, fontSize = 25 }) => {
  return (
    <View
      style={{ alignItems: "center", marginBottom: 15, marginHorizontal: 30 }}
    >
      <Text style={[styles.promptText, { fontSize: fontSize }]}>{text}</Text>
    </View>
  );
};

export const ConfirmButton = ({ text, onPress, disabled, loading }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text
          style={[styles.buttonText, disabled && styles.buttonTextDisabled]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const Signup = () => {
  // const { theme, backgroundGradient } = useThemes();
  const [step, setStep] = useState(1); // TEMP
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonText, setButtonText] = useState("Next");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  // Returning from other app
  const incomingUrl = Linking.useURL();

  useEffect(() => {
    if (incomingUrl) {
      const { path } = Linking.parse(incomingUrl);
      if (path === "finishSignUp") {
        setStep(4);
      }
    }
  }, [incomingUrl]);

  // Handle next button click
  const handleNextPress = () => {
    // Go to next step
    setStep((prevStep) => prevStep + 1);

    if (step === 1) {
      console.log("hi");
      sendEmailLink();
    }
    if (step == 2) {
    }
    if (step == 3) {
    }
    if (step == 4) {
    }
  };

  // Handle disabled button logic
  useEffect(
    () => {
      if (step === 1) {
        setButtonDisabled(!/\S+@\S+\.\S+/.test(email));
      }
      if (step === 3) {
        setButtonDisabled(firstName.trim() == "");
      }
      if (step === 4) {
        setButtonDisabled(lastName.trim() == "");
      }
    },
    // prettier-ignore
    [ step, firstName, lastName, email]
  );

  const sendEmailLink = async () => {
    const fullName = `${firstName} ${lastName}`;

    // Configure the action code settings for the email link
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain must be whitelisted in Firebase Console.
      url: "https://fervo-1.web.app/",
      handleCodeInApp: true,
      // This must be true for email link sign-in.
      iOS: {
        bundleId: "com.example.ios",
      },
      android: {
        packageName: "com.example.android",
        installApp: true,
        minimumVersion: "12",
      },
      dynamicLinkDomain: "example.page.link",
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      // Save the email locally to complete the sign in process later
      await SecureStore.setItemAsync("emailForSignIn", email);

      // Inform the user to check their email
      Alert.alert(
        "Check Your Email",
        "A sign-in link has been sent to your email. Please check your email to complete the registration process."
      );

      // Navigate to a page informing the user to check their email
      setStep(4);
    } catch (error) {
      console.error("Error sending sign-in link:", error);
      Alert.alert(
        "Sign-Up Error",
        "Failed to send sign-up link. Please try again later."
      );
    }
  };

  return (
    <LinearGradient colors={redGradientValues} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.promptContainer}>
            {step === 1 && (
              <>
                <AnimatedComponent>
                  <PromptText text={"Enter your email"} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="alexnimrod@gmail.com"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                    }}
                    placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                    autoCorrect={false}
                    keyboardType="email-address"
                    textAlign="center"
                    autoFocus
                    autoCapitalize={"none"}
                  />
                </AnimatedComponent>
              </>
            )}
            {step === 2 && (
              <>
                <AnimatedComponent>
                  <PromptText text={"Check your email"} />
                </AnimatedComponent>
              </>
            )}
            {/* First name */}
            {step === 3 && (
              <>
                <AnimatedComponent>
                  <PromptText text="Enter your first name" />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Alex"
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                    }}
                    placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                    autoCorrect={false}
                    keyboardType="default"
                    textAlign="center"
                    autoFocus
                  />
                </AnimatedComponent>
              </>
            )}
            {/* Last name */}
            {step === 4 && (
              <>
                <AnimatedComponent>
                  <PromptText text="Enter your last name" />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Smith"
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                    }}
                    placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                    autoCorrect={false}
                    keyboardType="default"
                    textAlign="center"
                    autoFocus
                  />
                </AnimatedComponent>
              </>
            )}
          </View>
          <View style={styles.bottomContainer}>
            {/* Conditional text above next button */}
            <TouchableOpacity
              onPress={() => {
                if (step === 1) {
                  // navigation.navigate("AuthScreen");
                } else {
                  setStep((prevStep) => prevStep - 1);
                }
              }}
            >
              {step > 1 && (
                <Text style={styles.buttonLabelText}>
                  {step === 2 ? "Re-enter email" : "Back"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Next button */}
            <ConfirmButton
              text={buttonText}
              onPress={handleNextPress}
              disabled={buttonDisabled}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  promptContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputField: {
    color: "white",
    borderWidth: 0,
    color: "#FFFFFF",
    fontSize: 25,
  },
  reenterEmailText: {
    color: "white",
    fontSize: 17,
    marginBottom: 10,
    paddingVertical: 15,
  },
  promptText: {
    color: "white",
    fontSize: 25,
    textAlign: "center",
    fontWeight: 500,
  },
  bottomContainer: {
    alignItems: "center",
    paddingBottom: 10,
    width: "100%",
  },

  // button
  button: {
    width: "80%",
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 50,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#1A2020",
    fontWeight: 700,
    fontSize: 20,
    textAlign: "center",
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonLabelText: {
    color: "white",
    opacity: 0.6,
    fontSize: 17,
    marginBottom: 14,
  },
});

export default Signup;
