import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { Color } from "../GlobalStyles";
import Todo from "../components/todo/Todo";
import OnboardingPopup from "../components/OnboardingPopup";
import { useBottomSheet } from "../hooks/BottomSheetContext";
import { useSettings } from "../hooks/SettingsContext";
import {
  currentOrNextDayStart,
  nextDayEnd,
  withinTimeWindow,
} from "../utils/currentDate";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../database/firebase";

const Today = () => {
  const [headerMessage, setHeaderMessage] = useState("");
  const { todayTodos, setTodayTodos } = useBottomSheet();
  const { settings } = useSettings();

  useEffect(() => {
    // 1. FETCH AND SET TODOS
    const fetchTodos = async () => {
      let fetchedTodos = [{}, {}, {}];
      const todoRef = collection(db, "users", settings.currentUserID, "todos");
      let todoQuery;

      try {
        if (withinTimeWindow(settings.dayStart, settings.dayEnd)) {
          todoQuery = query(
            todoRef,
            where(
              "opensAt",
              ">=",
              currentOrNextDayStart(settings.dayStart, settings.dayEnd)
            ),
            where("opensAt", "<", nextDayEnd(settings.dayEnd))
          );

          onSnapshot(todoQuery, (snapshot) => {
            snapshot.forEach((doc) => {
              const todoData = doc.data();
              todoData.id = doc.id;
              fetchedTodos[todoData.todoNumber - 1] = todoData;
              console.log('0'); 
              console.log(fetchedTodos);
            });
          });
        }
      } catch (error) {
        console.error("Error fetching todos: ", error);
      }

      console.log('1');
      console.log(fetchedTodos);

      // Fill in non-inputted todos with empty data
      for (let i = 0; i < 3; i++) {
        if (Object.keys(fetchedTodos[i]).length === 0) {
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
      console.log(fetchedTodos);
      setTodayTodos(fetchedTodos);

      // 2. SET HEADER MESSAGE
      if (withinTimeWindow(settings.dayStart, settings.dayEnd)) {
        setHeaderMessage("Ends @ " + settings.dayEnd + " PM");
      } else {
        setHeaderMessage("Opens @ " + settings.dayStart + " AM");
      }
    };

    // 3. SET SCREENTYPE BASED ON VACATION MODE

    fetchTodos();
  }, []);

  const renderTodos = () => {
    return todayTodos.map((todo, index) => {
      if (todo.title !== "") {
        return (
          <Todo
            key={todo.id}
            todoNumber={index + 1}
            title={todo.title}
            description={todo.description}
            amount={todo.amount.toString()}
            tag={todo.tag}
            componentType="info"
            isLocked={null}
          />
        );
      } else {
        return (
          <Todo
            key={index + 1}
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
    });
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      {/* <OnboardingPopup
        texts={['This is the Today page.', 'Your three tasks planned the night before will show up here.','Your only mission is to check them off before the day ends!']}
        buttonTitle="Cool, what's next?"
      /> */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Today</Text>
        <Text style={styles.headerSubtitle}>{headerMessage}</Text>
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
