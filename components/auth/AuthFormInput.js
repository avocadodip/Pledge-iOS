import { StyleSheet } from "react-native";
import React from "react";
import TextInput from "react-native-text-input-interactive";
import { Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";
import theme from "../../themes";
 
// possible types: first, last, email, password
const AuthFormInput = ({ action, value, type, autoCapitalize }) => {

  const autoCapitalizeValue = autoCapitalize ? "words" : "none";

  return (
    <TextInput
      mainColor="#ffffffb0"
      originalColor="#ffffff2a"
      textInputStyle={styles.textInput}
      placeholderTextColor={theme["Classic"].textMedium}
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
      autoCapitalize={autoCapitalizeValue}
    />
  );
};

export default AuthFormInput;


const styles = StyleSheet.create({
  textInput: {
    backgroundColor: theme["Classic"].faintPrimary,
    color: theme["Classic"].textHigh,
    flex: 1,
    fontSize: 15,
    borderWidth: 1.7,
  },
})