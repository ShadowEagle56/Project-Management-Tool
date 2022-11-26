'use strict';

const APP_DATA_KEY = "ScrumPMTData";

// Goes to the profile of the current logged in user
function userProfile() {
    appStorage.selectedMember = appStorage.memberLoggedIn._memberId;
    updateLocalStorage(APP_DATA_KEY, appStorage);
    window.location.replace('member.html')
}

const overlay = document.getElementById("overlay");
const addMemberPopup = document.getElementById("add-member-popup")

// Add Member Popup
function openAddMemberPopup() {
    addMemberPopup.classList.add("active");
    overlay.classList.add("active");
}

function closeAddMemberPopup() {
    addMemberPopup.classList.remove("active");
    overlay.classList.remove("active");
}

function addMember() {
    let fname = document.getElementById("add-member-fname").value;
    let lname = document.getElementById("add-member-lname").value;
    let role = document.getElementById("add-member-role").value;
    let email = document.getElementById("add-member-email").value;
    let password = document.getElementById("add-member-password").value;

    let member = new Member(fname, lname, role, email, password);
    appStorage.memberList.push(member);
    updateLocalStorage(APP_DATA_KEY, appStorage);

    addMemberCard(member, appStorage.memberList.length - 1)

    closeAddMemberPopup();
}

function addMemberCard(member, id) {
    let memberContainer = document.getElementById("member-container");
    let role = (str) => str.split('').filter(a => a.match(/[A-Z]/)).join('')
    
    // To be revised after active sprint part is done.
    let contribution = 0;
    for (let i = 0; i < member.contribution.length; i++) {
        contribution += member.contribution[i];
    }

    let card = `<div class="member-card" id="member-${id}">
                    <div class="role">${role(member.role)}</div>
                    <div class="card-name">${member.firstName + " " + member.lastName}</div>
                    <div class="card-sp">SP ${member.totalStoryPoint}</div>
                    <div class="card-contribution">${contribution} Hours</div>
                </div>` 
    
    memberContainer.insertAdjacentHTML('beforeend', card);
}

let appStorage = new Storage();

if (localStorageChecker(APP_DATA_KEY) == true) {
    appStorage.fromData(takeData(APP_DATA_KEY));
} else {
    updateLocalStorage(APP_DATA_KEY, appStorage);
};

console.log(appStorage);