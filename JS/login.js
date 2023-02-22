'use strict';

const APP_DATA_KEY = "ScrumPMTData";

// Validation for login
function loginValidation(){
    let userEmail = document.getElementById("user-email").value;
    let userPass = document.getElementById("user-password").value;
    
    // Checks if input email is of correct format
    if (!userEmail.includes('@') || !userEmail.includes(".com")){
        alert("Please enter a valid email!");
        return
    }

    // Checks if input password is empty
    if (!userPass) {
        alert("Please enter your password!")
        return
    }
    
    // Checks if input email and password is correct
    for (let i = 0; i < appStorage.memberList.length; i++){
        if (userEmail == appStorage.memberList[i].email){
            if (userPass == appStorage.memberList[i].password) {
                appStorage.memberLoggedIn = i;
                updateLocalStorage(APP_DATA_KEY, appStorage);
                login.classList.remove("active");
                buttonChoice.classList.add("active");
            } else {
                alert("Incorrect Email/Password!");
                return;
            }
        };
    }
};

let appStorage = new Storage();
let login = document.getElementById("login-form");
let buttonChoice = document.getElementById("button-choice");

if (localStorageChecker(APP_DATA_KEY) == true) {
    appStorage.fromData(takeData(APP_DATA_KEY));
} else {
    updateLocalStorage(APP_DATA_KEY, appStorage);
};

if (appStorage.memberList.length == 0) {
    let defaultMember = new Member("John", "Adams", "john@gmail.com", "password", "Product Owner", 0);
    appStorage.memberList.push(defaultMember);
}

if (appStorage.memberList.length == 1) {
    let defaultMember = new Member("Sofia", "Lee", "sofia@gmail.com", "password", "Scrum Master", 1);
    appStorage.memberList.push(defaultMember);
}

if (appStorage.memberLoggedIn) {
    login.classList.remove("active");
    buttonChoice.classList.add("active");
}