import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { Color } from "../GlobalStyles";
import Todo from "../components/Todo";
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
import Globals from "../Globals";

import { ThemeContext } from "../ThemeContext";
import { classicTheme, darkTheme, lightTheme } from "../Themes";
import React, { useContext, useEffect, useState } from "react";

const Today = () => {
  const { chosenTheme, setChosenTheme } = useContext(ThemeContext);

  const getStyles = () => {
    return StyleSheet.create({
      pageContainer: {
        backgroundColor: chosenTheme.accent,
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 20,
      },
      headerContainer: {
        marginTop: 10,
        width: "100%",
        flexDirection: "col",
      },
      headerTitle: {
        color: chosenTheme.primary,
        fontSize: 50,
        fontWeight: "bold",
      },
      headerSubtitle: {
        color: chosenTheme.primary,
        fontSize: 25,
        fontWeight: "bold",
        marginTop: 5,
      },
      todoContainer: {
        marginTop: 20,
        gap: 22,
        width: "100%",
      },
    })
  };

  const styles = getStyles();  

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
  const [headerMessage, setHeaderMessage] = useState("");
  const { todayTodos, setTodayTodos } = useBottomSheet();
  const { settings } = useSettings();

  useEffect(() => {
    // 1. FETCH AND SET TODOS
    const fetchTodos = async () => {
      let fetchedTodos = [{}, {}, {}];
      const todoRef = collection(db, "users", Globals.currentUserID, "todos");
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

export default Today;
