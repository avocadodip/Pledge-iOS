import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useRef, useState } from "react";
import { Color } from "../GlobalStyles";
import Todo from "../components/Todo";
import { useBottomSheet } from "../hooks/BottomSheetContext";

const Today = () => {
  const todos = [
    {
      id: 1,
      title: "Learn to juggle",
      description: "Practice juggling with three oranges",
      amount: "3",
      tag: "Fitness",
    },
    // {
    //   id: 2,
    //   title: "Create a silly dance",
    //   description: "Choreograph a funny dance routine",
    //   amount: "$5",
    //   tag: "Entertainment",
    // },
    {
      id: 3,
      title: "Build a blanket fort",
      description: "Construct a cozy fort using blankets and pillows",
      amount: "2",
      tag: "Cozy",
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
            componentType="info"
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
        <Text style={styles.headerTitle}>Today</Text>
        <Text style={styles.headerSubtitle}>Ends @ 9:00 PM</Text>
      </View>
      <View style={styles.todoContainer}>{renderTodos()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: "red",
    width: "100%",
    height: "100%",
  },
  pageContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 20,
  },
  headerContainer: {
    marginTop: 10,
    width: "100%",
    flexDirection: "col",
  },
  headerTitle: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 5,
  },
  todoContainer: {
    marginTop: 20,
    gap: 22,
    width: "100%",
  },
});

export default Today;
