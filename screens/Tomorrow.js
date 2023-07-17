import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
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
import { useThemes } from "../hooks/ThemesContext";
import GettingStartedModal from "../components/onboard/GettingStartedModal";
 
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
  const { theme } = useThemes();
  const styles = getStyles(theme);
  const { tmrwTodos } = useBottomSheet();
  const {
    settings: { vacationModeOn, daysActive, isOnboarded },
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
  const [modalVisible, setModalVisible] = useState(false);

  const renderTodos = useCallback(() => {
    return tmrwTodos.map((todo, index) => {
      return renderTodo(todo, index, timeStatus);
    });
  }, [tmrwTodos, dayChanged, timeStatus]);

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Tmrw</Text>
          <Text style={styles.headerDayOfWeek}>{tmrwDOWAbbrev}</Text>
        </View>

        {!isOnboarded && !vacationModeOn && isTmrwActiveDay && (
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

      <View style={styles.pageContent}>
        {isOnboarded ? (
          <View style={styles.startButtonContainer}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.startButtonText}>
                Start your first day of tasks
              </Text>
            </TouchableOpacity>
          </View>
        ) : vacationModeOn ? (
          <VacationMessage />
        ) : !isTmrwActiveDay ? (
          <RestDayMessage />
        ) : (
          <View style={styles.todoContainer}>{renderTodos()}</View>
        )}
      </View>

      <GettingStartedModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
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
      color: theme.textHigh,
      fontSize: 42,
      fontWeight: "bold",
    },
    headerDayOfWeek: {
      color: theme.textMedium,
      fontSize: 23,
      fontWeight: "bold",
      paddingBottom: 6,
    },
    headerSubtitle: {
      color: theme.textHigh,
      fontSize: 23,
      fontWeight: "bold",
    },
    pageContent: {
      height: "82%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    todoContainer: {
      marginTop: 20,
      gap: 18,
      width: "100%",
    },

    startButton: {},
    startButtonText: {
      color: "white",
      fontWeight: 500,
      fontSize: 20,
    },
  });

export default Tomorrow;
