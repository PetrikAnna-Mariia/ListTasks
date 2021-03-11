class Task{
    constructor(name) {
        this.name = name;
        this.state = false;
    }
    create(){
        this.div = createElem(block, 'div', "divTodo");
        this.button = createElem(this.div, "button", "btStyle");
        this.span = createElem(this.div, "span", '', this.name);
        this.button.addEventListener('click', this.switchState.bind(this));
    }   

    switchState(){
        this.state = !this.state;
        this.span.classList.toggle("spanComplete");    
    }                                
}

class TodoList{
    constructor(){
        this.tasks = [];
        this.flag = true;
        this.classAtt = "activ"
    }
    switchClass(){
        if(this.classAtt == "activ") this.classAtt = "activDark";
        else this.classAtt = "activ";
    }
    changeThema(){
        this.tasks.forEach(item => {
            if(item.div.classList.contains('activDark')){
                item.div.classList.remove('activDark');
                item.div.classList.add("activ");
            }
            else if(item.div.classList.contains('activ')){
                item.div.classList.remove('activ');
                item.div.classList.add("activDark");
            }
        });
    }
    addTask(task){
        this.tasks.push(task);
    }
    removeCompletedTask(){
        this.tasks = this.tasks.filter(task =>{
            if(task.state) task.div.remove();
            return !task.state 
        });
    }
    active(){
        this.tasks.forEach(task => {
            if(!task.state)task.div.classList.toggle(this.classAtt);
            if(task.state) task.div.classList.remove(this.classAtt);
        })
    }
    completed(){
        this.tasks.forEach(task => {
            if(task.state)task.div.classList.toggle(this.classAtt);
            if(!task.state) task.div.classList.remove(this.classAtt);
        })
    }
    all(){
        this.tasks.forEach(task => {
            console.log(task.div)
            if(this.flag){
                if(!task.div.classList.contains(this.classAtt)){
                    task.div.classList.add(this.classAtt); 
                }
            } 
            if(!this.flag) task.div.classList.remove(this.classAtt); 
        })
        this.flag = !this.flag
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
active.addEventListener("click",list.active.bind(list))
buttonClear.addEventListener('click', list.removeCompletedTask.bind(list));
const completed =document.getElementById("completed");
completed.addEventListener("click",list.completed.bind(list));
const all = document.getElementById("all");
all.addEventListener("click",list.all.bind(list));

if(size){
    fone.innerHTML = "<img src='bg-mobile-light.jpg' class='foneImg'></img>";
    let block2 = document.querySelector(".block2");
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
        list.switchClass();
        list.changeThema();
    }
}

function create() {
    if(input.value.trim()=="") return;
    let task = new Task(input.value);
    task.create();
    list.addTask(task)
    input.value = "";
}

function createElem(contener, elem,attribute, value) {
    let element = document.createElement(elem);
    if(attribute)element.setAttribute("class", attribute);
    if(value) element.innerHTML = value;
    contener.append(element);
    return element;
}