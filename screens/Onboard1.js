import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Color } from "../GlobalStyles";
import Todo from "../components/todo/Todo";

const Today = () => {
  const todos = [
    {
      id: 1,
      title: "Learn to juggle",
    },
    {
      id: 2,
      title: "Create a silly dance",
    },
    {
      id: 3,
      title: "Build a blanket fort Build a blanket fortBuild a blanket fortBuild a blanket fortBuild a blanket fortBuild a blanket fortBuild a blanket fort",
    },
  ];

  const renderTodos = () => {
    // Prepare the todos array
    const preparedTodos = Array(3).fill(null);
    todos.forEach((todo) => {
      preparedTodos[todo.id - 1] = todo; // assuming IDs start from 1
    });

    const result = [];
    // Iterate over the preparedTodos array and render Todo or EmptyTodo
    for (let i = 0; i < 3; i++) {
      if (preparedTodos[i]) {
        const todo = preparedTodos[i];
        result.push(
          <Todo
            key={todo.id}
            todoNumber={i + 1}
            title={todo.title}
            description={todo.description}
            amount={todo.amount}
            tag={todo.tag}
            componentType="onboard"
            isLocked={null}
          />
        );
      } else {
        result.push(
          <Todo
            key={i + 1}
            todoNumber={""}
            title={""}
            description={""}
            amount={""}
            tag={""}
            componentType="fined"
            isLocked={null}
          />
        ); // keys now start from 1
      }
    }

    return result;
  };
  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Welcome to Fervo!</Text>
        <Text style={styles.descTitle}>We'll take you on a quick walkthrough of the platform.</Text>
        <Text style={styles.descTitle}>But first, what are some huge, spectacular dreams you want to achieve? Think big, anything is possible!</Text>
      </View>
      <View style={styles.todoContainer}>{renderTodos()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 20,
  },
  headerContainer: {
    paddingTop: 20,
    paddingLeft: 20,
    width: "100%",
    flexDirection: "col",
    marginBottom: 20,
    gap: 20,
    // borderWidth: 1,
    // borderColor: 'black',
  },
  headerTitle: {
    color: Color.white,
    fontSize: 30,
    fontWeight: "bold",
  },
  descTitle: {
    color: Color.white,
    fontSize: 26,
    lineHeight: 44,
  },
  todoContainer: {
    marginTop: 20,
    gap: 22,
    width: "100%",
  },
});

export default Today;
