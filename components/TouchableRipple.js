import PropTypes from "prop-types";
import React, { PureComponent, useEffect, useState } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import Ripple from "react-native-material-ripple";
import { Color } from "../GlobalStyles";

const styles = StyleSheet.create({
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

export default function TouchableRipple({
  // default props
  color = "transparent",
  disabledColor = "rgb(240, 240, 240)",
  shadeColor = "#8A1919", // focus color
  shadeOpacity = 0.15, // focus opacity
  shadeBorderRadius = 2,
  focusAnimationDuration = 225, // transition duration
  disableAnimationDuration = 225,
  disabled = false,
  ...props
}) {
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

  let rippleStyle = {
    backgroundColor: color,
  };

  let shadeContainerStyle = {
    borderRadius: shadeBorderRadius,
  };

  let shadeStyle = {
    backgroundColor: shadeColor,
    opacity: focusAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, shadeOpacity],
    }),
  };

  return (
    <Ripple
      {...props}
      style={[styles.container, props.style]}
      onPress={onPress}
      onPressIn={() => onFocusChange(true)}
      onPressOut={() => onFocusChange(false)}
      rippleColor={"#8A1919"}
      rippleOpacity={0.5}
      disabled={disabled}
    >
      {props.children}

      <View style={[styles.shadeContainer, shadeContainerStyle]}>
        <Animated.View style={[styles.shade, shadeStyle]} />
      </View>
    </Ripple>
  );
}

TouchableRipple.propTypes = {
  ...Ripple.propTypes,
  color: PropTypes.string,
  disabledColor: PropTypes.string,
  shadeColor: PropTypes.string,
  shadeOpacity: PropTypes.number,
  shadeBorderRadius: PropTypes.number,
  focusAnimationDuration: PropTypes.number,
  disableAnimationDuration: PropTypes.number,
  payload: PropTypes.any,
  disabled: PropTypes.bool,
};
