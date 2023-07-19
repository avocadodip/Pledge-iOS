import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useThemes } from "../../hooks/ThemesContext";
import { getTmrwAbbrevDOW, getTodayAbbrevDOW } from "../../utils/currentDate";

const PLACEHOLDER_EXAMPLES = [
  "Write a chapter",
  "Do 20 minutes of yoga",
  "Apply to scholarship",
];

const TaskInput = ({ startDay, endTime, todos, setTodos }) => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  const [DOWAbbrev, setDOWAbbrev] = useState("");

  // Set DOW Abbreviation based on start day
  useEffect(() => {
    if (startDay === "Today") {
      setDOWAbbrev(getTodayAbbrevDOW());
    } else if (startDay === "Tmrw") {
      setDOWAbbrev(getTmrwAbbrevDOW());
    }
  }, [startDay]);

  const handleTodoChange = (text, index, type) => {
    const newTodos = [...todos];
    newTodos[index][type] = text;
    setTodos(newTodos);
  };

  const renderTodos = () => {
    return todos.map((todo, index) => (
      <View key={index} style={styles.todoContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.todoNumber}>{index + 1}</Text>
          <TextInput
            autoCorrect={false}
            style={styles.titleInput}
            placeholder={PLACEHOLDER_EXAMPLES[index]}
            placeholderTextColor="rgba(243, 243, 243, 0.5)"
            maxLength={40}
            onChangeText={(text) => handleTodoChange(text, index, "title")}
            value={todos[index].title}
          />
          <TextInput
            autoCorrect={false}
            style={styles.amountInput} // Create a new style for this
            placeholder="Amount"
            placeholderTextColor="rgba(243, 243, 243, 0.5)"
            maxLength={40}
            onChangeText={(text) => handleTodoChange(text, index, "amount")}
            value={todos[index].amount}
          />
        </View>
      </View>
    ));
  };

  return (
    <View>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>{startDay}</Text>
        <Text style={styles.headerDayOfWeek}>{DOWAbbrev}</Text>
      </View>
      <Text style={styles.headerSubtitle}>Due @ {endTime}</Text>
      <View style={styles.todoContainer}>{renderTodos()}</View>
    </View>
  );
};

export default TaskInput;

const getStyles = (theme) =>
  StyleSheet.create({
    todoContainer: {
      marginTop: 40,
      gap: 22,
      width: "100%",
    },
    headerTitleContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 15,
    },
    headerTitle: {
      color: theme.textHigh,
      fontSize: 42,
      fontWeight: "bold",
    },
    headerDayOfWeek: {
      color: theme.textMedium,
      fontSize: 23,
      fontWeight: "bold",
      paddingBottom: 6,
    },
    headerSubtitle: {
      color: theme.textHigh,
      fontSize: 25,
      fontWeight: "bold",
      marginTop: 5,
    },

    // todo styles
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
      fontWeight: "600",
    },
    titleInput: {
      color: theme.textHigh,
      fontSize: 24,
      // fontWeight:" 600",
    },
  });
