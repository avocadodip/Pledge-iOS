import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";

const SignInSignUpSwitch = ({ navigation, prompt, navigateTo, buttonText }) => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.signInText}>{prompt}</Text>
      <TouchableOpacity onPress={() => navigation.navigate(navigateTo)}>
        <Text style={styles.signInButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInSignUpSwitch;

const getStyles = (theme) =>
 StyleSheet.create({
  // Sign in styles
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    width: "100%",
    marginTop: 30,
  },
  signInText: {
    color: theme.textMedium,
    fontSize: 17,
  },
  signInButtonText: {
    color: theme.textHigh,
    fontSize: 17,
    fontWeight: 500,
  },
});
