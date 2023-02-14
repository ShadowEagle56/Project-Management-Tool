'use strict';

const APP_DATA_KEY = "ScrumPMTData";

//////////////////////////////// Constants /////////////////////////////////////
const dateContainer = document.getElementById("inactive-date");
const statusContainer = document.getElementById("inactive-status");
const sprintName = document.getElementById("sprint-container-title");
const overlay = document.getElementById("overlay");

// Update Tasks
const updateTasksPopup = document.getElementById("update-tasks-popup");

// Sprint Settings
const sprintSettingsPopup = document.getElementById("sprint-settings-popup");

// Loads all relevant data 
function loadData() {
    let current = appStorage.sprintList[appStorage.currentSprint];

    dateContainer.innerHTML = current.startDate + " -  " + current.endDate;
    statusContainer.innerHTML = current.status;
    sprintName.innerHTML = current.title;
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

/////////////////////////////// Sprint Settings ////////////////////////////////
function openSprintSettings() {
    overlay.classList.add("active");
    sprintSettingsPopup.classList.add("active");
}

function closeSprintSettings() {
    overlay.classList.remove("active");
    sprintSettingsPopup.classList.remove("active");
}

function confirmationStart() {
    let confirmation = confirm("Are you sure you want to start the sprint? No further changes can be made once the sprint has started.");
    if (confirmation) {
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