import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import { useSettings } from "../hooks/SettingsContext";
import { useDayChange } from "../hooks/useDayChange";
import { useThemes } from "../hooks/ThemesContext";
import GettingStartedModal from "../components/onboard/GettingStartedModal";
import TodayTmrwMessage from "../components/todaytmrw/TodayTmrwMessage";
import { APP_HORIZONTAL_PADDING } from "../GlobalStyles";
import TmrwTodo from "../components/todo/TmrwTodo";
import FinedTodo from "../components/todo/FinedTodo";
import NumberTodo from "../components/todo/NumberTodo";
import DayStatusIndicator from "../components/todaytmrw/DayStatusIndicator";
import Animated, { FadeIn } from "react-native-reanimated";

const Tomorrow = () => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  const {
    settings: {
      tmrwIsVacation,
      isOnboarded,
      tmrwTodos,
      tmrwIsActive,
      missedTaskFine,
    },
    timeStatus,
  } = useSettings();
  const { dayChanged, tmrwDOWAbbrev, tmrwDateNameAbbrev } = useDayChange();
  const [modalVisible, setModalVisible] = useState(false);

  const renderTodos = useCallback(() => {
    return tmrwTodos.map((itemData, index) => {
      if (itemData.title === "") {
        if (timeStatus == 0 || timeStatus == 1) {
          return <NumberTodo key={index} todoNumber={index + 1} />;
        } else if (timeStatus === 2 && !itemData.isLocked) {
          return <FinedTodo key={index} isFined={missedTaskFine > 0} />;
        }
      } else {
        return <TmrwTodo key={index} todoData={itemData} />;
      }
    });
  }, [tmrwTodos, dayChanged]);

  return (
    <>
      <Animated.View
        style={styles.pageContainer}
        entering={FadeIn.duration(400)}
      >
        <View style={{ width: "100%" }}>
          {isOnboarded && !tmrwIsVacation && <DayStatusIndicator />}
        </View>

        <View style={styles.headerContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Tmrw</Text>
              <Text style={styles.headerDayOfWeek}>
                {tmrwDOWAbbrev}, {tmrwDateNameAbbrev}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.pageContent}>
          {!isOnboarded ? (
            <TodayTmrwMessage
              type={"new user"}
              setModalVisible={setModalVisible}
            />
          ) : tmrwIsVacation ? (
            <TodayTmrwMessage type={"vacation"} />
          ) : !tmrwIsActive ? (
            <TodayTmrwMessage type={"rest day (tmrw screen)"} />
          ) : (
            <View style={styles.todosContainer}>{renderTodos()}</View>
          )}
        </View>
      </Animated.View>

      <GettingStartedModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </>
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
      marginTop: 2,
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
      fontWeight: "500",
      fontSize: 20,
    },
    timeZone: {
      color: theme.textHigh,
      fontWeight: "bold",
      paddingTop: 7,
    },
  });

export default Tomorrow;
