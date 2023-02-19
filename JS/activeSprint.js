'use strict';

const APP_DATA_KEY = "ScrumPMTData";

//////////////////////////////// Constants /////////////////////////////////////
const dateContainer = document.getElementById("active-date");
const statusContainer = document.getElementById("active-status");
const sprintName = document.getElementById("active-title");

// Inactive
const inactive = document.getElementById("todo-tasks-container");
const inProgress = document.getElementById("inprogress-tasks-container");
const completed = document.getElementById("completed-tasks-container")

// Loads all relevant data 
function loadData() {
    let current = appStorage.sprintList[appStorage.currentSprint];

    dateContainer.innerHTML = current.startDate + " -  " + current.endDate;
    statusContainer.innerHTML = current.status;
    sprintName.innerHTML = current.title;

    if (appStorage.sprintList[appStorage.currentSprint].status === "Completed") {
        document.getElementById("end-sprint").style.display = "none";
    }

    let sprint = appStorage.sprintList[appStorage.currentSprint]

    for (let i = 0; i < sprint.taskList.length; i++) {
        let task = appStorage.taskList[sprint.taskList[i]]
        
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
                        </div>`;
                    
        // Autofill inactive tasks into the Inactive container
        if (appStorage.taskList[sprint.taskList[i]].status === "To Do") {
            card += `<div class="task-status-buttons">
                        <div style="grid-column: 3;">
                            <button onclick="moveToInProgress(${i})">&rarr;</button>
                        </div>
                    </div>
                </div>`
            inactive.insertAdjacentHTML('beforeend', card);
        }

        // Autofill inactive tasks into the In Progress container
        if (appStorage.taskList[sprint.taskList[i]].status === "In Progress") {
            card += `<div class="task-status-buttons">
                        <div>
                            <button onclick="moveToTODO(${i})">&larr;</button>
                        </div>
                        <div>
                            <button>Track Time</button>
                        </div>
                        <div>
                            <button onclick="moveToCompleted(${i})">&rarr;</button>
                        </div>
                    </div>
                </div>`
            inProgress.insertAdjacentHTML('beforeend', card);
        }

        // Autofill inactive tasks into the Completed container
        if (appStorage.taskList[sprint.taskList[i]].status === "Completed") {
            card += `<div class="task-status-buttons">
                        <div>
                            <button onclick="moveToInProgress(${i})">&larr;</button>
                        </div>
                        <div>
                            <button>Track Time</button>
                        </div>
                    </div>
                </div>`
            completed.insertAdjacentHTML('beforeend', card);
        }
    }
}

function moveToInProgress(index) {
    appStorage.taskList[index].status = "In Progress";
    updateLocalStorage(APP_DATA_KEY, appStorage);
    window.location.reload();
}

function moveToTODO(index) {
    appStorage.taskList[index].status = "To Do";
    updateLocalStorage(APP_DATA_KEY, appStorage);
    window.location.reload();
}

function moveToCompleted(index) {
    appStorage.taskList[index].status = "Completed";
    updateLocalStorage(APP_DATA_KEY, appStorage);
    window.location.reload();
}

// Confirmation to end current sprint
function confirmEnd() {
    let confirmation = confirm("Are you sure you want to end the sprint? Once a sprint has ended, no further changes can be made to this sprint.")
    if (confirmation) {
        document.getElementById("end-sprint").style.display = "none";
        appStorage.sprintList[appStorage.currentSprint].status = "Completed";
        updateLocalStorage(APP_DATA_KEY, appStorage);
    }
}

let appStorage = new Storage();

if (localStorageChecker(APP_DATA_KEY) == true) {
    appStorage.fromData(takeData(APP_DATA_KEY));
} else {
    updateLocalStorage(APP_DATA_KEY, appStorage);
};

console.log(appStorage)