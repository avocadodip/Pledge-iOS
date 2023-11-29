import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  FlatList,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import StepIndicator from "react-native-step-indicator";
import SetDeadline from "./SetDeadline";
import NextButton from "./NextButton";
import SetStartDay from "./SetStartDay";
import { useThemes } from "../../hooks/ThemesContext";
import TaskInput from "./TaskInput";
import { useSettings } from "../../hooks/SettingsContext";
import {
  updateTodoListOnboarding,
  updateUserIsOnboarded,
} from "../../utils/firebaseUtils";
import { getTmrwDate, getTodayDate } from "../../utils/currentDate";
import { doc, runTransaction, setDoc } from "firebase/firestore";
import { db } from "../../database/firebase";
// import { useTmrwTodos } from "../../hooks/TmrwTodosContext";
import { LinearGradient } from "expo-linear-gradient";

const steps = ["Set daily deadline", "Set start day", "Lock in 3 tasks"];
const FADE_OUT_OPACITY = -7;

const GettingStartedModal = ({ modalVisible, setModalVisible }) => {
  const { theme, backgroundGradient } = useThemes();
  const [modalHeight, setModalHeight] = useState(0);
  const styles = getStyles(theme, modalHeight);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastCompletedPage, setLastCompletedPage] = useState(0);
  const [timePickerText, setTimePickerText] = useState({
    start: "Pick time",
    end: "Pick time",
  });
  const { currentUserID } = useSettings();
  const [startDay, setStartDay] = useState("");
  const [todos, setTodos] = useState([
    {
      todoNumber: 1,
      title: "",
      amount: "",
      isComplete: false,
      isLocked: true,
      description: "",
      amount: 0,
    },
    {
      todoNumber: 2,
      title: "",
      amount: "",
      isComplete: false,
      isLocked: true,
      description: "",
      amount: 0,
    },
    {
      todoNumber: 3,
      title: "",
      amount: "",
      isComplete: false,
      isLocked: true,
      description: "",
      amount: 0,
    },
  ]);
  // const { getAndSetTodayTodos } = useTodayTodos();
  // const { getAndSetTmrwTodos } = useTmrwTodos();

  // Allow step indicator press
  useEffect(() => {
    if (
      timePickerText.start !== "Pick time" &&
      timePickerText.end !== "Pick time"
    ) {
      setLastCompletedPage(1);
    }
    if (startDay !== "") {
      setLastCompletedPage(2);
    }
  }, [timePickerText, startDay]);

  // Gets modal height
  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setModalHeight(height);
  };

  useEffect(() => {
    if (!modalVisible) {
      setCurrentPage(0);
      setIsScrolling(false);
    }
  }, [modalVisible]);

  const stepIndicatorStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,

    // border
    currentStepStrokeWidth: 3,
    stepStrokeWidth: 3,
    stepStrokeCurrentColor: "#e7e7e7",
    stepStrokeFinishedColor: "#e7e7e7",
    stepStrokeUnFinishedColor: theme.stepStrokeFinishedColor,

    // line
    separatorStrokeWidth: 2,
    separatorFinishedColor: "#e7e7e7",
    separatorUnFinishedColor: "#ffffff2a",

    // inside circle
    stepIndicatorFinishedColor: "#e7e7e7",
    stepIndicatorUnFinishedColor: theme.stepIndicatorUnFinishedColor,
    stepIndicatorCurrentColor: "#ffffff",

    stepIndicatorLabelFontSize: 0,
    currentStepIndicatorLabelFontSize: 10,
    stepIndicatorLabelCurrentColor: "transparent",
    stepIndicatorLabelFinishedColor: "transparent",
    stepIndicatorLabelUnFinishedColor: "transparent",

    labelAlign: "left",
  };

  // Render conditionally styled labels
  const renderLabel = ({ position, label, currentPosition }) => {
    return (
      <Text
        style={
          position === currentPosition
            ? styles.stepLabelSelected
            : styles.stepLabel
        }
      >
        {label}
      </Text>
    );
  };

  // Scroll from page to page animation
  const onPageChange = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollAnim } } }],
    {
      listener: (event) => {
        const page = Math.round(
          event.nativeEvent.contentOffset.y / modalHeight
        );
        if (page !== currentPage) {
          setCurrentPage(page);
        }
        setIsScrolling(true); // set isScrolling to true
      },
      useNativeDriver: false,
    }
  );

  // Step indicator press
  const onStepPress = (position) => {
    // Prevent navigation if the user has not completed the previous page
    if (position > lastCompletedPage) {
      return;
    }

    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: position * modalHeight,
        animated: true,
      });
    }
  };

  // Next button press
  const onNextPress = async () => {
    if (currentPage === 2) {
      // Get rid of AM/PM at end of string
      let dayStart = timePickerText.start.replace(/(AM|PM)/g, "").trim();
      let dayEnd = timePickerText.end.replace(/(AM|PM)/g, "").trim();

      let todayDate = getTodayDate();
      let tmrwDate = getTmrwDate();
      const todayRef = doc(db, "users", currentUserID, "todos", todayDate);
      const tmrwRef = doc(db, "users", currentUserID, "todos", tmrwDate);

      if (startDay === "Today") {
        const userRef = doc(db, "users", currentUserID);
        await setDoc(userRef, { todayDayEnd: dayEnd }, { merge: true });
      }

      const createTodoObject = (date, todos, isActive, onboardStartTmrw) => {
        return {
          date,
          dateName: `${
            [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ][parseInt(date.slice(4, 6), 10) - 1]
          } ${parseInt(date.slice(6, 8), 10)}`,
          todos,
          totalFine: 0,
          opensAt: dayStart,
          closesAt: dayEnd,
          isActive,
          isVacation: false,
          onboardStartTmrw: !!onboardStartTmrw,
        };
      };

      const createEmptyTodos = () => [null, null, null];

      const todayTodo =
        startDay === "Today"
          ? createTodoObject(todayDate, todos, true)
          : createTodoObject(todayDate, createEmptyTodos(), false, true);

      const tmrwTodo =
        startDay === "Today"
          ? createTodoObject(tmrwDate, createEmptyTodos(), true)
          : createTodoObject(tmrwDate, todos, true);

      await setDoc(todayRef, todayTodo);
      await setDoc(tmrwRef, tmrwTodo);

      updateUserIsOnboarded(currentUserID); // Update firebase isOnboarded field to true
      // getAndSetTodayTodos(); // re-fetch today todos to update Today
      // getAndSetTmrwTodos(); // re-fetch tmrw todos to update Tmrw
      setModalVisible(false); // Close modal
    }

    if (currentPage < steps.length - 1) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: currentPage + 1,
      });
    }
  };

  const renderViewPagerPage = ({ item, index }) => {
    // Animation - content opacity based on scroll location
    const opacity = isScrolling
      ? scrollAnim.interpolate({
          inputRange: [
            (index - 1) * modalHeight,
            index * modalHeight,
            (index + 1) * modalHeight,
          ],
          outputRange: [FADE_OUT_OPACITY, 1, FADE_OUT_OPACITY],
          extrapolate: "clamp",
        })
      : 1;

    // Render each page content
    let PageContent, nextButtonDisabled;
    if (index === 0) {
      PageContent = (
        <SetDeadline
          timePickerText={timePickerText}
          setTimePickerText={setTimePickerText}
        />
      );
      nextButtonDisabled =
        timePickerText.start === "Pick time" ||
        timePickerText.end === "Pick time";
    } else if (index === 1) {
      // Get user's device time and show today option if their time is before day end
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();

      const end = timePickerText.end.split(" ")[0];
      const endHour = parseInt(end.split(":")[0]) + 12; // adding 12 to convert to 24 hour format
      const endMinute = parseInt(end.split(":")[1]);

      // Check if current time is before end time
      const isTodayOption =
        currentHour < endHour ||
        (currentHour === endHour && currentMinutes <= endMinute);
      nextButtonDisabled = startDay === "";
      PageContent = (
        <SetStartDay
          isTodayOption={isTodayOption}
          timePickerText={timePickerText}
          startDay={startDay}
          setStartDay={setStartDay}
        />
      );
    } else {
      // Disable lock button if any fields unentered
      nextButtonDisabled = todos.some((todo) => !todo.title);
      // nextButtonDisabled = todos.some((todo) => !todo.title || !todo.amount);
      PageContent = (
        <TaskInput
          startDay={startDay}
          endTime={timePickerText.end}
          todos={todos}
          setTodos={setTodos}
        />
      );
    }

    return (
      <Animated.View style={[styles.pageContainer, { opacity }]}>
        <View style={styles.pageContent}>
          <View style={styles.contentContainer}>{PageContent}</View>
          <View style={styles.nextButtonContainer}>
            <NextButton
              action={onNextPress}
              text={"Next"}
              disabled={nextButtonDisabled}
              isFinalButton={index === 2}
            />
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      onDismiss={() => setModalVisible(false)}
      onRequestClose={() => setModalVisible(false)}
      presentationStyle={"pageSheet"}
    >
      <TouchableWithoutFeedback
        onPressOut={(e) => {
          if (e.nativeEvent.locationY > 150) {
            setModalVisible(false);
          }
        }}
      >
        <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
          <View style={styles.container} onLayout={onLayout}>
            <Text style={styles.gettingStartedText}>Set Up Your First Day</Text>
            <View style={styles.stepIndicator}>
              <StepIndicator
                stepCount={3}
                customStyles={stepIndicatorStyles}
                currentPosition={currentPage}
                onPress={onStepPress}
                renderLabel={renderLabel}
                labelAlign="left"
                labels={steps}
                direction="vertical"
              />
            </View>
            <FlatList
              ref={flatListRef}
              data={steps}
              renderItem={renderViewPagerPage}
              keyExtractor={(item, index) => "page_" + index}
              pagingEnabled
              vertical
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={onPageChange}
              getItemLayout={(data, index) => ({
                length: modalHeight,
                offset: modalHeight * index,
                index,
              })}
            />
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const getStyles = (theme, modalHeight) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.accent,
    },
    pageContainer: {
      height: modalHeight,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    pageContent: {
      position: "absolute",
      top: 170,
      flex: 1,
      height: "75%",
      width: "100%",
    },
    contentContainer: {
      flex: 8,
      width: "100%",
      justifyContent: "center",
    },
    nextButtonContainer: {
      flex: 2,
      justifyContent: "center",
      width: "100%",
      alignItems: "center",
    },
    gettingStartedText: {
      fontSize: 25,
      fontWeight: 500,
      color: "white",
      width: 120,
      marginLeft: 20,
      position: "absolute",
      top: 30,

      // borderWidth: 1,
      // borderColor: "black",
    },
    stepIndicator: {
      zIndex: 1,
      position: "absolute",
      top: 20,
      right: 0,
      height: "18%",
      width: "60%",
      flexDirection: "row",
      gap: 20,
    },
    stepLabel: {
      fontSize: 17,
      fontWeight: 500,
      color: "#ffffffbd",
      paddingLeft: 10,
    },
    stepLabelSelected: {
      fontSize: 17,
      fontWeight: 500,
      color: "#ffffff",
      paddingLeft: 10,
    },
  });

export default GettingStartedModal;
