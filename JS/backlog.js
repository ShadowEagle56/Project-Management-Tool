'use strict';

const APP_DATA_KEY = "ScrumPMTData";

function loadData() {
    let addTaskMember = document.getElementById("add-task-member");
    let editTaskMember = document.getElementById("edit-task-member");
    for (let i = 0; i < appStorage.memberList.length; i++) {
        let name = appStorage.memberList[i].firstName + " " + appStorage.memberList[i].lastName;
        let opt = `<option value="${i}">${name}</option>`
        addTaskMember.insertAdjacentHTML('beforeend', opt);
        editTaskMember.insertAdjacentHTML('beforeend', opt);
    }

    // let typeDropdown = document.getElementById("add-task-type");
    let typeLegend = document.getElementById("legend-type");
    for (let i = 0; i < appStorage.typeList.length; i++) {
        // let name = appStorage.typeList[i].title;
        // let opt = `<option value="${i}">${name}</option>`
        // typeDropdown.insertAdjacentHTML('beforeend', opt)

        let legend = `<div class="legend-pair">
                        <div class="legend-name">${appStorage.typeList[i].title}</div>
                        <div class="legend-color" style="background-color: ${appStorage.typeList[i].hexVal};"></div>
                    </div>`
        typeLegend.insertAdjacentHTML('beforeend', legend)
    }

}

////////////////////////////////// User Story //////////////////////////////////
const overlay = document.getElementById("overlay");
const addUSPopup = document.getElementById("add-us-popup");
const usContainer = document.getElementById("us-items");
const viewUSPopup = document.getElementById("view-us-popup");
const editUSPopup = document.getElementById("edit-us-popup");
const viewTaskPopup = document.getElementById("view-task-popup");
const editTaskPopup = document.getElementById("edit-task-popup");

const high = "rgb(240,128,128)";
const medium = "rgb(255,250,205)";
const low = "rgb(152,251,152)";

// Add User Story Popup
function openAddUSPopup() {
    addUSPopup.classList.add("active");
    overlay.classList.add("active");
}

function closeAddUSPopup() {
    addUSPopup.classList.remove("active");
    overlay.classList.remove("active");
}

function addUS() {
    let title = document.getElementById("add-us-title").value;
    let priority = document.getElementById("add-us-priority").value;
    let desc = document.getElementById("add-us-description").value;

    let us = new UserStory(title, priority);
    if (desc) {
        us.description = desc;
    }

    appStorage.usList.push(us);
    updateLocalStorage(APP_DATA_KEY, appStorage);
    addUSCard(us, appStorage.usList.length - 1);
    clearAddUSData();
    closeAddUSPopup();
}

// Clear input data
function clearAddUSData() {
    document.getElementById("add-us-title").value = "";
    document.getElementById("add-us-priority").value = "";
    document.getElementById("add-us-description").value = "";
}

// Displays user story card
function addUSCard(us, id) {
    let color = low;
    if (us.priority == "High") {
        color = high;
    } else if (us.priority == "Medium") {
        color = medium;
    } else if (us.priority == "Low") {
        color = low;
    }

    let spColor = "white";
    if (us.storyPoint <= 10 && us.storyPoint > 0) {
        spColor = low;
    } else if (us.storyPoint > 10 && us.storyPoint <= 40) {
        spColor = medium;
    } else if (us.storyPoint > 40) {
        spColor = high;
    }

    let card = `<div class="us-card" id="us-${id}" onclick="openViewUSPopup(${id})">
                    <div class="us-card-header" style="background-color: ${color}">${us.title}</div>
                    <div class="us-card-content">
                        <div class="story-point" style="background-color: ${spColor};">SP ${us.storyPoint}</div>
                    </div>
                </div>`
    
    usContainer.insertAdjacentHTML('beforeend', card)
}

// View User Story Details
function openViewUSPopup(id) {
    let us = appStorage.usList[id];
    document.getElementById("view-us-title").innerHTML = us.title;
    document.getElementById("view-us-priority").innerHTML = us.priority;
    document.getElementById("view-us-description").innerHTML = us.description;

    document.getElementById("view-us-button-container").innerHTML = `<div class="view-us-edit-button">
                                                                        <button onclick="editUS(${id})">Edit User Story</button>
                                                                    </div>`

    viewUSPopup.classList.add("active");
    overlay.classList.add("active");
}

function closeViewUSPopup() {
    viewUSPopup.classList.remove("active");
    overlay.classList.remove("active");
}

// Edit User Story
function editUS(id) {
    document.getElementById("edit-us-title").value = appStorage.usList[id].title;
    document.getElementById("edit-us-priority").value = appStorage.usList[id].priority;
    document.getElementById("edit-us-description").value = appStorage.usList[id].description;

    document.getElementById("edit-us-button-container").innerHTML = `<button onclick="editUSApply(${id})">Apply</button>
                                                                    <button onclick="closeEditUS()">Cancel</button>
                                                                    <button onclick="deleteUS(${id})">Delete</button>`

    viewUSPopup.classList.remove("active");
    editUSPopup.classList.add("active");
}

