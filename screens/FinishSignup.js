import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { redGradientValues } from "../themes";
import theme from "../themes";
import Animated, { FadeIn, FadeOutUp } from "react-native-reanimated";

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


const createFirebaseUserDoc = async () => {
  try {
    // Get user's local timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Call the Firebase Cloud Function to create a new Stripe customer
    const idToken = await getIdToken(currentUser, true);

    // Send paymentMethod.id to Cloud Function
    const response = await fetch(`${API_URL}/createStripeCustomer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
      body: JSON.stringify({
        email: email,
        uid: currentUser.uid,
        name: fullName,
      }),
    });

    // Handle response from your server.
    if (!response.ok) {
      throw new Error("Failed to create Stripe customer.");
    }

    const result = await response.json();
    const stripeCustomerId = result.customerId;

    // Save full name, email and stripeCustomerId to Firestore
    await setDoc(doc(db, "users", currentUser.uid), {
      fullName: fullName,
      email: email,
      profilePhoto: 1,
      todayDayStart: "7:30",
      todayDayEnd: "9:00",
      tmrwDayStart: "7:30",
      tmrwDayEnd: "9:00",
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
      missedTaskFine: 0,
      timezone: timeZone,
      isActiveUser: true,
      currency: "usd",
      stripeCustomerId: stripeCustomerId,
      isPaymentSetup: false,
      hasBeenChargedBefore: false,
      isOnboarded: false,
      paymentMethodId: null,
      last4Digits: null,
      // for notifs:
      notificationsEnabled: false,
      todayIsActive: false,
      tmrwIsActive: false,
      todayDayEnd: "",
      todayAllNotifsSent: false,
      todayANotifHasBeenSent: false,
      notificationTimes: {
        15: {
          shouldSend: false,
          isSent: false,
        },
        30: {
          shouldSend: false,
          isSent: false,
        },
        60: {
          shouldSend: false,
          isSent: false,
        },
        180: {
          shouldSend: false,
          isSent: false,
        },
        360: {
          shouldSend: false,
          isSent: false,
        },
      },
    });
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to create user.");
  } finally {
    // Sign user out and sign user back in to trigger onAuthStateChanged listener in App.js to navigate to Today
    try {
      await signOut(auth);
      try {
        const password = await SecureStore.getItemAsync("password");
        if (email && password) {
          await signInWithEmailAndPassword(auth, email, password);
          await SecureStore.deleteItemAsync("password");
        } else {
          throw new Error("Missing email or password in SecureStore");
        }
      } catch (signInError) {
        console.error("Error during sign in:", signInError);
      }
    } catch (signOutError) {
      console.error("Error during sign out:", signOutError);
    }
  }
};


const FinishSignup = () => {
  // const { theme, backgroundGradient } = useThemes();
  const [step, setStep] = useState(1); // TEMP
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonText, setButtonText] = useState("Next");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigation = useNavigation();

  // Handle next button click
  const handleNextPress = () => {
    if (step === 1) {
      setStep(2);
    }
    if (step == 2) {
      // save to database and they're in!
    }
  };

  // Handle disabled button logic
  useEffect(
    () => {
      if (step === 1) {
        setButtonDisabled(firstName.trim() == "");
      }
      if (step === 2) {
        setButtonDisabled(lastName.trim() == "");
      }
    },
    // prettier-ignore
    [ step, firstName, lastName]
  );

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
            {step === 2 && (
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
            {/* <TouchableOpacity
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
            </TouchableOpacity> */}

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

export default FinishSignup;
