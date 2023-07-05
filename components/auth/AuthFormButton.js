import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TouchableRipple from "../TouchableRipple";
import { Color } from "../../GlobalStyles";

const AuthFormButton = ({ action, text }) => {
  return (
    <TouchableRipple style={styles.button} onPress={action}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableRipple>
  );
};

export default AuthFormButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.white,
    gap: 15,
    height: 52,
    borderRadius: 10,
    width: "100%",
    overflow: "hidden",
    marginBottom: 40,
    borderColor: "#dd4f4f45",
    borderWidth: 1.7,
  },
  buttonText: {
    color: Color.fervo_red,
    fontSize: 18,
    fontWeight: 600,
  },
});
