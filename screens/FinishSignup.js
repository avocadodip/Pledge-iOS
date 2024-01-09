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
  Alert,
  Linking,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  greenGradientValues,
  purpleGradientValues,
  redGradientValues,
} from "../themes";
import Animated, {
  FadeIn,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { getIdToken } from "@firebase/auth";
import { auth, db } from "../database/firebase";
import { API_URL } from "@env";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { getTodayDate } from "../utils/currentDate";
import SampleNotif from "../components/SampleNotif";
import { EXPO_PROJECT_ID } from "@env";
import * as Notifications from "expo-notifications";
import { useDayChange } from "../hooks/useDayChange";
import ProgressBar from "../components/onboard/ProgressBar";
import OnboardTodo from "../components/todo/OnboardTodo";
import AnimatedSignature from "../components/onboard/AnimatedSignature";
import ExponentialCurve from "../components/onboard/ExponentialCurve";

export const PLACEHOLDER_TEXT_COLOR = "rgba(255, 255, 255, 0.6)";

export const AnimatedComponent = ({ isFirstStep = false, children }) => {
  return (
    <Animated.View
      entering={isFirstStep ? undefined : FadeIn.duration(400).delay(300)}
      exiting={FadeOutUp.duration(400)}
      style={{ width: "100%", justifyContent: "center", alignItems: "center" }}
    >
      {children}
    </Animated.View>
  );
};

export const PromptText = ({
  text,
  fontSize = 25,
  fontWeight = 500,
  width = "100%",
  style = {},
}) => {
  return (
    <View
      style={{
        alignItems: "center",
        marginBottom: 15,
        width: width,
        paddingHorizontal: 30,
        ...style,
      }}
    >
      <Text
        style={[
          styles.promptText,
          { fontSize: fontSize, fontWeight: fontWeight },
        ]}
      >
        {text}
      </Text>
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

const FinishSignup = () => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dream, setDream] = useState("");
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [endFadeOut, setEndFadeOut] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const { todayDate } = useDayChange();
  const [firstTodoChecked, setFirstTodoChecked] = useState(false);
  const [secondTodoChecked, setSecondTodoChecked] = useState(false);
  const [thirdTodoChecked, setThirdTodoChecked] = useState(false);
  const [firstTodoLocked, setFirstTodoLocked] = useState(false);
  const [secondTodoLocked, setSecondTodoLocked] = useState(false);
  const [thirdTodoLocked, setThirdTodoLocked] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationComplete(true);
    }, 12500);

    return () => clearTimeout(timer);
  }, []);

  const placeholders = [
    "Publish a book ✍️",
    "Win a Grammy 🏆",
    "Work at OpenAI 🧑‍💻",
    "Produce a film 🎥",
    "Bench two plates 💪",
    "Speak fluent Spanish 🇪🇸",
    "Move to NYC 🗽",
    "Run a marathon 🏃",
  ];

  useEffect(() => {
    const typingTimer = setInterval(() => {
      setCharIndex((currentCharIndex) => {
        const currentPlaceholder = placeholders[placeholderIndex];
        if (currentCharIndex < currentPlaceholder.length) {
          const nextChar = currentPlaceholder[currentCharIndex];
          // Check if the next character is the start of an emoji
          if (nextChar >= "\ud800" && nextChar <= "\udbff") {
            // Add the whole emoji (which is two characters in JavaScript)
            setPlaceholder(currentPlaceholder.slice(0, currentCharIndex + 2));
            return currentCharIndex + 2;
          } else {
            // Add the next character
            setPlaceholder(currentPlaceholder.slice(0, currentCharIndex + 1));
            return currentCharIndex + 1;
          }
        }
        return currentCharIndex;
      });
    }, 50); // Typing speed in milliseconds

    const cyclingTimer = setInterval(() => {
      setPlaceholderIndex(
        (currentIndex) => (currentIndex + 1) % placeholders.length
      );
      setCharIndex(0);
    }, 3000); // Time before switching to next placeholder

    return () => {
      clearInterval(typingTimer);
      clearInterval(cyclingTimer);
    };
  }, [placeholderIndex]);

  const getNotifPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Linking.openURL("app-settings:");
      return;
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        experienceId: EXPO_PROJECT_ID,
      });
      const token = tokenData.data;

      if (token !== null) {
        setExpoPushToken(token);
        setNotificationsEnabled(true);
      }
    } catch (error) {
      console.error("Error getting Expo push token: ", error.message);
    }
  };

  const createFirebaseUserDoc = async () => {
    try {
      // Add dream
      const dreamsCollection = collection(
        doc(db, "users", auth.currentUser.uid),
        "dreams"
      );

      // Create a new document in the dreams collection with the provided data
      await addDoc(dreamsCollection, {
        title: dream,
        amountPledged: 0,
        doneCount: 0,
        completionHistory: [],
        lastCompleted: null,
        streak: 0,
        createdAt: todayDate,
      });

      // Call the Firebase Cloud Function to create a new Stripe customer
      const idToken = await getIdToken(auth.currentUser, true);
      console.log(API_URL);
      // Send paymentMethod.id to Cloud Function
      const response = await fetch(`${API_URL}/createStripeCustomer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + idToken,
        },
        body: JSON.stringify({
          email: auth.currentUser.email,
          uid: auth.currentUser.uid,
          name: firstName + " " + lastName,
        }),
      });

      // Handle response from your server.
      if (!response.ok) {
        throw new Error("Failed to create Stripe customer.");
      }

      const result = await response.json();
      const stripeCustomerId = result.customerId;

      // Save user data to Firestore
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        fullName: firstName + " " + lastName,
        email: auth.currentUser.email,
        profilePhoto: 1,
        todayDayStart: "7:30",
        todayDayEnd: "9:00",
        nextDayStart: "7:30",
        nextDayEnd: "9:00",
        daysActive: {
          Sunday: true,
          Monday: true,
          Tuesday: true,
          Wednesday: true,
          Thursday: true,
          Friday: true,
          Saturday: true,
        },
        theme: "Classic",
        missedTaskFine: 0,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        lastSeen: getTodayDate(),
        currency: "usd",
        stripeCustomerId: stripeCustomerId,
        isPaymentSetup: false,
        hasBeenChargedBefore: false,
        isOnboarded: false,
        paymentMethodId: null,
        last4Digits: null,
        notificationsEnabled: notificationsEnabled,
        todayIsActive: false,
        tmrwIsActive: false,
        todayAllNotifsSent: false,
        todayANotifHasBeenSent: false,
        notificationTimes: {
          15: {
            shouldSend: true,
            isSent: false,
          },
          30: {
            shouldSend: true,
            isSent: false,
          },
          60: {
            shouldSend: true,
            isSent: false,
          },
          180: {
            shouldSend: true,
            isSent: false,
          },
          360: {
            shouldSend: true,
            isSent: false,
          },
        },
        dailyUpdateLastRun: null,
        isActive: false,
        last4Digits: null,
        notifExpoPushToken: expoPushToken,
        todayDayEnd: "11:00",
        todayDayStart: "8:30",
        tmrwIsActive: true,
        tmrwIsVacation: false,
        tmrwTodos: [],
        todayIsVacation: false,
        todayNoInputCount: 0,
        todayNoInputFine: 0,
        todayTodos: [],
      });
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "Failed to make an account. Please try again later."
      );
      setStep(1);
      setEndFadeOut(false)
    }
  };

  // Handle next button click
  const handleNextPress = async () => {
    // Go to next step
    if (step === 1) {
      if (isAnimationComplete) {
        setStep(step + 1);
      }
    }
    if (step === 6) {
    }
    if (step === 7) {
    }
    if (step === 9) {
      await getNotifPermissions();
    }
    if (step === 10) {
      if (firstName.trim().length === 0) {
        return;
      }
    }
    if (step === 11) {
      if (lastName.trim().length === 0) {
        return;
      }
    }
    if (step === 12) {
      if (dream.trim().length > 5) {
        setEndFadeOut(true);
        await createFirebaseUserDoc();
      }
    }
    // Increment for all steps but these:
    if (step !== 4 && step !== 5 && step !== 1) {
      setStep(step + 1);
    }
  };

  // Handle hook logic
  useEffect(
    () => {
      if (step === 4) {
        if (firstTodoChecked && secondTodoChecked && thirdTodoChecked) {
          setTimeout(() => {
            setStep(5);
          }, 300);
        }
      }
      if (step === 5) {
        if (firstTodoLocked && secondTodoLocked && thirdTodoLocked) {
          setTimeout(() => {
            setStep(6);
          }, 200);        }
      }
      if (step === 6) {
        turnGreenAnimation();
        removePurpleAnimation();
      } else if (step < 6) {
        removeGreenAnimation();
      }
      if (step === 7) {
        turnPurpleAnimation();
        removeRedAnimation();
      } else if (step < 6) {
        removePurpleAnimation();
      }
      if (step === 8) {
        turnRedAnimation();
      }
    },
    // prettier-ignore
    [ step, firstName, lastName, firstTodoChecked, secondTodoChecked, thirdTodoChecked, firstTodoLocked, secondTodoLocked, thirdTodoLocked]
  );

  // ANIMATING BACKGROUND
  const greenGradientY = useSharedValue(Dimensions.get("window").height);
  const greenGradientStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "100%", // Full height of the screen
      transform: [{ translateY: greenGradientY.value }],
    };
  });
  const purpleGradientY = useSharedValue(Dimensions.get("window").height);
  const purpleGradientStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "100%", // Full height of the screen
      transform: [{ translateY: purpleGradientY.value }],
    };
  });
  const redGradientY = useSharedValue(Dimensions.get("window").height);
  const redGradientStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "100%", // Full height of the screen
      transform: [{ translateY: redGradientY.value }],
    };
  });
  const turnRedAnimation = () => {
    redGradientY.value = withTiming(0, { duration: 1000 }, () => {});
  };
  const turnGreenAnimation = () => {
    greenGradientY.value = withTiming(0, { duration: 1000 }, () => {});
  };
  const turnPurpleAnimation = () => {
    purpleGradientY.value = withTiming(0, { duration: 1000 }, () => {});
  };

  const removeGreenAnimation = () => {
    // Slide the green gradient down
    greenGradientY.value = withTiming(Dimensions.get("window").height, {
      duration: 500,
    });
  };
  const removePurpleAnimation = () => {
    // Slide the green gradient down
    purpleGradientY.value = withTiming(Dimensions.get("window").height, {
      duration: 500,
    });
  };
  const removeRedAnimation = () => {
    // Slide the green gradient down
    redGradientY.value = withTiming(Dimensions.get("window").height, {
      duration: 500,
    });
  };

  return (
    <TouchableOpacity
      style={{ flex: 1, overflow: "hidden" }}
      activeOpacity={1}
      onPress={handleNextPress}
    >
      {/* Gradient container */}
      <View
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {/* Red Gradient as the base */}
        {step < 7 && (
          <LinearGradient colors={redGradientValues} style={{ flex: 1 }} />
        )}

        {/* Animated Green Gradient */}
        <Animated.View style={greenGradientStyle}>
          <LinearGradient colors={greenGradientValues} style={{ flex: 1 }} />
        </Animated.View>
        {/* Animated Purple Gradient */}
        <Animated.View style={purpleGradientStyle}>
          <LinearGradient colors={purpleGradientValues} style={{ flex: 1 }} />
        </Animated.View>
        {/* Animated Red Gradient */}
        <Animated.View style={redGradientStyle}>
          <LinearGradient colors={redGradientValues} style={{ flex: 1 }} />
        </Animated.View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {step === 8 && (
          <Animated.View
            exiting={FadeOutUp.duration(400)}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <ExponentialCurve />
          </Animated.View>
        )}
        <SafeAreaView style={styles.container}>
          {!endFadeOut && <ProgressBar progress={(step - 1) / 11} />}
          <View style={styles.promptContainer}>
            {step === 1 && (
              <>
                <AnimatedComponent>
                  <Animated.View
                    entering={FadeIn.duration(700).delay(1000)}
                    style={{ width: "100%", alignItems: "center" }}
                  >
                    <PromptText text="Welcome to Pledge!" />
                  </Animated.View>
                  <Animated.View
                    entering={FadeIn.duration(700).delay(3200)}
                    style={{ width: "100%", alignItems: "center" }}
                  >
                    <PromptText
                      text="We made this app to hold ourselves accountable to our most spectacular dreams."
                      fontSize={18}
                      fontWeight={400}
                    />
                  </Animated.View>
                  <Animated.View
                    entering={FadeIn.duration(700).delay(5700)}
                    style={{ width: "100%", alignItems: "center" }}
                  >
                    <PromptText
                      text="We hope it works for you, too."
                      fontSize={18}
                      fontWeight={400}
                    />
                  </Animated.View>
                  <Animated.View
                    entering={FadeIn.duration(700).delay(8200)}
                    style={{ width: "100%", alignItems: "center" }}
                  >
                    <PromptText
                      text="This is the first day of the rest of your life."
                      fontSize={18}
                      fontWeight={400}
                    />
                  </Animated.View>
                  <Animated.View
                    entering={FadeIn.duration(700).delay(10700)}
                    style={{ width: "100%", alignItems: "center" }}
                  >
                    <PromptText
                      text={`Sincerely,
Chris and Josh`}
                      fontSize={18}
                      fontWeight={400}
                    />
                  </Animated.View>
                  <AnimatedSignature delay={10700} />
                </AnimatedComponent>
              </>
            )}
            {step === 2 && (
              <>
                <AnimatedComponent>
                  <Animated.View
                    entering={FadeIn.duration(700).delay(700)}
                    style={{ width: "100%", alignItems: "center" }}
                  >
                    <PromptText
                      text="Pledge is simple."
                      fontSize={20}
                      fontWeight={400}
                    />
                  </Animated.View>
                  <Animated.View
                    entering={FadeIn.duration(700).delay(2000)}
                    style={{ width: "100%", alignItems: "center" }}
                  >
                    <PromptText
                      text="You assign a cash value to each task."
                      fontSize={20}
                      fontWeight={400}
                    />
                  </Animated.View>
                  <Animated.View
                    entering={FadeIn.duration(700).delay(3000)}
                    style={{ width: "100%", alignItems: "center" }}
                  >
                    <OnboardTodo
                      type={"sample"}
                      bool={firstTodoChecked}
                      setBool={setFirstTodoChecked}
                      title={"Upload new video"}
                      dream={"Dream: Reach 1 million subscribers!"}
                      amount={"$5"}
                    />
                  </Animated.View>

                  <Animated.View
                    entering={FadeIn.duration(700).delay(5000)}
                    style={{
                      width: "100%",
                      alignItems: "center",
                      marginTop: 17,
                    }}
                  >
                    <PromptText
                      text="If you don’t check it off by the deadline, we charge your card that amount."
                      fontSize={20}
                      fontWeight={400}
                    />
                  </Animated.View>
                </AnimatedComponent>
              </>
            )}
            {step === 3 && (
              <>
                <AnimatedComponent>
                  <PromptText
                    text={`Each day you have 2 obligations.        
                    `}
                    fontSize={22}
                    fontWeight={400}
                  />
                </AnimatedComponent>
              </>
            )}
            {step === 4 && (
              <>
                <AnimatedComponent>
                  <PromptText
                    text="First, check off the 3 tasks you set yesterday."
                    fontSize={20}
                    fontWeight={400}
                    width={270}
                  />
                  <OnboardTodo
                    type={"today"}
                    bool={firstTodoChecked}
                    setBool={setFirstTodoChecked}
                    title={"Revise Chapter 3"}
                    dream={"Publish a book 📘"}
                    amount={"$10"}
                  />
                  <OnboardTodo
                    type={"today"}
                    bool={secondTodoChecked}
                    setBool={setSecondTodoChecked}
                    title={"Do 5 sets of pull-ups"}
                    dream={"Get ripped 💪"}
                    amount={"$3"}
                  />
                  <OnboardTodo
                    type={"today"}
                    bool={thirdTodoChecked}
                    setBool={setThirdTodoChecked}
                    title={"Study 3-point perspective"}
                    dream={"Learn oil painting 🎨"}
                    amount={"$5"}
                  />
                </AnimatedComponent>
              </>
            )}
            {step === 5 && (
              <>
                <Animated.View
                  entering={FadeIn.duration(400).delay(300)}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  <PromptText
                    text="Second, lock in 3 tasks for tomorrow."
                    fontSize={20}
                    fontWeight={400}
                    width={300}
                  />
                  <OnboardTodo
                    type={"tmrw"}
                    bool={firstTodoLocked}
                    setBool={setFirstTodoLocked}
                    title={"Write two pages of ch. 4"}
                    dream={"Publish a book 📘"}
                    amount={"$5"}
                  />
                  <OnboardTodo
                    type={"tmrw"}
                    bool={secondTodoLocked}
                    setBool={setSecondTodoLocked}
                    title={"Do 60 incline push-ups"}
                    dream={"Get ripped 💪"}
                    amount={"$8"}
                  />
                  <OnboardTodo
                    type={"tmrw"}
                    bool={thirdTodoLocked}
                    setBool={setThirdTodoLocked}
                    title={"Sketch out cityscape"}
                    dream={"Learn oil painting 🎨"}
                    amount={"$3"}
                  />
                </Animated.View>
              </>
            )}
            {step === 6 && (
              <>
                <Animated.View style={{ width: "100%", alignItems: "center" }}>
                  <Animated.View
                    entering={FadeIn.duration(400).delay(300)}
                    style={{ width: "100%", alignItems: "center" }}
                  >
                    <PromptText
                      text="That's it! Once both are done, the app turns green."
                      fontSize={20}
                      fontWeight={400}
                      width={330}
                    />
                  </Animated.View>
                  <OnboardTodo
                    type={"tmrw"}
                    bool={firstTodoLocked}
                    setBool={setFirstTodoLocked}
                    title={"Write two pages of ch. 4"}
                    dream={"Publish a book 📘"}
                    amount={"$5"}
                  />
                  <OnboardTodo
                    type={"tmrw"}
                    bool={secondTodoLocked}
                    setBool={setSecondTodoLocked}
                    title={"Do 60 incline push-ups"}
                    dream={"Get ripped 💪"}
                    amount={"$8"}
                  />
                  <OnboardTodo
                    type={"tmrw"}
                    bool={thirdTodoLocked}
                    setBool={setThirdTodoLocked}
                    title={"Sketch out cityscape"}
                    dream={"Learn oil painting 🎨"}
                    amount={"$3"}
                  />
                </Animated.View>
              </>
            )}
            {step === 7 && (
              <>
                <Animated.View
                  entering={FadeIn.duration(400).delay(300)}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  <PromptText
                    text="After the deadline has passed, the app goes to sleep."
                    fontSize={20}
                    fontWeight={400}
                    width={350}
                  />
                </Animated.View>
                <OnboardTodo
                  type={"tmrw"}
                  bool={firstTodoLocked}
                  setBool={setFirstTodoLocked}
                  title={"Write two pages of ch. 4"}
                  dream={"Publish a book 📘"}
                  amount={"$5"}
                  sleepMode={true}
                />
                <OnboardTodo
                  type={"tmrw"}
                  bool={secondTodoLocked}
                  setBool={setSecondTodoLocked}
                  title={"Do 60 incline push-ups"}
                  dream={"Get ripped 💪"}
                  amount={"$8"}
                  sleepMode={true}
                />
                <OnboardTodo
                  type={"tmrw"}
                  bool={thirdTodoLocked}
                  setBool={setThirdTodoLocked}
                  title={"Sketch out cityscape"}
                  dream={"Learn oil painting 🎨"}
                  amount={"$3"}
                  sleepMode={true}
                />
              </>
            )}
            {step === 8 && (
              <>
                <AnimatedComponent>
                  <PromptText
                    text="Rinse and repeat for the next day."
                    fontSize={20}
                    fontWeight={500}
                    width={270}
                  />
                  <PromptText
                    text="A 1% improvement each day for a year will make you 37x better."
                    fontSize={20}
                    fontWeight={400}
                    width={330}
                  />
                </AnimatedComponent>
              </>
            )}
            {step === 9 && (
              <>
                <AnimatedComponent>
                  <PromptText text="Pledge works best with notifications on." />
                  <View style={{ width: "90%", marginTop: 10 }}>
                    <SampleNotif />
                  </View>
                </AnimatedComponent>
              </>
            )}
            {step === 10 && (
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
                    onSubmitEditing={handleNextPress}
                    enterKeyHint={"done"}
                  />
                </AnimatedComponent>
              </>
            )}
            {step === 11 && (
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
                    onSubmitEditing={handleNextPress}
                    enterKeyHint={"done"}
                  />
                </AnimatedComponent>
              </>
            )}
            {step === 12 && (
              <>
                {!endFadeOut && (
                  <AnimatedComponent>
                    <PromptText text="What's a dream of yours?" />
                    <TextInput
                      style={styles.inputField}
                      placeholder={placeholder}
                      value={dream}
                      onChangeText={(text) => {
                        setDream(text);
                      }}
                      placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                      autoCorrect={false}
                      keyboardType="default"
                      textAlign="center"
                      autoFocus
                      onSubmitEditing={handleNextPress}
                      enterKeyHint={"done"}
                    />
                  </AnimatedComponent>
                )}
              </>
            )}
          </View>

          {!endFadeOut && (
            <View style={styles.bottomContainer}>
              {/* Back button logic */}
              {step > 1 ? (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    if (step === 5) {
                      setFirstTodoChecked(false);
                      setSecondTodoChecked(false);
                      setThirdTodoChecked(false);
                      setFirstTodoLocked(false);
                      setSecondTodoLocked(false);
                      setThirdTodoLocked(false);
                    }
                    if (step === 6) {
                      setFirstTodoLocked(false);
                      setSecondTodoLocked(false);
                      setThirdTodoLocked(false);
                    }
                    setStep((prevStep) => prevStep - 1);
                  }}
                >
                  <Text style={styles.buttonLabelText}>Back</Text>
                </TouchableOpacity>
              ) : (
                <Animated.View
                  entering={FadeIn.duration(700).delay(10400)}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  <Text style={styles.buttonLabelText}>Tap to continue</Text>
                </Animated.View>
              )}
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableOpacity>
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
    paddingHorizontal: 5,
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },

  // button
  button: {
    width: "80%",
    height: 55,
    backgroundColor: "#ffffffc9",
    borderRadius: 50,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#f75f2cc4",
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
  },
  backButton: {
    display: "flex",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default FinishSignup;
