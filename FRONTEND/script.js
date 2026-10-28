
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");


let tasks = [];

try {
  const savedTasks = localStorage.getItem("studentStudyTasks");

  if (savedTasks) {
    const parsedTasks = JSON.parse(savedTasks);

    if (Array.isArray(parsedTasks)) {
      tasks = parsedTasks.filter(task =>
        task &&
        typeof task.id === "number" &&
        typeof task.text === "string" &&
        typeof task.done === "boolean"
      );
    }
  }
} catch (error) {
  console.error("Could not load saved tasks:", error);
}



try {
  const savedTasks = localStorage.getItem("studentStudyTasks");

  if (savedTasks) {
    const parsedTasks = JSON.parse(savedTasks);

    if (Array.isArray(parsedTasks)) {
      tasks = parsedTasks.filter(task =>
        task &&
        typeof task.id === "number" &&
        typeof task.text === "string" &&
        typeof task.done === "boolean"
      );
    }
  }
} catch (error) {
  console.error("Could not load saved tasks:", error);
}


function updateTaskCount() {
  const completed = tasks.filter(task => task.done).length;
  const total = tasks.length;

  taskCount.textContent = `Completed: ${completed} / ${total}`;

  const percentage = total === 0
    ? 0
    : Math.round((completed / total) * 100);

  document.getElementById("progress-fill").style.width =
    percentage + "%";

  document.getElementById("progress-text").textContent =
    percentage + "% completed";
}


function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    if (task.done) {
      li.classList.add("done");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "Mark task complete");

    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      renderTasks();
    });

    const span = document.createElement("span");
    span.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-task";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      renderTasks();
    });

    li.append(checkbox, span, deleteButton);
    taskList.appendChild(li);
  });

  updateTaskCount();
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (text === "") {
    return;
  }

  tasks.push({
    id: Date.now() + Math.random(),
    text: text,
    done: false
  });

  taskInput.value = "";
  renderTasks();
  taskInput.focus();
});

const focusMinutes = document.getElementById("focus-minutes");
const timerDisplay = document.getElementById("timer-display");
const timerMessage = document.getElementById("timer-message");

const startButton = document.getElementById("timer-start");
const pauseButton = document.getElementById("timer-pause");
const resetButton = document.getElementById("timer-reset");

let remainingSeconds = 25 * 60;
let timerInterval = null;
let endTime = null;

function displayTime() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  timerDisplay.textContent =
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0");
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  endTime = null;
}

function updateTimer() {
  remainingSeconds = Math.max(
    0,
    Math.ceil((endTime - Date.now()) / 1000)
  );

  displayTime();

  if (remainingSeconds === 0) {
    stopTimer();
    timerMessage.textContent = "Session complete! Great work! 🎉";
  }
}

startButton.addEventListener("click", () => {
  if (timerInterval !== null) return;

  if (remainingSeconds <= 0) {
    timerMessage.textContent = "Press Reset to start a new session.";
    return;
  }

  endTime = Date.now() + remainingSeconds * 1000;
  timerMessage.textContent = "Stay focused. You've got this! 💜";

  timerInterval = setInterval(updateTimer, 250);
});

pauseButton.addEventListener("click", () => {
  if (timerInterval !== null) {
    updateTimer();
    stopTimer();

    if (remainingSeconds > 0) {
      timerMessage.textContent = "Timer paused.";
    }
  }
});

resetButton.addEventListener("click", () => {
  stopTimer();

  const minutes = Number(focusMinutes.value);

  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
    focusMinutes.value = "25";
    remainingSeconds = 25 * 60;
    timerMessage.textContent = "Choose 1–180 minutes.";
  } else {
    remainingSeconds = minutes * 60;
    timerMessage.textContent = "Ready for a new session!";
  }

  displayTime();
});

focusMinutes.addEventListener("change", () => {
  if (timerInterval === null) {
    resetButton.click();
  }
});

displayTime();

function saveTasks() {
  try {
    localStorage.setItem("studentStudyTasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
    alert("Tasks could not be saved. Please check your browser storage.");
  }
  saveTasks();
  renderTasks();
}
