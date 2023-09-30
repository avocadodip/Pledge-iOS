import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ThreeDotsIcon from "../../assets/icons/three-dots.svg";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { useThemes } from "../../hooks/ThemesContext";

const ThemeToggle = () => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  const { currentThemeName, saveTheme } = useThemes();

  return (
    <View style={styles.rightSettingsButton}>
      <Text style={styles.currentThemeText}>{currentThemeName}</Text>
      <View style={{ borderRadius: 10, overflow: "hidden" }}>
        <Menu>
          <MenuTrigger>
            <View style={styles.threeDotsButton}>
              <ThreeDotsIcon width={22} height={22} color={theme.textHigh} />
            </View>
          </MenuTrigger>
          <MenuOptions customStyles={menuOptionsStyles}>
            {/* <MenuOption
              style={currentThemeName === "Light" ? styles.selectedOption : {}}
              onSelect={() => saveTheme("Light")}
              text="Light"
            /> */}
            <MenuOption
              style={currentThemeName === "Dark" ? styles.selectedOption : {}}
              onSelect={() => saveTheme("Dark")}
              text="Dark"
            />
            <MenuOption
              style={
                currentThemeName === "Classic" ? styles.selectedOption : {}
              }
              onSelect={() => saveTheme("Classic")}
              text="Classic"
            />
            {/* <MenuOption
              style={currentThemeName === "Auto" ? styles.selectedOption : {}}
              onSelect={() => saveTheme("Auto")}
              text="Auto"
            /> */}
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
};

export default ThemeToggle;

const getStyles = (theme) =>
  StyleSheet.create({
    rightSettingsButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
    },
    currentThemeText: {
      fontSize: 15,
      color: theme.textMedium,
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
      backgroundColor: "rgba(0, 0, 0, 0.2)",
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
