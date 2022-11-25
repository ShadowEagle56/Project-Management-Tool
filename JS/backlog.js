'use strict';

const APP_DATA_KEY = "ScrumPMTData";

// Goes to the profile of the current logged in user
function userProfile() {
    appStorage.selectedMember = appStorage.memberLoggedIn._memberId;
    updateLocalStorage(APP_DATA_KEY, appStorage);
    window.location.replace('member.html')
}

const overlay = document.getElementById("overlay");

// Add User Story Popup
function openAddUSPopup() {
    let popup = document.getElementById("add-us-popup");
    popup.classList.add("active");
    overlay.classList.add("active");
}

function closeAddUSPopup() {
    let popup = document.getElementById("add-us-popup");
    popup.classList.remove("active");
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
}

function clearAddUSData() {
    document.getElementById("add-us-title").value = "";
    document.getElementById("add-us-priority").value = "";
    document.getElementById("add-us-description").value = "";
}

function addUSCard(us, id) {
    let usContainer = document.getElementById("us-items");
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

    let card = `<div class="us-card" id="us-${id}">
                    <div class="us-card-header" style="background-color: ${color}">${us.title}</div>
                    <div class="us-card-content">
                        <div class="story-point" style="background-color: ${spColor};">SP ${us.storyPoint}</div>
                    </div>
                </div>`
    
    usContainer.insertAdjacentHTML('beforeend', card)
}

let appStorage = new Storage();
const high = "rgb(240,128,128)";
const medium = "rgb(255,250,205)";
const low = "rgb(152,251,152)";

if (localStorageChecker(APP_DATA_KEY) == true) {
    appStorage.fromData(takeData(APP_DATA_KEY));
} else {
    updateLocalStorage(APP_DATA_KEY, appStorage);
};