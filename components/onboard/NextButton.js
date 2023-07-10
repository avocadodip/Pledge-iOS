import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import TouchableRipple from "../TouchableRipple";
import { Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";
import DownArrowIcon from "../../assets/icons/down-arrow-icon.svg";

const NextButton = ({ action, text, disabledCondition }) => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  return (
    <View style={styles.buttonWrapper}>
      <TouchableRipple
        style={styles.button}
        onPress={action}
        disabled={disabledCondition}
      >
        <DownArrowIcon color={Color.fervo_red} width={27} height={27}/>
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
