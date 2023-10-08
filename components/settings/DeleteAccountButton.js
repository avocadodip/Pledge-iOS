import { getAuth } from "firebase/auth";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";

const DeleteAccountButton = ({ currentUserID, navigation }) => {
  const { theme } = useThemes();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: "transparent",
          borderBottomWidth: 2,
          borderColor: "rgba(255, 255, 255, 0.7)",
        },
      ]}
      onPress={() => {navigation.navigate("DeleteAccount")}}
    >
      <Text style={[styles.buttonText, { color: Color.white }]}>
        Delete Account
      </Text>
    </TouchableOpacity>
  );
};

export default DeleteAccountButton;

const getStyles = (theme) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.textMedium,
      gap: 15,
      height: 25,
      overflow: "hidden",
      margin: 8,
      marginTop: 16,
      width: 100,
    },
    buttonText: {
      color: theme.textMedium,
      opacity: 0.8,
      fontSize: 14,
      textAlign: "left",
    },
  });
