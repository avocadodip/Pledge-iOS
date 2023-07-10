import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import Todo from "../components/todo/Todo";
import OnboardingPopup from "../components/OnboardingPopup";
import { useBottomSheet } from "../hooks/BottomSheetContext";
import { useDayStatus } from "../hooks/useDayStatus";
import { useTodayTodos } from "../hooks/useTodayTodos";
import VacationMessage from "../components/VacationMessage";
import RestDayMessage from "../components/RestDayMessage";
import Loading from "../components/Loading";
import { useSettings } from "../hooks/SettingsContext";
import { useDayChange } from "../hooks/useDayChange";
import { useThemes } from "../hooks/ThemesContext";
import { Modal } from "react-native";
import GettingStartedModal from "../components/onboard/GettingStartedModal";

const renderTodo = (
  { title, description, amount, tag, isComplete },
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
    componentType="today"
    isLocked={null} // null allows check
    isComplete={isComplete}
    timeStatus={timeStatus}
  />
);

const Today = () => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  const { todayTodos } = useBottomSheet();
  const { dayChanged } = useDayChange();
  const {
    todayDOWAbbrev,
    dayStart,
    dayEnd,
    isTodayActiveDay,
    isTodayVacation,
    isTodoArrayEmpty,
  } = useTodayTodos(dayChanged);
  const { todayHeaderSubtitleMessage, timeStatus } = useDayStatus(
    dayStart,
    dayEnd
  );
  const [modalVisible, setModalVisible] = useState(true);

  // re-renders based on todayTodos (updates based on day) & isDay (change appearance of todo)
  const renderTodos = useCallback(() => {
    return todayTodos.map((todo, index) => {
      return renderTodo(todo, index, timeStatus);
    });
  }, [todayTodos, timeStatus]);

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

        {!isTodayVacation && isTodayActiveDay && !isTodoArrayEmpty && (
          <Text style={styles.headerSubtitle}>
            {todayHeaderSubtitleMessage}
          </Text>
        )}
      </View>

      {isTodayVacation ? (
        <VacationMessage />
      ) : !isTodayActiveDay ? (
        <RestDayMessage />
      ) : (
        <View style={styles.todoContainer}>{renderTodos()}</View>
      )}

      <GettingStartedModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>
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
