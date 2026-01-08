const input = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filterBtn');
const clearAllBtn = document.getElementById('clearAll');
const emptyState = document.getElementById('emptyState');

// Data Structure: Array of objects { id, text, completed }
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function updateFilterButtons() {
  filterBtns.forEach(btn => {
    if (btn.dataset.filter === currentFilter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function renderTodos() {
  todoList.innerHTML = '';

  const filtered = todos.filter(todo => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'completed') return todo.completed;
    if (currentFilter === 'pending') return !todo.completed;
  });

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    // Create inner HTML structure safely
    const checkIcon = todo.completed ? '<i class="fa-solid fa-check"></i>' : '';

    li.innerHTML = `
      <div class="todo-content" onclick="toggleTodo(${todo.id})">
        <div class="check-btn">
          ${checkIcon}
        </div>
        <span class="todo-text">${escapeHtml(todo.text)}</span>
      </div>
      <button class="delete-btn" onclick="deleteTodo(${todo.id})">
        <i class="fa-regular fa-trash-can"></i>
      </button>
    `;

    todoList.appendChild(li);
  });

  updateFilterButtons();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function addTodo() {
  const text = input.value.trim();
  if (text === '') return;

  const newTodo = {
    id: Date.now(), // Unique ID
    text: text,
    completed: false
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
  input.value = '';
}

// Global functions for inline onclick handlers
// Note: In a larger app, we would use event delegation, but this maintains the user's pattern while fixing the bug.
window.toggleTodo = function (id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }
}

window.deleteTodo = function (id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
}

function clearAll() {
  const confirmClear = confirm("Are you sure you want to delete all tasks?");
  if (confirmClear) {
    todos = [];
    saveTodos();
    renderTodos();
  }
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

addBtn.addEventListener('click', addTodo);

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

clearAllBtn.addEventListener('click', clearAll);

// Initial render
renderTodos();
