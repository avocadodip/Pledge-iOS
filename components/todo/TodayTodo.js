import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { getTodoStyles, variableFontSize } from "./TodoStyles";
import CheckIcon from "../../assets/icons/check-icon.svg";
import InfoIcon from "../../assets/icons/info-icon.svg";
import MoonIcon from "../../assets/icons/moon-icon.svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import TouchableRipple from "../TouchableRipple";
import { Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";
import { useDayStatus } from "../../hooks/DayStatusContext";
import { useBottomSheet } from "../../hooks/BottomSheetContext";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../database/firebase";
import { useSettings } from "../../hooks/SettingsContext";
import { getTodayDate } from "../../utils/currentDate";
import { useTodayTodos } from "../../hooks/TodayTodosContext";
import { useDayChange } from "../../hooks/useDayChange";

// Animation constants
const OPEN_DURATION = 100;
const CLOSE_DURATION = 150;

const TodayTodo = ({ todoData }) => {
  const { todoNumber, title, description, amount, tag, isComplete } = todoData;
  const { setTodayTodos } = useTodayTodos();
  const { timeStatus } = useDayStatus();
  const { todayDate } = useDayChange();
  const { openBottomSheet } = useBottomSheet();
  const { currentUserID, dreamsArray } = useSettings();

  const stringAmount =
    amount !== null && amount !== undefined ? amount.toString() : "";
  const findDreamTitleById = (id, dreams) => {
    const dream = dreams.find((d) => d.id === id);
    return dream ? dream.title : null;
  };

  const dreamTitle = findDreamTitleById(tag, dreamsArray);

  const { theme } = useThemes();
  const styles = getTodoStyles(theme);
  const leftFlex = useSharedValue(8);
  const rightFlex = useSharedValue(2);

  // ------------- HANDLE CHECK -------------
  const handleCheckTodo = async (todoNumber, currentBoolean) => {
    const todoRef = doc(db, "users", currentUserID, "todos", getTodayDate());
    const docSnap = await getDoc(todoRef);

    // Update local array
    setTodayTodos((prevTodos) => {
      const updatedTodos = [...prevTodos];
      const todoToUpdate = updatedTodos[todoNumber - 1];
      if (todoToUpdate) {
        todoToUpdate.isComplete = !currentBoolean;
      }
      return updatedTodos;
    });

    // Update database
    if (docSnap.exists()) {
      let data = docSnap.data();
      let todos = data.todos;
      todos[todoNumber - 1].isComplete = !currentBoolean;
      await updateDoc(todoRef, { todos: todos });

      // Update dream
      if (todos[todoNumber - 1].tag !== "") {
        const dreamRef = doc(
          db,
          "users",
          currentUserID,
          "dreams",
          todos[todoNumber - 1].tag
        );

        if (!currentBoolean) {
          // If the todo is being checked, add today's date to the front of the completionHistory array
          await updateDoc(dreamRef, {
            completionHistory: arrayUnion(todayDate),
            doneCount: increment(1),
            lastCompleted: todayDate,
          });
        } else {
          let newLastCompleted = null;
          // Check if there are at least two dates in the completionHistory array
          if (dreamsArray[0].completionHistory.length > 1) {
            // If there are at least two dates, set newLastCompleted to the second-to-last date
            // This is done by accessing the element at the index length - 2
            newLastCompleted =
              dreamsArray[0].completionHistory[
                dreamsArray[0].completionHistory.length - 2
              ];
          }
          // If there are not at least two dates, newLastCompleted remains null
          
          await updateDoc(dreamRef, {
            completionHistory: arrayRemove(todayDate),
            doneCount: increment(-1),
            lastCompleted: newLastCompleted,
          });
        }
      }
    } else {
      console.log("No such document!");
    }
  };

  // ------------- ANIMATIONS -------------
  const [shouldRenderTaskInfo, setShouldRenderTaskInfo] = useState(!isComplete);

  // Render animation whenever isComplete changes
  useEffect(() => {
    if (isComplete) {
      // Hide task info and set flex values
      setShouldRenderTaskInfo(false);
      leftFlex.value = 0;
      rightFlex.value = 10;
    } else {
      // Initially hide task info then set to true to avoid premature flashing
      setShouldRenderTaskInfo(false);
      leftFlex.value = 8;
      rightFlex.value = 2;
      const timeoutId = setTimeout(() => {
        setShouldRenderTaskInfo(true);
      }, OPEN_DURATION - 50); // Slightly shorter than duration so it looks smoother

      return () => clearTimeout(timeoutId);
    }
  }, [isComplete]);

  const leftStyle = useAnimatedStyle(() => ({
    flex: withTiming(leftFlex.value, { duration: CLOSE_DURATION }),
  }));
  const rightStyle = useAnimatedStyle(() => ({
    flex: withTiming(rightFlex.value, { duration: OPEN_DURATION }),
  }));

  // ------------- JSX -------------

  // Before day, show disabled today todos with moon icon
  if (timeStatus === 0) {
    return (
      <View style={[styles.infoContainer]}>
        {/* Left side */}
        <View style={[{ flex: 8 }]}>
          <TouchableRipple
            onPress={() => {
              openBottomSheet(todoData, "today");
            }}
            style={[styles.leftContainer, styles.disabledOpacity]}
          >
            <View
              style={[
                styles.leftContainerInner,
                { width: "100%", padding: 16 },
              ]}
            >
              {dreamTitle && (
                <View style={styles.tagContainer}>
                  <Text style={styles.tagText}>{dreamTitle}</Text>
                </View>
              )}
              <View style={styles.titleContainer}>
                <Text
                  style={[
                    styles.titleText,
                    { fontSize: variableFontSize(title) },
                  ]}
                >
                  {title}{" "}
                  {description !== "" && (
                    <Text
                      style={[
                        styles.moreText,
                        { fontSize: variableFontSize(title, true) },
                      ]}
                    >
                      {" "}
                      more...
                    </Text>
                  )}
                </Text>
              </View>
              {stringAmount && (
                <View style={styles.amountContainer}>
                  <Text style={styles.amountText}>
                    {"$" + stringAmount.toString()}
                  </Text>
                </View>
              )}
            </View>
          </TouchableRipple>
        </View>
        {/* Right side */}
        <View style={styles.rightDisabledContainer}>
          <View style={styles.disabledOpacity}>
            <MoonIcon width={35} height={35} color={Color.white} />
          </View>
        </View>
      </View>
    );
  }

  // During day, show the following:
  if (timeStatus === 1) {
    return (
      <View style={styles.infoContainer}>
        {/* Left side */}
        <Animated.View style={leftStyle}>
          <TouchableRipple
            onPress={() => {
              openBottomSheet(todoData, "today");
            }}
            style={[styles.leftContainer, { padding: 0 }]}
          >
            {shouldRenderTaskInfo && (
              <View
                style={[
                  styles.leftContainerInner,
                  { width: "100%", padding: 16 },
                ]}
              >
                {tag && (
                  <View style={styles.tagContainer}>
                    <Text style={styles.tagText}>{dreamTitle}</Text>
                  </View>
                )}
                <View style={styles.titleContainer}>
                  <Text
                    style={[
                      styles.titleText,
                      { fontSize: variableFontSize(title) },
                    ]}
                  >
                    {title}{" "}
                    {description !== "" && (
                      <Text
                        style={[
                          styles.moreText,
                          { fontSize: variableFontSize(title, true) },
                        ]}
                      >
                        {" "}
                        more...
                      </Text>
                    )}
                  </Text>
                </View>
                {stringAmount && (
                  <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>
                      {"$" + stringAmount.toString()}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </TouchableRipple>
        </Animated.View>
        {/* Right side */}
        <Animated.View style={rightStyle}>
          <TouchableRipple
            onPress={() => {
              handleCheckTodo(todoNumber, isComplete);
            }}
            style={styles.rightButtonContainer}
          >
            <CheckIcon color={theme.primary} />
          </TouchableRipple>
        </Animated.View>
      </View>
    );
  }

  // After day, show disabled check state OR disabled failed todo with info icon
  if (timeStatus === 2) {
    return (
      <View style={[styles.infoContainer]}>
        {isComplete ? (
          <View
            style={[styles.disabledCompleteContainer, styles.disabledOpacity]}
          >
            <CheckIcon width={35} height={35} color={Color.white} />
          </View>
        ) : (
          <>
            {/* Left side */}
            <Animated.View style={leftStyle}>
              <TouchableRipple
                onPress={() => {
                  openBottomSheet(todoData, "today");
                }}
                style={[styles.leftContainer, styles.disabledOpacity]}
              >
                <View
                  style={[
                    styles.leftContainerInner,
                    { width: "100%", padding: 16 },
                  ]}
                >
                  {dreamTitle && (
                    <View style={styles.tagContainer}>
                      <Text style={styles.tagText}>{dreamTitle}</Text>
                    </View>
                  )}
                  <View style={styles.titleContainer}>
                    <Text
                      style={[
                        styles.titleText,
                        { fontSize: variableFontSize(title) },
                      ]}
                    >
                      {title}{" "}
                      {description !== "" && (
                        <Text
                          style={[
                            styles.moreText,
                            { fontSize: variableFontSize(title, true) },
                          ]}
                        >
                          {" "}
                          more...
                        </Text>
                      )}
                    </Text>
                  </View>
                  {stringAmount && (
                    <View style={styles.amountContainer}>
                      <Text style={styles.amountText}>
                        {"$" + stringAmount.toString()}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableRipple>
            </Animated.View>
            {/* Right side */}
            <View style={styles.rightDisabledContainer}>
              <InfoIcon width={35} height={35} color={Color.white} />
            </View>
          </>
        )}
      </View>
    );
  }
};

export default TodayTodo;

const animatedStyles = StyleSheet.create({
  leftButtonContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    height: "100%",
  },
  rightButtonContainer: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
