import { useState, useEffect, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import themeStyles, {
  greenGradientValues,
  purpleGradientValues,
  redGradientValues,
} from "../themes";
import { Color } from "../GlobalStyles";
import { useDayStatus } from "./DayStatusContext";
import { useSettings } from "./SettingsContext";

export const ThemeContext = createContext();

export const ThemesProvider = ({ children }) => {
  const { timeStatus } = useDayStatus();
  const { currentUserID } = useSettings();
  const [currentThemeName, setCurrentThemeName] = useState("");
  const systemTheme = useColorScheme(); // Gets the current system theme
  const [backgroundGradient, setBackgroundGradient] = useState([]);
  const [statusBarHidden, setStatusBarHidden] = useState(false); // For settings page scrollview

  let noActionItemsLeft = false;

  // Call fetchTheme on initialization
  useEffect(() => {
    fetchTheme();
  }, []);

  // Update appearance when theme is changed or user auth changes
  useEffect(() => {
    updateBackgroundGradient();
  }, [currentThemeName, currentUserID, timeStatus]);


  const updateBackgroundGradient = () => {
    switch (currentThemeName) {
      case "Classic":
        if (
          (timeStatus === 1 && !noActionItemsLeft) ||
          currentUserID === null
        ) {
          setBackgroundGradient(redGradientValues);
        } else if (timeStatus === 0 || timeStatus === 2) {
          setBackgroundGradient(purpleGradientValues);
        } else if (timeStatus === 1 && noActionItemsLeft) {
          setBackgroundGradient(greenGradientValues);
        }
        break;
      case "Dark":
        setBackgroundGradient([Color.black, Color.black]);
        break;
      case "Light":
        setBackgroundGradient([Color.white, Color.white]);
        break;
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
    statusBarHidden,
    setStatusBarHidden
  };

  return (
    <ThemeContext.Provider value={themeData}>{children}</ThemeContext.Provider>
  );
};

export const useThemes = () => useContext(ThemeContext);
