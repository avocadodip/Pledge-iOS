import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CircleRightArrow from "../../assets/icons/circle-right-arrow.svg";
import { useNavigation } from "@react-navigation/native";
import { useThemes } from "../../hooks/ThemesContext";
import { daysOfWeek, getNextActiveDay } from "../../utils/currentDate";
import GlowButton from "../GlowButton";
import { useSettings } from "../../hooks/SettingsContext";
import { useDayChange } from "../../hooks/useDayChange";

const TodayTmrwMessage = ({ type, setModalVisible }) => {
  const { theme } = useThemes();
  const navigation = useNavigation();
  const styles = getStyles(theme);
  const {
    settings: { tmrwIsActive, daysActive },
  } = useSettings();
  const { tmrwDOW } = useDayChange();
  const [nextActiveDay, setNextActiveDay] = useState(
    getNextActiveDay(tmrwDOW, daysActive)
  );
  const nextActiveDayIndex = daysOfWeek.indexOf(nextActiveDay);
  const dayBeforeNextActiveDay = daysOfWeek[(nextActiveDayIndex - 1 + 7) % 7];

  const renderMessage = () => {
    switch (type) {
      case "new user":
        return (
          <GlowButton
            height={50}
            width={300}
            color={theme.faintPrimary}
            borderColor={theme.buttonBorder}
            borderRadius={10}
            onPress={() => setModalVisible(true)}
            shadowColor={"white"}
          >
            <Text style={styles.glowButtonText}>
              Set up your first day of tasks
            </Text>
          </GlowButton>
        );
      case "vacation":
        return (
          <View style={styles.container}>
            <Text style={styles.infoText}>You're on vacation.</Text>
            <GlowButton
              height={50}
              width={300}
              color={theme.faintPrimary}
              borderColor={theme.buttonBorder}
              borderRadius={10}
              onPress={() => {
                navigation.navigate("SettingsStack");
              }}
              shadowColor={"white"}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text style={styles.glowButtonText}>
                  Turn off vacation mode
                </Text>
                <CircleRightArrow color={theme.textHigh} />
              </View>
            </GlowButton>
          </View>
        );
      case "rest day (today screen)":
        return (
          <View style={styles.container}>
            <Text style={styles.infoText}>It's your rest day.</Text>
            {tmrwIsActive ? (
              <GlowButton
                height={50}
                width={300}
                color={theme.faintPrimary}
                borderColor={theme.buttonBorder}
                borderRadius={10}
                onPress={() => {
                  navigation.navigate("Tomorrow");
                }}
                shadowColor={"white"}
              >
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Text style={styles.glowButtonText}>
                    Make pledges for tomorrow
                  </Text>
                  <CircleRightArrow color={theme.textHigh} />
                </View>
              </GlowButton>
            ) : (
              <Text style={styles.subText}>
                Come back on {dayBeforeNextActiveDay} to lock in tasks for{" "}
                {nextActiveDay}.
              </Text>
            )}
          </View>
        );
      case "rest day (tmrw screen)":
        return (
          <View style={styles.container}>
            <Text style={styles.infoText}>You have a rest day tomorrow.</Text>
            <Text style={styles.subText}>
              Come back on {dayBeforeNextActiveDay} to lock in tasks for{" "}
              {nextActiveDay}.
            </Text>
          </View>
        );
      // When user selected tmrw option in onboarding (tmrw page is set; today should show "You're all set! Check in tomorrow.")
      case "all set":
        return (
          <View style={styles.container}>
            <Text style={styles.infoText}>You're all set!</Text>
            <Text style={styles.subText}>
              The tasks you've set will appear here tomorrow.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return renderMessage();
};

export default TodayTmrwMessage;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      width: "100%",
      height: 200,
      justifyContent: "center",
      alignItems: "center",
      gap: 28,
      borderRadius: 16,
      padding: 15,
    },
    infoText: {
      color: theme.primary,
      fontSize: 19,
      fontWeight: "600",
    },
    subText: {
      color: theme.primary,
      fontSize: 19,
      fontWeight: "400",
      lineHeight: 28,
      textAlign: "center",
    },
    glowButtonText: {
      color: theme.primary,
      fontWeight: 500,
      fontSize: 19,
    },
  });
