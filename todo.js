const todoInput = document.getElementById('todo-input')
const todoForm = document.querySelector('form')
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
        showToast("Todo added ✅")
        todoInput.value = ""
    } else if(todoText.length === 0) return


    
if(Notification.permission === "granted"){
    new Notification("Todo Added ✅" , {
        body: todoText,
        icon: "./assets/pic/appicon.png",
    })
}
}

function updateTodoList(){
    todoListUl.innerHTML = ""
    allTodos.forEach((todo , todoIndex) =>{
      const  todoitem = createTodoItem(todo , todoIndex)
        todoListUl.appendChild(todoitem)
    })

    if(allTodos.length === 0){
        document.body.style.overflow = "hidden"
    }
    else{
        document.body.style.overflow = "auto"
    }
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

        if(checkbox.checked) {
            if(Notification.permission === "granted"){
                new Notification("Todo completed ✅" , {
                    body: todo.text,
                    icon: "./assets/pic/appicon.png"
                })
            }
            showToast("Todo completed ✅")
        }

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

if(Notification.permission !== "granted"){
    Notification.requestPermission()
}

function showToast(message) {
    if(document.querySelector(".toast")) return
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);

}

//TOAST NOTIFICATION STYLE
const style = document.createElement("style")
style.innerHTML = `

.toast {
    position: fixed;
    bottom: 10vh;
    left: 50%;
    transform: translateX(-50%);
    background: var(--accent-color);
    color: var(--background);
    padding: 10px 20px;
    border-radius: 1000px;
    font-weight: 600;
    box-shadow: 0 0 10px rgba(0, 255, 196, 0.8);
    animation: fadeInOut 3s ease;
    z-index: 9999;
    max-width: 90%;
}
@keyframes fadeInOut {
    0% { opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; }
}
`
document.head.appendChild(style)

navigator.serviceWorker.ready.then(registration => {
    registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "YOUR_SERVER_KEY"
    }).then(subscription => {
        console.log("Push Subscription: " , subscription);
        
    }).catch(error => {
        console.error("Push Subscription Failed: " , error);
    })
})