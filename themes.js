import { Color } from "./GlobalStyles";

// Backgrounds
export const redGradientValues = ["#DB5353", "#E46959"];
export const purpleGradientValues = ["#5653DB", "#7653DB"];
export const greenGradientValues = ["#30AD4C", "#2AA746"];

// Comes in as "purple", "red", or "green" & name of style like ContentLoaderBackgroundColor
export const getClassicColor = (color, styleName) => {
  const colorMap = {
    red: {
      ContentLoaderBackgroundColor: "#e16564",
      ContentLoaderForegroundColor: "#f27b7b"
    },
    purple: {
      ContentLoaderBackgroundColor: "#6967e4",
      ContentLoaderForegroundColor: "#9c9af9"
    },
    green: {
      ContentLoaderBackgroundColor: "#45c05f",
      ContentLoaderForegroundColor: "#6ed785"
    }
  };
 
  return colorMap[color]?.[styleName];
};

  
export default {
  Classic: {
    accent: "#E05E56",
    statusBar: "light",
    scrollIndicator: "white",
    primary: Color.white,
    overlayPrimary: Color.white70,
    halfPrimary: Color.white50,
    lightPrimary: Color.white20,
    faintPrimary: Color.white12,
    logo: {
      tintColor: "rgba(255, 255, 255, 1)",
    },

    // Ripple effect
    rippleFocus: "#8A1919",
    rippleColor: "#8A1919",

    // Text
    textHigh: "rgba(255, 255, 255, 1)",
    textMedium: "rgba(255, 255, 255, 0.8)",
    textLow: "rgba(255, 255, 255, 0.7)",
    textDisabled: "rgba(255, 255, 255, 0.6)",

    // Auth button
    authButtonBg: "white",
    authButtonBorder: "#dd4f4f45",
    authButtonText: Color.fervo_red,

    // GetStartedModal step indicator
    stepStrokeFinishedColor: "#f56565",
    stepIndicatorUnFinishedColor: "#f97676",
  },
  Dark: {
    accent: Color.black,
    statusBar: "light",
    scrollIndicator: "white",

    primary: Color.white,
    overlayPrimary: Color.white70,
    halfPrimary: Color.white50,
    lightPrimary: Color.white20,
    faintPrimary: Color.white12,

    logo: {
      tintColor: "rgba(255, 255, 255, 1)",
    },

    // Ripple effect
    rippleFocus: "#847c7c",
    rippleColor: "#847c7c",

    // Text
    // high emphasis, medium emphasis, disabled https://uxplanet.org/8-tips-for-dark-theme-design-8dfc2f8f7ab6
    textHigh: "rgba(255, 255, 255, 0.87)",
    textMedium: "rgba(255, 255, 255, 0.6)",
    textLow: "rgba(255, 255, 255, 0.55)",
    textDisabled: "rgba(255, 255, 255, 0.38)",

    // Auth button
    authButtonBg: "#eaeaea",
    authButtonBorder: "#ffffff88",
    authButtonText: "#3c3c3c",

    // GetStartedModal step indicator
    stepStrokeFinishedColor: "#7c7c7c",
    stepIndicatorUnFinishedColor: "#acacac",
  },
  Light: {
    accent: Color.white,
    statusBar: "dark",
    scrollIndicator: "black",

    primary: Color.black,
    overlayPrimary: Color.black55,
    halfPrimary: Color.black35,
    lightPrimary: Color.black16,
    faintPrimary: Color.black4,

    logo: {
      tintColor: "rgba(0, 0, 0, 1)",
    },

    // Ripple effect
    rippleFocus: "rgba(0, 0, 0, 0.08)",
    rippleColor: "rgba(0, 0, 0, 0.08)",

    // Text
    textHigh: "rgba(0, 0, 0, 0.8)",
    textMedium: "rgba(0, 0, 0, 0.6)",
    textLow: "rgba(255, 255, 255, 0.5)",
    textDisabled: "rgba(0, 0, 0, 0.3)",

    // Auth button
    authButtonBg: "white",
    authButtonBorder: "#dd4f4f00",
    authButtonText: Color.fervo_red,

    // GetStartedModal step indicator
    stepStrokeUnFinishedColor: "#f56565",
    stepIndicatorUnFinishedColor: "#f97676",
  },
};
