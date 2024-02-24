import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { BORDER_RADIUS } from "./TodoStyles";
import { useThemes } from "../../hooks/ThemesContext";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import TouchableRipple from "../TouchableRipple";
import CheckIcon from "../../assets/icons/check-icon.svg";
import LockIcon from "../../assets/icons/lock-icon.svg";
import UnlockIcon from "../../assets/icons/unlock-icon.svg";

const OPEN_DURATION = 100;

const OnboardTodo = ({ type, bool, setBool, title, dream, amount, sleepMode }) => {
  const { theme, backgroundGradient } = useThemes();
  const containerWidth = Dimensions.get("window").width * 0.8;
  const styles = getStyles(theme, containerWidth);
  const opacityValue = useSharedValue(1); // Initial opacity

  const rightWidth = useSharedValue(containerWidth * 0.2);

  const handleCheck = () => {
    setBool(!bool);

    if (bool) {
      rightWidth.value = containerWidth * 0.2;
      opacityValue.value = 1; // Set opacity back to fully visible
    } else {
      rightWidth.value = containerWidth;
      opacityValue.value = 0; // Fade out when full width is reached
    }
  };

  const handleLock = () => {
    setBool(true);
  };

  const rightStyle = useAnimatedStyle(() => ({
    width: withTiming(rightWidth.value, { duration: OPEN_DURATION }),
  }));

  const leftStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacityValue.value, { duration: OPEN_DURATION }),
  }));

  return (
    <TouchableRipple
      onPress={type === "today" ? handleCheck : handleLock}
      style={[
        styles.container,
        sleepMode && { opacity: 0.6 },
      ]}
      disabled={type === "tmrw" && bool}
    >
      <Animated.View style={[styles.leftContainer, leftStyle]}>
        <View style={styles.dream}>
          <Text style={styles.dreamText}>{dream}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>

        <Animated.View entering={type === "sample" && FadeInDown.duration(1100).delay(4000)} style={styles.amount}>
          <Text style={styles.amountText}>{amount}</Text>
        </Animated.View>
      </Animated.View>

      {/* Right side */}

      {type === "today" && (
        <Animated.View style={[styles.rightContainer, rightStyle]}>
          <CheckIcon color={theme.primary} />
        </Animated.View>
      )}
      {type === "tmrw" && (
        <View
          style={[
            styles.rightContainer,
            {
              width: containerWidth * 0.2,
              backgroundColor: bool ? "transparent" : theme.faintishPrimary,
            },
          ]}
        >
          {bool ? (
            <LockIcon color={theme.primary} width={30} height={30} />
          ) : (
            <UnlockIcon color={theme.primary} width={30} height={30} />
          )}
        </View>
      )}
    </TouchableRipple>
  );
};

export default OnboardTodo;

const getStyles = (theme, containerWidth) =>
  StyleSheet.create({
    container: {
      width: containerWidth, // Set the width to the calculated containerWidth
      height: 130,
      backgroundColor: theme.faintishPrimary,
      borderRadius: BORDER_RADIUS,
      overflow: "hidden",
      marginVertical: 7,
    },
    leftContainer: {
      paddingLeft: 15,
      justifyContent: "space-between",
      height: "100%",
      paddingVertical: 15,
      // borderWidth: 1,
      // borderColor: "white",
    },
    rightContainer: {
      position: "absolute",
      top: 0,
      right: 0,
      height: "100%",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.faintishPrimary,
    },
    title: {
      color: "white",
      fontSize: 18,
      fontWeight: "600",
    },

    dream: {
      alignSelf: "flex-start",
      backgroundColor: theme.faintishPrimary,
      paddingHorizontal: 7,
      paddingVertical: 4,
      borderRadius: 7,
    },
    dreamText: {
      color: "white",
      fontSize: 13,
      fontWeight: "500",
    },
    amount: {
      alignSelf: "flex-start",
      backgroundColor: theme.faintishPrimary,
      paddingHorizontal: 7,
      paddingVertical: 4,
      borderRadius: 7,
    },
    amountText: {
      color: "white",
      fontSize: 17,
      fontWeight: "600",
    },
  });
