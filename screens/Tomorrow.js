import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Todo from "../components/todo/Todo";
import { useBottomSheet } from "../hooks/BottomSheetContext";
import { useSettings } from "../hooks/SettingsContext";
import OnboardingPopup from "../components/OnboardingPopup";
import { useDayTimeStatus } from "../hooks/useDayStatus";
import { useTmrwTodos } from "../hooks/useTmrwTodos";
import { useActiveDay } from "../hooks/useActiveDay";

const renderLockedTodo = (
  { title, description, amount, tag, isLocked, isTodoLocked, id },
  index
) => (
  <Todo
    key={id} // replace with unique id
    todoNumber={index + 1}
    title={title}
    description={description}
    amount={amount.toString()}
    tag={tag}
    componentType="info"
    isLocked={isLocked || isTodoLocked}
  />
);

const renderNewTodo = (index) => (
  <Todo
    key={index + 1} // replace with unique id
    todoNumber={index + 1}
    componentType="number"
    title=""
    description=""
    amount=""
    tag=""
    isLocked={false}
  />
);

const renderFinedTodo = (index) => (
  <Todo
    key={index + 1} // replace with unique id
    todoNumber=""
    title=""
    description=""
    amount=""
    tag=""
    componentType="fined"
    isLocked={null}
  />
);

const Tomorrow = () => {
  const { tmrwTodos } = useBottomSheet();
  const {
    settings: { dayStart, dayEnd, vacationModeOn, daysActive },
  } = useSettings();

  const isDay = useDayTimeStatus(dayStart, dayEnd);
  const headerMessage = useTmrwTodos(isDay, dayStart, dayEnd);
  const { nextDay, isTmrwActiveDay, tmrwInactiveMessage } = useActiveDay(
    dayStart,
    dayEnd,
    daysActive
  );
 
  const renderTodos = useCallback(() => {
    // Map through three todos and render them based on their content
    return tmrwTodos.map((todo, index) => {
      if (todo.title !== "") {
        return renderLockedTodo(todo, index);
      } else if (isDay) {
        return renderNewTodo(index);
      } else {
        return renderFinedTodo(index);
      }
    });
  }, [tmrwTodos, isDay]);

  return (
    <SafeAreaView style={styles.pageContainer}>
      {/* <OnboardingPopup
        texts={['This is the Tomorrow page.', 'Plug in your 3 tasks to be completed tomorrow and how much you will be fined if you fail them.','Be careful! If you forget to input 3 tasks each day, you’ll be fined!','Give this a go, now! We’ve added your dreams as tags to get you started.']}
        buttonTitle="Will do!"
      /> */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Tmrw</Text>
          <Text style={styles.headerDayOfWeek}>{nextDay}</Text>
        </View>
        {vacationModeOn ? (
          <Text>Vacation mode on. Visit settings to turn it off.</Text>
        ) : !isTmrwActiveDay ? (
          <Text>{tmrwInactiveMessage}</Text>
        ) : (
          <Text style={styles.headerSubtitle}>{headerMessage}</Text>
        )}
      </View>
      {vacationModeOn || !isTmrwActiveDay ? null : (
        <View style={styles.todoContainer}>{renderTodos()}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: "red",
    width: "100%",
    height: "100%",
  },
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

export default Tomorrow;
