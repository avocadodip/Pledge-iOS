import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import Todo from "../components/todo/Todo";
import OnboardingPopup from "../components/OnboardingPopup";
import { useBottomSheet } from "../hooks/BottomSheetContext";
import { useSettings } from "../hooks/SettingsContext";
import { useDayStatus } from "../hooks/useDayStatus";
import { useTodayTodos } from "../hooks/useTodayTodos";
import VacationMessage from "../components/VacationMessage";
import RestDayMessage from "../components/RestDayMessage";
import Loading from "../components/Loading";

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
  const { loading, settings } = useSettings();
  const [dayStart, setDayStart] = useState("");
  const [dayEnd, setDayEnd] = useState("");
  const [vacationModeOn, setVacationModeOn] = useState(false);
  const [daysActive, setDaysActive] = useState([]);

  const { todayHeaderSubtitleMessage, timeStatus, dayChanged } = useDayStatus(
    dayStart,
    dayEnd
  );

  // Re-fetch and set todayTodos at 12am
  const { todayDOWAbbrev, isTodayActiveDay } = useTodayTodos(dayChanged);

  // Fetch settings
  useEffect(() => {
    if (!loading && settings) {
      setDayStart(settings.dayStart);
      setDayEnd(settings.dayEnd);
      setVacationModeOn(settings.vacationModeOn);
      setDaysActive(settings.daysActive);
    }
  }, [loading, settings]);

  // re-renders based on todayTodos (updates based on day) & isDay (change appearance of todo)
  const renderTodos = useCallback(() => {
    return todayTodos.map((todo, index) => {
      if (todo.title !== "") {
        return renderActiveTodo(todo, index);
      } else {
        return renderFinedTodo(index);
      }
    });
  }, [todayTodos, dayChanged]);

  // Loading indicator (replace with skeleton ui, also add in transitions)
  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      {/* <OnboardingPopup
        texts={['This is the Today page.', 'Your three tasks planned the night before will show up here.','Your only mission is to check them off before the day ends!']}
        buttonTitle="Cool, what's next?"
      /> */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Today</Text>
          <Text style={styles.headerDayOfWeek}>{todayDOWAbbrev}</Text>
        </View>

        {!vacationModeOn && isTodayActiveDay && (
          <Text style={styles.headerSubtitle}>
            {todayHeaderSubtitleMessage}
          </Text>
        )}
      </View>

      {vacationModeOn ? (
        <VacationMessage />
      ) : !isTodayActiveDay ? (
        <RestDayMessage />
      ) : (
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
