import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";
import { Color } from "../GlobalStyles";
import Todo from "../components/Todo";
import { useBottomSheet } from "../hooks/BottomSheetContext";

const Tomorrow = () => {
  const { todos, setTodos } = useBottomSheet();

  useEffect(() => {
    const initialTodos = [
      {
        todoNumber: 1,
        title: "Learn to juggle",
        description: "Practice juggling with three oranges",
        amount: "3",
        tag: "Fitness",
        isLocked: true,
      },
      {
        todoNumber: 2,
        title: "",
        description: "",
        amount: "",
        tag: "",
        isLocked: false,
      },
      {
        todoNumber: 3,
        title: "",
        description: "",
        amount: "",
        tag: "",
        isLocked: false,
      },
    ];

    setTodos(initialTodos);
  }, [setTodos]); // Passing setTodos here to silence React warning about missing dependency in useEffect

  const renderTodos = () => {
    const result = [];

    for (let i = 0; i < 3; i++) {
      const todo = todos.find((item) => item.todoNumber === i + 1);
      if (
        todo &&
        (todo.title !== "" ||
          todo.description !== "" ||
          todo.amount !== "" ||
          todo.tag !== "")
      ) {
        result.push(
          <Todo
            key={i + 1}
            todoNumber={i + 1}
            title={todo.title}
            description={todo.description}
            amount={todo.amount}
            tag={todo.tag}
            componentType="info"
            isLocked={todo.isLocked}
          />
        );
      } else {
        result.push(
          <Todo
            key={i + 1}
            todoNumber={i + 1}
            componentType="number"
            title={""}
            description={""}
            amount={""}
            tag={""}
            isLocked={false}
          />
        );
      }
    }

    return result;
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Tmrw</Text>
        <Text style={styles.headerSubtitle}>Locks @ 9:00 PM</Text>
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

export default Tomorrow;
