/* eslint-disable */
function calculateIncompleteFines(todos) {
  let todayIncompleteFine = 0;
  const todayFinedTasks = [];

  // Find todos that are not complete and increment the fine
  todos.forEach((todo) => {
    if (todo.isComplete === false && todo.amount > 0) {
      todayIncompleteFine += parseInt(todo.amount);
      todayFinedTasks.push(todo);
    }
  }); 

  return {
    todayIncompleteFine,
    todayFinedTasks,
  };
}

function calculateNoInputFines(todos, missedTaskFine) {
  let tmrwNoInputCount = 0;
  let tmrwNoInputFine = 0;

  // Find todos that are not locked and increment the fine
  todos.forEach((todo) => {
    if (todo.isLocked === false && missedTaskFine > 0) {
      tmrwNoInputCount += 1;
      tmrwNoInputFine += missedTaskFine; // +1
    }
  });

  return {
    tmrwNoInputCount,
    tmrwNoInputFine,
  };
}

module.exports = {
  calculateIncompleteFines,
  calculateNoInputFines,
};
