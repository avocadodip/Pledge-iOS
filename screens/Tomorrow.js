import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";
import { Color } from "../GlobalStyles";
import Todo from "../components/Todo";
import { useBottomSheet } from "../hooks/BottomSheetContext";
import OnboardingPopup from "../components/OnboardingPopup";
import { db } from "../database/firebase";
import { query, collection, getDocs } from "firebase/firestore";

const Tomorrow = () => {
  const { todos, setTodos } = useBottomSheet();

  useEffect(() => {
    // An async function to fetch the data
    const fetchTodos = async () => {
      let fetchedTodos = [];

      // Fetch locked todos from Firestore
      const todosQuery = query(collection(db, "todos"));
      const snapshot = await getDocs(todosQuery);

      snapshot.docs.forEach((doc) => {
        const todoData = doc.data();
        fetchedTodos[todoData.todoNumber - 1] = todoData;
      });

      // Fill in non-inputted todos with empty data
      for (let i = 0; i < 3; i++) {
        if (!fetchedTodos[i]) {
          fetchedTodos[i] = {
            todoNumber: i + 1,
            title: "",
            description: "",
            amount: "",
            tag: "",
            isLocked: false,
          };
        }
      }

      setTodos(fetchedTodos);
    };

    fetchTodos();
  }, []);

  const renderTodos = () => {
    return todos.map((todo, index) => {
      if (
        todo.title !== "" ||
        todo.description !== "" ||
        todo.amount !== "" ||
        todo.tag !== ""
      ) {
        return (
          <Todo
            key={index + 1}
            todoNumber={index + 1}
            title={todo.title}
            description={todo.description}
            amount={todo.amount}
            tag={todo.tag}
            componentType="info"
            isLocked={todo.isLocked}
          />
        );
      } else {
        return (
          <Todo
            key={index + 1}
            todoNumber={index + 1}
            componentType="number"
            title=""
            description=""
            amount=""
            tag=""
            isLocked={false}
          />
        );
      }
    });
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      {/* <OnboardingPopup
        texts={['This is the Tomorrow page.', 'Plug in your 3 tasks to be completed tomorrow and how much you will be fined if you fail them.','Be careful! If you forget to input 3 tasks each day, you’ll be fined!','Give this a go, now! We’ve added your dreams as tags to get you started.']}
        buttonTitle="Will do!"
      /> */}
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
