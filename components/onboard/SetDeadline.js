import { StyleSheet, Text, View } from "react-native";
import React from "react";
import NextButton from "./NextButton";
// import TmrwTimePicker from "../TmrwTimePicker";
import OnboardTimePicker from "./OnboardTimePicker";
import SunIcon from "../../assets/icons/sun-theme-icon.svg";
import SunFilledIcon from "../../assets/icons/sun-filled.svg";
import MoonIcon from "../../assets/icons/moon-icon.svg";
import { useThemes } from "../../hooks/ThemesContext";

const SetDeadline = ({ timePickerText, setTimePickerText }) => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  return (
    <>
      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>My day will start at</Text>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <SunFilledIcon color={"white"} height={30} width={30} />
          </View>
          <OnboardTimePicker
            type={"AM"}
            timePickerText={timePickerText}
            setTimePickerText={setTimePickerText}
          />
        </View>
        <View style={styles.explainer}>
          <Text style={styles.explainerText}>
            This is when the app allows you to begin checking off tasks and entering in
            next day's tasks.
          </Text>
        </View>
      </View>

      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>My day will end at</Text>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <MoonIcon color={"white"} height={25} width={25} />
          </View>

          <OnboardTimePicker
            type={"PM"}
            timePickerText={timePickerText}
            setTimePickerText={setTimePickerText}
          />
        </View>
        <View>
          <Text style={styles.explainerText}>
            This is your deadline for checking off tasks and locking
            in next day's tasks.
          </Text>
          <Text style={[styles.explainerText, {marginTop: 15}]}>
            After this time, the app will total up incomplete pledges for unentered tasks. (Total weekly charges occur on Saturdays at 11:45 PM).
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
      color: "white",
      fontSize: 26,
      fontWeight: 600,
    },
    iconContainer: {
      width: 35,
    },

    explainerText: {
      marginTop: 3,
      fontSize: 15,
      color: theme.textMedium,
      lineHeight: 22,
    },
  });
