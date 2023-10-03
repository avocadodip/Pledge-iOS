import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import { useBottomSheet } from "../hooks/BottomSheetContext";
import { useSettings } from "../hooks/SettingsContext";
import { useDayStatus } from "../hooks/DayStatusContext";
import { useTmrwTodos } from "../hooks/TmrwTodosContext";
import TmrwTimePicker from "../components/todaytmrw/TmrwTimePicker";
import { useDayChange } from "../hooks/useDayChange";
import { useThemes } from "../hooks/ThemesContext";
import GettingStartedModal from "../components/onboard/GettingStartedModal";
import TodayTmrwMessage from "../components/todaytmrw/TodayTmrwMessage";
import { getTimezoneAbbrev } from "../utils/currentDate";
import { APP_HORIZONTAL_PADDING } from "../GlobalStyles";
import TmrwTodo from "../components/todo/TmrwTodo";
import FinedTodo from "../components/todo/FinedTodo";
import NumberTodo from "../components/todo/NumberTodo";
import DayStatusIndicator from "../components/todaytmrw/DayStatusIndicator";

const Tomorrow = () => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  const { tmrwTodos } = useTmrwTodos();
  const {
    settings: { timezone, vacationModeOn, isOnboarded },
  } = useSettings();
  const { dayChanged } = useDayChange();
  const { timeStatus } = useDayStatus();

  const { tmrwDOWAbbrev, isTmrwActiveDay, nextActiveDay, isTodoArrayEmpty } =
    useTmrwTodos();
  const [modalVisible, setModalVisible] = useState(false);

  const renderTodos = useCallback(() => {
    return tmrwTodos.map((todoData, index) => {
      if (todoData == null || todoData.title == "") {
        if (timeStatus == 0 || timeStatus == 1) {
          // before or during day
          return <NumberTodo key={index} todoNumber={index + 1} />;
        } else if (timeStatus == 2) {
          // after day
          return <FinedTodo key={index} />;
        }
      } else {
        return <TmrwTodo key={index} todoData={todoData} />;
      }
    });
  }, [tmrwTodos, dayChanged]);

  return (
    <SafeAreaView style={styles.pageContainer}>
      {isOnboarded && (
        <DayStatusIndicator />
      )}

      <View style={[styles.headerContainer]}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Tmrw</Text>
          <Text style={styles.headerDayOfWeek}>{tmrwDOWAbbrev}</Text>
        </View>

        {isOnboarded && !vacationModeOn && isTmrwActiveDay && (
          <View>
            {(timeStatus === 1 || timeStatus === 2) &&
              (timeStatus === 2 && isTodoArrayEmpty ? (
                <TmrwTimePicker altMessage={true} />
              ) : (
                <TmrwTimePicker altMessage={false} />
              ))}
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
      height: 75,
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
