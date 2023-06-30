/* fonts */
export const FontFamily = {
  epilogueBold: "Epilogue_bold",
  epilogueRegular: "Epilogue_regular",
  interSemibold: "Inter_semibold",
  epilogueSemibold: "Epilogue_semibold",
  interRegular: "Inter_regular",
  interBold: "Inter_bold",
  epilogueMedium: "Epilogue_medium",
};

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
  white: "#FFFFFF",
  faint_white: "rgba(243, 243, 243, 0.5)",
  border_white: "rgba(243, 243, 243, 0.32)",
  black: "#000",
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

// https://stripe.com/docs/elements/appearance-api (fonts & light/dark mode)
export const paymentSheetAppearance = {
  shapes: {
    borderRadius: 12,
    borderWidth: 0,
    shadow: 0,
  },
  colors: {
    primary: "#fcfdff",
    background: Color.fervo_red,
    componentBackground: "#e86464",
    componentBorder: "#f3f8fa",
    componentDivider: Color.white,
    primaryText: Color.white,
    secondaryText: Color.white,
    componentText: Color.white,
    placeholderText: Color.white,
    icon: Color.white,
    error: "#e1e1e1"
  },
  primaryButton: {
    colors: {
      background: "#e86464",
      text: Color.white,
    },
    shapes: {
      borderWidth: 0,
      borderRadius: 12,
      shadow: 0
    },
  },
};
