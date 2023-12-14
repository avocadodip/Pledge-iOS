import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useThemes } from "../../hooks/ThemesContext";
import { useDayChange } from "../../hooks/useDayChange";

const SetStartDay = ({
  isTodayOption,
  timePickerText,
  startDay,
  setStartDay,
}) => {
  const { theme } = useThemes();
  const { tmrwDateName } = useDayChange();
  const styles = getStyles(theme);
  const [hoursLeft, setHoursLeft] = useState(0);


  // Calculate time left
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const [hours, minutes, period] = timePickerText.end.split(/[:\s]/);
      const targetHours =
        period === "PM" && hours !== "12"
          ? parseInt(hours) + 12
          : parseInt(hours);
      const targetMinutes = parseInt(minutes);

      const targetTime = new Date();
      targetTime.setHours(targetHours);
      targetTime.setMinutes(targetMinutes);
      targetTime.setSeconds(0);

      let diffInMilliseconds = targetTime - now;
      if (diffInMilliseconds < 0) {
        // If the target time has already passed today, add 24 hours to the difference
        diffInMilliseconds += 24 * 60 * 60 * 1000;
      }

      const diffInHours = diffInMilliseconds / 1000 / 60 / 60;

      setHoursLeft(Math.floor(diffInHours)); // Round down to nearest hour
    };

    calculateTimeLeft();
    const intervalId = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [timePickerText]);

  return (
    <View style={styles.container}>
      {/* Today Button */}
      {isTodayOption && hoursLeft !== 0 && (
        <TouchableOpacity
          style={[styles.button, startDay === "Today" && styles.buttonSelected]}
          onPress={() => setStartDay("Today")}
        >
          <Text
            style={[
              styles.buttonTitleText,
              startDay === "Today" && styles.buttonTitleTextSelected,
            ]}
          >
            Today
          </Text>
          <View style={styles.descContainer}>
            <Text
              style={[
                styles.buttonDescText,
                startDay === "Today" && styles.buttonDescTextSelected,
              ]}
            >
              Tasks must be completed by{" "}
            </Text>
            <Text
              style={[
                styles.buttonDescBoldText,
                startDay === "Today" && styles.buttonDescTextSelected,
              ]}
            >
              {timePickerText.end} ({hoursLeft}{" "}
              {hoursLeft === 1 ? "hour" : "hours"} left)
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Tomorrow Button */}
      <TouchableOpacity
        style={[styles.button, startDay === "Tmrw" && styles.buttonSelected]}
        onPress={() => setStartDay("Tmrw")}
      >
        <Text
          style={[
            styles.buttonTitleText,
            startDay === "Tmrw" && styles.buttonTitleTextSelected,
          ]}
        >
          Tomorrow
        </Text>
        <View style={styles.descContainer}>
          <Text
            style={[
              styles.buttonDescText,
              startDay === "Tmrw" && styles.buttonDescTextSelected,
            ]}
          >
            Tasks must be completed by{" "}
          </Text>
          <Text
            style={[
              styles.buttonDescBoldText,
              startDay === "Tmrw" && styles.buttonDescTextSelected,
            ]}
          >
            {timePickerText.end}, {tmrwDateName}
          </Text> 
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SetStartDay;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      gap: 20,
      alignItems: "center",
    },
    promptText: {
      color: "white",
      fontSize: 26,
      fontWeight: 600,
      alignSelf: "flex-start",
      lineHeight: 35,
    },

    // Unselected button styles
    button: {
      // Base styles
      flexDirection: "column",
      gap: 7,
      borderRadius: 12,
      width: "100%",
      height: 120,
      justifyContent: "center",
      alignItems: "center",

      // Unselected
      borderWidth: 2,
      borderColor: "#ffffffb1",
    },
    buttonTitleText: {
      color: "#ffffffb1",
      fontSize: 23,
      fontWeight: 600,
    },
    buttonDescText: {
      color: "#ffffffb1",
      fontSize: 16,
      lineHeight: 27,
    },
    buttonDescBoldText: {
      color: "#ffffffb1",
      fontSize: 16,
      fontWeight: "bold",
    },

    // Selected button styles
    buttonSelected: {
      backgroundColor: "#ffffff",
    },
    buttonTitleTextSelected: {
      color: theme.authButtonText,
    },
    buttonDescTextSelected: {
      color: theme.authButtonText,
    },

    descContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
      paddingHorizontal: 20,
      justifyContent: "center",
      alignItems: "center",
    },

    buttonRemainingTimeText: {
      color: "#ffffffb1",
      fontSize: 16,
      fontWeight: "bold",
    },
    buttonRemainingTimeTextSelected: {
      color: theme.authButtonText,
    },
  });
