const input = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filterBtn');
const clearAllBtn = document.getElementById('clearAll');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = '';

  const filtered = todos.filter(todo => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'completed') return todo.completed;
    if (currentFilter === 'pending') return !todo.completed;
  });

  filtered.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';
    li.innerHTML = `
      <span>${todo.text}</span>
      <div>
        <button onclick="toggleTodo(${index})">${todo.completed ? 'Undo' : 'Done'}</button>
        <button class="deleteBtn" onclick="deleteTodo(${index})">Delete</button>
      </div>
    `;
    todoList.appendChild(li);
  });
}

function addTodo() {
  const text = input.value.trim();
  if (text === '') return;
  todos.push({ text, completed: false });
  saveTodos();
  renderTodos();
  input.value = '';
}

function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

function clearAll() {
  todos = [];
  saveTodos();
  renderTodos();
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
