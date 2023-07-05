import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Color } from "../../GlobalStyles";

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

const styles = StyleSheet.create({
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
    color: Color.white,
    fontSize: 17,
  },
  signInButtonText: {
    color: Color.white,
    fontSize: 17,
    fontWeight: 500,
  },
});
