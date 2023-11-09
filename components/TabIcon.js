// TabIcon.js
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTodayTodos } from "../hooks/TodayTodosContext";
import { useTmrwTodos } from "../hooks/TmrwTodosContext";

export default function TabIcon({
  type,
  focused,
  activeIcon: ActiveIcon,
  inactiveIcon: InactiveIcon,
  theme,
}) {
  const styles = getStyles(theme);
  const { incompleteCount } = useTodayTodos();
  const { actionItemsLeft } = useTmrwTodos();
  const iconSize = focused ? 40 : 35;
  const iconColor = focused ? theme.textHigh : theme.textDisabled;

  return (
    <>
      <View style={styles.iconContainer}>
        <ActiveIcon width={iconSize} height={iconSize} color={iconColor} />
        {/* notification dot: */}
        {type === "today" && incompleteCount > 0 && (
          <View
            style={[
              styles.notificationDot,
              focused ? styles.focusedDot : styles.unfocusedDot,
            ]}
          >
            <Text style={styles.notificationText}>
              {incompleteCount}
            </Text>
          </View>
        )}
        {type === "tmrw" && actionItemsLeft > 0 && (
          <View
            style={[
              styles.notificationDot,
              focused ? styles.focusedDot : styles.unfocusedDot,
            ]}
          >
            <Text style={styles.notificationText}>
              {actionItemsLeft}
            </Text>
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
      backgroundColor: theme.dayStatusIndicatorBgIncomplete,
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
      top: -11,
      right: -11,
    },
    notificationText: {
      color: "white",
      fontWeight: 800,
      fontSize: 13,
    },
  });
