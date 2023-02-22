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

// Track Time
const trackPopup = document.getElementById("time-popup");
const timeContainer = document.getElementById("time-container");

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
        let name = (task.member) ? appStorage.memberList[task.member]._firstName + " " + appStorage.memberList[task.member]._lastName : "";
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

                        <div style="grid-column: 3;">
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

function openTrackTimePopup(index) {
    let template = ``;

    for (let i = 0; i < appStorage.memberList[appStorage.taskList[index].member].contribution.length; i++) {
        let member = appStorage.memberList[appStorage.taskList[index].member].contribution[i];
        let date = member[0].slice(0,10);
        let hour = parseInt(member[1]);
        let min = (member[1] - parseInt(member[1])) * 60 > 0 ? parseInt((member[1] - parseInt(member[1])) * 60) : 0;
        template = `<div class="time-pair">
                        <div class="input-time-dates">${date} : ${hour} hour(s) ${min} minute(s)</div>
                        <div i class="fa fa-trash-o" onclick="deleteTimeLog(${i})"></i></div>
                    </div>`
        timeContainer.insertAdjacentHTML('beforeend', template);
    }
    viewTaskPopup.classList.remove("active");
    trackPopup.classList.add("active");
    overlay.classList.add("active");
    if(!document.getElementById(`time-container-${index}`)){
        document.getElementById("time-popup").insertAdjacentHTML('beforeend',
        `<div class="time-container" id="time-container-${index}"></div>`);
        console.log(appStorage.taskList[index].timeList
            //document.getElementById(`time-container-${index}`
            //   ).insertAdjacentHTML(
            //        'beforeend', `<div class="time-pair">
            //        <div class="input-time-dates">${t.date} : ${t.days} days ${t.hrs} hours ${t.mins} minutes</div>
            //            <div i class="fa fa-trash-o" onclick="this.parentNode.remove()"></i></div>
            //        </div>`
                );
    }
}

function addTime(){
    let days = document.getElementById("time-day").value
    let hrs = document.getElementById("time-hour").value
    let min = document.getElementById("time-min").value
    let date = document.getElementById("time-date").value
    let id = document.querySelector('[id^=time-container]').id
    appStorage.taskList[id.slice(15)].timeList.push(new Time(days, hrs, min, date))
    console.log(appStorage.taskList[id.slice(15)].timeList)
    document.getElementById(id).insertAdjacentHTML(
        'beforeend', `<div class="time-pair">
        <div class="input-time-dates">${date} : ${days} days ${hrs} hours ${min} minutes</div>
            <div i class="fa fa-trash-o" onclick="this.parentNode.remove()"></i></div>
        </div>`
    )
    updateLocalStorage(APP_DATA_KEY, appStorage);
}

function deleteTimeLog(index) {
    // Todo
}

function closeTrackTimePopup() {
    timeContainer.innerHTML = "";
    trackPopup.classList.remove("active");
    viewTaskPopup.classList.add("active");
}

function addTrackedTime(index) {
    let date = document.getElementById("time-date").value;
    let hour = document.getElementById("time-hour").value;
    let min = document.getElementById("time-min").value;

    appStorage.memberList[appStorage.taskList[index].member].addContribution(date, hour, min);
    console.log(appStorage.memberList[appStorage.taskList[index].member])

    let template = `<div class="time-pair">
                        <div class="input-time-dates">${date.slice(0,10)} : ${hour} hour(s) ${min} minute(s)</div>
                        <div i class="fa fa-trash-o"></i></div>
                    </div>`
    timeContainer.insertAdjacentHTML('beforeend', template);
    updateLocalStorage(APP_DATA_KEY, appStorage);
    // window.location.reload();
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