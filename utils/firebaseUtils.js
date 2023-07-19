import { doc, runTransaction, arrayUnion, increment } from "@firebase/firestore";
import { db } from "../database/firebase";

// todos comes in as either an item or the full array
export const updateTodoList = async (currentUserID, todos, date) => {
  const todosRef = doc(db, "users", currentUserID, "todos", date);

  return runTransaction(db, async (transaction) => {
    const todoDoc = await transaction.get(todosRef);

    if (!todoDoc.exists()) {
      // If the document does not exist, create it
      transaction.set(todosRef, {
        todos: Array.isArray(todos) ? todos : [todos],
        totalTodos: 1,
        totalFine: 0,
      });
    } else {
      // If the document exists, update it
      transaction.update(todosRef, {
        todos: Array.isArray(todos) ? arrayUnion(...todos) : arrayUnion(todos),
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

