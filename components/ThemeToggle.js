import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import ThreeDotsIcon from "../assets/icons/three-dots.svg";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Color } from "../GlobalStyles";

const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState(null);

  useEffect(() => {
    // Fetch the theme from async storage when the component mounts
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    const storedTheme = await AsyncStorage.getItem("theme");
    setCurrentTheme(storedTheme);
  };

  const handleThemeSave = async (theme) => {
    // Store the theme in async storage
    await AsyncStorage.setItem("theme", theme);
    // Update the current theme
    setCurrentTheme(theme);
  };

  return (
    <View style={styles.rightSettingsButton}>
      <Text style={styles.currentThemeText}>{currentTheme}</Text>
      <View style={{ borderRadius: 10, overflow: "hidden" }}>
        <Menu>
          <MenuTrigger>
            <View style={styles.threeDotsButton}>
              <ThreeDotsIcon width={22} height={22} color={Color.white} />
            </View>
          </MenuTrigger>
          <MenuOptions customStyles={menuOptionsStyles}>
            <MenuOption
              style={currentTheme === "Classic" ? styles.selectedOption : {}}
              onSelect={() => handleThemeSave("Classic")}
              text="Classic"
            />
            <MenuOption
              style={currentTheme === "Light" ? styles.selectedOption : {}}
              onSelect={() => handleThemeSave("Light")}
              text="Light"
            />
            <MenuOption
              style={currentTheme === "Dark" ? styles.selectedOption : {}}
              onSelect={() => handleThemeSave("Dark")}
              text="Dark"
            />
            <MenuOption
              style={currentTheme === "Auto" ? styles.selectedOption : {}}
              onSelect={() => handleThemeSave("Auto")}
              text="Auto"
            />
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
};

export default ThemeToggle;

const styles = StyleSheet.create({
  rightSettingsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  currentThemeText: {
    fontSize: 15,
    color: Color.white,
    opacity: 0.8,
  },
  threeDotsButton: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    height: 44,
    width: 44,
  },
  selectedOption: {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});

const menuOptionsStyles = {
  optionsContainer: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "white",
    paddingVertical: 7,
    width: 120,
  },
  // optionsWrapper: {
  //   backgroundColor: "purple",
  // },
  optionWrapper: {
    paddingLeft: 20,
    // backgroundColor: "yellow",
  },

  optionText: {
    paddingVertical: 10,
    fontSize: 16,
    color: "black",
  },
};
