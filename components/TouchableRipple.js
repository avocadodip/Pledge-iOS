import PropTypes from "prop-types";
import React, { PureComponent, useContext, useEffect, useState } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import Ripple from "react-native-material-ripple";
import { Color } from "../GlobalStyles";
import { useThemes } from "../hooks/ThemesContext";
import { useDayStatus } from "../hooks/DayStatusContext";
import { getClassicColor } from "../themes";

const rippleStyles = StyleSheet.create({
  container: {
    borderRadius: 2,
    justifyContent: "space-around",
  },

  shadeContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },

  shade: {
    flex: 1,
  },
});

const getStyles = (theme, currentClassicColor) => {
  let shadeColor, rippleColor;
  if (theme === "classic") {
    switch (currentClassicColor) {
      case "purple":
        shadeColor = "#4e9a47";
        rippleColor = "#4e9a47";
        break;
      case "red":
        shadeColor = "#8A1919"; // Replace with the actual value
        rippleColor = "#8A1919"; // Replace with the actual value
        break;
      case "green":
        shadeColor = "#498044";
        rippleColor = "#4c8747";
        break;
      default:
        break;
    }
  } else {
    shadeColor = theme ? theme.rippleFocus : "transparent";
    rippleColor = theme ? theme.rippleColor : "transparent";
  }

  return StyleSheet.create({
    color: "transparent",
    disabledColor: "rgb(130, 130, 130)",
    shadeColor: shadeColor,
    rippleColor: rippleColor,
  });
};

const useConditionalThemes = () => {
  try {
    const { theme, currentClassicColor } = useThemes();

    // You can customize the logic to check authentication here if needed

    return { theme, currentClassicColor };
  } catch {
    // Return default Classic theme if not authenticated
    return {
      theme: "Classic",
      currentClassicColor: null, // Set appropriate default value if needed
    };
  }
};

export default function TouchableRipple({
  // default props
  // color = "transparent",
  // disabledColor = "rgb(240, 240, 240)",
  // shadeColor = "#8A1919", // focus color
  // shadeOpacity = 0.15, // focus opacity
  shadeOpacity = 0.15, // focus opacity

  shadeBorderRadius = 2,
  focusAnimationDuration = 225, // transition duration
  disableAnimationDuration = 225,
  disabled = false,
  ...props
}) { 
  const { theme, currentClassicColor } = useConditionalThemes();
  const styles = getStyles(theme, getClassicColor(currentClassicColor));
  const [focusAnimation, setFocusAnimation] = useState(new Animated.Value(0));
  // const [disableAnimation, setDisableAnimation] = useState(
  //   new Animated.Value(disabled ? 1 : 0)
  // );

  // useEffect(() => {
  //   Animated.timing(disableAnimation, {
  //     toValue: disabled ? 1 : 0,
  //     duration: disableAnimationDuration,
  //     useNativeDriver: false,
  //   }).start();
  // }, [disabled, disableAnimationDuration, disableAnimation]);

  function onPress() {
    if (typeof props.onPress === "function") {
      props.onPress(props.payload);
    }
  }

  function onFocusChange(focused) {
    Animated.timing(focusAnimation, {
      toValue: focused ? 1 : 0,
      duration: focusAnimationDuration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }

  let shadeContainerStyle = {
    borderRadius: styles.shadeBorderRadius,
  };

  let shadeStyle = {
    backgroundColor: styles.shadeColor,
    opacity: focusAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, shadeOpacity],
    }),
  };

  return (
    <Ripple
      {...props}
      style={[rippleStyles.container, props.style]}
      onPress={onPress}
      onPressIn={() => onFocusChange(true)}
      onPressOut={() => onFocusChange(false)}
      rippleColor={styles.rippleColor}
      rippleOpacity={0.5}
      disabled={disabled}
    >
      {props.children}

      <View style={[rippleStyles.shadeContainer, shadeContainerStyle]}>
        <Animated.View style={[rippleStyles.shade, shadeStyle]} />
      </View>
    </Ripple>
  );
}

TouchableRipple.propTypes = {
  // ...Ripple.propTypes,
  // color: PropTypes.string,
  // disabledColor: PropTypes.string,
  // shadeColor: PropTypes.string,
  // shadeOpacity: PropTypes.number,
  // shadeBorderRadius: PropTypes.number,
  // focusAnimationDuration: PropTypes.number,
  // disableAnimationDuration: PropTypes.number,
  // payload: PropTypes.any,
  disabled: PropTypes.bool,
};
