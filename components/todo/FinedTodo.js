import { Text, View } from "react-native";
import React from "react";
import { getTodoStyles } from "./TodoStyles";
import { useThemes } from "../../hooks/ThemesContext";

const FinedTodo = () => {
  const { theme } = useThemes();
  const styles = getTodoStyles(theme);
  
  return (
    <View style={styles.finedContainer}>
      <Text style={styles.finedText}>No task entered.</Text>
      {/* <Text style={styles.finedText}>-$1</Text> */}
    </View>
  );
};

export default FinedTodo;
