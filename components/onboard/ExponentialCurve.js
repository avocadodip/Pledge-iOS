import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedView = Animated.createAnimatedComponent(View);

const ExponentialCurve = () => {
  const pathLength = 1000; // Replace with the actual length of your SVG path
  const animatedStroke = useSharedValue(pathLength);

  useEffect(() => {
    const delay = 500;
    const animationDuration = 3000;

    // Start the stroke animation
    const timer = setTimeout(() => {
      animatedStroke.value = withTiming(0, {
        duration: animationDuration,
        easing: Easing.bezier(0.9, 0, 0.4, 1)
      });
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: animatedStroke.value,
  }));

  const SIZE = 700;

  // CURVE MATH:
  const a = 1; // You can adjust this value
  const b = 0.35; // You can adjust this value
  const xMax = 20;
  const xMin = 0;
  const numPoints = 200; // More points for a smoother curve
  const deltaX = (xMax - xMin) / numPoints;

  let pathData = "M 0 " + (SIZE - a * Math.exp(b * 0)); // Starting point, adjusted for SVG coordinates

  for (let i = 1; i <= numPoints; i++) {
    let x = xMin + i * deltaX;
    let y = a * Math.exp(b * x);
    y = SIZE - y; // Adjust for SVG coordinates (flip y-axis)
    pathData += ` L ${x * 20} ${y}`; // Scale x to fit into your SVG width
  }

  return (
      <Svg
        height={"100%"}
        width={SIZE}
      >
        <AnimatedPath
          animatedProps={animatedProps}
          d={pathData}
          fill="none"
          stroke="#ffffff5a"
          strokeWidth="22"
          strokeDasharray={pathLength}
          strokeLinecap="round" // This line makes the stroke ends rounded
        />
      </Svg>
  );
};

export default ExponentialCurve;

const styles = StyleSheet.create({
});
