import { StyleSheet, Text, View } from "react-native";
import React from "react";
import NextButton from "./NextButton";
// import TmrwTimePicker from "../TmrwTimePicker";
import OnboardTimePicker from "./OnboardTimePicker";
import SunIcon from "../../assets/icons/sun-theme-icon.svg";
import SunFilledIcon from "../../assets/icons/sun-filled.svg";
import MoonIcon from "../../assets/icons/moon-icon.svg";
import { useThemes } from "../../hooks/ThemesContext";
import GlowButton from "../GlowButton";

const SetDeadline = ({ timePickerText, setTimePickerText }) => {
  const { theme, currentThemeName } = useThemes();
  const styles = getStyles(theme);
  return (
    <>
      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>My day will start at</Text>
        <View style={styles.container}>
          {/* {currentThemeName === "Dark" ? (
            <GlowButton height={42} width={42} color={"#e5a23f"}>
              <SunFilledIcon color={"white"} height={30} width={30} />
            </GlowButton>
            <View style={styles.iconContainer}>
              <SunFilledIcon color={"#e5a23f"} height={30} width={30} />
            </View>
          ) : ( */}
            <View style={styles.iconContainer}>
              <SunFilledIcon color={"white"} height={33} width={33} />
            </View>
          {/* )} */}
          <OnboardTimePicker
            type={"AM"}
            timePickerText={timePickerText}
            setTimePickerText={setTimePickerText}
            isOnboardingModal={false}
          />
        </View>
        <View style={styles.explainer}>
          <Text style={styles.explainerText}>
            This is when the app allows you to begin checking off tasks and
            entering in next day's tasks.
          </Text>
        </View>
      </View>

      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>My day will end at</Text>
        <View style={styles.container}>
          {/* {currentThemeName === "Dark" ? (
            <GlowButton height={42} width={42} color={"#8755f3"}>
              <MoonIcon color={"white"} height={30} width={30} />
            </GlowButton>
            <View style={styles.iconContainer}>
              <MoonIcon color={"#8755f3"} height={30} width={30} />
            </View>
          ) : ( */}
            <View style={styles.iconContainer}>
              <MoonIcon color={"white"} height={29} width={29} />
            </View>
          {/* )} */}

          <OnboardTimePicker
            type={"PM"}
            timePickerText={timePickerText}
            setTimePickerText={setTimePickerText}
            isOnboardingModal={false}
          />
        </View>
        <View>
          <Text style={styles.explainerText}>
            This is your deadline for checking off tasks and locking in next
            day's tasks.
          </Text>
          <Text style={[styles.explainerText, { marginTop: 15 }]}>
            After this time, incomplete pledges are added to the weekly total fine. (Charges occur on Saturdays at 11:45 PM).
          </Text>
        </View>
      </View>
    </>
  );
};

export default SetDeadline;

const getStyles = (theme) =>
  StyleSheet.create({
    promptContainer: {
      flexDirection: "col",
      gap: 15,
      width: "100%",
      paddingVertical: 20,

      // borderColor: "black",
      // borderWidth: 1,
    },
    container: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
    promptText: {
      color: theme.textHigh,
      fontSize: 26,
      fontWeight: 600,
    },
    iconContainer: {
      width: 42,
      height: 42,
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    darkModeSunContainer: {
      backgroundColor: "#edac4a",
      borderColor: "#b57c27",
      borderWidth: 1.5,
      shadowColor: "#edac4a",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: 7,
    },
    darkModeMoonContainer: {
      backgroundColor: "#6f45ed",
      borderColor: "#542dc7",
      borderWidth: 1.5,
      shadowColor: "#6f45ed",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.7,
      shadowRadius: 12,
    },

    explainerText: {
      marginTop: 3,
      fontSize: 15,
      color: theme.textMedium,
      lineHeight: 22,
    },
  });
