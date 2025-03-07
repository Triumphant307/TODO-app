const todoForm = document.querySelector('.todoform')
const todoInput = document.getElementById('todo-input')
const todoListUl = document.getElementById('todo-list')
const addButton = document.getElementById('add-button')

let allTodos = getTodos()
updateTodoList()



addButton.addEventListener('click', () => {
    addTodo()
})

todoForm.addEventListener('submit' , e => {
    e.preventDefault()
    addTodo()
})

function addTodo(){
    const todoText = todoInput.value.trim()
    if(todoText.length > 0){
        const todoObject = {
            text: todoText,
            completed: false,
        }
        allTodos.push(todoObject)
        updateTodoList()
        saveTodos()
        todoInput.value = ""
    }
}

function updateTodoList(){
    todoListUl.innerHTML = ""
    allTodos.forEach((todo , todoIndex) =>{
        todoitem = createTodoItem(todo , todoIndex)
        todoListUl.appendChild(todoitem)
    })
}

function createTodoItem(todo , todoIndex){
    const todoId = "todo-" + todoIndex
    const todoLI = document.createElement("li")
    const todoText = todo.text
    todoLI.className = "todo"
    todoLI.innerHTML = 
    `
        <input type="checkbox" id="${todoId}">
        <label class="custom-checkbox" for="${todoId}">&#x2713;</label>
        <label for="${todoId}" class="todo-text">${todoText}</label>
        <button class="delete-button">&#x1F5D1;</button>
    `
    const deleteButton = todoLI.querySelector('.delete-button')
    deleteButton.addEventListener('click' , () => {
        deleteTodoItem(todoIndex)
    })
    const checkbox = todoLI.querySelector('input')
    checkbox.addEventListener('change' , () => {
        allTodos[todoIndex].completed = checkbox.checked
        saveTodos()
    })
    checkbox.checked = todo.completed
    return todoLI
}

function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex)
    saveTodos()
    updateTodoList()
}

function saveTodos(){
    const todosJson = JSON.stringify(allTodos)
    localStorage.setItem("todos" , todosJson)
}

function getTodos(){
    const todos = localStorage.getItem("todos") || "[]"
    return JSON.parse(todos)
}

if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./service-worker.js")
    .then((registration) => {
        console.log("Service Worker Registered" , registration.scope);
    })
    .catch(err => {
        console.log("Service Worker Registration Failed", err);
    });
}