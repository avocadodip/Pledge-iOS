import { Text, View } from "react-native";
import React from "react";
import { getTodoStyles } from "./TodoStyles";
import { useThemes } from "../../hooks/ThemesContext";

const FinedTodo = ({ isFined }) => {
  const { theme } = useThemes();
  const styles = getTodoStyles(theme);

  return (
    <View style={styles.finedContainer}>
      {isFined ? (
        <Text style={styles.finedText}>No task entered. -$1</Text>
      ) : (
        <Text style={styles.finedText}>No task entered.</Text>
      )}
    </View>
  );
};

export default FinedTodo;
