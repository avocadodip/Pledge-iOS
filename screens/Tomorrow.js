import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback } from "react";
import Todo from "../components/todo/Todo";
import { useBottomSheet } from "../hooks/BottomSheetContext";
import { useSettings } from "../hooks/SettingsContext";
import OnboardingPopup from "../components/OnboardingPopup";
import { useDayStatus } from "../hooks/useDayStatus";
import { useTmrwTodos } from "../hooks/useTmrwTodos";
import VacationMessage from "../components/VacationMessage";
import RestDayMessage from "../components/RestDayMessage";
import TmrwTimePicker from "../components/TmrwTimePicker";
import { useTodayTodos } from "../hooks/useTodayTodos";
import { useDayChange } from "../hooks/useDayChange";

const renderTodo = (
  { title, description, amount, tag, isLocked },
  index,
  timeStatus
) => (
  <Todo
    key={index + 1}
    todoNumber={index + 1}
    title={title}
    description={description}
    amount={amount.toString()}
    tag={tag}
    componentType="tmrw"
    isLocked={isLocked}
    timeStatus={timeStatus}
  />
);

const Tomorrow = () => {
  const { tmrwTodos } = useBottomSheet();
  const {
    settings: { vacationModeOn, daysActive },
    currentUserID,
  } = useSettings();
  const { dayChanged } = useDayChange();
  const { dayStart, dayEnd } = useTodayTodos(dayChanged);
  const { tmrwHeaderSubtitleMessage, timeStatus } = useDayStatus(
    dayStart,
    dayEnd
  );
  const { tmrwDOWAbbrev, isTmrwActiveDay, nextActiveDay, isTodoArrayEmpty } =
    useTmrwTodos(dayChanged, daysActive);

  const renderTodos = useCallback(() => {
    // Map through three todos and render them based on their content
    return tmrwTodos.map((todo, index) => {
      return renderTodo(todo, index, timeStatus);
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
            {
              // Show a different time picker message if day has ended and no tasks inputted
              // Instead of tasks will open from...to..., day will start at...to...
              timeStatus == 2 && isTodoArrayEmpty ? (
                <TmrwTimePicker
                  currentUserID={currentUserID}
                  dayStart={dayStart}
                  dayEnd={dayEnd}
                  altMessage={true}
                />
              ) : (
                <TmrwTimePicker
                  currentUserID={currentUserID}
                  dayStart={dayStart}
                  dayEnd={dayEnd}
                  altMessage={false}
                />
              )
            }
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
    fontSize: 42,
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
