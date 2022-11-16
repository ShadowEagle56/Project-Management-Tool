// Main storage class
class Storage {
    constructor() {
        this._memberList = []
        this._memberLoggedIn = "";
    };

    // Getters
    get memberList() { return this._memberList; };
    get memberLoggedIn() { return this._memberLoggedIn; };

    // Setters
    set memberLoggedIn(member) { this._memberLoggedIn = member; };
    
    // Methods
    fromData(listObj) {
        for (let i in listObj._memberList) {
            let member = new Member();
            member.fromData(listObj._memberList[i]);
            this._memberList.push(member);
        }

        this._memberLoggedIn = listObj._memberLoggedIn;
    };
}

// Member class that stores individual member data
class Member {
    constructor (fName, lName, email, pass, role, id){
        this._firstName = fName;
        this._lastName = lName;
        this._email = email;
        this._password = pass;
        this._role = role;
        this._contribution = [];
        this._memberId = id;
        this._totalStoryPoint = 0;
    };

    // Getters
    get firstName() { return this._firstName; };
    get lastName() { return this._lastName; };
    get email() { return this._email; };
    get password() { return this._password; };
    get role() { return this._role; };
    get contribution() { return this._contribution; };
    get memberId() { return this._memberId; };
    get totalStoryPoint() { return this._totalStoryPoint; };

    // Setters
    set firstName(newFname) { this._firstName = newFname; };
    set lastName(newLname) { this._lastName = newLname; };
    set email(newEmail) { this._email = newEmail; };
    set password(newPass) { this._password = newPass; };
    set role(newRole) { this._role = newRole; };
    set memberId(newId) { this._memberId = newId; };

    // Methods
    addContribution(d, h, m) {
        let date = new Date(d);
    };

    addStoryPoint(p) {
        this._totalStoryPoint += parseInt(p);
    };

    fromData(memberObj) {
        this._name = memberObj._firstName;
        this._lastName = memberObj._lastName;
        this._email = memberObj._email;
        this._password = memberObj._password;
        this._role = memberObj._role;
    };
};

// Upload data with the key into local storage
function updateLocalStorage(key, data) {
    let dataString = JSON.stringify(data);  // Convert object into string
    localStorage.setItem(key, dataString);  // Store data into local storage
};

// Retrieves data from local storage
function takeData(key) {
    let jsonString = localStorage.getItem(key); // Get item from local storage
    let data = undefined;
    try {
        data = JSON.parse(jsonString);  // Convert the data back into object type
    } catch (e) {
        console.log(e);
    } finally {
        return data
    };
};

// Checks if data exists in the local storage at the provided key
function localStorageChecker(key) {
    if (localStorage[key] == undefined) {
        return false;
    } else {
        return true;
    };
};