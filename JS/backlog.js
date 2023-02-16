'use strict';

const APP_DATA_KEY = "ScrumPMTData";

function loadData() {
    // User Story
    let addTaskUS = document.getElementById("add-task-us");
    let editTaskUS = document.getElementById("edit-task-us");
    for (let i = 0; i < appStorage.usList.length; i++) {
        let usTitle = appStorage.usList[i].title.slice(0, 20);
        let opt = `<option value="${i}">${usTitle}</option>`
        addTaskUS.insertAdjacentHTML('beforeend', opt);
        editTaskUS.insertAdjacentHTML('beforeend', opt);
    }

    // Members
    let addTaskMember = document.getElementById("add-task-member");
    let editTaskMember = document.getElementById("edit-task-member");
    for (let i = 0; i < appStorage.memberList.length; i++) {
        let name = appStorage.memberList[i].firstName + " " + appStorage.memberList[i].lastName;
        let opt = `<option value="${i}">${name}</option>`
        addTaskMember.insertAdjacentHTML('beforeend', opt);
        editTaskMember.insertAdjacentHTML('beforeend', opt);
    }

    // Types
    let typeLegend = document.getElementById("legend-type");
    for (let i = 0; i < appStorage.typeList.length; i++) {
        let legend = `<div class="legend-pair">
                        <div class="legend-name">${appStorage.typeList[i].title}</div>
                        <div class="legend-color" style="background-color: ${appStorage.typeList[i].hexVal};"></div>
                    </div>`
        typeLegend.insertAdjacentHTML('beforeend', legend)
    }

}

////////////////////////////////// User Story //////////////////////////////////
const addUSPopup = document.getElementById("add-us-popup");
const usContainer = document.getElementById("us-items");
const viewUSPopup = document.getElementById("view-us-popup");
const editUSPopup = document.getElementById("edit-us-popup");

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
    window.location.reload();
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