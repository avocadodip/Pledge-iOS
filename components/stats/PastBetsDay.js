import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import XMarkIcon from "../../assets/icons/x-mark.svg";
import CheckIcon from "../../assets/icons/check.svg";
import ClockIcon from "../../assets/icons/clock.svg";
import Collapsible from "react-native-collapsible";
import TouchableRipple from "../TouchableRipple";
import { useThemes } from "../../hooks/ThemesContext";
import { useDayChange } from "../../hooks/useDayChange";
import { useSettings } from "../../hooks/SettingsContext";

const PastBetsDay = ({ dayData, index }) => {
  const { theme } = useThemes();
  const { todayDate } = useDayChange();
  const { dateName, todos, isActive, isVacation, date } = dayData;
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Get dream name
  const { dreamsArray } = useSettings();
  const findDreamTitleById = (id, dreams) => {
    const dream = dreams.find((d) => d.id === id);
    return dream ? dream.title : null;
  };

  // Upcoming day
  let upcomingDay = false;
  if (index == 0) {
    upcomingDay = true;
  }

  // toggle collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Only show past bets
  const isPastBet = date < todayDate;

  if (!isPastBet) {
    return null;
  }
  console.log(todos);

  // Filter out null values and count the number of completed tasks
  const completedTasks = todos.filter((todo) => todo && todo.isComplete).length;

  // Filter out null values and count the total number of tasks
  const totalTasks = todos.filter((todo) => todo && todo.isLocked).length;

  if (dayData && todos && todos.some((todo) => todo && todo.isLocked)) {
    return (
      <>
        <TouchableRipple onPress={toggleCollapse} style={styles.itemContainer}>
          <View style={styles.button}>
            {/* DATE */}
            <Text style={styles.dateText}>{dateName}</Text>
            {/* FRACTION */}
            {upcomingDay ? (
              <ClockIcon height={24} width={24} color={"white"} />
            ) : (
              <Text style={styles.fractionText}>
                {completedTasks}/{totalTasks}
              </Text>
            )}
          </View>
          <Collapsible collapsed={isCollapsed} style={styles.revealedContent}>
            {todos.map((item, index) => {
              if (item) {
                const { title, amount, tag, isComplete } = item;
                return (
                  <View style={styles.todoItem} key={index}>
                    <View style={styles.row}>
                      <Text style={styles.titleText}>{title}</Text>
                      {isComplete ? (
                        <CheckIcon
                          width={20}
                          height={20}
                          color={theme.textHigh}
                        />
                      ) : (
                        <XMarkIcon
                          width={20}
                          height={20}
                          color={theme.textHigh}
                        />
                      )}
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.tagText}>
                        {" "}
                        {findDreamTitleById(tag, dreamsArray)}
                      </Text>
                      {amount.toString() && (
                        <Text style={styles.titleText}>
                          ${amount.toString()}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              }
              return null;
            })}
          </Collapsible>
        </TouchableRipple>
        <View style={styles.separator} />
      </>
    );
  } else {
    return (
      <>
        <View style={styles.itemContainer}>
          <View style={styles.button}>
            <Text style={styles.dateText}>{dateName}</Text>
            <Text style={styles.fractionText}>
              {isVacation ? "Vacation" : !isActive ? "Day off" : "0/0"}
            </Text>
          </View>
        </View>
        <View style={styles.separator} />
      </>
    );
  }
};

const styles = StyleSheet.create({
  // Main components
  itemContainer: {
    flexDirection: "col",
    paddingHorizontal: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 15,
  },

  // Text
  dateText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  fractionText: {
    color: "white",
    fontSize: 15,
  },

  // Other
  separator: {
    height: 1, // You can adjust the height to your desired thickness
    width: "100%",
    backgroundColor: "#ffffff38", // You can choose the color that fits your design
  },

  // Revealed content
  revealedContent: {
    flexDirection: "col",
    gap: 6,
    paddingBottom: 15,
  },
  todoItem: {
    flexDirection: "col",
    gap: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleText: {
    color: "#F3F3F3",
    fontWeight: "400",
    fontSize: 15,
  },
  tagText: {
    color: "#f3f3f38d",
    fontWeight: "300",
    fontSize: 15,
  },
});

export default PastBetsDay;
