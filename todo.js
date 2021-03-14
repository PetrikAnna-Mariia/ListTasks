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
    filter(predicate) {
        return this.tasks.filter(predicate);
    }
    removeAll() {
        this.tasks = this.tasks.filter(task => !task.state);
    }
}

let todoList = new TodoList();

const {
    wrapper,
    counter,
    themeSwitch,
    filters,
    clearCompleted,
    active,
    completed,
    all,
    createTasks,
} = globalThis;

const renderTask = render();
const size = document.documentElement.clientWidth < 376;
const blockTodo = document.querySelector(".todo-list");

blockTodo.addEventListener("click", completeTask);
blockTodo.addEventListener("click", removeLi);
createTasks.addEventListener("click", createTask);
filters.addEventListener("click", onFilter);
clearCompleted.addEventListener("click", clearAllCompleted);
themeSwitch.addEventListener("click", changeTheme);

let lastButton = all;

mapFilter = new Map();
mapFilter.set("active", (task) => !task.state);
mapFilter.set("completed", (task) => task.state);

if(size){
    let listBlock = document.querySelector(".list-block");
    listBlock.after(filters);
    filters.classList.add("mobile-filters")
}

function changeTheme() {
    document.body.classList.toggle("dark-theme");
}

function removeLi(event) {
    if (event.target.tagName != "IMG") return;
    const li = event.target.closest("li");
    const id = li.id;
    todoList.removeById(id);
    li.remove();
    counter.innerHTML = getItemsLeft();
}

function getItemsLeft() {
    return "" + todoList.filter(mapFilter.get('active')).length;
}

function clearAllCompleted() {
    const result = todoList.filter(mapFilter.get("completed"));
    todoList.removeAll(result);
    result.forEach((task) => {
        document.getElementById(task.id).remove();
    });
    counter.innerHTML = getItemsLeft();
}

function onFilter(event) {
    if (event.target.tagName != "A") return;
    const filterButton = event.target;
    lastButton.classList.remove("pressButton");
    filterButton.classList.add("pressButton");
    clearHighlighted();
    if (filterButton == all){
        lastButton = filterButton;
        return;
    }
    highlight(filterButton.id);
    lastButton = filterButton;
}

function clearHighlighted() {
    let arrLi = Array.from(blockTodo.querySelectorAll("li"));
    arrLi.forEach((li) => li.classList.remove("active"));
}

function highlight(filterId) {
    const result = todoList.filter(mapFilter.get(filterId));
    result.forEach((task) => {
        document.getElementById(task.id).classList.add("active");
    });
}

function createTask() {
    const input = document.querySelector("input[type='text']");
    if (input.value.trim() == "") return;
    let task = new Task(input.value, new Date().getTime());
    todoList.addTask(task);
    renderTask(task);
    input.value = "";
    counter.innerHTML = getItemsLeft();
}

function render() {
    let counter = 0;
    return function (task) {
        const li = document.createElement("li");
        li.innerHTML = `<input type="checkbox" id=${"label-" + counter}>
                        <label for=${"label-" + counter}>${task.name}</label>
                        <a href="#"><img src="icon-cross.svg" alt="check" hidden></a>`;
        let button = li.querySelector("A");
        if (size) button.hidden = false;
        blockTodo.append(li);
        li.id = task.id;
        counter++;
        clearHighlighted();
        if (lastButton != all) highlight(lastButton.id);
    };
}

function completeTask(event) {
    if (event.target.tagName != "LABEL") return;
    let li = event.target.closest("li");
    let id = li.id;
    todoList.switchState(id);
    li.classList.toggle("completed");
    let button = li.querySelector("img");
    if (!size) button.hidden = !button.hidden;
    clearHighlighted();
    if (lastButton != all) highlight(lastButton.id);
    counter.innerHTML = getItemsLeft();
}

const app = document.querySelector(".todo-app")
app.addEventListener("mousedown", onMousedown);

function onMousedown(event) {
    if(event.target.tagName == "INPUT" || event.target.tagName == "LABEL" || event.target.tagName == "A") return;
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
};

app.ondragstart = function () {
    return false;
};
