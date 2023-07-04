import { useState, useEffect, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from 'react-native';
import themeStyles from '../themes';

export const ThemeContext = createContext();

export const ThemesProvider = ({ children }) => {
  const [currentThemeName, setCurrentThemeName] = useState(null);
  const systemTheme = useColorScheme(); // Gets the current system theme

  // Fetch theme from storage
  const fetchTheme = async () => {
    const storedTheme = await AsyncStorage.getItem("storedTheme");
    setCurrentThemeName(storedTheme);
  };

  // Save theme to storage
  const saveTheme = async (themeType) => {
    await AsyncStorage.setItem("storedTheme", themeType);
    setCurrentThemeName(themeType);
  };

  // Call fetchTheme on initialization
  useEffect(() => {
    fetchTheme();
  }, []);

  // If current theme is "Auto", select light or dark based on system theme
  let currentTheme;
  if (currentThemeName === 'Auto') {
    currentTheme = systemTheme === 'dark' ? themeStyles.Dark : themeStyles.Light;
  } else {
    currentTheme = themeStyles[currentThemeName];
  }

  // Prepare the theme data to be provided
  const themeData = { currentThemeName, saveTheme, theme: currentTheme };

  return (
    <ThemeContext.Provider value={themeData}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemes = () => useContext(ThemeContext);
