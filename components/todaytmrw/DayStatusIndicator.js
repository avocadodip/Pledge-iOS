import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import ClockIcon from "../../assets/icons/clock.svg";
import { useThemes } from "../../hooks/ThemesContext";
import { useDayStatus } from "../../hooks/DayStatusContext";
import BottomModal from "../BottomModal";

const DayStatusIndicator = ({ message }) => {
  const { theme } = useThemes();
  const { dayCompleted, todayHeaderSubtitleMessage, timeStatus } =
    useDayStatus();
  const styles = getStyles(theme, dayCompleted, timeStatus);

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.headerSubtitle}>{todayHeaderSubtitleMessage}</Text>
        {todayHeaderSubtitleMessage.includes("PM") && timeStatus == 1 && (
          <View>
            <ClockIcon color={theme.textHigh} height={19} width={19} />
          </View>
        )}
      </TouchableOpacity>

      <BottomModal
        // style={styles.bottomModal}
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        modalTitle={"Set Deadline"}
      >
        <View>
          <Text>Hi</Text>
        </View>
      </BottomModal>
    </>
  );
};

export default DayStatusIndicator;

const getStyles = (theme, dayCompleted, timeStatus) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 7,
      paddingVertical: 2,
      paddingHorizontal: 10,

      // Background & border
      backgroundColor:
        timeStatus == 0 || timeStatus == 2
          ? theme.dayStatusIndicatorBg
          : dayCompleted
          ? theme.dayStatusIndicatorBgComplete
          : theme.dayStatusIndicatorBgIncomplete,
      borderColor:
        timeStatus == 0 || timeStatus == 2
          ? theme.dayStatusIndicatorBorder
          : dayCompleted
          ? theme.dayStatusIndicatorBorderComplete
          : theme.dayStatusIndicatorBorderIncomplete,
      borderRadius: 16,
      borderWidth: 2,

      // Adding glow effect
      shadowColor: (timeStatus == 0 || timeStatus == 2)
      ? theme.dayStatusIndicatorBg
      : dayCompleted
        ? theme.dayStatusIndicatorBgComplete
        : theme.dayStatusIndicatorBgIncomplete,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: 10,
    },
    headerSubtitle: {
      color: theme.textHigh,
      fontSize: 15, // 22
      paddingBottom: 4, //temp
      fontWeight: "bold",
      marginTop: 5,
    },
  });
