/* fonts */
// export const FontFamily = {
//   epilogueBold: "Epilogue_bold",
//   epilogueRegular: "Epilogue_regular",
//   interSemibold: "Inter_semibold",
//   epilogueSemibold: "Epilogue_semibold",
//   interRegular: "Inter_regular",
//   interBold: "Inter_bold",
//   epilogueMedium: "Epilogue_medium",
// };

import { Dimensions } from "react-native";


/* font sizes */
export const FontSize = {
  size_lg: 18,
  size_base: 16,
  size_11xl: 30,
  size_xs: 12,
  size_5xl: 24,
  size_17xl: 36,
  size_31xl: 50,
};

/* Colors */
export const Color = {
  fervo_red: "#DD4F4F",
  fervo_green: "#2FAC52",
  fervo_purple: "#6E48D9",
  fervo_blue: "#3D56DD",
  task_red: "#E98E8E",
  task_green: "#8FE98E",
  task_yellow: "#E9E08E",
  white: "#F3F3F3",
  white70: "rgba(243, 243, 243, 0.7)", //maybe change back
  white50: "rgba(243, 243, 243, 0.5)",
  white20: "rgba(243, 243, 243, 0.2)",
  white18: "rgba(243, 243, 243, 0.18)",
  white12: "rgba(243, 243, 243, 0.12)",

  // Dark
  black: "#121212",
  black55: "rgba(0, 0, 0, 0.55)",
  black35: "rgba(0, 0, 0, 0.35)",
  black16: "rgba(0, 0, 0, 0.16)",
  black8: "rgba(0, 0, 0, 0.08)",
  black4: "rgba(0, 0, 0, 0.04)",
  border_white: "rgba(243, 243, 243, 0.32)",
  gray_100: "rgba(0, 0, 0, 0.5)",
  gray_200: "rgba(0, 0, 0, 0.6)",
};

/* Paddings */
export const Padding = {
  p_xl: 20,
  p_3xs: 10,
  p_8xs: 5,
  p_11xl: 30,
  p_7xs: 6,
  p_5xs: 8,
  p_9xs: 4,
};
/* border radiuses */
export const Border = {
  br_11xl: 30,
  br_11xs: 2,
  br_xl: 20,
  br_81xl: 100,
  br_3xs: 10,
  br_9xs: 4,
  br_7xs: 6,
  br_8xs: 5,
};

export const BOTTOM_TAB_HEIGHT = 100;
export const APP_HORIZONTAL_PADDING = 18;

const WINDOW_HEIGHT = Dimensions.get("window").height;

export const settingsPageStyles = {
  pageContainer: {
    display: "flex",
    marginBottom: BOTTOM_TAB_HEIGHT + 70,
    height: WINDOW_HEIGHT - BOTTOM_TAB_HEIGHT,

    // marginHorizontal: SETTINGS_HORIZONTAL_PADDING,
  },
};
