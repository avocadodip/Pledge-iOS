import {
  doc,
  setDoc,
  runTransaction,
  arrayUnion,
  increment,
} from "@firebase/firestore";
import { db } from "../database/firebase";
import { getTmrwDate, getTodayDate } from "./currentDate";

// Normal: Add a single todo to tmrw
export const addTodoItem = async (currentUserID, todo, date) => {
  const todosRef = doc(db, "users", currentUserID, "todos", date);

  return runTransaction(db, async (transaction) => {
    const todoDoc = await transaction.get(todosRef);

    if (!todoDoc.exists()) {
      // If the document does not exist, create it
      transaction.set(todosRef, {
        todos: [todo],
        totalTodos: 1,
        totalFine: 0,
      });
    } else {
      // If the document exists, update it
      transaction.update(todosRef, {
        todos: arrayUnion(todo),
        totalTodos: increment(1),
        totalFine: 0,
      });
    }
  })
    .then(() => {
      console.log("Todo added successfully");
    })
    .catch((error) => {
      console.error("Error adding Todo: ", error);
    });
};

// Onboarding: Function to add multiple todos (onboarding)
export const updateTodoListOnboarding = async (
  currentUserID,
  todos,
  startDay,
  dayStart,
  dayEnd
) => {
  if (startDay === "Today") {
    // Today doc (tmrw doc set by cloud function at end of day)
    await addTodoArray(
      currentUserID,
      todos,
      3,
      getTodayDate(),
      dayStart,
      dayEnd,
      true
    );
  }

  if (startDay === "Tmrw") {
    // Today doc
    await addTodoArray(
      currentUserID,
      [],
      0,
      getTodayDate(),
      dayStart,
      dayEnd,
      false,
      true
    );
    // Tmrw doc
    await addTodoArray(
      currentUserID,
      todos,
      3,
      getTmrwDate(),
      dayStart,
      dayEnd,
      true,
      false
    );
  }
};

// Function to add an array of todos
const addTodoArray = async (
  currentUserID,
  todos,
  totalTodos,
  date,
  dayStart,
  dayEnd,
  isActive,
  onboardStartTmrw // only if user chooses tmrw in onboarding
) => {
  const todosRef = doc(db, "users", currentUserID, "todos", date);

  return runTransaction(db, async (transaction) => {
    const todoDoc = await transaction.get(todosRef);

    if (!todoDoc.exists()) {
      // If the document does not exist, create it
      const newTodo = {
        todos,
        totalTodos: totalTodos,
        totalFine: 0,
        opensAt: dayStart,
        closesAt: dayEnd,
        isActive: isActive,
        isVacation: false,
      };

      // Lets Today page know to show "all set" message if user elects to start Tmrw in onboarding
      if (onboardStartTmrw) {
        newTodo.onboardStartTmrw = true;
      }

      transaction.set(todosRef, newTodo);
    }
  })
    .then(() => {
      console.log("Todos added successfully");
    })
    .catch((error) => {
      console.error("Error adding Todos: ", error);
    });
};
// Updates isOnboarded field to true; Used in gettstartedmodal when user locks in 3 tasks
export const updateUserIsOnboarded = async (currentUserID) => {
  const userRef = doc(db, "users", currentUserID);

  return setDoc(
    userRef,
    {
      isOnboarded: true,
    },
    { merge: true }
  )
    .then(() => {
      console.log("User isOnboarded updated successfully");
    })
    .catch((error) => {
      console.error("Error updating user isOnboarded: ", error);
    });
};
