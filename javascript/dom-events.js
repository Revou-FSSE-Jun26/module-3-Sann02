// ============================================================
// JS Exercise 1 — DOM manipulation & event handling
// Demonstrates: selecting elements, updating them, toggling
// classes, creating & removing elements, and attaching event
// handlers (click). Pure vanilla JavaScript, no frameworks.
// ============================================================

// ---- 1. SELECT & UPDATE an element on click ----
let clickCount = 0; // number variable holding state
const counterText = document.querySelector("#counter-text");
const incrementBtn = document.querySelector("#increment-btn");

incrementBtn.addEventListener("click", () => {
  clickCount += 1;
  // Update the DOM element's text content
  counterText.textContent = `You clicked ${clickCount} time${
    clickCount === 1 ? "" : "s"
  }.`;
});

// ---- 2. TOGGLE a class ----
const toggleBox = document.querySelector("#toggle-box");
const toggleBtn = document.querySelector("#toggle-btn");

toggleBtn.addEventListener("click", () => {
  // classList.toggle adds the class if absent, removes it if present
  const isOn = toggleBox.classList.toggle("highlight");
  toggleBtn.textContent = isOn ? "Remove highlight" : "Toggle highlight";
});

// ---- 3. CREATE & REMOVE elements ----
const taskInput = document.querySelector("#task-input");
const addBtn = document.querySelector("#add-btn");
const taskList = document.querySelector("#task-list");

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return; // guard against empty input

  // Create a new list item
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = text;

  // Create a remove button for this task
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => {
    // Remove this element from the DOM
    li.remove();
  });

  li.appendChild(span);
  li.appendChild(removeBtn);
  taskList.appendChild(li);

  taskInput.value = "";
  taskInput.focus();
}

// Attach handlers: click the button OR press Enter in the input
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTask();
});
