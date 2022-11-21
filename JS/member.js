'use strict';

const APP_DATA_KEY = "ScrumPMTData";

function memberDetails() {
    let memberName = document.getElementById("member-name");
    memberName.innerHTML = appStorage.memberList[appStorage.selectedMember].firstName + " " + appStorage.memberList[appStorage.selectedMember].lastName
}

let appStorage = new Storage();

if (localStorageChecker(APP_DATA_KEY) == true) {
    appStorage.fromData(takeData(APP_DATA_KEY));
} else {
    updateLocalStorage(APP_DATA_KEY, appStorage);
};

console.log(appStorage.memberList[appStorage.selectedMember])