function closeEditUS() {
    editUSPopup.classList.remove("active");
    viewUSPopup.classList.add("active");
}

function editUSApply(id) {
    let title = document.getElementById("edit-us-title").value;
    let priority = document.getElementById("edit-us-priority").value;
    let desc = document.getElementById("edit-us-description").value;

    appStorage.usList[id].title = title;
    appStorage.usList[id].priority = priority;
    appStorage.usList[id].description = desc;

    updateLocalStorage(APP_DATA_KEY, appStorage);
    window.location.reload();
}

// Delete User Story
function deleteUS(id) {
    appStorage.usList.splice(id, 1);
    updateLocalStorage(APP_DATA_KEY, appStorage);
    window.location.reload();
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Tasks /////////////////////////////////////
const addTaskPopup = document.getElementById("add-task-popup");
const taskContainer = document.getElementById("task-items");
let selectingUS = false;

function openAddTaskPopup() {
    addTaskPopup.classList.add("active");
    overlay.classList.add("active");
    // populate drop down
    for(var i = 0; i < appStorage.typeList.length; i++){
        var opt = appStorage.typeList[i];
        var el = document.createElement("option");
        el.setAttribute("id", opt.title)
        el.textContent = opt.title;
        el.value = i;
        document.getElementById("add-task-type").appendChild(el);
    }
}

function closeAddTaskPopup() {
    addTaskPopup.classList.remove("active");
    overlay.classList.remove("active");
    // remove all types from the drop down
    for(var i = 0; i < appStorage.typeList.length; i++){
        var el = document.getElementById(appStorage.typeList[i].title);
        document.getElementById("add-task-type").removeChild(el);
    }
}

function clearAddTaskData() {
    document.getElementById("add-task-title").value = "";
    document.getElementById("add-task-member").value = "";
    document.getElementById("add-task-priority").value = "";
    document.getElementById("add-task-type").value = "";
    document.getElementById("add-task-description").value = "";
    document.getElementById("add-task-sp").value = 0;
}

function addTaskCard(task, id) {
    let color = low;
    if (task.priority == "High") {
        color = high;
    } else if (task.priority == "Medium") {
        color = medium;
    } else if (task.priority == "Low") {
        color = low;
    }

    let spColor = "white";
    if (task.storyPoint <= 10 && task.storyPoint > 0) {
        spColor = low;
    } else if (task.storyPoint > 10 && task.storyPoint <= 40) {
        spColor = medium;
    } else if (task.storyPoint > 40) {
        spColor = high;
    }

    let types = ``
    task.type.forEach(
        typeIndex => 
            types += `<div class="task-type-display" style="background-color: ${appStorage.typeList[typeIndex].hexVal}"></div>`)

    let member = (str) => str.split('').filter(a => a.match(/[A-Z]/)).join('')
    let name = (task.member) ? task.member._firstName + " " + task.member._lastName : "";
    let shortenMember = (name) ? member(name).slice(0,2) : "N/A"

    let card = `<div class="task-card" id="task-${id}" onclick="openViewTaskPopup(${id})">
                    <div class="task-card-header" style="background-color: ${color};">${task.title}</div>
                    <div class="task-card-content">
                        <div class="story-point" style="background-color: ${spColor};">SP ${task.storyPoint}</div>
                        <div class="task-type-container">${types}</div>
                        <div class="task-member-container">${shortenMember}</div>
                    </div>
                </div>`

    taskContainer.insertAdjacentHTML('beforeend', card);
}

function addTask() {
    let title = document.getElementById("add-task-title").value;
    let member = document.getElementById("add-task-member").value;
    let priority = document.getElementById("add-task-priority").value;
    let sp = document.getElementById("add-task-sp").value;
    let types = document.getElementById("add-task-type").selectedOptions;  // of type HTMLCollection
    let description = document.getElementById("add-task-description").value;

    let task = new Task(title, priority);
    if (member) {
        task.member = appStorage.memberList[member];
    }
    if (types) {
        task.type = Array.from(types).map(({value}) => value);  // convert to array of indices
    }
    if (description) {
        task.description = description;
    }
    if (sp) {
        task.storyPoint = sp;
    }
    appStorage.taskList.push(task);
    updateLocalStorage(APP_DATA_KEY, appStorage);
    addTaskCard(task, appStorage.taskList.length - 1);
    clearAddTaskData();
    closeAddTaskPopup();
}

// View Task Details
function openViewTaskPopup(id) {
    let task = appStorage.taskList[id];
    let types = "";
    task.type.forEach(typeIndex => types += `<div class="task-pair">
    <div class="task-type-name">${appStorage.typeList[typeIndex].title}</div>
    <div class="task-type-color" style="background-color: ${appStorage.typeList[typeIndex].hexVal};"></div>
    </div>`)

    document.getElementById("view-task-title").innerHTML = task.title;
    document.getElementById("view-task-member").innerHTML = task.member ? task.member._firstName + " " + task.member._lastName : "";
    document.getElementById("view-task-priority").innerHTML = task.priority;
    document.getElementById("view-task-sp").innerHTML = task.storyPoint;
    document.getElementById("view-task-type").innerHTML = task.type ? types : "";
    document.getElementById("view-task-description").innerHTML = task.description;

    document.getElementById("view-task-button-container").innerHTML = `<div class="view-task-edit-button">
                                                                        <button onclick="editTask(${id})">Edit Task</button>
                                                                    </div>`

    viewTaskPopup.classList.add("active");
    overlay.classList.add("active");
}

// Edit task

function closeViewTaskPopup() {
    viewTaskPopup.classList.remove("active");
    overlay.classList.remove("active");
}

function closeEditTaskPopup() {
    editTaskPopup.classList.remove("active");
    viewTaskPopup.classList.add("active");
}

function editTask(id) {
    viewTaskPopup.classList.remove("active");
    editTaskPopup.classList.add("active");

    let index = 0;

    for(let i = 0; i < appStorage.memberList.length; i++){
        if (appStorage.taskList[id].member == appStorage.memberList[i]){
            index = i;
        }
    }

    for(var i = 0; i < appStorage.typeList.length; i++){
        var opt = appStorage.typeList[i];
        var el = document.createElement("option");
        el.setAttribute("id", opt.title)
        el.textContent = opt.title;
        el.value = i;
        document.getElementById("edit-task-type").appendChild(el);
    }

    document.getElementById("edit-task-title").value = appStorage.taskList[id].title;
    document.getElementById("edit-task-member").value = index;
    document.getElementById("edit-task-priority").value = appStorage.taskList[id].priority;
    document.getElementById("edit-task-sp").value = appStorage.taskList[id].storyPoint;
    document.getElementById("edit-task-type").value = appStorage.taskList[id].type;
    document.getElementById("edit-task-description").value = appStorage.taskList[id].description;

    document.getElementById("edit-task-submit").innerHTML = `<button>Assign to User Story</button>
                                                            <button onclick="editTaskApply(${id})">Apply</button>
                                                            <button onclick="closeEditTaskPopup()">Cancel</button>
                                                            <button onclick="deleteTask(${id})">Delete</button>`
}

function editTaskApply(id) {
    let title = document.getElementById("edit-task-title").value;
    let member = document.getElementById("edit-task-member").value;
    let priority = document.getElementById("edit-task-priority").value;
    let sp = document.getElementById("edit-task-sp").value;
    let types = document.getElementById("edit-task-type").selectedOptions;
    let desc = document.getElementById("edit-task-description").value

    appStorage.taskList[id].title = title;
    appStorage.taskList[id].member = appStorage.memberList[member];
    appStorage.taskList[id].priority = priority;
    appStorage.taskList[id].sp = sp;
    appStorage.taskList[id].type = Array.from(types).map(({value}) => value);
    appStorage.taskList[id].description = desc;
    updateLocalStorage(APP_DATA_KEY, appStorage);
    window.location.reload();
}

function deleteTask(id) {
    appStorage.taskList.splice(id, 1);
    updateLocalStorage(APP_DATA_KEY, appStorage);
    window.location.reload();
}

// Filter
const filterPopup = document.getElementById("filter-popup");

function openFilterPopup() {
    filterPopup.classList.add("active");
    overlay.classList.add("active");
}

function closeFilterPopup() {
    filterPopup.classList.remove("active");
    overlay.classList.remove("active");
}

// Add Type
const addTypePopup = document.getElementById("add-type-popup");

function openAddTypePopup() {
    addTypePopup.classList.add("active");
    overlay.classList.add("active");
}

function closeAddTypePopup() {
    addTypePopup.classList.remove("active");
    overlay.classList.remove("active");
}

function clearAddTypeData(){
    document.getElementById("add-type-title").value = "";
    document.getElementById("type-colour").value = "#000000";
}

function addType(){
    let title = document.getElementById("add-type-title").value;
    let hexVal = document.getElementById("type-colour").value;

    appStorage.typeList.push(new Type(title, hexVal));
    updateLocalStorage(APP_DATA_KEY, appStorage);
    clearAddTypeData();
    closeAddTypePopup();
    window.location.reload();
}

// View Legend Popup
const legendPopup = document.getElementById("legend-popup");

function openLegendPopup() {
    legendPopup.classList.add("active");
    overlay.classList.add("active");
}

function closeLegendPopup() {
    legendPopup.classList.remove("active");
    overlay.classList.remove("active");
}

let appStorage = new Storage();

if (localStorageChecker(APP_DATA_KEY) == true) {
    appStorage.fromData(takeData(APP_DATA_KEY));
} else {
    updateLocalStorage(APP_DATA_KEY, appStorage);
};

console.log(appStorage)