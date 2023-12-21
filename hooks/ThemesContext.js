import { useState, useEffect, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import themeStyles, {
  greenGradientValues,
  purpleGradientValues,
  redGradientValues,
} from "../themes";
import { Color } from "../GlobalStyles";
import { useSettings } from "./SettingsContext";

export const ThemeContext = createContext();

export const ThemesProvider = ({ children }) => {
  const {
    settings: { isOnboarded },
    currentUserID, timeStatus, dayCompleted
  } = useSettings();
  const [currentThemeName, setCurrentThemeName] = useState("");
  const systemTheme = useColorScheme(); // Gets the current system theme
  const [backgroundGradient, setBackgroundGradient] = useState([]);
  const [currentClassicColor, setCurrentClassicColor] = useState(""); // purple, red, green


  // Call fetchTheme on initialization
  useEffect(() => {
    fetchTheme();
  }, []);

  // Update background color wh
  useEffect(() => {
    updateBackgroundGradient();
  }, [
    currentThemeName,
    currentUserID,
    timeStatus,
    dayCompleted,
    isOnboarded
  ]);

  const updateBackgroundGradient = () => {
    console.log("currentUserID: ", currentUserID);
    console.log("timeStatus: ", timeStatus);
    console.log("dayCompleted: ", dayCompleted);
    console.log("isOnboarded: ", isOnboarded);
    console.log("currentThemeName: ", currentThemeName);
    if (currentThemeName === "Classic") {
      if (
        currentUserID === null ||
        !isOnboarded ||
        (timeStatus === 1 && !dayCompleted) 
      ) {
        setBackgroundGradient(redGradientValues);
        setCurrentClassicColor("red");
      } else if (timeStatus === 0 || timeStatus === 2) {
        setBackgroundGradient(purpleGradientValues);
        setCurrentClassicColor("purple");
      } else if (
        timeStatus === 1 &&
        dayCompleted
      ) {
        setBackgroundGradient(greenGradientValues);
        setCurrentClassicColor("green");
      }
    }
    if (currentThemeName === "Dark") {
      setBackgroundGradient([Color.black, Color.black]);
    }
    if (currentThemeName === "Light") {
      setBackgroundGradient([Color.white, Color.white]);
    }
  };

  // Fetch theme from storage
  const fetchTheme = async () => {
    const storedTheme = await AsyncStorage.getItem("storedTheme");
    setCurrentThemeName(storedTheme || "Classic");
  };

  // Save theme to storage
  const saveTheme = async (themeType) => {
    await AsyncStorage.setItem("storedTheme", themeType);
    setCurrentThemeName(themeType);
  };

  // If current theme is "Auto", select light or dark based on system theme
  let currentTheme;
  if (currentThemeName === "Auto") {
    currentTheme =
      systemTheme === "Dark" ? themeStyles.Dark : themeStyles.Light;
  } else {
    currentTheme = themeStyles[currentThemeName];
  }

  currentTheme = currentTheme || themeStyles.Light;

  // Prepare the theme data to be provided
  const themeData = {
    currentThemeName,
    saveTheme,
    theme: currentTheme,
    updateBackgroundGradient,
    backgroundGradient,
    currentClassicColor,
  };

  return (
    <ThemeContext.Provider value={themeData}>{children}</ThemeContext.Provider>
  );
};

export const useThemes = () => useContext(ThemeContext);
