import { Color } from "./GlobalStyles";

export default {
  Classic: {
    accent: Color.fervo_red,
    primary: Color.white,
    overlayPrimary: Color.white70,
    halfPrimary: Color.white50,
    lightPrimary: Color.white20,
    faintPrimary: Color.white12,
    logo: {
      tintColor: "rgba(255, 255, 255, 1)",
    },
    rippleFocus: "#8A1919",
    rippleColor: "#8A1919",
  },
  Dark: {
    accent: Color.black,
    primary: Color.white,
    overlayPrimary: Color.white70,
    halfPrimary: Color.white50,
    lightPrimary: Color.white20,
    faintPrimary: Color.white12,
    logo: {
      tintColor: "rgba(255, 255, 255, 1)",
    },
    rippleFocus: "#847c7c",
    rippleColor: "#847c7c",
  },
  Light: {
    accent: Color.white,
    primary: Color.black,
    overlayPrimary: Color.black55,
    halfPrimary: Color.black35,
    lightPrimary: Color.black16,
    faintPrimary: Color.black8,
    logo: {
      tintColor: "rgba(0, 0, 0, 1)",
    },
    rippleFocus: "#8A1919",
    rippleColor: "#8A1919",
  },
};
