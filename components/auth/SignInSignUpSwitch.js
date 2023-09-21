import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";
import theme from "../../themes";


const SignInSignUpSwitch = ({ navigation, prompt, navigateTo, buttonText }) => {
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

styles = StyleSheet.create({
  // Sign in styles
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    width: "100%",
    marginTop: 50,
  },
  signInText: {
    color: theme[["Classic"]].textMedium,
    fontSize: 17,
  },
  signInButtonText: {
    color: theme["Classic"].textHigh,
    fontSize: 17,
    fontWeight: 500,
  },
});
