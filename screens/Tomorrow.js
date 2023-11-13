import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import { useSettings } from "../hooks/SettingsContext";
import { useDayStatus } from "../hooks/DayStatusContext";
import { useTmrwTodos } from "../hooks/TmrwTodosContext";
import { useDayChange } from "../hooks/useDayChange";
import { useThemes } from "../hooks/ThemesContext";
import GettingStartedModal from "../components/onboard/GettingStartedModal";
import TodayTmrwMessage from "../components/todaytmrw/TodayTmrwMessage";
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
    settings: { vacationModeOn, isOnboarded },
  } = useSettings();
  const { dayChanged } = useDayChange();
  const { timeStatus } = useDayStatus();

  const { tmrwDOWAbbrev, isTmrwActiveDay, isTodoArrayEmpty, loading } =
    useTmrwTodos();
  const [modalVisible, setModalVisible] = useState(false);

  const renderTodos = useCallback(() => {
    return tmrwTodos.map((todoData, index) => {
      if (todoData == null) {
        if (timeStatus == 0 || timeStatus == 1) {
          return <NumberTodo key={index} todoNumber={index + 1} />;
        } else if (timeStatus == 2) {
          return <FinedTodo key={index} />;
        }
      } else {
        return <TmrwTodo key={index} todoData={todoData} />;
      }
    });
  }, [tmrwTodos, dayChanged]);

  return (
    <SafeAreaView style={styles.pageContainer}>
      {isOnboarded && <DayStatusIndicator />}

      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Tmrw</Text>
          <Text style={styles.headerDayOfWeek}>{tmrwDOWAbbrev}</Text>
        </View>
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
          <TodayTmrwMessage type={"rest day (tmrw screen)"} />
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
      paddingTop: 10,
    },
    headerContainer: {
      marginTop: 7,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      height: 55,
    },
    headerTitleContainer: {
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
      gap: 15,
      width: "100%",
    },

    startButton: {},
    startButtonText: {
      color: theme.primary,
      fontWeight: 500,
      fontSize: 20,
    },
    timeZone: {
      color: theme.textHigh,
      fontWeight: "bold",
      paddingTop: 7,
    },
  });

export default Tomorrow;
