import { Color } from "./GlobalStyles";

// Backgrounds
export const redGradientValues = ["#F13434", "#e88844"];
export const purpleGradientValues = ["#5653DB", "#7653DB"];
export const greenGradientValues = ["#30AD4C", "#2AA746"];

// Comes in as "purple", "red", or "green" & name of style like ContentLoaderBackgroundColor
export const getClassicColor = (color, styleName) => {
  const colorMap = {
    red: {
      ContentLoaderBackgroundColor: "#e64e3d",
      ContentLoaderForegroundColor: "#f37463",
    },
    purple: {
      ContentLoaderBackgroundColor: "#6967e4",
      ContentLoaderForegroundColor: "#9c9af9",
    },
    green: {
      ContentLoaderBackgroundColor: "#45c05f",
      ContentLoaderForegroundColor: "#6ed785",
    },
    Light: {
      ContentLoaderBackgroundColor: "#cccccc",
      ContentLoaderForegroundColor: "#a2a2a2",
    },
    Dark: {
      ContentLoaderBackgroundColor: "#212121",
      ContentLoaderForegroundColor: "#363636",
    },
  };

  return colorMap[color]?.[styleName];
};

export default {
  Classic: {
    accent: "#E05E56",
    accent2: "#80E05E56",
    statusBar: "light",
    scrollIndicator: "white",
    primary: Color.white,
    overlayPrimary: Color.white70,
    halfPrimary: Color.white50,
    lightPrimary: Color.white20,
    faintishPrimary: Color.white18,
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

    // Payment sheet
    paymentSheetComponentBackground: "#E05E56",
    paymentSheetComponentBackground: "#FFFFFF",
    paymentSheetSetupButton: "#4b4b4b",
    paymentSheetPrimary: "#fcfdff",

    // Day Status indicator
    dayStatusIndicatorBg: Color.white18,
    dayStatusIndicatorBorder: Color.white18,

    dayStatusIndicatorBgIncomplete: Color.white18,
    dayStatusIndicatorBorderIncomplete: "transparent",

    dayStatusIndicatorBgComplete: Color.white18,
    dayStatusIndicatorBorderComplete: Color.white18,

    notificationDotBg: "#ff4e33",
    notificationDotBorder: "#ff4e33",

    // Start first day button border
    buttonBorder: "#feb3b33d",
  },
  Dark: {
    accent: Color.black,
    accent2: "#80121212",
    statusBar: "light",
    scrollIndicator: "white",

    primary: Color.white,
    overlayPrimary: Color.white70,
    halfPrimary: Color.white50,
    lightPrimary: Color.white20,
    faintishPrimary: Color.white18,
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

    vacationToggleDisabled: "#6b6b6b",

    // Payment sheet
    paymentSheetBackground: Color.black,
    paymentSheetComponentBackground: "#5c5c5c",
    paymentSheetSetupButton: "#474747",
    paymentSheetPrimary: "#fcfdff",

    // Day Status indicator
    dayStatusIndicatorBg: Color.white12,
    dayStatusIndicatorBorder: "#4a4a4a",
    dayStatusIndicatorBgIncomplete: "#df3a3a",
    dayStatusIndicatorBorderIncomplete: "#d01f1f",
    dayStatusIndicatorBgComplete: "#3eb344",
    dayStatusIndicatorBorderComplete: "#1f8b25",

    notificationDotBg: "#df3a3a",
    notificationDotBorder: "#d01f1f",

    // Start first day button border
    buttonBorder: "#4a4a4a",
  },
  Light: {
    accent: Color.white,
    accent2: "#80F3F3F3",
    statusBar: "dark",
    scrollIndicator: "black",

    primary: Color.black,
    overlayPrimary: Color.black55,
    halfPrimary: Color.black35,
    lightPrimary: Color.black16,
    faintishPrimary: Color.black8,
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

    // Payment sheet
    paymentSheetBackground: "#FFFFFF",
    paymentSheetComponentBackground: "#999999",
    paymentSheetSetupButton: "#4b4b4b",
    paymentSheetPrimary: "#616161",

    // Day Status indicator
    dayStatusIndicatorBg: "#ff7d7a",

    // Start first day button border
    buttonBorder: "#d0d0d0",
  },
};
