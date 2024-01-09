import {
  Modal,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  useWindowDimensions,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import SetStartDay from "./SetStartDay";
import { useThemes } from "../../hooks/ThemesContext";
import { useSettings } from "../../hooks/SettingsContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../database/firebase";
import { LinearGradient } from "expo-linear-gradient";
import {
  AnimatedComponent,
  PLACEHOLDER_TEXT_COLOR,
  PromptText,
} from "../../screens/FinishSignup";
import OnboardTimePicker from "./OnboardTimePicker";


const GettingStartedModal = ({ modalVisible, setModalVisible }) => {
  const { currentUserID, setDayCompleted, dreamsArray } = useSettings();
  const { theme, backgroundGradient } = useThemes();
  const styles = getStyles(theme);

  const [step, setStep] = useState(1);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [timePickerText, setTimePickerText] = useState({
    start: "Pick time",
    end: "Pick time",
  });
  const [startDay, setStartDay] = useState("");
  const [showTodayOption, setShowTodayOption] = useState(null);
  const [firstTodoTitle, setFirstTodoTitle] = useState("");
  const [secondTodoTitle, setSecondTodoTitle] = useState("");
  const [thirdTodoTitle, setThirdTodoTitle] = useState("");

  const [viewHeight, setViewHeight] = useState(0);
  const dim = useWindowDimensions();

  const ConfirmButton = ({ text, onPress, disabled, loading }) => {
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
            style={[styles.buttonText, {color: theme.authButtonText}]}
          >
            {text}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  // Handle disabled button logic
  useEffect(
    () => {
      if (step === 1) {
        setButtonDisabled(timePickerText.start === "Pick time");
      }
      if (step === 2) {
        setButtonDisabled(timePickerText.end === "Pick time");
      }
      if (step === 3) {
        setButtonDisabled(startDay === "");
      }
      if (step === 4) {
        setButtonDisabled(firstTodoTitle.trim().length === 0);
      }
      if (step === 5) {
        setButtonDisabled(secondTodoTitle.trim().length === 0);
      }
      if (step === 6) {
        setButtonDisabled(thirdTodoTitle.trim().length === 0);
      }
    },
    // prettier-ignore
    [ step, timePickerText, startDay, firstTodoTitle, secondTodoTitle, thirdTodoTitle]
  );

  // Determine whether to show today option based on user's device time
  useEffect(() => {
    const currentTime = new Date();
    let [endHour, endMinute] = timePickerText.end
      .split(" ")[0]
      .split(":")
      .map(Number);
    endHour += 12; // Convert to 24 hour format

    // Check if current time is at least 1 hour before end time
    setShowTodayOption(
      currentTime.getHours() < endHour - 1 ||
        (currentTime.getHours() === endHour - 1 &&
          currentTime.getMinutes() <= endMinute)
    );
  }, [timePickerText]);

  const handleSubmit = async () => {
    const waitForAlertResponse = () =>
      new Promise((resolve, reject) => {
        Alert.alert(
          "Confirm",
          `These tasks will be due at ${timePickerText.end} ${
            startDay === "Today" ? "today" : "tomorrow"
          }.`,
          [
            {
              text: "Cancel",
              onPress: () => resolve("cancel"),
              style: "default",
            },
            {
              text: "Lock 'em!",
              onPress: () => resolve("ok"),
              style: "default",
            },
          ],
          { cancelable: false }
        );
      });

    const response = await waitForAlertResponse();
    if (response === "cancel") {
      return; // Exit the function if 'Cancel' was pressed
    }

    // Get rid of AM/PM at end of string
    let dayStart = timePickerText.start.replace(/(AM|PM)/g, "").trim();
    let dayEnd = timePickerText.end.replace(/(AM|PM)/g, "").trim();
    const userRef = doc(db, "users", currentUserID);

    // Update user doc
    await updateDoc(userRef, {
      isOnboarded: true,
      onboardStartTmrw: startDay === "Tmrw",
      todayDayStart: dayStart,
      todayDayEnd: dayEnd,
      nextDayStart: dayStart,
      nextDayEnd: dayEnd,
      todayIsActive: true,
      tmrwIsActive: true,
      todayIsVacation: false,
      tmrwIsVacation: false,
      onboardStartTmrw: startDay === "Tmrw",
      todayTodos: [
        {
          todoNumber: 1,
          title: startDay === "Today" ? firstTodoTitle : "",
          description: "",
          amount: "",
          tag: "",
          isLocked: startDay === "Today",
          isComplete: false,
        },
        {
          todoNumber: 2,
          title: startDay === "Today" ? secondTodoTitle : "",
          description: "",
          amount: "",
          tag: "",
          isLocked: startDay === "Today",
          isComplete: false,
        },
        {
          todoNumber: 3,
          title: startDay === "Today" ? thirdTodoTitle : "",
          description: "",
          amount: "",
          tag: "",
          isLocked: startDay === "Today",
          isComplete: false,
        },
      ],
      tmrwTodos: [
        {
          todoNumber: 1,
          title: startDay === "Tmrw" ? firstTodoTitle : "",
          description: "",
          amount: "",
          tag: "",
          isLocked: startDay === "Tmrw",
          isComplete: false,
        },
        {
          todoNumber: 2,
          title: startDay === "Tmrw" ? secondTodoTitle : "",
          description: "",
          amount: "",
          tag: "",
          isLocked: startDay === "Tmrw",
          isComplete: false,
        },
        {
          todoNumber: 3,
          title: startDay === "Tmrw" ? thirdTodoTitle : "",
          description: "",
          amount: "",
          tag: "",
          isLocked: startDay === "Tmrw",
          isComplete: false,
        },
      ],
    });

    if (startDay === "Tmrw") {
      setDayCompleted(true);
    }

    setModalVisible(false);
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      onDismiss={() => setModalVisible(false)}
      onRequestClose={() => setModalVisible(false)}
      presentationStyle={"pageSheet"}
    >
      <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={dim.height - viewHeight}
          behavior="padding"
          style={{ flex: 1 }}
          onLayout={(event) => {
            if (event && event.nativeEvent && event.nativeEvent.layout) {
              setViewHeight(event.nativeEvent.layout.height);
            }
          }}
          
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.promptContainer}>
              {step === 1 && (
                <>
                  <AnimatedComponent>
                    <PromptText text="My day will start at" />
                    <View style={{ alignItems: "center" }}>
                      <OnboardTimePicker
                        type={"AM"}
                        timePickerText={timePickerText}
                        setTimePickerText={setTimePickerText}
                        isOnboardingModal={false}
                      />
                    </View>
                    <View style={styles.explainer}>
                      <Text style={styles.explainerText}>
                        This is when the app allows you to begin checking off
                        tasks and entering in next day's tasks.
                      </Text>
                    </View>
                  </AnimatedComponent>
                </>
              )}
              {step === 2 && (
                <>
                  <AnimatedComponent>
                    <PromptText text="My day will end at" />
                    <View style={{ alignItems: "center" }}>
                      <OnboardTimePicker
                        type={"PM"}
                        timePickerText={timePickerText}
                        setTimePickerText={setTimePickerText}
                        isOnboardingModal={false}
                      />
                    </View>
                    <View style={styles.explainer}>
                      <Text style={styles.explainerText}>
                        This is your deadline for checking off tasks and locking
                        in next day's tasks.
                      </Text>
                      <Text style={[styles.explainerText, { marginTop: 15 }]}>
                        After this time, incomplete pledges are added to the
                        weekly total fine. (Charges occur on Saturdays at 11:45
                        PM).
                      </Text>
                    </View>
                  </AnimatedComponent>
                </>
              )}
              {step === 3 && (
                <>
                  <AnimatedComponent>
                    <PromptText text="I will complete my first day of tasks" />
                    <SetStartDay
                      isTodayOption={showTodayOption}
                      timePickerText={timePickerText}
                      startDay={startDay}
                      setStartDay={setStartDay}
                    />
                  </AnimatedComponent>
                </>
              )}
              {step === 4 && (
                <>
                  <AnimatedComponent>
                    <PromptText text="Enter your first task" />
                    {/* <PromptText text={dreamsArray[0].title} fontWeight={700} fontSize={20}/> */}
                    <TextInput
                      style={styles.inputField}
                      placeholder="Box for 20 minutes"
                      value={firstTodoTitle}
                      onChangeText={(text) => {
                        setFirstTodoTitle(text);
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
              {step === 5 && (
                <>
                  <AnimatedComponent>
                    <PromptText text="Enter your second task" />
                    <TextInput
                      style={styles.inputField}
                      placeholder="Apply to 3 internships"
                      value={secondTodoTitle}
                      onChangeText={(text) => {
                        setSecondTodoTitle(text);
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
              {step === 6 && (
                <>
                  <AnimatedComponent>
                    <PromptText text="Enter your third task" />
                    <TextInput
                      style={styles.inputField}
                      placeholder="30 minutes in the gym"
                      value={thirdTodoTitle}
                      onChangeText={(text) => {
                        setThirdTodoTitle(text);
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
              <TouchableOpacity
                onPress={() => {
                  setStep((prevStep) => prevStep - 1);
                }}
              >
                {step > 1 && <Text style={styles.buttonLabelText}>Back</Text>}
              </TouchableOpacity>
              <ConfirmButton
                text={step === 6 ? "Lock it!" : "Next"}
                onPress={() => {
                  if (step === 6) {
                    handleSubmit();
                  } else {
                    setStep(step + 1);
                  }
                }}
                disabled={buttonDisabled}
                theme={theme}
              />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Modal>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    promptContainer: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      height: "100%",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    inputField: {
      color: "white",
      borderWidth: 0,
      color: "#FFFFFF",
      fontSize: 25,
    },
    bottomContainer: {
      alignItems: "center",
      paddingBottom: 10,
      width: "100%",
    },

    explainer: {
      marginTop: 15,
    },
    explainerText: {
      marginTop: 3,
      fontSize: 15,
      color: theme.textMedium,
      lineHeight: 22,
    },
    buttonLabelText: {
      color: "white",
      opacity: 0.6,
      fontSize: 17,
      marginBottom: 14,
    },

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
      opacity: 0.5,
    },
  });

export default GettingStartedModal;
