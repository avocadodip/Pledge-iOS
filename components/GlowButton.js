import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

const GlowButton = ({
  children,
  color,
  height,
  width,
  borderRadius = 5,
  onPress,
}) => {
  // Usage:
  // const darkerColor = darkenHexColor(color, -20);  // Darken by 20%
  function darkenHexColor(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      B = ((num >> 8) & 0x00ff) + amt,
      G = (num & 0x0000ff) + amt;
    return (
      "#" +
      (0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
        (G < 255 ? (G < 1 ? 0 : G) : 255))
        .toString(16)
        .slice(1)
        .toUpperCase()
    );
  }

  return (
    <TouchableOpacity
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: color,

          // borderborder
          borderColor: darkenHexColor(color, -15),
          borderWidth: 1.5,
          borderRadius: borderRadius,

          // size
          height: height,
          width: width,

          // shadow
          shadowColor: color,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.5,
          shadowRadius: 10,
        },
      ]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

export default GlowButton;
