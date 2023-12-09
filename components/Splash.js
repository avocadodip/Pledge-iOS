import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { redGradientValues } from "../themes";
import Animated, { FadeOut } from "react-native-reanimated";
import { useThemes } from "../hooks/ThemesContext";

const Splash = () => {
  const styles = getStyles();

  return (
    <Animated.View exiting={FadeOut.duration(300)} style={styles.pageContainer}>
      <LinearGradient colors={redGradientValues} style={styles.pageContainer}>
        <Animated.View
          exiting={FadeOut.duration(100)}
          style={styles.pageContainer}
        >
          <Image
            style={styles.logoIcon}
            resizeMode="cover"
            source={require("../assets/icons/pledgetransparent.png")}
          />
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    pageContainer: {
      flex: 1,
      ...StyleSheet.absoluteFillObject, // This makes it an overlay
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999, // Set zIndex high so it appears above other elements
    },
    logoIcon: {
      width: 132,
      height: 132,
    },
  });

export default Splash;
