'use strict';

const APP_DATA_KEY = "ScrumPMTData";

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

    let member = new Member(fname, lname, email, password, role);
    appStorage.memberList.push(member);
    updateLocalStorage(APP_DATA_KEY, appStorage);

    addMemberCard(member, appStorage.memberList.length - 1)

    closeAddMemberPopup();
    clearAddMemberPopupData();
}

function clearAddMemberPopupData() {
    document.getElementById("add-member-fname").value = "";
    document.getElementById("add-member-lname").value = "";
    document.getElementById("add-member-role").value = "";
    document.getElementById("add-member-email").value = "";
    document.getElementById("add-member-password").value = "";
}

function addMemberCard(member, id) {
    let memberContainer = document.getElementById("member-container");
    let role = (str) => str.split('').filter(a => a.match(/[A-Z]/)).join('')
    
    // To be revised after active sprint part is done.
    let contribution = 0;
    for (let i = 0; i < member.contribution.length; i++) {
        contribution += member.contribution[i];
    }

    let card = `<div class="member-card" id="member-${id}" onclick="redirectMember(${id})">
                    <div class="role">${role(member.role).slice(0,2)}</div>
                    <div class="card-name">${member.firstName + " " + member.lastName}</div>
                    <div class="card-sp">SP ${member.totalStoryPoint}</div>
                    <div class="card-contribution">${contribution} Hours</div>
                </div>` 
    
    memberContainer.insertAdjacentHTML('beforeend', card);
}

function loadData() {
    let incomplete = 0;
    let complete = 0;
    for (let i=0; i < appStorage.taskList.length; i++) {
        if (appStorage.taskList[i] != "Complete") {
            incomplete += 1;
        } else {
            complete += 1;
        }
    }
    document.getElementById("incomplete-tasks").innerHTML = incomplete;
    document.getElementById("complete-tasks").innerHTML = complete;

    createChart();
}

// Chart generator
function redirectMember(id) {
    appStorage.selectedMember = id;
    updateLocalStorage(APP_DATA_KEY, appStorage);
    window.location = "member.html";
}

// Get the dates recorded by each member
function getData(startDate, endDate){
    let datesArr = getDates(startDate, endDate);
    let temp = [];
    for (let i = 0; i < appStorage.memberList.length; i++){
        let arr = []
        for (let j = 0; j < datesArr.length; j++){
            let checked = false;
            let index = 0;
            for (let k = 0; k < appStorage.memberList[i].contribution.length; k++){
                if (appStorage.memberList[i].contribution[k][0].toISOString().slice(0,10) == datesArr[j]){
                    checked = true;
                    index = k;
                }
            }
            if (checked == true){
                arr.push(applicationList.memberList[i].contribution[index][1]);
            } else {
                arr.push(0);
            }
        }
        let dataset = {
            label: appStorage.memberList[i].firstName + " " + appStorage.memberList[i].lastName,
            backgroundColor: color[i],
            data: arr,
        }
        temp.push(dataset)
    }
    return temp
}

function createChart(startDate=getDefaultDate()[0], endDate=getDefaultDate()[1]){
    let datesArr = getDates(startDate, endDate);

    var ctx = document.getElementById("member-chart").getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datesArr,
            datasets: getData(startDate, endDate),
        },
        options: {
            title: {
                display: true,
                text: 'Overall Team Performance'
            },
            responsive: true,
            legend: {
                position: 'bottom'
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Dates"
                    }
                }],
                yAxes: [{
                    ticks:{
                        min: 0
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Time spent (Hours)"
                    }
                }],
            },
            maintainAspectRatio: false,
            
        }
    })
}


let appStorage = new Storage();

if (localStorageChecker(APP_DATA_KEY) == true) {
    appStorage.fromData(takeData(APP_DATA_KEY));
} else {
    updateLocalStorage(APP_DATA_KEY, appStorage);
};

console.log(appStorage);