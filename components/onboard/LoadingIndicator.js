import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MotiView } from "moti";

const LoadingIndicator = ({ size = 60 }) => {
  return (
    <MotiView
      from={{
        width: 0,
        borderRadius: size / 2,
        borderWidth: 0,
        shadowOpacity: 0.5
      }}
      animate={{
        width: size,
        borderRadius: (size + 20) / 2,
        borderWidth: size / 10,
        shadowOpacity: 1,
      }}
      transition={{
        type: 'timing',
        duration: 900,
        repeat: Infinity
        
      }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: size / 5,
        borderColor: "white",
        shadowColor: "white",
        ShadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
      }}
    />
  );
};

export default LoadingIndicator;

const styles = StyleSheet.create({});
