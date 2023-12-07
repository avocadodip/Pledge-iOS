import { StyleSheet, Pressable } from "react-native";
import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

const AnimatedButton = ({ style, children, onPress }) => {
  const pressed = useSharedValue(false);
  const offset = useSharedValue(0);

  const longHold = Gesture.LongPress()
    .onBegin(() => {
      pressed.value = true;
    })
    .onFinalize(() => {
      offset.value = withSpring(0);
      pressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? 0.93 : 1) }],
  }));

  return (
    <Pressable
      onPress={() => {
        onPress();
        Haptics.selectionAsync();
      }}
    >
      <GestureDetector gesture={longHold}>
        <Animated.View style={[style, animatedStyles]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </Pressable>
  );
};

export default AnimatedButton;

const styles = StyleSheet.create({});
