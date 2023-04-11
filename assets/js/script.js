const inputBox = document.getElementById("input-box");
const tasksList = document.getElementById("list-container");
const addButton = document.getElementsByTagName("button");
const notCompletedTaskCounter = document.getElementById("not-completed-tasks");
const allTasks = document.getElementById("all-tasks");
const uncompletedTasks = document.getElementById("uncompleted-tasks");
const completedTasks = document.getElementById("completed-tasks");

//function to save all task in local storage of browser
function saveTaskLocally(task) {
  allTodos = JSON.parse(localStorage.getItem("todos"));
  if (allTodos == null) {
    allTodos = [];
  }
  allTodos.push(task);
  localStorage.setItem("todos", JSON.stringify(allTodos));

  renderList();
}

// filter the tasks and store that tasks in array to pass on to filterTasksRender function
function filterTasks(value) {
  let todos = JSON.parse(localStorage.getItem("todos"));
  if (todos == null) {
    showNotification("Kindly,First add a task in todo list!");
    return;
  } else if (value == allTasks.innerText) {
    renderList();
    return;
  } else if (value == uncompletedTasks.innerText) {
    let leftTask = [];

    for (let i = 0; i < todos.length; i++) {
      if (todos[i].completed == false) {
        leftTask.push(todos[i]);
      }
    }
    filterTasksRender(leftTask, value);
    return;
  } else if (value == completedTasks.innerText) {
    let doneTask = [];

    for (let i = 0; i < todos.length; i++) {
      if (todos[i].completed == true) {
        doneTask.push(todos[i]);
      }
    }
    filterTasksRender(doneTask);
    return;
  }
}
// Renders the filtered task on todo list
function filterTasksRender(filterTasksArray) {
  tasksList.innerHTML = "";
  if (filterTasksArray.length == 0) {
    tasksList.innerHTML = "";
  } else {
    for (let i = 0; i < filterTasksArray.length; i++) {
      addTaskToDOM(filterTasksArray[i]);
    }
    return;
  }
}
// function for add all task as list element in HTML
function addTaskToDOM(task) {
  let list = document.createElement("li");
  list.innerText = task.title;
  list.classList.add(`${task.completed ? "checked" : "unchecked"}`);
  list.setAttribute("id", `${task.id}`);
  tasksList.appendChild(list);
  tasksList.set;
  let span = document.createElement("span");
  span.innerHTML = `<i id="delete" class="fa-sharp fa-solid fa-xmark" data-id="${task.id}"></i>`;
  span.classList.add("delete");
  span.setAttribute("data-id", `${task.id}`);
  list.appendChild(span);
}
// Renders the all tasks on todo-list web application
function renderList() {
  tasksList.innerHTML = "";
  let todos = [];

  let notCompleted = 0;
  if (JSON.parse(localStorage.getItem("todos")) != null) {
    todos = JSON.parse(localStorage.getItem("todos"));
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].completed == false) {
        notCompleted++;
      }
      addTaskToDOM(todos[i]);
    }
  }
  notCompletedTaskCounter.innerHTML = notCompleted;
  renderColour();

  return;
}

// Highlight the All filter value when first time todolist load on browser
function renderColour() {
  let span = document.querySelectorAll("span");

  let filterSpan = document.querySelectorAll("span.filter");

  filterSpan[0].classList.add("dark-color");
  filterSpan[0].classList.remove("grey-color");
  filterSpan[1].classList.add("grey-color");
  filterSpan[2].classList.add("grey-color");
  return;
}

// function for delete the tasks from todo list
function deleteTask(taskId) {
  let tasks = JSON.parse(localStorage.getItem("todos"));
  let newTasks = tasks.filter(function (task) {
    return task.id != taskId;
  });

  localStorage.setItem("todos", JSON.stringify(newTasks));
  renderList();
}

// function for toggle the value of completed property of object (task) - either true or false
function toggleTask(taskId) {
  let totalTasks = JSON.parse(localStorage.getItem("todos"));

  for (let i = 0; i < totalTasks.length; i++) {
    if (totalTasks[i].id == taskId) {
      totalTasks[i].completed = !totalTasks[i].completed;
      break;
    }
  }
  localStorage.setItem("todos", JSON.stringify(totalTasks));
  renderList();
}

function showNotification(text) {
  alert(text);
}

// function for add task to the todolist and call function aveTaskLocally store tasks in local storage of browser
function addTask(task) {
  if (task) {
    addTaskToDOM(task);
    saveTaskLocally(task);
    return;
  }

  showNotification("Task cannot be added!");
  return;
}

function handleAddTaskButtonClick(task) {
  if (task.title.length == 0) {
    showNotification("Task title cannot be empty!");
    return;
  }
  addTask(task);
}

//function to handle all type of click event
function handleClickListener(event) {
  const target = event.target;

  if (target.className == "delete" || target.id == "delete") {
    const taskId = target.dataset.id;
    deleteTask(taskId);
    return;
  } else if (target.className == "unchecked" || target.className == "checked") {
    const taskId = target.id;
    toggleTask(taskId);
    return;
  }

  // condition for all filters in todo list
  else if (target.classList[0] == "filter") {
    const value = event.target.innerText;

    // hightlight the selected filter value
    let span = document.querySelectorAll("span");

    let filterSpan = document.querySelectorAll("span.filter");

    for (ele of filterSpan) {
      if (ele.innerText == value) {
        if (event.target.classList.contains("grey-color")) {
          event.target.classList.remove("grey-color");
          event.target.classList.add("dark-color");
        }
      } else {
        ele.classList.add("grey-color");
      }
    }

    filterTasks(value);
    return;
  }
  // for add button action - add new task in todo list
  else if (target.className == "add-btn") {
    let title = event.target.value;

    if (title.length == 0) {
      showNotification("Task title cannot be empty!");
      return;
    }
    let task = {
      title: title,
      id: Date.now().toString(),
      completed: false,
    };

    inputBox.value = "";
    handleAddTaskButtonClick(task);
  }
}

// handle Enter key press in Add your task field
function handleInputKeypress(event) {
  if (event.key === "Enter") {
    let title = event.target.value;

    if (title.length == 0) {
      showNotification("Task title cannot be empty!");
      return;
    }

    let task = {
      title: title,
      id: Date.now().toString(),
      completed: false,
    };

    event.target.value = "";
    addTask(task);
  }
}

// initilaize function when todolist load on browser
function initializeApp() {
  renderList();
  // using event delegation for all click events
  document.addEventListener("click", handleClickListener);

  // set keyup event listener for input field of tasks
  inputBox.addEventListener("keyup", handleInputKeypress);
}
//once script load automatically call initializeApp function
initializeApp();
