const createElementWithText = (tag, content) => {
  const element = document.createElement(tag);
  element.innerText = content;
  return element;
};

const removeHandler = async (id, todoId) => {
  const response = await fetch(`/todo/${todoId}/task/${id}/remove-task`, {
    method: 'DELETE',
  });

  if (response.ok) {
    fetchAndRenderTodos();
  }
};

const handleToggleStatus = async (id, todoId) => {
  const response = await fetch(`/todo/${todoId}/task/${id}/toggle-status`, {
    method: 'PATCH',
  });

  if (response.ok) {
    fetchAndRenderTodos();
  }
};

const getStatus = (done) => (done ? 'undone' : 'done');

const applyStrikeIfUndone = (status, taskTag) => {
  if (status === 'undone') taskTag.style.textDecoration = 'line-through';
};

const renderTaskItem = ({ id, task, done }, todoId) => {
  //extract fns
  const tasks = document.querySelector('#tasks');
  const clone2 = tasks.content.cloneNode(true); //variable names
  const taskTag = clone2.querySelector('p');
  const element = document.getElementById(todoId); //no use of todo id if tasks container is present
  const doneTag = clone2.querySelector('#done');
  const div = clone2.querySelector('div');
  const removeTag = clone2.querySelector('#remove');
  const status = getStatus(done);

  div.id = id;
  doneTag.innerText = status;

  applyStrikeIfUndone(status, taskTag);

  doneTag.addEventListener('click', () => handleToggleStatus(id, todoId));
  removeTag.addEventListener('click', () => removeHandler(id, todoId));

  taskTag.innerText = task;
  element.appendChild(clone2);
};

const renderTasks = ({ todoId: todoId, tasks }) => {
  tasks.forEach((task) => {
    renderTaskItem(task, todoId);
  });
};

const postTask = async (event, todoId) => {
  const formData = new FormData(event.target);
  const task = formData.get('task');
  const jsonObj = JSON.stringify({ task, todoId });

  return await fetch(`/todo/${todoId}/task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: jsonObj,
  });
};

const handleAddTask = async (event, todoList) => {
  event.preventDefault();
  postTask(event, todoList.todoId);
  fetchAndRenderTodos();
};

const handleDeleteTodo = async ({ todoId }) => {
  const response = await fetch(`/todo/${todoId}/remove-todo`, {
    method: 'DELETE',
  });

  if (response.ok) {
    fetchAndRenderTodos();
  }
};

const renderTodoLayout = async (todoList) => {
  //extract fns
  const todo = document.querySelector('#todoList');
  const template = document.querySelector('#header');
  const clone = template.content.cloneNode(true);
  const divHead = clone.querySelector('div');
  const title = clone.querySelector('h1');
  const addTask = clone.querySelector('#addTask');
  const deleteTask = clone.querySelector('#delete');

  divHead.id = todoList.todoId;
  title.innerText = todoList.todo;
  todo.appendChild(clone);
  renderTasks(todoList);

  deleteTask.addEventListener('click', (e) => handleDeleteTodo(todoList));
  addTask.addEventListener('submit', (e) => handleAddTask(e, todoList));
};

const renderUsername = async (username) => {
  const userNameTag = document.querySelector('#user');

  userNameTag.innerText = username;
};

const fetchAndRenderTodos = async () => {
  const response = await fetch('/todo');
  const { todo, username } = await response.json();
  const todoElement = document.querySelector('#todoList');
  renderUsername(username);
  todoElement.innerHTML = ''; //replaceChildren
  todo.forEach(renderTodoLayout);
};

const postTodo = async (event) => {
  const formData = new FormData(event.target);
  const todo = formData.get('todo');
  const todoPayload = JSON.stringify({ todo });
  return await fetch('/todo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: todoPayload,
  });
};

const handleSubmit = async (event) => {
  event.preventDefault();
  postTodo(event);
  fetchAndRenderTodos();
  event.target.reset();
};

const main = async () => {
  const todoBox = document.querySelector('#todo');

  fetchAndRenderTodos();
  todoBox.addEventListener('submit', handleSubmit);
};

globalThis.onload = main;
