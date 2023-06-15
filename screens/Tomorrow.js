import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Todo from "../components/todo/Todo";
import { useBottomSheet } from "../hooks/BottomSheetContext";
import { useSettings } from "../hooks/SettingsContext";
import OnboardingPopup from "../components/OnboardingPopup";
import { useDayStatus } from "../hooks/useDayStatus";
import { useTmrwTodos } from "../hooks/useTmrwTodos";
import VacationMessage from "../components/VacationMessage";
import RestDayMessage from "../components/RestDayMessage";
import TouchableRipple from "../components/TouchableRipple";
import TmrwTimePicker from "../components/TmrwTimePicker";

const renderLockedTodo = (
  { title, description, amount, tag, isLocked, isTodoLocked },
  index
) => (
  <Todo
    key={index + 1}
    todoNumber={index + 1}
    title={title}
    description={description}
    amount={amount.toString()}
    tag={tag}
    componentType="lock"
    isLocked={isLocked || isTodoLocked}
  />
);

const renderNewTodo = (index) => (
  <Todo
    key={index + 1}
    todoNumber={index + 1}
    componentType="number"
    title=""
    description=""
    amount="3"
    tag=""
    isLocked={false}
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

const Tomorrow = () => {
  const { tmrwTodos } = useBottomSheet();
  const {
    settings: { dayStart, dayEnd, vacationModeOn, daysActive },
    currentUserID,
  } = useSettings();

  // Realtime detection of if it's 12am, and if it's before, during, after day window
  const { tmrwHeaderSubtitleMessage, dayChanged, timeStatus } = useDayStatus(
    dayStart,
    dayEnd
  );

  // Re-fetches and sets tmrwTodos, and processes daysActive
  const { tmrwDOWAbbrev, isTmrwActiveDay, nextActiveDay } = useTmrwTodos(
    dayChanged,
    daysActive
  );

  const renderTodos = useCallback(() => {
    // Map through three todos and render them based on their content
    return tmrwTodos.map((todo, index) => {
      if (todo.title !== "") {
        return renderLockedTodo(todo, index);
      } else if (todo.title == "") {
        // edit
        return renderNewTodo(index);
      } else {
        return renderFinedTodo(index);
      }
    });
  }, [tmrwTodos, dayChanged, timeStatus]);

  return (
    <SafeAreaView style={styles.pageContainer}>
      {/* <OnboardingPopup
        texts={['This is the Tomorrow page.', 'Plug in your 3 tasks to be completed tomorrow and how much you will be fined if you fail them.','Be careful! If you forget to input 3 tasks each day, you’ll be fined!','Give this a go, now! We’ve added your dreams as tags to get you started.']}
        buttonTitle="Will do!"
      /> */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Tmrw</Text>
          <Text style={styles.headerDayOfWeek}>{tmrwDOWAbbrev}</Text>
        </View>
        {!vacationModeOn && isTmrwActiveDay && (
          <View>
            <Text style={styles.headerSubtitle}>
              {tmrwHeaderSubtitleMessage}
            </Text>
            <TmrwTimePicker
              currentUserID={currentUserID}
              dayStart={dayStart}
              dayEnd={dayEnd}
            />
          </View>
        )}
      </View>

      {vacationModeOn ? (
        <VacationMessage />
      ) : !isTmrwActiveDay ? (
        <RestDayMessage />
      ) : (
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
    marginTop: 5,
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
    fontSize: 45,
    fontWeight: "bold",
  },
  headerDayOfWeek: {
    color: "white",
    fontSize: 23,
    fontWeight: "bold",
    paddingBottom: 6,
    opacity: 0.7,
  },
  headerSubtitle: {
    color: "white",
    fontSize: 23,
    fontWeight: "bold",
  },
  todoContainer: {
    marginTop: 20,
    gap: 18,
    width: "100%",
  },
});

export default Tomorrow;
