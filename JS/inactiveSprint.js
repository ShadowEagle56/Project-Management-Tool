'use strict';

const APP_DATA_KEY = "ScrumPMTData";

// Constants
const dateContainer = document.getElementById("inactive-date");
const statusContainer = document.getElementById("inactive-status");
const sprintName = document.getElementById("sprint-container-title");

function loadData() {
    let current = appStorage.sprintList[appStorage.currentSprint];

    dateContainer.innerHTML = current.startDate + " -  " + current.endDate;
    statusContainer.innerHTML = current.status;
    sprintName.innerHTML = current.title;
}

let appStorage = new Storage();

if (localStorageChecker(APP_DATA_KEY) == true) {
    appStorage.fromData(takeData(APP_DATA_KEY));
} else {
    updateLocalStorage(APP_DATA_KEY, appStorage);
};

console.log(appStorage)