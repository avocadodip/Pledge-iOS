import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";
import { Color } from "../GlobalStyles";
import Todo from "../components/Todo";
import { useBottomSheet } from "../hooks/BottomSheetContext";
import { useSettings } from "../hooks/SettingsContext";
import OnboardingPopup from "../components/OnboardingPopup";
import { db } from "../database/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Globals from "../Globals";
import { getTodayDateTime, lastDayEnd, lastDayStart, withinTimeWindow } from "../utils/currentDate";

const Tomorrow = () => {
  const [ headerMessage, setHeaderMessage ] = useState("");
  const { todos, setTodos } = useBottomSheet();
  const { settings } = useSettings();

  useEffect(() => {
    // 1. FETCH AND SET TODOS
    const fetchTodos = async () => {
      let fetchedTodos = [{}, {}, {}];
      const todoRef = collection(db, 'users', Globals.currentUserID, 'todos');
      let todoQuery;
      
      try {
        // if in time window, locked todos = anything created from dayStart to now
        if (withinTimeWindow(settings.dayStart, settings.dayEnd)) {
          todoQuery = query(
            todoRef,
            where('createdAt', '>=', lastDayStart(settings.dayStart)),
            where('createdAt', '<', getTodayDateTime())
          );
          // if not in time window, locked todos should be anything created from lastDayStart to lastDayEnd
        } else {
          todoQuery = query(
            todoRef,
            where('createdAt', '>=', lastDayStart(settings.dayStart)),
            where('createdAt', '<', lastDayEnd(settings.dayEnd))
          );
        }
        const querySnapshot = await getDocs(todoQuery);

        querySnapshot.docs.forEach((doc) => {
          const todoData = doc.data();
          fetchedTodos[todoData.todoNumber - 1] = todoData;
        });
      } catch (error) {
        console.error("Error fetching todos: ", error);
      }
  
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
  
      setTodos(fetchedTodos);

      // 2. SET HEADER MESSAGE
			if (withinTimeWindow(settings.dayStart, settings.dayEnd)) {
				setHeaderMessage('Locks @ ' + settings.dayEnd + ' PM');
			} else {
				setHeaderMessage('Opens @ ' + settings.dayStart + ' AM');
			}
    };
  
    fetchTodos();
  }, []);
  
  const renderTodos = () => {
    return todos.map((todo, index) => {
      if (todo.title !== "") {
        return (
          <Todo
            key={index + 1}
            todoNumber={index + 1}
            title={todo.title}
            description={todo.description}
            amount={todo.amount.toString()}
            tag={todo.tag}
            componentType="info"
            isLocked={todo.isLocked || todo.isTodoLocked}
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
        <Text style={styles.headerSubtitle}>{headerMessage}</Text>
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
