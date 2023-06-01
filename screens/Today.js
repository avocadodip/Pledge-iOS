import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import Todo from "../components/todo/Todo";
import OnboardingPopup from "../components/OnboardingPopup";
import { useBottomSheet } from "../hooks/BottomSheetContext";
import { useSettings } from "../hooks/SettingsContext";
import { useDayTimeStatus } from "../hooks/useDayStatus";
import { useTodayTodos } from "../hooks/useTodayTodos";

const renderActiveTodo = (
  { title, description, amount, tag, isComplete },
  index
) => (
  <Todo
    key={index + 1}
    todoNumber={index + 1}
    title={title}
    description={description}
    amount={amount.toString()}
    tag={tag}
    componentType="check"
    isLocked={null} // null allows check
    isComplete={isComplete}
  />
);

const renderFinedTodo = (index) => (
  <Todo
    key={index + 1}
    todoNumber=""
    title=""
    description=""
    amount=""
    tag=""
    componentType="fined"
    isLocked={null}
  />
);

const Today = () => {
  const { todayTodos } = useBottomSheet();
  let vacationModeOn;
  let daysActive;
  let isTodayActiveDay = true;
  let todayInactiveMessage = "today is rest day";
  const { loading, settings } = useSettings();
  let isDay = null;
  let headerMessage = "";

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (settings) {
    const { dayStart, dayEnd } = settings;
    vacationModeOn = settings.vacationModeOn;
    daysActive = settings.daysActive;
    isDay = useDayTimeStatus(dayStart, dayEnd);
    headerMessage = useTodayTodos(isDay, dayStart, dayEnd);
  }

  const renderTodos = useCallback(() => {
    // Map through three todos and render them based on their content
    return todayTodos.map((todo, index) => {
      if (todo.title !== "") {
        return renderActiveTodo(todo, index);
      } else {
        return renderFinedTodo(index);
      }
    });
  }, [todayTodos, isDay]);
 
  return (
    <SafeAreaView style={styles.pageContainer}>
      {/* <OnboardingPopup
        texts={['This is the Today page.', 'Your three tasks planned the night before will show up here.','Your only mission is to check them off before the day ends!']}
        buttonTitle="Cool, what's next?"
      /> */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Today</Text>
          <Text style={styles.headerDayOfWeek}>Wed.</Text>
        </View>
        {vacationModeOn ? (
          <Text>Vacation mode on. Visit settings to turn it off.</Text>
        ) : !isTodayActiveDay ? (
          <Text>{todayInactiveMessage}</Text>
        ) : (
          <Text style={styles.headerSubtitle}>{headerMessage}</Text>
        )}
      </View>
      {vacationModeOn || !isTodayActiveDay ? null : (
        <View style={styles.todoContainer}>{renderTodos()}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 20,
  },
  headerContainer: {
    marginTop: 10,
    width: "100%",
    flexDirection: "col",
  },
  headerTitleContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 15,
  },
  headerTitle: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
  },
  headerDayOfWeek: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    paddingBottom: 6,
  },
  headerSubtitle: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 5,
  },
  todoContainer: {
    marginTop: 20,
    gap: 22,
    width: "100%",
  },
});

export default Today;
