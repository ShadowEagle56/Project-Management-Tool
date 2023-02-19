'use strict';

const APP_DATA_KEY = "ScrumPMTData";

//////////////////////////////// Constants /////////////////////////////////////
const dateContainer = document.getElementById("inactive-date");
const statusContainer = document.getElementById("inactive-status");
const sprintName = document.getElementById("sprint-container-title");
const taskContainer = document.getElementById("inactive-tasks-container");

// Update Tasks
const updateTasksPopup = document.getElementById("update-tasks-popup");
const addTasks = document.getElementById("add-task");
const removeTasks = document.getElementById("remove-task");

// Sprint Settings
const sprintSettingsPopup = document.getElementById("sprint-settings-popup");
const settingsTitle = document.getElementById("sprint-settings-title");
const settingsStart = document.getElementById("sprint-settings-start-date");
const settingsEnd = document.getElementById("sprint-settings-end-date");

// Loads all relevant data 
function loadData() {
    let current = appStorage.sprintList[appStorage.currentSprint];

    dateContainer.innerHTML = current.startDate + " -  " + current.endDate;
    statusContainer.innerHTML = current.status;
    sprintName.innerHTML = current.title;

    // Autofills option to add tasks that are not in any other sprints into current sprint
    for (let i = 0; i < appStorage.taskList.length; i++) {
        if (!appStorage.taskList[i].inSprint) {
            let name = appStorage.taskList[i].title.slice(0,20);
            let opt = `<option value="${i}">${name}</option>`;
            addTasks.insertAdjacentHTML('beforeend', opt);
        }
    }

    // Autofills option to remove existing tasks in current sprint
    for (let i = 0; i < appStorage.sprintList[appStorage.currentSprint].taskList.length; i++) {
        let name = appStorage.taskList[appStorage.sprintList[appStorage.currentSprint].taskList[i]].title.slice(0,20);
        let opt = `<option value="${appStorage.sprintList[appStorage.currentSprint].taskList[i]}">${name}</option>`;
        removeTasks.insertAdjacentHTML('beforeend', opt);
    }

    // To be further optimized - Code copied from backlog.js
    if (appStorage.sprintList[appStorage.currentSprint].taskList.length) {
        for (let i = 0; i < appStorage.sprintList[appStorage.currentSprint].taskList.length; i++) {
            let task = appStorage.taskList[appStorage.sprintList[appStorage.currentSprint].taskList[i]];

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

            let card = `<div class="task-card" id="task-${i}" onclick="openViewTaskPopup(${i})">
                            <div class="task-card-header" style="background-color: ${color};">${task.title}</div>
                            <div class="task-card-content">
                                <div class="story-point" style="background-color: ${spColor};">SP ${task.storyPoint}</div>
                                <div class="task-type-container">${types}</div>
                                <div class="task-member-container">${shortenMember}</div>
                            </div>
                        </div>`

            taskContainer.insertAdjacentHTML('beforeend', card);
        }
    }

    // Autofills member for edit task popup
    let editTaskMember = document.getElementById("edit-task-member");
    for (let i = 0; i < appStorage.memberList.length; i++) {
        let name = appStorage.memberList[i].firstName + " " + appStorage.memberList[i].lastName;
        let opt = `<option value="${i}">${name}</option>`
        editTaskMember.insertAdjacentHTML('beforeend', opt);
    }
}

/////////////////////////////////// Update Tasks ///////////////////////////////
function openUpdateTasks() {
    overlay.classList.add("active");
    updateTasksPopup.classList.add("active");
}

function closeUpdateTasks() {
    overlay.classList.remove("active");
    updateTasksPopup.classList.remove("active");
}

function addRemoveTask() {
    let add = addTasks.selectedOptions;
    let remove = removeTasks.selectedOptions;

    if (add !== "") {
        let selectedAdd = Array.from(add).map(({value}) => value);

        for (let i = 0; i < selectedAdd.length; i++) {
            appStorage.sprintList[appStorage.currentSprint]._taskList.push(selectedAdd[i]);
            console.log("h")
        }
        appStorage.sprintList[appStorage.currentSprint]._taskList.sort();

        for (let i = 0; i < selectedAdd.length; i++) {
            appStorage.taskList[selectedAdd[i]].inSprint = true;
        }
    }

    if (remove !== "") {
        let selectedRemove = Array.from(remove).map(({value}) => value);

        for (let i = 0; i < selectedRemove.length; i++) {
            appStorage.sprintList[appStorage.currentSprint].taskList = appStorage.sprintList[appStorage.currentSprint].taskList.filter(function(arr) {
                return arr != selectedRemove[i];
            })
            appStorage.taskList[selectedRemove[i]].inSprint = false;
        }
    }

    updateLocalStorage(APP_DATA_KEY, appStorage);
    window.location.reload();
}

/////////////////////////////// Sprint Settings ////////////////////////////////
function openSprintSettings() {
    let title = appStorage.sprintList[appStorage.currentSprint].title;
    let startDate = appStorage.sprintList[appStorage.currentSprint].startDate;
    let endDate = appStorage.sprintList[appStorage.currentSprint].endDate;

    settingsTitle.value = title;
    settingsStart.value = startDate;
    settingsEnd.value = endDate;

    overlay.classList.add("active");
    sprintSettingsPopup.classList.add("active");
}

function closeSprintSettings() {
    overlay.classList.remove("active");
    sprintSettingsPopup.classList.remove("active");
}

function applySprintSettings() {
    let sprint = appStorage.sprintList[appStorage.currentSprint];

    // Validation - No field can be left empty
    if (settingsTitle.value && settingsStart.value && settingsEnd.value) {
        sprint.title = settingsTitle.value;
        sprint.startDate = settingsStart.value;
        sprint.endDate = settingsEnd.value;
    } else {
        alert("Please make sure all fields have been filled.")
    }

    updateLocalStorage(APP_DATA_KEY, appStorage);
    window.location.reload();
}

function deleteSprint(){
    let confirmation = confirm("Are you sure you want to delete this sprint? This action is irreversible!");

    if (confirmation) {
        for (let i = 0; i < appStorage.sprintList[appStorage.currentSprint].taskList.length; i++) {
            appStorage.taskList[appStorage.sprintList[appStorage.currentSprint].taskList[i]].inSprint = false;
        }
        appStorage.sprintList.splice(appStorage.currentSprint, 1)
        updateLocalStorage(APP_DATA_KEY, appStorage);
        window.location.replace("sprintList.html");
    }
}

function confirmationStart() {
    let confirmation = confirm("Are you sure you want to start the sprint? No further changes can be made once the sprint has started.");
    if (confirmation) {
        appStorage.sprintList[appStorage.currentSprint].status = "Active";
        updateLocalStorage(APP_DATA_KEY, appStorage);
        window.location.replace("activeSprint.html");
    }
}

let appStorage = new Storage();

if (localStorageChecker(APP_DATA_KEY) == true) {
    appStorage.fromData(takeData(APP_DATA_KEY));
} else {
    updateLocalStorage(APP_DATA_KEY, appStorage);
};

console.log(appStorage)