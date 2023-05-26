import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color } from "../GlobalStyles";
import Todo from "../components/Todo";
import { useBottomSheet } from "../hooks/BottomSheetContext";
import { useSettings } from "../hooks/SettingsContext";
import OnboardingPopup from "../components/OnboardingPopup";
import { db } from "../database/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Globals from "../Globals";
import {
  getTodayDateTime,
  lastDayEnd,
  lastDayStart,
  withinTimeWindow,
} from "../utils/currentDate";

import { ThemeContext } from "../hooks/ThemeContext";
import { classicTheme, darkTheme, lightTheme } from "../Themes";
import React, { useContext, useRef, useEffect, useState } from "react";

const Tomorrow = () => {
  const { chosenTheme, setChosenTheme } = useContext(ThemeContext);

  const getStyles = () => {
    return StyleSheet.create({
      bottomSheet: {
        backgroundColor: chosenTheme.accent,
        width: "100%",
        height: "100%",
      },
      pageContainer: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: chosenTheme.accent,
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

  // Day Start
  let zaa = "10:00";
  // Day End
  let zbb = "2:00";

  const [headerMessage, setHeaderMessage] = useState("");
  const { tmrwTodos, setTmrwTodos } = useBottomSheet();
  const { settings } = useSettings();

  // Realtime state of whether its day or not
  const [isDay, setIsDay] = useState(withinTimeWindow(zaa, zbb));

  // Start a timer that updates whether its day every second
  useEffect(() => {
    const timerId = setInterval(() => {
      setIsDay(withinTimeWindow(zaa, zbb));
    }, 1000);

    // Clear interval when the component is unmounted or before the next effect runs
    return () => clearInterval(timerId);
  }, []);

  // Fetches todos for current time window and re-fetches whenever isDay changes
  useEffect(() => {
    // 1. FETCH AND SET TODOS
    const fetchTodos = async () => {
      let fetchedTodos = [{}, {}, {}];
      const todoRef = collection(db, "users", Globals.currentUserID, "todos");
      let todoQuery;

      try {
        // if in time window, locked todos = anything created from dayStart to now
        if (withinTimeWindow(zaa, zbb)) {
          todoQuery = query(
            todoRef,
            where("createdAt", ">=", lastDayStart(zaa)),
            where("createdAt", "<", getTodayDateTime())
          );
          // if not in time window, locked todos should be anything created from lastDayStart to lastDayEnd
        } else {
          todoQuery = query(
            todoRef,
            where("createdAt", ">=", lastDayStart(zaa)),
            where("createdAt", "<", lastDayEnd(zbb))
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

      // Set state
      setTmrwTodos(fetchedTodos);
      console.log(tmrwTodos);

      // 2. SET HEADER MESSAGE
      if (withinTimeWindow(zaa, zbb)) {
        setHeaderMessage("Locks @ " + zbb + " PM");
      } else {
        setHeaderMessage("Opens @ " + zaa + " AM");
      }
    };

    fetchTodos();
  }, [isDay]); // This effect runs whenever isDay changes

  const renderTodos = () => {
    return tmrwTodos.map((todo, index) => {
      if (todo.title !== "") {
        // Locked todo
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
      } else if (isDay) {
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
      } else if (!isDay) {
        return (
          <Todo
            key={index + 1}
            todoNumber=""
            title=""
            description=""
            amount=""
            tag=""
            componentType="fined"
            isLocked={null}
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

export default Tomorrow;
