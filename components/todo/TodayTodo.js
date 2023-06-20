import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { styles } from "./TodoStyles";
import DescriptLinesIcon from "../../assets/icons/descript-lines-icon.svg";
import CheckIcon from "../../assets/icons/check-icon.svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import TouchableRipple from "../TouchableRipple";
 
// Animation constants
const OPEN_DURATION = 100; 
const CLOSE_DURATION = 150;

const TodayTodo = ({
  todoNumber,
  title,
  description,
  amount,
  tag,
  isTodoComplete,
  handleOpenBottomSheet,
  handleCheckTodo,
  timeStatus
}) => {
  const leftFlex = useSharedValue(8);
  const rightFlex = useSharedValue(2);

  // State to show or hide task info
  const [shouldRenderTaskInfo, setShouldRenderTaskInfo] = useState(
    !isTodoComplete
  );

  useEffect(() => {
    if (isTodoComplete) {
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
  }, [isTodoComplete]); // Render animation everytime isTodoComplete is changed

  // Declare animated styles that depend on the flex values
  const leftStyle = useAnimatedStyle(() => ({
    flex: withTiming(leftFlex.value, { duration: CLOSE_DURATION }),
  }));
  const rightStyle = useAnimatedStyle(() => ({
    flex: withTiming(rightFlex.value, { duration: OPEN_DURATION }),
  }));

  // Before day, show disabled today todos with moon icon

  // After day, show disabled check state OR disabled failed todo with info icon

  // During day, show the following:
  return (
    <View style={[styles.infoContainer]}>
      {/* Left side */}
      <Animated.View style={leftStyle}>
        <TouchableRipple
          onPress={handleOpenBottomSheet}
          style={[animatedStyles.leftButtonContainer]}
        >
          {shouldRenderTaskInfo && (
            <>
              <View style={[styles.upperHalfContainer, { margin: 15 }]}>
                <View style={styles.numberTitleContainer}>
                  <Text style={styles.todoNumber}>{todoNumber}</Text>
                  <Text style={styles.todoTitle}>{title}</Text>
                </View>
              </View>
              <View style={[styles.lowerHalfContainer, { margin: 15 }]}>
                <View style={styles.tagDescriptionContainer}>
                  {tag && (
                    <View style={styles.tagContainer}>
                      <View style={styles.tagBackground}>
                        <Text style={styles.todoTag}>{tag}</Text>
                      </View>
                    </View>
                  )}
                  {description && (
                    <View style={styles.descriptionContainer}>
                      <DescriptLinesIcon />
                      <Text
                        style={styles.todoDescription}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {description}
                      </Text>
                    </View>
                  )}
                </View>
                {amount && (
                  <View style={styles.amountContainer}>
                    <Text style={styles.todoAmount}>${amount}</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </TouchableRipple>
      </Animated.View>
      {/* Right side */}
      <Animated.View style={rightStyle}>
        <TouchableRipple
          onPress={() => {
            handleCheckTodo(todoNumber, isTodoComplete); 
          }}
          style={animatedStyles.rightButtonContainer}
        >
          <CheckIcon />
        </TouchableRipple>
      </Animated.View>
    </View>
  );
};
export default TodayTodo;

const animatedStyles = StyleSheet.create({
  leftButtonContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    height: "100%",
  },
  rightButtonContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
