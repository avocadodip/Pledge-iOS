import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Todo from "../todo/Todo";

const TaskInput = () => {
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
      title:
        "Build a blanket fort Build a blanket fortBuild a blanket fortBuild a blanket fortBuild a blanket fortBuild a blanket fortBuild a blanket fort",
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
            isLocked={false}
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
    <View>
      <Text>Today. Due at 9pm</Text>
      <View style={styles.todoContainer}>{renderTodos()}</View>
    </View>
  );
};

export default TaskInput;

const styles = StyleSheet.create({
  todoContainer: {
    marginTop: 20,
    gap: 22,
    width: "100%",
  },
});
