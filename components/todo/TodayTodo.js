import { Dimensions, StyleSheet, Text, View } from "react-native";
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
import { APP_HORIZONTAL_PADDING, Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";
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
import { useDayChange } from "../../hooks/useDayChange";

// Animation constants
const OPEN_DURATION = 100;
const CLOSE_DURATION = 150;

const TodayTodo = ({ todoData }) => {
  const { todoNumber, title, description, amount, tag, isComplete } = todoData;
  const { todayDate } = useDayChange();
  const { openBottomSheet } = useBottomSheet();
  const { currentUserID, dreamsArray, timeStatus } = useSettings();

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
  const handleCheckTodo = async () => {
    const todoRef = doc(db, "users", currentUserID);
    const docSnap = await getDoc(todoRef);

    // Update database
    if (docSnap.exists()) {
      let data = docSnap.data();
      let todayTodos = data.todayTodos; // Access the 'todayTodos' field
      todayTodos[todoNumber - 1].isComplete = !isComplete; // Update the specific todo item
      await updateDoc(todoRef, { todayTodos: todayTodos });

      // Update dream
      if (todayTodos[todoNumber - 1].tag !== "") {
        const dreamRef = doc(
          db,
          "users",
          currentUserID,
          "dreams",
          todayTodos[todoNumber - 1].tag
        );

        if (!isComplete) {
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
  const containerWidth =
    Dimensions.get("window").width - 2 * APP_HORIZONTAL_PADDING;

  const OPEN_DURATION = 100;

  const rightWidth = useSharedValue("100%");

  const opacityValue = useSharedValue(1); // Initial opacity

  useEffect(() => {
    if (isComplete) {
      rightWidth.value = "100%";
      opacityValue.value = 0; // Fade out when full width is reached
    } else {
      rightWidth.value = "20%";
      opacityValue.value = 1; // Set opacity back to fully visible
    }
  }, [isComplete]);

  const rightStyle = useAnimatedStyle(() => ({
    width: withTiming(rightWidth.value, { duration: OPEN_DURATION }),
  }));

  const leftStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacityValue.value, { duration: OPEN_DURATION }),
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
              openBottomSheet("today", todoNumber);
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
      <View
        style={styles.infoContainer}
      >
        {/* Left side */}
        {/* <Animated.View style={[leftStyle, styles.leftContainer]}>
          <TouchableRipple
            onPress={() => {
              openBottomSheet("today", todoNumber);
            }}
            style={{ padding: 0 }}
          >
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
          </TouchableRipple>
        </Animated.View> */}
        {/* Right side */}
        <Animated.View
          style={[
            rightStyle,
            {
              position: "absolute",
              top: 0,
              right: 0,
              height: "100%",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.faintishPrimary,

              borderWidth: 1,
               borderColor: "white",
            },
          ]}
        >
          <TouchableRipple
            onPress={handleCheckTodo}
            // style={styles.rightButtonContainer}
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
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
                  openBottomSheet("today", todoNumber);
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
            <View
              style={[styles.disabledCompleteContainer, styles.disabledOpacity]}
            >
              <CheckIcon width={35} height={35} color={Color.white} />
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
