// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterSelect = document.querySelector("#filter-select");

let oldInputValue;

// Funções
const saveTodo = (text, done = false, save = true) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    if (done) {
        todo.classList.add("done");
    }

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    todoList.appendChild(todo);

    todoInput.value = "";
    todoInput.focus();

    if (save) {
        saveToLocalStorage({ text, done });
    }
};

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
            updateLocalStorage();
        }
    });
};

const getTodosFromLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    return todos;
};

const saveToLocalStorage = (todo) => {
    const todos = getTodosFromLocalStorage();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
};

const updateLocalStorage = () => {
    const todosElements = document.querySelectorAll(".todo");
    const todos = [];

    todosElements.forEach((todo) => {
        const text = todo.querySelector("h3").innerText;
        const done = todo.classList.contains("done");

        todos.push({ text, done });
    });

    localStorage.setItem("todos", JSON.stringify(todos));
};

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        switch (filterValue) {
            case "all":
                todo.style.display = "flex";
                break;
            case "done":
                todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none");
                break;
            case "todo":
                !todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none");
                break;
        }
    });
};

const searchTodos = (search) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        const title = todo.querySelector("h3").innerText.toLowerCase();

        if (title.includes(search.toLowerCase())) {
            todo.style.display = "flex";
        } else {
            todo.style.display = "none";
        }
    });
};

// Eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTodo(inputValue);
    }
});

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
        updateLocalStorage();
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        updateLocalStorage();
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    if (editInputValue) {
        updateTodo(editInputValue);
    }

    toggleForms();
});

filterSelect.addEventListener("change", (e) => {
    const filterValue = e.target.value;
    filterTodos(filterValue);
});

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
    searchTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = "";
    searchTodos("");
});

// Carregar tarefas salvas ao abrir
window.addEventListener("load", () => {
    const todos = getTodosFromLocalStorage();
    todos.forEach((todo) => saveTodo(todo.text, todo.done, false));
});
