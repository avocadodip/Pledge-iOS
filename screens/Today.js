import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import { useBottomSheet } from "../hooks/BottomSheetContext";
import Loading from "../components/Loading";
import { useSettings } from "../hooks/SettingsContext";
import { useDayChange } from "../hooks/useDayChange";
import { useThemes } from "../hooks/ThemesContext";
import { Modal } from "react-native";
import GettingStartedModal from "../components/onboard/GettingStartedModal";
import TodayTmrwMessage from "../components/todaytmrw/TodayTmrwMessage";
import { APP_HORIZONTAL_PADDING } from "../GlobalStyles";
import TodayTodo from "../components/todo/TodayTodo";
import FinedTodo from "../components/todo/FinedTodo";
import DayStatusIndicator from "../components/todaytmrw/DayStatusIndicator";
import { AnimatedComponent } from "./FinishSignup";
import Animated, { FadeIn, FadeOutUp } from "react-native-reanimated";

const Today = () => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  const {
    timeStatus,
    settings: {
      isOnboarded,
      todayTodos,
      todayIsActive,
      todayIsVacation,
      todayNoInputFine,
      onboardStartTmrw,
    },
  } = useSettings();
  const { todayDOWAbbrev, todayDate, todayDateNameAbbrev } = useDayChange();
  const [modalVisible, setModalVisible] = useState(false);
  const [renderedTodos, setRenderedTodos] = useState([]);

  // re-renders based on todayTodos (updates based on day) & isDay (change appearance of todo)
  useEffect(() => {
    const updatedTodos = todayTodos.map((todo, i) => {
      if (todo.isLocked === false) {
        return <FinedTodo key={i} isFined={todayNoInputFine > 0} />;
      } else {
        return <TodayTodo key={i} todoData={todo} />;
      }
    });

    setRenderedTodos(updatedTodos);
  }, [todayTodos, timeStatus]);

  return (
    <SafeAreaView style={styles.pageContainer}>
      {isOnboarded && <DayStatusIndicator />}

      <Animated.View
        entering={FadeIn.duration(400).delay(300)}
        style={styles.headerContainer}
      >
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Today</Text>
          <Text style={styles.headerDayOfWeek}>{todayDOWAbbrev}, {todayDateNameAbbrev}</Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(400).delay(300)}
        style={styles.pageContent}
      >
        {!isOnboarded ? (
          <TodayTmrwMessage
            type={"new user"}
            setModalVisible={setModalVisible}
          />
        ) : // Lets Today page know to show "all set" message if user elects to start Tmrw in onboarding
        onboardStartTmrw ? (
          <TodayTmrwMessage type={"all set"} />
        ) : todayIsVacation ? (
          <TodayTmrwMessage type={"vacation"} />
        ) : !todayIsActive ? (
          <TodayTmrwMessage type={"rest day (today screen)"} />
        ) : (
          <View style={styles.todosContainer}>{renderedTodos}</View>
        )}
      </Animated.View>

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
    timeZone: {
      color: theme.textHigh,
      fontWeight: "bold",
      paddingTop: 7,
    },
  });

export default Today;
