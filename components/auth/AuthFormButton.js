import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TouchableRipple from "../TouchableRipple";
import { Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";

const AuthFormButton = ({ action, text, disabledCondition }) => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  return (
    <View style={styles.buttonWrapper}>
      <TouchableRipple
        style={styles.button}
        onPress={action}
        disabled={disabledCondition}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableRipple>
    </View>
  );
};

export default AuthFormButton;

const getStyles = (theme) =>
  StyleSheet.create({
    buttonWrapper: {
      borderRadius: 10,
      width: "100%",
      overflow: "hidden",
      marginBottom: 40,
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
    buttonText: {
      color: theme.authButtonText,
      fontSize: 17,
      fontWeight: 600,
    },
  });