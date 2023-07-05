import { StyleSheet } from "react-native";
import React from "react";
import TextInput from "react-native-text-input-interactive";
import { Color } from "../../GlobalStyles";

// possible types: first, last, email, password
const AuthFormInput = ({ action, value, type }) => {
  return ( 
    <TextInput
      mainColor="#ffffffb0"
      originalColor="#ffffff2a"
      textInputStyle={styles.textInput}
      placeholderTextColor="#ffffffd9"
      placeholder={
        type === "first"
          ? "First name"
          : type === "last"
          ? "Last name"
          : type === "email"
          ? "Email"
          : "Password"
      }
      onChangeText={action}
      value={value}
      secureTextEntry={type === "password"}
      keyboardType={type === "email" ? "email-address" : "default"}
      autoCorrect={false}
      autoCapitalize="none"
    />
  );
};

export default AuthFormInput;

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    color: Color.white,
    flex: 1,
    fontSize: 15,
    borderWidth: 1.7,
  },
});
