'use strict';

const APP_DATA_KEY = "ScrumPMTData";

//////////////////////////////// Constants /////////////////////////////////////
const dateContainer = document.getElementById("active-date");
const statusContainer = document.getElementById("active-status");
const sprintName = document.getElementById("active-title");

// Loads all relevant data 
function loadData() {
    let current = appStorage.sprintList[appStorage.currentSprint];

    dateContainer.innerHTML = current.startDate + " -  " + current.endDate;
    statusContainer.innerHTML = current.status;
    sprintName.innerHTML = current.title;
}

// Confirmation to end current sprint
function confirmEnd() {
    let confirmation = confirm("Are you sure you want to end the sprint? Once a sprint has ended, no further changes can be made to this sprint.")
    if (confirmation) {
        document.getElementById("end-sprint").style.display = "none";
    }
}
let appStorage = new Storage();

if (localStorageChecker(APP_DATA_KEY) == true) {
    appStorage.fromData(takeData(APP_DATA_KEY));
} else {
    updateLocalStorage(APP_DATA_KEY, appStorage);
};

console.log(appStorage)