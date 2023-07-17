import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useThemes } from "../../hooks/ThemesContext";

const OnboardTodo = ({ title, amount, todoNumber, isTodoLocked }) => {
  const { theme } = useThemes();
  const styles = getStyles(theme);

  return (
    <View style={styles.todoContainer}>
      <View style={styles.leftContainer}>
        <Text style={styles.todoNumber}>{todoNumber}</Text>
        <TextInput
          autoCorrect={false}
          style={styles.titleText}
          placeholder={"Write a screenplay"}
          placeholderTextColor="rgba(243, 243, 243, 0.5)"
          maxLength={40}
          // borderWidth={1}
          // borderColor={"black"}
        />
      </View>
    </View>
  );
};
export default OnboardTodo;

const getStyles = (theme) =>
  StyleSheet.create({
    todoContainer: {
      height: 50,
    },
    leftContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
    },
    todoNumber: {
      color: theme.textHigh,
      fontSize: 28,
      fontWeight: 700,
    },
    titleText: {
      color: theme.textHigh,
      fontSize: 24,
      fontWeight: 700,
    },
  });
