class Task{
    constructor(name) {
        this.name = name;
        this.state = false;
    }
    switchState(){
        this.state = !this.state;
    }                                
}

class TodoList{
    constructor(){
        this.tasks = [];
    }
    addTask(task){
        this.tasks.push(task);
    }
    filter(condition){
        const result = this.tasks.filter(task => {
            switch (condition) {
                case "all":
                    return task;
                    break;
                case "active":
                    return task.state == false;
                    break;
                case "completed":
                    return task.state == true;
                    break;
            }
        })
        return result;
    }
    removeTask(arr){
        arr.forEach(item =>{
            this.tasks = this.tasks.filter(task => task !== item)
        });
    }
}
let list = new TodoList();

const buttonCreate = document.getElementById('create');
buttonCreate.addEventListener('click', create);
const input = document.querySelector('input');
const block = document.querySelector('.block');
const generalBloc = document.querySelector('.generalBloc');
const themaSwitch = document.getElementById('thema');
const size = document.documentElement.clientWidth < 376;
const fone = document.querySelector('.fone');
const changeThema = wrapperchangeThema();
themaSwitch.addEventListener("click", changeThema);
const div = document.createElement("div");
const buttonClear = document.getElementById('clear');
const active = document.getElementById("active")
// active.addEventListener("click",list.active.bind(list))
buttonClear.addEventListener('click', removeCompletedTask);
const completed =document.getElementById("completed");
// completed.addEventListener("click",list.completed.bind(list));
const all = document.getElementById("all");
// all.addEventListener("click",list.all.bind(list));
const block2 = document.querySelector(".block2");
const tasksAndDivs = new Map();
const filterTask = filterTasks();
block2.addEventListener("click", filterTask);
let classAtt = "activ";

let laschoise =[];

function removeCompletedTask() {
    const result = list.filter("completed");
    list.removeTask(result);
    result.forEach(item => {
        tasksAndDivs.get(item).remove();
        tasksAndDivs.delete(item);
    })
}

function filterTasks() {
    let lastButton = null;
    return function (event) {
        if(event.target.tagName != "BUTTON") return;
        const target = event.target;
        tasksAndDivs.forEach( div => div.classList.remove(classAtt));
        if(lastButton == target.id){
            lastButton = null;
            return;
        }
        const result = list.filter(target.id);
        result.forEach(task => {
            tasksAndDivs.get(task).classList.add(classAtt);
            laschoise.push(tasksAndDivs.get(task));
        });
        lastButton = target.id;
    }
}


if(size){
    fone.innerHTML = "<img src='bg-mobile-light.jpg' class='foneImg'></img>";
    div.classList.add("contener2");
    div.append(block2);
    generalBloc.after(div);
}



function wrapperchangeThema() {
    let flag = true;
    const createTodo = document.querySelector('.createTodo')
    return function () {
        if(flag){
            themaSwitch.innerHTML = "<img src='icon-sun.svg' >" 
            if(size) {
                fone.innerHTML = "<img src='bg-mobile-dark.jpg' class='foneImg'></img>";
                
            } 
            else{
                fone.innerHTML = "<img src='bg-desktop-dark.jpg' class='foneImg'></img>";
            }
        }
        else{
            themaSwitch.innerHTML = "<img src='icon-moon.svg' >"
            if(size) {
                fone.innerHTML = "<img src='bg-mobile-light.jpg' class='foneImg'></img>";
            } 
            else{
                fone.innerHTML = "<img src='bg-desktop-light.jpg' class='foneImg'></img>";
            }
        }
        document.body.classList.toggle('dark');
        div.classList.toggle("darkForDiv");
        generalBloc.classList.toggle("darkForDiv");
        createTodo.classList.toggle("darkForDiv");
        flag = !flag;
        if(laschoise)laschoise.forEach(item => {
            item.classList.remove(classAtt);
        });
        switchClass();
        if(laschoise)laschoise.forEach(item => {
            item.classList.add(classAtt);
        });
    }
}

function switchClass(){
        if(classAtt == "activ") classAtt = "activDark";
        else classAtt = "activ";
    }

function create() {
    if(input.value.trim()=="") return;
    let task = new Task(input.value);
    const div = render(task);
    list.addTask(task);
    input.value = "";
    tasksAndDivs.set(task, div);

}

function createElem(contener, elem,attribute, value) {
    let element = document.createElement(elem);
    if(attribute)element.setAttribute("class", attribute);
    if(value) element.innerHTML = value;
    contener.append(element);
    return element;
}
function render(task){
        const div = createElem(block, 'div', "divTodo");
        const button = createElem(div, "button", "btStyle");
        const span = createElem(div, "span", '', task.name);
        const changeState = f(task, span);
        button.addEventListener('click', changeState);
        return div;
        function f(task, span){ 
            return function () {
                task.switchState();
                span.classList.toggle("spanComplete");  
            }   
        }
}

block.addEventListener('mousedown', moveTask);

function moveTask(event){
    event.preventDefault();
    if(!event.target.closest(".divTodo")) return;
    let target = event.target.closest(".divTodo");
    let blockCoord =block.getBoundingClientRect();
    selectedTask = target.cloneNode(true);
    selectedTask.style.position = 'absolute';
    selectedTask.style.zIndex = 100;
    selectedTask.style.width = target.getBoundingClientRect().width + "px";
    document.body.append(selectedTask);
    
    moveAt( event.pageY);
    function moveAt( pageY) {
        let coorsClone = selectedTask.getBoundingClientRect()
        let top = pageY - target.getBoundingClientRect().top ;
        let topClone = pageY - top;
        if ( coorsClone.top < blockCoord.top) {
            topClone = blockCoord.top;
        } 
        if ( coorsClone.top+ coorsClone.height > blockCoord.top + blockCoord.height) {
            topClone = blockCoord.top + blockCoord.height - coorsClone.height;
        }
        
        selectedTask.style.top = pageY - selectedTask.offsetHeight / 2 + 'px';
        }
    

    block.addEventListener("mousemove",onMouseMove);
    let elemBelow 
    function onMouseMove(event) {
        moveAt(event.pageY);
        selectedTask.hidden = true;
        elemBelow = document.elementFromPoint(event.clientX, event.clientY).closest(".divTodo");

        selectedTask.hidden = false;
        if (!elemBelow) return;

        block.addEventListener('mousemove', onMouseMove);


    }
    selectedTask.addEventListener("mouseup", onMouseup)
    function onMouseup() {
        if(!elemBelow) return;
        console.log(elemBelow);
        elemBelow.after(selectedTask);
        selectedTask.style.position = "static";
        target.remove();
        block.removeEventListener('mousemove', onMouseMove);
        selectedTask.removeEventListener('mouseup', onMouseup);
    };

    selectedTask.ondragstart = function() {
    return false;
};
};

    

