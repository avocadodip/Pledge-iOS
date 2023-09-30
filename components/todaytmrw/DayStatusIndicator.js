import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ClockIcon from "../../assets/icons/clock.svg";
import { useThemes } from "../../hooks/ThemesContext";
import { useDayStatus } from "../../hooks/DayStatusContext";

const DayStatusIndicator = ({ message }) => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  const {
    dayCompleted,
    todayHeaderSubtitleMessage,
  } = useDayStatus();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 7,
        backgroundColor:
          dayCompleted
            ? theme.lightPrimary
            : theme.dayStatusIndicatorBg,
        paddingHorizontal: 9,
        borderRadius: 16,
      }}
    >
      <Text style={styles.headerSubtitle}>{todayHeaderSubtitleMessage}</Text>
      {todayHeaderSubtitleMessage.includes("PM") && (
        <View>
          <ClockIcon color={theme.textHigh} height={19} width={19} />
        </View>
      )}
    </View>
  );
};

export default DayStatusIndicator;

const getStyles = (theme) =>
  StyleSheet.create({
    headerSubtitle: {
      color: theme.textHigh,
      fontSize: 15, // 22
      paddingBottom: 4, //temp
      fontWeight: "bold",
      marginTop: 5,
    },
  });
