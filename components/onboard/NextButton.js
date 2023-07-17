import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import TouchableRipple from "../TouchableRipple";
import { Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";
import DownArrowIcon from "../../assets/icons/down-arrow-icon.svg";
import LockIcon from "../../assets/icons/lock-icon.svg";

const NextButton = ({ action, text, disabled, isFinalButton }) => {
  const { theme } = useThemes();
  const styles = getStyles(theme);

  return (
    <View style={styles.buttonWrapper}>
      <TouchableRipple
        style={[styles.button, disabled ? { opacity: 0.2 } : { opacity: 1 }]}
        onPress={action}
        disabled={disabled}
      >
        {isFinalButton ? (
          <LockIcon color={theme.authButtonText} width={27} height={27} />
        ) : (
          <DownArrowIcon color={theme.authButtonText} width={27} height={27} />
        )}
      </TouchableRipple>
    </View>
  );
};

export default NextButton;

const getStyles = (theme) =>
  StyleSheet.create({
    buttonWrapper: {
      borderRadius: 25,
      width: "30%",
      overflow: "hidden",
    },
    button: {
      height: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.authButtonBg,
      borderColor: theme.authButtonBorder,
      borderWidth: 1.7,
    },
  });
