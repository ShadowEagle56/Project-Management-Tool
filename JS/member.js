'use strict';

const APP_DATA_KEY = "ScrumPMTData";

// Goes to the profile of the current logged in user
function userProfile() {
    appStorage.selectedMember = appStorage.memberLoggedIn._memberId;
    updateLocalStorage(APP_DATA_KEY, appStorage);
    window.location.replace('member.html')
}

function memberDetails() {
    let memberName = document.getElementById("member-name");
    let fname = appStorage.memberList[appStorage.selectedMember].firstName;
    let lname = appStorage.memberList[appStorage.selectedMember].lastName
    memberName.innerHTML = fname + " " + lname;

    let incompleteC = document.getElementById("incomplete-num");
    let completeC = document.getElementById("completed-num");

    let incomplete = 0;
    let complete = 0;

    for (let i = 0; i < appStorage.taskList.length; i++) {
        if (appStorage.taskList[i].member._firstName == fname && appStorage.taskList[i].member._lastName == lname && appStorage.taskList[i].status != "Complete") {
            incomplete += 1;
        } else if (appStorage.taskList[i].member._firstName == fname && appStorage.taskList[i].member._lastName == lname && appStorage.taskList[i].status == "Complete") {
            complete += 1;
        }
    }

    incompleteC.innerHTML = incomplete;
    completeC.innerHTML = complete;
}

let appStorage = new Storage();

if (localStorageChecker(APP_DATA_KEY) == true) {
    appStorage.fromData(takeData(APP_DATA_KEY));
} else {
    updateLocalStorage(APP_DATA_KEY, appStorage);
};