import { StyleSheet, Text, View } from "react-native";
import React from "react";
import OnboardTimePicker from "./OnboardTimePicker";
import SunFilledIcon from "../../assets/icons/sun-filled.svg";
import MoonIcon from "../../assets/icons/moon-icon.svg";
import { useThemes } from "../../hooks/ThemesContext";
import InfoIcon from "../../assets/icons/info-icon-alt.svg";
import { abbreviateDOW } from "../../utils/currentDate";
import { useDayChange } from "../../hooks/useDayChange";
import { useSettings } from "../../hooks/SettingsContext";

const SetDeadline = ({ timePickerText, setTimePickerText }) => {
  const { theme } = useThemes();
  const { tmrwDOW } = useDayChange();
  const {
    settings: { todayDayEnd, todayIsActive },
  } = useSettings();

  const styles = getStyles(theme);
  return (
    <View style={styles.pageContainer}>
      <View style={{ alignItems: "center", gap: 2 }}>
        <Text style={styles.title}>Daily Deadline</Text>
        {todayIsActive && (
          <Text style={styles.explainerText}>
            Today's deadline: {todayDayEnd} PM
          </Text>
        )}
      </View>

      <View style={styles.explainerContainer}>
        <InfoIcon color={theme.textMedium} width={21} height={21} />
        <Text style={styles.explainerText}>
          The times below go into effect tomorrow (on {abbreviateDOW(tmrwDOW)})
        </Text>
      </View>
      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>My day will start at</Text>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <SunFilledIcon color={"white"} height={33} width={33} />
          </View>
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
          <View style={styles.iconContainer}>
            <MoonIcon color={"white"} height={29} width={29} />
          </View>
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
            After this time, incomplete pledges are added to the weekly total
            fine. (Charges occur on Saturdays at 11:45 PM).
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SetDeadline;

const getStyles = (theme) =>
  StyleSheet.create({
    pageContainer: {
      height: "100%",
      alignItems: "center",
      paddingHorizontal: 20,
      flex: 1,
    },
    title: {
      color: theme.textHigh,
      fontSize: 26,
      fontWeight: "600",
      marginTop: 35,
    },
    subtitle: {
      color: theme.textHigh,
      fontSize: 22,
      fontWeight: "600",
      marginTop: 10,
    },
    explainerContainer: {
      backgroundColor: theme.faintishPrimary,
      flexDirection: "row",
      alignItems: "center",
      marginTop: 25,
      gap: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
    },
    explainerText: {
      fontSize: 15,
      color: theme.textMedium,
      lineHeight: 22,
    },
    promptContainer: {
      flexDirection: "column",
      gap: 15,
      width: "100%",
      paddingVertical: 17,
    },
    container: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
    promptText: {
      color: theme.textHigh,
      fontSize: 22,
      fontWeight: "600",
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
