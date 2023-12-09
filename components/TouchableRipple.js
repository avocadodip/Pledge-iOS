import PropTypes from "prop-types";
import React, { PureComponent, useContext, useEffect, useState } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import Ripple from "react-native-material-ripple";
import { Color } from "../GlobalStyles";
import { useThemes } from "../hooks/ThemesContext";
import themeStyles, { getClassicColor } from "../themes";

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

const getStyles = (theme, currentThemeName, currentClassicColor) => {
  let shadeColor, rippleColor;
  if (currentThemeName === "Classic") {
    switch (currentClassicColor) {
      case "purple":
        shadeColor = "#33084f";
        rippleColor = "#33084f";
        break;
      case "red":
        shadeColor = "#8A1919";
        rippleColor = "#8A1919";
        break;
      case "green":
        shadeColor = "#083e03";
        rippleColor = "#083e03";
        break;
      default:
        break;
    }
  } else {
    if (!currentThemeName) {
      shadeColor = "#083e03";
      rippleColor = "#083e03";
    } else if (currentThemeName === "Auto") {
      shadeColor = theme.rippleColor;
      rippleColor = theme.rippleFocus;
    } else {
      shadeColor = themeStyles[currentThemeName].rippleColor;
      rippleColor = themeStyles[currentThemeName].rippleFocus;
    }
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
    const { theme, currentThemeName, currentClassicColor } = useThemes();

    // You can customize the logic to check authentication here if needed

    return { theme, currentThemeName, currentClassicColor };
  } catch {
    // Return default Classic theme if not authenticated
    return {
      currentThemeName: "Classic",
      currentClassicColor: null, // Set appropriate default value if needed
    };
  }
};

export default function TouchableRipple({
  shadeOpacity = 0.15, // focus opacity

  shadeBorderRadius = 2,
  focusAnimationDuration = 225, // transition duration
  disableAnimationDuration = 225,
  disabled = false,
  ...props
}) {
  const { theme, currentThemeName, currentClassicColor } =
    useConditionalThemes();
  const styles = getStyles(theme, currentThemeName, currentClassicColor);
  const [focusAnimation, setFocusAnimation] = useState(new Animated.Value(0));

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
  disabled: PropTypes.bool,
};
