import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TouchableRipple from "../TouchableRipple";
import { Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";
import theme from "../../themes";

const AuthFormButton = ({ action, text, disabledCondition }) => {
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

const styles = 
  StyleSheet.create({
    buttonWrapper: {
      borderRadius: 10,
      width: "100%",
      overflow: "hidden",
      marginBottom: 5,
    },
    button: {
      height: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme["Classic"].authButtonBg,
      borderColor: theme["Classic"].authButtonBorder,
      borderWidth: 1.7,
    },
    buttonText: {
      color: theme["Classic"].authButtonText,
      fontSize: 17,
      fontWeight: 600,
    },
  });
