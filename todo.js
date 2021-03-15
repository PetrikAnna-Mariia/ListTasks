class Task {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.state = false;
    }
    switchState() {
        this.state = !this.state;
    }
}

class TodoList {
    constructor() {
        this.tasks = [];
    }
    addTask(task) {
        this.tasks.push(task);
    }
    removeById(idTask) {
        this.tasks = this.tasks.filter((task) => (task = task.id != idTask));
    }
    switchState(taskId) {
        this.tasks
            .filter((task) => task.id == taskId)
            .map((task) => task.switchState());
    }
    removeAllCompleted() {
        this.tasks = this.tasks.filter((task) => !task.state);
    }
}

const {
    wrapper,
    counter,
    all,
    themeSwitch,
    filters,
    clearCompleted,
    createTasks,
} = globalThis;

let todoList = new TodoList();
// todoList.tasks = JSON.parse(localStorage.getItem("tasks"));  

// todoList.tasks.forEach(task => render(task));
// setCounterTask();



const renderTask = render();
const size = document.documentElement.clientWidth < 376;
const blockTodo = document.querySelector(".todo-list");

let highlightButton = wrapperHighlightButton();

blockTodo.addEventListener("click", completeTask);
blockTodo.addEventListener("click", removeTask);
createTasks.addEventListener("click", createTask);
filters.addEventListener("click", onFilter);
filters.addEventListener("click", highlightButton);
clearCompleted.addEventListener("click", clearAllCompleted);
themeSwitch.addEventListener("click", changeTheme);

function changeTheme() {
    document.body.classList.toggle("dark-theme");
    console.log(document.body);
}

function wrapperHighlightButton() {
    let lastButton = all;
    return function (event) {
        if (event.target.tagName != "A") return;
        if (event.target == lastButton) return;
        event.target.classList.add("pressButton");
        lastButton.classList.remove("pressButton");
        lastButton = event.target;
    };
}

function onFilter(event) {
    if (event.target.tagName != "A") return;
    currentFilterId = event.target.id;
    highlight(currentFilterId);
}

let currentFilterId = "all";
mapFilter = new Map();
mapFilter.set("all", () => false);
mapFilter.set("active", (task) => !task.state);
mapFilter.set("completed", (task) => task.state);

function highlight(filterId) {
    let shouldBeHighlighted = mapFilter.get(filterId);
    todoList.tasks.forEach((task) => {
        let li = document.getElementById(task.id);
        if (shouldBeHighlighted(task)) {
            li.classList.add("active");
        } else {
            li.classList.remove("active");
        }
    });
}

if (size) {
    let listBlock = document.querySelector(".list-block");
    listBlock.after(filters);
    wrapper.classList.add("mobile")
    filters.classList.add("mobile-filters");
}

function removeTask(event) {
    if (event.target.tagName != "IMG") return;
    const li = event.target.closest("li");
    todoList.removeById(li.id);
    li.remove();
    setCounterTask();
    // localStorage.setItem("tasks", JSON.stringify(todoList.tasks));
}

function getItemsLeft() {
    return  todoList.tasks.filter((task) => !task.state).length;
}

function clearAllCompleted() {
    const result = todoList.tasks.filter((task) => task.state);
    todoList.removeAllCompleted(result);
    result.forEach((task) => {
        document.getElementById(task.id).remove();
    });
    setCounterTask();
    // localStorage.setItem("tasks", JSON.stringify(todoList.tasks));
}

function createTask() {
    const input = document.querySelector("input[type='text']");
    if (input.value.trim() == "") return;
    let task = new Task(input.value, generateId());
    todoList.addTask(task);
    renderTask(task);
    input.value = "";
    setCounterTask();
    // localStorage.setItem("tasks", JSON.stringify(todoList.tasks));
}

function setCounterTask(){
    getItemsLeft()
        ? (counter.innerHTML = getItemsLeft() + " items left")
        : (counter.innerHTML = "all items have completed");
}

function generateId() {
    return Math.random().toString(16).slice(4);
}

function render() {
    let counter = 0;
    return function (task) {
        const li = document.createElement("li");
        li.innerHTML = `<input type="checkbox" id=${"label-" + counter}>
                        <label for=${"label-" + counter}>${task.name}</label>
                        <a href="#"><img src="icon-cross.svg" alt="check" hidden></a>`;
        let button = li.querySelector("img");
        if (size) button.hidden = false;
        blockTodo.append(li);
        li.id = task.id;
        counter++;
        highlight(currentFilterId);
    };
}

function completeTask(event) {
    if (event.target.tagName != "LABEL") return;
    let li = event.target.closest("li");
    let id = li.id;
    todoList.switchState(id);
    event.target.classList.toggle("completed");
    let button = li.querySelector("img");
    if (!size) button.hidden = !button.hidden;
    highlight(currentFilterId);
    setCounterTask();
}

const app = document.querySelector(".todo-app");
app.addEventListener("mousedown", onMousedown);

function onMousedown(event) {
    if (
        event.target.tagName == "INPUT" ||
        event.target.tagName == "LABEL" ||
        event.target.tagName == "A" ||
        event.target.tagName == "IMG"
    )
        return;
    let shiftX = event.clientX - app.getBoundingClientRect().left;
    let shiftY = event.clientY - app.getBoundingClientRect().top;

    app.style.position = "absolute";
    app.style.zIndex = 1000;
    document.body.append(app);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        app.style.left = pageX - shiftX + "px";
        app.style.top = pageY - shiftY + "px";
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    app.addEventListener("mouseup", onMoseup);
    function onMoseup() {
        document.removeEventListener("mousemove", onMouseMove);
        app.removeEventListener("mouseup", onMoseup);
    }
}

app.ondragstart = function () {
    return false;
};
