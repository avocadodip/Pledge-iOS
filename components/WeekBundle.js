import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Collapsible from "react-native-collapsible";
import TouchableRipple from "./TouchableRipple";
import { Color } from "../GlobalStyles";

const WeekBundle = ({
  weekDateRange,
  totalWeeklyFine,
  isCharged,
  isFirstSection,
  noInputCount,
  noInputFine,
  finedTasks,
}) => {
  const [isCollapsed, setIsCollapsed] = useState( 
    isFirstSection ? false : true
  );

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Group tasks by date
  const tasksByDate = finedTasks.reduce((acc, task) => {
    (acc[task.date] = acc[task.date] || []).push(task);
    return acc;
  }, {});
  const tasksArray = Object.entries(tasksByDate).map(([date, tasks]) => ({
    date,
    tasks,
  }));

  return (
    <View style={styles.bundle}>
      <TouchableRipple onPress={toggleCollapse} style={styles.weekRowButton}>
        <View style={styles.weekRow}>
          <Text style={styles.weekDateRangeText}>{weekDateRange}</Text>
          <Text style={styles.totalWeeklyFineText}>{totalWeeklyFine}</Text>
        </View>
        <Collapsible collapsed={isCollapsed} style={styles.collapsibleContent}>
          <View style={styles.unenteredTasksItem}>
            <Text style={styles.collapsibleText}>
              {noInputCount} unentered tasks
            </Text>
            <Text style={styles.collapsibleText}>{noInputFine}</Text>
          </View>

          <View style={styles.dayContainer}>
            {tasksArray.map((item, index) => (
              <View key={index} style={styles.dayItem}>
                {/* Date */}
                <Text style={styles.dayDate}>{item.date}</Text>
                {/* Tasks under that date */}
                {item.tasks.map((task, taskIndex) => (
                  <View key={taskIndex}>
                    <View style={styles.spaceBetween}>
                      <Text style={styles.collapsibleText}>{task.title}</Text>
                      <Text style={styles.collapsibleText}>{task.amount}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </Collapsible>
      </TouchableRipple>
    </View>
  );
};

export default WeekBundle;

const styles = StyleSheet.create({
  bundle: {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    borderRadius: 16,
    overflow: "hidden",
  },
  weekRowButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  weekRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    paddingVertical: 13,
    paddingHorizontal: 13,
  },
  weekDateRangeText: {
    fontSize: 15,
    color: "white",
    fontWeight: 600,
  },
  totalWeeklyFineText: {
    fontSize: 15,
    color: "white",
    fontWeight: 600,
  },
  // Collapsible content styles
  collapsibleContent: {
    paddingHorizontal: 13,
    paddingVertical: 13,
  },
  collapsibleText: {
    fontSize: 15,
    color: "white",
    fontWeight: 400,
    opacity: 0.8,
  },
  unenteredTasksItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayItem: {
    flexDirection: "col",
    gap: 6,
    marginTop: 18,
  },
  dayDate: {
    fontSize: 15,
    color: "white",
    fontWeight: 600,
    opacity: 0.8,
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
