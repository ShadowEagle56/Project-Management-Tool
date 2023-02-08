'use strict';

const APP_DATA_KEY = "ScrumPMTData";

// Goes to the profile of the current logged in user
function userProfile() {
    appStorage.selectedMember = appStorage.memberLoggedIn._memberId;
    updateLocalStorage(APP_DATA_KEY, appStorage);
    window.location.replace('member.html')
}

const addSprintPopup = document.getElementById("add-sprint-popup");
const delSprintPopup = document.getElementById("delete-sprint-popup");
const overlay = document.getElementById("overlay");

function openAddSprintPopup() {
    addSprintPopup.classList.add("active");
    overlay.classList.add("active");
}

function closeAddSprintPopup() {
    addSprintPopup.classList.remove("active");
    overlay.classList.remove("active");
}

function addSprint() {
    let title = document.getElementById("add-sprint-title").value;
    let startDate = document.getElementById("add-sprint-start-date").value;
    let endDate = document.getElementById("add-sprint-end-date").value;

    let index = appStorage.sprintList.length - 1;

    let sprint = new Sprint(title, startDate, endDate)
    appStorage.sprintList.push(sprint)
    updateLocalStorage(APP_DATA_KEY, appStorage);
    addSprintCard(sprint, index);
    closeAddSprintPopup();
    clearAddSprintData();
}

function deleteSprint(sprintTitle){
    appStorage.removeItem("sprintList", sprintTitle);
    updateLocalStorage(APP_DATA_KEY, appStorage);
    document.getElementById("sprint-card-"+sprintTitle);
    window.location.reload();
}

function addSprintCard(sprint, i) {
    let sprintContainer = document.getElementById("sprint-container");
    // button is in the middle
    let card = `<div class="sprint-card" id="sprint-card-${i}" onclick="openSprintPage(${i})">
                    <div class="card-title">${sprint.title}</div>
                    <div class="card-date">${sprint.startDate} - ${sprint.endDate}</div>
                    <div class="card-status">${sprint.status}</div>
                    <div class="add-sprint-submit">
                        <button class="close-button" onclick="deleteSprint('${sprint.title}')">Delete Sprint</button>
                    </div>
                </div>`

    sprintContainer.insertAdjacentHTML('beforeend', card);
}

function clearAddSprintData() {
    document.getElementById("add-sprint-title").value = "";
    document.getElementById("add-sprint-start-date").value = "";
    document.getElementById("add-sprint-end-date").value = "";
}

function openSprintPage(i) {
    appStorage.currentSprint = i;
    updateLocalStorage(APP_DATA_KEY, appStorage);

    let status = appStorage.sprintList[appStorage.currentSprint].status

    if (status === "Inactive") {
        window.location.replace("inactiveSprint.html");
    } else {
        window.location.replace("activeSprint.html")
    }
}

let appStorage = new Storage();

if (localStorageChecker(APP_DATA_KEY) == true) {
    appStorage.fromData(takeData(APP_DATA_KEY));
} else {
    updateLocalStorage(APP_DATA_KEY, appStorage);
};

console.log(appStorage)