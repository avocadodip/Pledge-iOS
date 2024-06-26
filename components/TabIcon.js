// TabIcon.js
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSettings } from "../hooks/SettingsContext";

export default function TabIcon({
  type,
  focused,
  activeIcon: ActiveIcon,
  theme,
}) {
  const styles = getStyles(theme);
  const { todayItemsLeft, tmrwItemsLeft, timeStatus } = useSettings();

  const iconSize = focused ? 40 : 35;
  const iconColor = focused ? theme.textHigh : theme.textDisabled;

  return (
    <>
      <View style={styles.iconContainer}>
        <ActiveIcon width={iconSize} height={iconSize} color={iconColor} />
        {/* notification dot: */}
        {type === "today" && todayItemsLeft > 0 && timeStatus === 1 && (
          <View
            style={[
              styles.notificationDot,
              focused ? styles.focusedDot : styles.unfocusedDot,
            ]}
          >
            <Text style={styles.notificationText}>{todayItemsLeft}</Text>
          </View>
        )}
        {type === "tmrw" && tmrwItemsLeft > 0 && timeStatus === 1 && (
          <View
            style={[
              styles.notificationDot,
              focused ? styles.focusedDot : styles.unfocusedDot,
            ]}
          >
            <Text style={styles.notificationText}>{tmrwItemsLeft}</Text>
          </View>
        )}
      </View>
    </>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    iconContainer: {
      position: "relative", // This enables absolute positioning for children
    },
    notificationDot: {
      position: "absolute", // Position the dot absolutely so that it floats over the icon
      // top: -15, // Position at the top-right
      // right: -15,
      width: 25, // Small dot size
      height: 25,
      borderRadius: 50, // Circular dot

      backgroundColor: theme.notificationDotBg,
      borderColor: theme.notificationDotBorder,
      borderWidth: 2,

      flex: 1,
      justifyContent: "center",
      alignItems: "center",

      // Adding glow effect
      shadowColor: theme.dayStatusIndicatorBgIncomplete,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.8,
      shadowRadius: 20,
    },
    focusedDot: {
      top: -10,
      right: -10,
    },
    unfocusedDot: {
      top: -12.7,
      right: -12.7,
    },
    notificationText: {
      color: "white",
      fontWeight: "800",
      fontSize: 13,
    },
  });
