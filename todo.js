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
    tasksList,
    wrapper,
    counter,
    all,
    themeSwitch,
    filters,
    clearCompleted,
    createTasks,
} = globalThis;

let todoList = new TodoList();


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
    wrapper.classList.add("mobile");
    filters.classList.add("mobile-filters");
}

function removeTask(event) {
    if (event.target.tagName != "IMG") return;
    const li = event.target.closest("li");
    todoList.removeById(li.id);
    li.remove();
    setCounterTask();
}

function getItemsLeft() {
    return todoList.tasks.filter((task) => !task.state).length;
}

function clearAllCompleted() {
    const result = todoList.tasks.filter((task) => task.state);
    todoList.removeAllCompleted(result);
    result.forEach((task) => {
        document.getElementById(task.id).remove();
    });
    setCounterTask();
}

function createTask() {
    const input = document.querySelector("input[type='text']");
    if (input.value.trim() == "") return;
    let task = new Task(input.value, generateId());
    todoList.addTask(task);
    renderTask(task);
    input.value = "";
    setCounterTask();
}

function setCounterTask() {
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
    
}

tasksList.addEventListener("mousedown", onMousedown);


function onMousedown(event) {
    if (event.target.tagName == "IMG") return;
    if (!event.target.closest("#tasksList")) return;
    let li = event.target.closest("li");
    let liClone = li.cloneNode(true);

    liClone.style.width = li.getBoundingClientRect().width + "px";
    let shiftY = event.clientY - li.offsetTop;

    liClone.style.position = "absolute";
    liClone.style.zIndex = 1000;
    tasksList.append(liClone);
    liClone.style.top = li.offsetTop + "px";

    moveAt(event.pageY);
    function moveAt(pageY) {
        let top = pageY - shiftY;
        if (top < tasksList.offsetTop) top = tasksList.offsetTop;
        if (
            top >
            tasksList.offsetTop + tasksList.clientHeight - li.clientHeight
        )
            top = tasksList.offsetTop + tasksList.clientHeight - li.clientHeight;
        liClone.style.top = top + "px";
    }
    
    let elemBelow;
    function onMouseMove(event) {
        moveAt(event.pageY);
        liClone.style.display = "none";
        elemBelow = document.elementFromPoint(event.clientX, event.clientY).closest("li");
        liClone.style.display = "block";
        if (!elemBelow) return;
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener('mouseup',documentMousup);
    function documentMousup(e){
        e.target != liClone && liClone.remove();
        document.removeEventListener("mouseup", documentMousup);
    };
    liClone.addEventListener("mouseup", onMoseup);
    function onMoseup(e) {
        document.removeEventListener("mousemove", onMouseMove);
        if (elemBelow ) {
            let correlationPasteLi = Math.floor(
                (elemBelow.offsetTop + elemBelow.clientHeight - event.clientY) /
                    2
            );
            correlationPasteLi = Math.abs(correlationPasteLi);
            correlationPasteLi > elemBelow.clientHeight / 2
                ? elemBelow.before(li)
                : elemBelow.after(li);
            liClone.remove();
        } else {
            liClone.remove();
            if (event.target.tagName != "LABEL") return;
            let id = li.id;
            todoList.switchState(id);
            event.target.classList.toggle("completed");
            let button = li.querySelector("img");
            if (!size) button.hidden = !button.hidden;
            highlight(currentFilterId);
            setCounterTask();
        }
    }
    
}

tasksList.ondragstart = function () {
    return false;
};
