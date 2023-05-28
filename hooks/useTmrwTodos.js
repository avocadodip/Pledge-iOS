import { useState, useEffect } from "react";
import { db } from "../database/firebase";
import {
  query,
  collection,
  getDocs,
  where,
} from "firebase/firestore";
import { getTodayDateTime, lastDayEnd, lastDayStart, withinTimeWindow } from "../utils/currentDate";
import Globals from "../Globals";
import { useBottomSheet } from "./BottomSheetContext";

export const useTmrwTodos = (isDay, dayStart, dayEnd) => {
  const [todos, setTodos] = useState([{},{},{}]);
  const { tmrwTodos, setTmrwTodos } = useBottomSheet();
  const [headerMessage, setHeaderMessage] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      let fetchedTodos = [{}, {}, {}];
      const todoRef = collection(db, "users", Globals.currentUserID, "todos");
      let todoQuery;

      try {
        // if in time window, locked todos = anything created from dayStart to now
        if (withinTimeWindow(dayStart, dayEnd)) {
          todoQuery = query(
            todoRef,
            where("createdAt", ">=", lastDayStart(dayStart)),
            where("createdAt", "<", getTodayDateTime())
          );
          // if not in time window, locked todos should be anything created from lastDayStart to lastDayEnd
        } else {
          todoQuery = query(
            todoRef,
            where("createdAt", ">=", lastDayStart(dayStart)),
            where("createdAt", "<", lastDayEnd(dayEnd))
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

      // SET HEADER MESSAGE
      if (withinTimeWindow(dayStart, dayEnd)) {
        setHeaderMessage("Locks @ " + dayEnd + " PM");
      } else {
        setHeaderMessage("Opens @ " + dayStart + " AM");
      }
    };


    fetchTodos();
  }, [isDay]);

  return {todos, headerMessage};
};
