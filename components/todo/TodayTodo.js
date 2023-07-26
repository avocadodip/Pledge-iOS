import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { getTodoStyles, styles } from "./TodoStyles";
import DescriptLinesIcon from "../../assets/icons/descript-lines-icon.svg";
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
  timeStatus,
}) => {
  const { theme } = useThemes();
  const styles = getTodoStyles(theme);
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
  if (timeStatus === 0) {
    return (
      <View style={[styles.infoContainer]}>
        {/* Left side */}
        <Animated.View style={[leftStyle]}>
          <TouchableRipple
            onPress={handleOpenBottomSheet}
            // style={animatedStyles.leftButtonContainer}
            style={[styles.leftContainer, styles.disabledOpacity]}
          >
            <View style={styles.tagTitleContainer}>
              {tag && (
                <View style={styles.tagContainer}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              )}
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title}</Text>
              </View>
            </View>
            {amount && (
              <View style={styles.amountContainer}>
                <Text style={styles.amountText}>${amount}</Text>
              </View>
            )}
          </TouchableRipple>
        </Animated.View>
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
      <View style={[styles.infoContainer]}>
        {/* Left side */}
        <Animated.View style={leftStyle}>
          <TouchableRipple
            onPress={handleOpenBottomSheet}
            style={[styles.leftContainer, { padding: 0 }]}
          >
            {shouldRenderTaskInfo && (
              <View style={[styles.leftContainerInner, {width: "100%", padding: 16 }]}>
                <View style={styles.tagTitleContainer}>
                  {tag && (
                    <View style={styles.tagContainer}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  )}
                  <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                  </View>
                </View>
                {amount && (
                  <View
                    style={[
                      styles.amountContainer,
                    ]}
                  >
                    <Text style={styles.amountText}>${amount}</Text>
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
              handleCheckTodo(todoNumber, isTodoComplete);
            }}
            style={animatedStyles.rightButtonContainer}
          >
            <CheckIcon />
          </TouchableRipple>
        </Animated.View>
      </View>
    );
  }

  // After day, show disabled check state OR disabled failed todo with info icon
  if (timeStatus === 2) {
    return (
      <View style={[styles.infoContainer]}>
        {isTodoComplete ? (
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
                onPress={handleOpenBottomSheet}
                style={[styles.leftContainer, styles.disabledOpacity]}
              >
                <View style={styles.tagTitleContainer}>
                  {tag && (
                    <View style={styles.tagContainer}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  )}
                  <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                  </View>
                </View>
                {amount && (
                  <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>${amount}</Text>
                  </View>
                )}
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
