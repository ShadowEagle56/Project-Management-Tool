// Main storage class
class Storage {
    constructor() {
        this._memberList = [];
        this._memberLoggedIn = "";
        this._selectedMember = 0;
        this._taskList = [];
        this._usList = [];
        this._sprintList = [];
        this._typeList = [];
    };

    // Getters
    get memberList() { return this._memberList; };
    get memberLoggedIn() { return this._memberLoggedIn; };
    get selectedMember() { return this._selectedMember; };
    get taskList() { return this._taskList; };
    get usList() { return this._usList; };
    get sprintList() { return this._sprintList; };
    get typeList() { return this._typeList; };

    // Setters
    set memberLoggedIn(member) { this._memberLoggedIn = member; };
    set selectedMember(newNum) { this._selectedMember = newNum; };
    
    // Methods
    fromData(listObj) {
        for (let i in listObj._memberList) {
            let member = new Member();
            member.fromData(listObj._memberList[i]);
            this._memberList.push(member);
            if (window.location.href.includes("memberList.html")) {
                addMemberCard(member, i)
            }
        }

        for (let i in listObj._taskList) {
            let task = new Task();
            task.fromData(listObj._taskList[i]);
            this._taskList.push(task);
            if (window.location.href.includes("backlog.html")) {
                addTaskCard(task, i);
            }
        }

        for (let i in listObj._usList) {
            let us = new UserStory();
            us.fromData(listObj._usList[i]);
            this._usList.push(us);
            if (window.location.href.includes("backlog.html")){
                addUSCard(us, i);
            };
        }

        for (let i in listObj._sprintList) {
            let sprint = new Sprint();
            sprint.fromData(listObj._sprintList[i]);
            this._sprintList.push(sprint);
            if (window.location.href.includes("sprintList.html")){
                addSprintCard(sprint, i);
            }
        }

        for(let i in listObj._typeList){
            let type = new Type();
            type.fromData(listObj._typeList[i]);
            this.typeList.push(type);
        }

        this._memberLoggedIn = listObj._memberLoggedIn;
        this._selectedMember = listObj._selectedMember;
    };

    removeItem(data, key){
        if(data = "sprintList"){
            for(let i = 0; i < this._sprintList.length; i++){
                if(this._sprintList[i].title == key){
                    this._sprintList.splice(i, 1);
                    return true;
                }
            } return false;
        } else{
            return false;
        }
    }
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
        this.firstName = memberObj._firstName;
        this._lastName = memberObj._lastName;
        this._email = memberObj._email;
        this._password = memberObj._password;
        this._role = memberObj._role;
    };
};

// Task class that stores all relevant informationn regarding a task
class Task {
    constructor (title, p){
        this._title = title;
        this._member;
        this._description = "";
        this._priority = p;
        this._storyPoint = 0;
        this._labels = [];
        this._type;
        this._startDate;
        this._endDate;
        this._index;
        this._status = "To Do";
        this._sprint;
        this._timeSpent;
        this._totalHour = 0;
        this._userStory;
    };

    // Getters
    get title() { return this._title; };
    get member() { return this._member; };
    get description() { return this._description; };
    get priority() { return this._priority; };
    get storyPoint() { return this._storyPoint; };
    get labels() { return this._labels; };
    get type() { return this._type; };
    get startDate() { return this._startDate; };
    get endDate() { return this._endDate; };
    get index() { return this._index; };
    get status() { return this._status; };
    get sprint() { return this._sprint; };
    get timeSpent() { return this._timeSpent; };
    get totalHour() { return this._totalHour; };
    get userStory() { return this._userStory; };

    // Setters
    set title(newTitle) { this._title = newTitle; };
    set member(newMember) { this._member = newMember; };
    set description(newDesc) { this._description = newDesc; };
    set priority(newP) { this._priority = newP; };
    set storyPoint(newSP) { this._storyPoint = newSP; };
    set labels(newLabels) { this._labels = newLabels; };
    set type(newType) { this._type = newType; };
    set startDate(newDate) { this._startDate = newDate; };
    set endDate(newDate) { this._endDate = newDate; };
    set index(newIndex) { this._index = newIndex; };
    set status(newStatus) { this._status = newStatus; };
    set sprint(newSprint) { this._sprint = newSprint; };
    set userStory(newUS) { this._userStory = newUS; };

    // Methods
    addRecord(date, hour, minute) {
        let totalTime =  parseFloat(hour) + (parseFloat(minute)/60);
        let record = [date, totalTime];
        this._timeSpent.push(record);
        let total = totalTime + parseFloat(this._totalHour);
        this._totalHour = total.toFixed(2)
        updateLocalStorage(APP_DATA_KEY, appStorage)
    };

    fromData(taskObj) {
        this._title = taskObj._title;
        this._member = taskObj._member;
        this._description = taskObj._description;
        this._priority = taskObj._priority;
        this._storyPoint = taskObj._storyPoint;
        this._labels = taskObj._labels;
        this._type = taskObj._type;
        this._startDate = taskObj._startDate;
        this._endDate = taskObj._endDate;
        this._index = taskObj._index;
        this._status = taskObj._status;
        this._sprint = taskObj._sprint;
        this._timeSpent = taskObj._timeSpent;
        this._userStory = taskObj._userStory;
    };
};

class UserStory {
    constructor (title, p) {
        this._title = title;
        this._priority = p;
        this._storyPoint = 0;
        this._description = "";
        this._tasks = [];
        this._id = 0;
    }

    // Getters
    get title() { return this._title; };
    get priority() { return this._priority; };
    get storyPoint() { return this._storyPoint; };
    get description() { return this._description; };
    get tasks() { return this._tasks; };
    get id() { return this._id; };

    // Setters
    set title(newTitle) { this._title = newTitle; };
    set priority(newP) { this._priority = newP; };
    set storyPoint(newSP) { this._storyPoint = newSP; };
    set description(newDesc) { this._description = newDesc; };
    set id(newId) { this._id = newId; };

    // Methods
    fromData(usObj) {
        this._title = usObj._title;
        this._priority = usObj._priority;
        this._storyPoint = usObj._storyPoint;
        this._description = usObj._description;
        this._tasks = usObj._tasks;
        this._id = usObj._id;
    };
}

class Sprint {
    constructor (title, startDate, endDate) {
        this._title = title;
        this._startDate = startDate;
        this._endDate = endDate;
        this._status = "Inactive";
    }

    // Getters
    get title() { return this._title; };
    get startDate() { return this._startDate; };
    get endDate() { return this._endDate; };
    get status() { return this._status; };

    // Setters
    set title(newTitle) { this._title = newTitle; };
    set startDate(newDate) { this._startDate = newDate; };
    set endDate(newDate) { this._endDate = newDate; };
    set status(newStatus) { this._status = newStatus; };

    // Methods
    fromData(sprintObj) {
        this._title = sprintObj._title;
        this._startDate = sprintObj._startDate;
        this._endDate = sprintObj._endDate;
        this._status = sprintObj._status;
    }
}

// Type class
class Type{
    constructor(title, hexVal){
        this._title = title;
        this._hexVal = hexVal;
    }

    get title() { return this._title };
    get hexVal() { return this._hexVal };

    set title(newTitle) { this._title = newTitle };
    set hexVal(newHex) { this._hexVal = newHex };

    fromData(typeObj){
        this._title = typeObj._title;
        this._hexVal = typeObj._hexVal;
    }
}

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