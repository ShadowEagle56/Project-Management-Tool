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

// may be able to unify functions, for now separate
function openAddSprintPopup() {
    addSprintPopup.classList.add("active");
    overlay.classList.add("active");
}

function closeAddSprintPopup() {
    addSprintPopup.classList.remove("active");
    overlay.classList.remove("active");
}

function openDelSprintPopup(){
    delSprintPopup.classList.add("active");
    overlay.classList.add("active");
}

function closeDelSprintPopup(){
    delSprintPopup.classList.remove("active");
    overlay.classList.remove("active");
}

function addSprint() {
    let title = document.getElementById("add-sprint-title").value;
    let startDate = document.getElementById("add-sprint-start-date").value;
    let endDate = document.getElementById("add-sprint-end-date").value;

    let sprint = new Sprint(title, startDate, endDate)
    appStorage.sprintList.push(sprint)
    updateLocalStorage(APP_DATA_KEY, appStorage);
    addSprintCard(sprint, title);
    closeAddSprintPopup();
    clearAddSprintData();
}

function deleteSprint(){
    let sTitle = document.getElementById("del-title").value;
    appStorage.removeItem("sprintList", sTitle);
    updateLocalStorage(APP_DATA_KEY, appStorage);
    document.getElementById("sprint-card-"+sTitle);
    closeDelSprintPopup()
    window.location.reload();
}

function addSprintCard(sprint, title) {
    let sprintContainer = document.getElementById("sprint-container");
    let card = `<div class="sprint-card" id="sprint-card-${title}">
                    <div class="card-title">${sprint.title}</div>
                    <div class="card-date">${sprint.startDate} - ${sprint.endDate}</div>
                    <div class="card-status">${sprint.status}</div>
                </div>`

    sprintContainer.insertAdjacentHTML('beforeend', card);
}

function clearAddSprintData() {
    document.getElementById("add-sprint-title").value = "";
    document.getElementById("add-sprint-start-date").value = "";
    document.getElementById("add-sprint-end-date").value = "";
}

let appStorage = new Storage();

if (localStorageChecker(APP_DATA_KEY) == true) {
    appStorage.fromData(takeData(APP_DATA_KEY));
} else {
    updateLocalStorage(APP_DATA_KEY, appStorage);
};
