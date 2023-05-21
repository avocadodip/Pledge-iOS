import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Color } from "../GlobalStyles";
import XMarkIcon from "../assets/icons/x-mark.svg";
import CheckIcon from "../assets/icons/check.svg";
import ClockIcon from "../assets/icons/clock.svg";

const OneDayStats = ({ taskStatus, taskName, taskFine }) => {
  let taskColor;

  taskName = "Jump really high.";
  taskFine = "$5";

  if (taskStatus === 'inprogress') {
    taskColor = Color.task_yellow;
  } else if (taskStatus === 'completed') {
    taskColor = Color.task_green;
  } else if (taskStatus === 'failed') {
    taskColor = Color.task_red;
  } else {
    taskColor = 'black'; // Default color
  }

  let icon;
  if (taskStatus === 'inprogress') {
    icon = <ClockIcon width={24} height={24} color="rgba(0, 0, 0, 0.5)" />;
  } else if (taskStatus === 'completed') {
    icon = <CheckIcon width={24} height={24} color="rgba(0, 0, 0, 0.5)" />;
  } else if (taskStatus === 'failed') {
    icon = <XMarkIcon width={24} height={24} color="rgba(0, 0, 0, 0.5)" />;
  } else {
    icon = null; // No icon
  }

  return (
    <View style={[styles.container, { backgroundColor: taskColor }]}>
      <View style={styles.statsTextContainer}>
        <Text numberOfLines={1} style={styles.statsText}>
          {taskName}
        </Text>
      </View>
      <View style={styles.statsRightContainer}>
        <View style={styles.statsFineContainer}>
          <Text style={styles.statsText}>{taskFine}</Text>
        </View>
        <View style={styles.statsIconContainer}>
          {icon}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    flex: 2,
    height: 48,
    justifyContent: 'space-between',
  },
  statsText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.5)",
  },
  statsTextContainer: {
    height: 28,
    paddingLeft: 19,
    overflow: 'hidden',
    justifyContent: 'center',
    display: 'flex',
    flex: 1,
  },
  statsRightContainer: {
    flexDirection: 'row',
  },
  statsFineContainer: {
    width: 54,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsIconContainer: {
    width: 74,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OneDayStats;
