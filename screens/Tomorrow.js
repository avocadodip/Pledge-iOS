import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import Todo from "../components/todo/Todo";
import { useBottomSheet } from "../hooks/BottomSheetContext";
import { useSettings } from "../hooks/SettingsContext";
import { useDayStatus } from "../hooks/DayStatusContext";
import { useTmrwTodos } from "../hooks/useTmrwTodos";
import TmrwTimePicker from "../components/todaytmrw/TmrwTimePicker";
import { useDayChange } from "../hooks/useDayChange";
import { useThemes } from "../hooks/ThemesContext";
import GettingStartedModal from "../components/onboard/GettingStartedModal";
import TodayTmrwMessage from "../components/todaytmrw/TodayTmrwMessage";
import { getTimezoneAbbrev } from "../utils/currentDate";
import { APP_HORIZONTAL_PADDING } from "../GlobalStyles";

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
    settings: { timezone, vacationModeOn, daysActive, isOnboarded },
  } = useSettings();
  const { dayChanged } = useDayChange();
  const { tmrwHeaderSubtitleMessage, timeStatus } = useDayStatus();

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

        {isOnboarded && !vacationModeOn && isTmrwActiveDay && (
          <View>
            <View style={styles.headerSubtitleContainer}>
              <Text style={styles.headerSubtitle}>
                {tmrwHeaderSubtitleMessage}
              </Text>
              <Text style={styles.timeZone}>{getTimezoneAbbrev(timezone)}</Text>
            </View>
            {
              // Show a different time picker message if day has ended and no tasks inputted
              // Instead of tasks will open from...to..., day will start at...to...
              timeStatus == 2 && isTodoArrayEmpty ? (
                <TmrwTimePicker altMessage={true} />
              ) : (
                <TmrwTimePicker altMessage={false} />
              )
            }
          </View>
        )}
      </View>

      <View style={styles.pageContent}>
        {!isOnboarded ? (
          <TodayTmrwMessage
            type={"new user"}
            setModalVisible={setModalVisible}
          />
        ) : vacationModeOn ? (
          <TodayTmrwMessage type={"vacation"} />
        ) : !isTmrwActiveDay ? (
          <TodayTmrwMessage
            type={"rest day (tmrw screen)"}
            nextActiveDay={nextActiveDay}
          />
        ) : (
          <View style={styles.todosContainer}>{renderTodos()}</View>
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
      marginHorizontal: APP_HORIZONTAL_PADDING,
    },
    headerContainer: {
      marginTop: 5,
      width: "100%",
      flexDirection: "col",
      height: 110,
    },
    headerTitleContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "baseline",
      gap: 10,
    },
    headerTitle: {
      color: theme.textHigh,
      fontSize: 40,
      fontWeight: "bold",
    },
    headerDayOfWeek: {
      color: theme.textLow,
      fontSize: 23,
      fontWeight: "bold",
    },
    headerSubtitle: {
      color: theme.textHigh,
      fontSize: 22,
      fontWeight: "bold",
      marginTop: 5,
    },
    pageContent: {
      height: "75%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    todosContainer: {
      gap: 14,
      width: "100%",
    },

    startButton: {},
    startButtonText: {
      color: theme.primary,
      fontWeight: 500,
      fontSize: 20,
    },
    headerSubtitleContainer: {
      display: "flex",
      flexDirection: "row",
      gap: 4,
    },
    timeZone: {
      color: theme.textHigh,
      fontWeight: "bold",
      paddingTop: 7,
    },
  });

export default Tomorrow;
