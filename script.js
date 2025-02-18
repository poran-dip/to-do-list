const taskManager = document.querySelector(".all-tasks");
const addBtn = document.querySelector(".add");
const taskInput = document.querySelector(".task");

window.onload = function(){
    loadTasks();
}

function loadTasks(){
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if(tasks.length === 0){
        createNoTaskLabel();
    }
    else{
        tasks.forEach(task => {
            createNewTask(task.description, task.done);
        });
    }
}

function addTask(){
    const newTask = taskInput.value;
    if(newTask === "") return;

    removeNoTaskLabel();
    createNewTask(newTask, false);
    saveTasks();
}

function createNewTask(description, isDone){
    const container = createElement("div", "task-container");

    const checkbox = createElement("div", "checkbox");
    checkbox.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    `;
    checkbox.addEventListener("click", doneTask);

    const taskDesc = createElement("div", "task-description", description);
    taskDesc.contentEditable = true;
    taskDesc.spellcheck = false;
    taskDesc.addEventListener("blur", () => {
        saveTasks();
    });
    taskDesc.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            taskDesc.blur();
        }
    });

    const deltBtn = createElement("div", "remove-btn");
    deltBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
    `;
    deltBtn.addEventListener("click", removeTask);

    container.append(checkbox, taskDesc, deltBtn);
    if(isDone) container.classList.add("done");

    taskManager.appendChild(container);
    taskInput.value = "";
}

function createElement(tag, className, textContent = "") {
    const elem = document.createElement(tag);
    elem.classList.add(className);
    if (textContent) elem.textContent = textContent;
    return elem;
}

function createButton(label, className, handler) {
    const btn = createElement("button", className, label);
    btn.addEventListener("click", handler);
    return btn;
}

function doneTask(event){
    let taskContainer = event.target.closest(".task-container");
    taskContainer.classList.toggle("done");
    saveTasks();
}

function removeTask(event){
    let taskContainer = event.target.closest(".task-container");
    taskContainer.remove();
    saveTasks();
    if(taskManager.children.length === 0) createNoTaskLabel();
}

function saveTasks(){
    const tasks = Array.from(document.querySelectorAll('.task-container')).map(task => ({
        description: task.querySelector(".task-description").innerText,
        done: task.classList.contains("done")
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createNoTaskLabel(){
    let div = document.createElement('div');
    div.classList.add("no-task-label");
    div.addEventListener("click", function(){
        taskInput.focus();
    });
    div.textContent = "+ Add a task";
    taskManager.appendChild(div);
}

function removeNoTaskLabel(){
    label = document.querySelector(".no-task-label");
    if(label){
        label.remove();
    }
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        event.preventDefault();
        addTask();
    }
});