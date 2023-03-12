class Employee {
    constructor(fullName, email, phoneNumber, dateOfBirth, monthlySalary, team) {
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.monthlySalary = monthlySalary;
        this.team = team;
    }
}

class Task {
    constructor(title, description, assignee, dueDate) {
        this.title = title;
        this.description = description;
        this.assignee = assignee;
        this.dueDate = dueDate;
    }
}

class Team {
    constructor(teamName, teamDescription) {
        this.teamName = teamName;
        this.teamDescription = teamDescription;
    }
}

let selectedRow = null;
let selectedRowTask = null;
let selectedRowTeam = null;

let employees = [];
let tasks = [];
let assignees = [];
let teams = [];
let existingTeams = [];
let bestEmployees = [];
let teamsPercentage = [];

window.onload = function() {

    let teamsInitial = [
        new Team('Team 1', 'Team Description 1'),
        new Team('Team 2', 'Team Description 2'),
        new Team('Team 3', 'Team Description 3')];

    teamsInitial.forEach(team => insertTeam(team));
    loadTeams();

    let employeesInitial = [new Employee('Sam Johns', 'sam.johns@gmail.com', '123456', '1995-03-10', '1000', 'Team 1'),
        new Employee('Ana Smith', 'ana.smith@gmail.com', '587456', '2000-04-16', '1100', 'Team 1'),
        new Employee('Maria Adams', 'maria.adams@gmail.com', '789456', '1991-01-17', '1100', 'Team 2'),
        new Employee('Robert Garcia', 'robert.garcia@gmail.com', '789456', '1991-01-17', '1100', 'Team 1'),
        new Employee('James Smith', 'james.smith@gmail.com', '789456', '1991-01-17', '1100', 'Team 2'),
        new Employee('David Martinez', 'david.martinez@gmail.com', '789456', '1991-01-17', '1100', 'Team 3'),
        new Employee('Peter Fox', 'peter.fox@gmail.com', '117456', '1985-04-30', '1100', 'Team 1')];

    employeesInitial.forEach(employee => insertEmployee(employee));

    let tasksInitial = [
        new Task('Task 1', 'Task Description 1', 'Ana Smith', '2023-02-26'),
        new Task('Task 2', 'Task Description 2', 'Maria Adams', '2023-02-20'),
        new Task('Task 3', 'Task Description 3', 'Robert Garcia', '2023-02-26'),
        new Task('Task 4', 'Task Description 4', 'Sam Johns', '2023-02-27'),
        new Task('Task 5', 'Task Description 5', 'Ana Smith', '2023-02-0'),
        new Task('Task 6', 'Task Description 6', 'Peter Fox', '2023-02-26'),
        new Task('Task 7', 'Task Description 7', 'James Smith', '2023-02-01'),
        new Task('Task 8', 'Task Description 8', 'Sam Johns', '2023-02-26'),
        new Task('Task 9', 'Task Description 9', 'Ana Smith', '2023-02-22'),
        new Task('Task 9', 'Task Description 10', 'Ana Smith', '2023-03-22'),
        new Task('Task 10', 'Task Description 11', 'Maria Adams', '2023-02-26')];

    tasksInitial.forEach(task => insertTask(task));

    loadAssignees();

    calculateTopFiveEmployees()

    calculateTeamsPercentage();
};

function loadAssignees() {
    var select = document.getElementById("assignee");
    employees.forEach( employee => assignees.push(employee.fullName));

    assignees.forEach(assignee => {
        var el = document.createElement("option");
        el.text = assignee;
        el.value = assignee;
        select.add(el);
    });
}

function calculateTopFiveEmployees() {
    getBestEmployeesInPastMonth();

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(showBestEmployees);
}

function calculateTeamsPercentage() {
    getTeamsPercentage();

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(showTeamsPercentage);
}

function onEmployeeFormSubmit() {
    if (validate()) {
        var formData = readFormData();
        if (selectedRow == null)
            insertEmployee(formData);
        else
            updateEmployee(formData);
        resetForm();
    }
}

function readFormData() {
    return new Employee(document.getElementById("fullName").value, document.getElementById("email").value,
                                document.getElementById("phoneNumber").value, document.getElementById("dateOfBirth").value,
                                document.getElementById("monthlySalary").value, document.getElementById("team").value);
}

function insertEmployee(data) {
    employees.push(data);
    saveEmployeesInLocalStorage();

    
    var table = document.getElementById("employeeList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.fullName;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.email;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.phoneNumber;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.dateOfBirth;
    cell5 = newRow.insertCell(4);
    cell5.innerHTML = data.monthlySalary;
    cell6 = newRow.insertCell(5);
    cell6.innerHTML = data.team;
    cell7 = newRow.insertCell(6);
    cell7.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>`;
}

function saveEmployeesInLocalStorage() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

function resetForm() {
    document.getElementById("fullName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("dateOfBirth").value = "";
    document.getElementById("monthlySalary").value = "";
    document.getElementById("team").value = "";
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("fullName").value = selectedRow.cells[0].innerHTML;
    document.getElementById("email").value = selectedRow.cells[1].innerHTML;
    document.getElementById("phoneNumber").value = selectedRow.cells[2].innerHTML;
    document.getElementById("dateOfBirth").value = selectedRow.cells[3].innerHTML;
    document.getElementById("monthlySalary").value = selectedRow.cells[4].innerHTML;
    document.getElementById("team").value = selectedRow.cells[5].innerHTML;
}
function updateEmployee(formData) {
    employees[selectedRow.rowIndex - 1] = formData;
    saveEmployeesInLocalStorage();
    selectedRow.cells[0].innerHTML = formData.fullName;
    selectedRow.cells[1].innerHTML = formData.email;
    selectedRow.cells[2].innerHTML = formData.phoneNumber;
    selectedRow.cells[3].innerHTML = formData.dateOfBirth;
    selectedRow.cells[4].innerHTML = formData.monthlySalary;
    selectedRow.cells[5].innerHTML = formData.team;
}

function onDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        let rowIndex = td.parentElement.parentElement.rowIndex;
        employees.splice(rowIndex - 1, 1);
        saveEmployeesInLocalStorage();
        calculateTopFiveEmployees();
        document.getElementById("employeeList").deleteRow(rowIndex);
        selectedRow = null;
    }
}
function validate() {
    isValid = true;
    if (document.getElementById("fullName").value == "") {
        isValid = false;
        document.getElementById("fullNameValidationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("fullNameValidationError").classList.contains("hide"))
            document.getElementById("fullNameValidationError").classList.add("hide");
    }
    return isValid;
}

function onTaskFormSubmit() {
    if (validateTask()) {
        var formData = readTaskFormData();
        if (selectedRowTask == null)
            insertTask(formData);
        else
            updateTask(formData);
        resetTaskForm();
    }
}

function readTaskFormData() {

    return new Task(document.getElementById("title").value, document.getElementById("description").value,
                                document.getElementById("assignee").value, document.getElementById("dueDate").value);                               
}

function insertTask(data) {
    tasks.push(data);
    saveTasksInLocalStorage();
    calculateTopFiveEmployees();

    var table = document.getElementById("taskList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.title;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.description;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.assignee;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.dueDate;
    cell5 = newRow.insertCell(4);
    cell5.innerHTML = `<a onClick="onEditTask(this)">Edit</a>
                       <a onClick="onDeleteTask(this)">Delete</a>`;
}

function saveTasksInLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function resetTaskForm() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("assignee").value = "";
    document.getElementById("dueDate").value = "";
    selectedRowTask = null;
}

function onEditTask(td) {
    selectedRowTask = td.parentElement.parentElement;
    document.getElementById("title").value = selectedRowTask.cells[0].innerHTML;
    document.getElementById("description").value = selectedRowTask.cells[1].innerHTML;
    document.getElementById("assignee").value = selectedRowTask.cells[2].innerHTML;
    document.getElementById("dueDate").value = selectedRowTask.cells[3].innerHTML;
}
function updateTask(formData) {
    tasks[selectedRowTask.rowIndex - 1] = formData;
    saveTasksInLocalStorage();
    calculateTopFiveEmployees();
    selectedRowTask.cells[0].innerHTML = formData.title;
    selectedRowTask.cells[1].innerHTML = formData.description;
    selectedRowTask.cells[2].innerHTML = formData.assignee;
    selectedRowTask.cells[3].innerHTML = formData.dueDate;
}

function onDeleteTask(td) {
    if (confirm('Are you sure to delete this record ?')) {
        let rowIndex = td.parentElement.parentElement.rowIndex;
        tasks.splice(rowIndex - 1, 1);
        saveTasksInLocalStorage();
        document.getElementById("taskList").deleteRow(rowIndex);
        selectedRowTask = null;
    }
}
function validateTask() {
    isValid = true;
    if (document.getElementById("title").value == "") {
        isValid = false;
        document.getElementById("titleValidationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("titleValidationError").classList.contains("hide"))
            document.getElementById("titleValidationError").classList.add("hide");
    }
    return isValid;
}

function insertTeam(data) {
    teams.push(data);
    saveTeamsInLocalStorage();
    var table = document.getElementById("teamList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.teamName;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.teamDescription;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = `<a onClick="onEditTeam(this)">Edit</a>
                       <a onClick="onDeleteTeam(this)">Delete</a>`;
}

function saveTeamsInLocalStorage() {
    localStorage.setItem("teams", JSON.stringify(teams));
}

function loadTeams() {
    var select = document.getElementById("team");
    teams.forEach( team => existingTeams.push(team.teamName));

    existingTeams.forEach(existingTeam => {
        var el = document.createElement("option");
        el.text = existingTeam;
        el.value = existingTeam;
        select.add(el);
    });
}

function onTeamFormSubmit() {
    if (validateTeam()) {
        var formData = readTeamFormData();
        if (selectedRowTeam == null)
            insertTeam(formData);
        else
            updateTeam(formData);
        resetTeamForm();
    }
}

function validateTeam() {
    isValid = true;
    if (document.getElementById("teamName").value == "") {
        isValid = false;
        document.getElementById("titleValidationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("titleValidationError").classList.contains("hide"))
            document.getElementById("titleValidationError").classList.add("hide");
    }
    return isValid;
}

function readTeamFormData() {
    return new Team(document.getElementById("teamName").value, document.getElementById("teamDescription").value);
}

function resetTeamForm() {
    document.getElementById("teamName").value = "";
    document.getElementById("teamDescription").value = "";
    selectedRowTeam = null;
}

function updateTeam(formData) {
    teams[selectedRowTeam.rowIndex - 1] = formData;
    saveTeamsInLocalStorage();
    selectedRowTeam.cells[0].innerHTML = formData.teamName;
    selectedRowTeam.cells[1].innerHTML = formData.teamDescription;
}

function onEditTeam(td) {
    selectedRowTeam = td.parentElement.parentElement;
    document.getElementById("teamName").value = selectedRowTeam.cells[0].innerHTML;
    document.getElementById("teamDescription").value = selectedRowTeam.cells[1].innerHTML;
}

function onDeleteTeam(td) {
    if (confirm('Are you sure to delete this record ?')) {
        let rowIndex = td.parentElement.parentElement.rowIndex;
        teams.splice(rowIndex - 1, 1);
        saveTeamsInLocalStorage();
        document.getElementById("teamList").deleteRow(rowIndex);
        selectedRowTeam = null;    
    }
}

function getBestEmployeesInPastMonth() {
    var now = new Date();
    var pastMonth = new Date(now).setMonth(now.getMonth() - 1);
    var employeeMap = new Map();
    var pastMonthTasks = []
    employees.forEach(employee => employeeMap.set(employee.fullName, 0));

    tasks.forEach(task => {
        var dueDate = new Date(task.dueDate);
        if (dueDate >= pastMonth && dueDate <= now) {
            pastMonthTasks.push(task)
            var assignee = task.assignee;
            var taskNumber = employeeMap.get(assignee);
            employeeMap.set(assignee, taskNumber + 1);
        }
    })

    var employeeMapSorted = new Map(
        [...employeeMap.entries()].sort((a, b) => String(b[1]).localeCompare(a[1]))
    );
    let iterator_obj = employeeMapSorted.entries();

    bestEmployees = [];

    bestEmployees.push(['Employee', 'Number of tasks']);
    for (let i=0; i<5; i++) {
        let nextEmployee = iterator_obj.next().value;
        bestEmployees.push(nextEmployee);
    }
}

function showBestEmployees() {
    var data = google.visualization.arrayToDataTable(bestEmployees);

    var options = {
        title: '5 employees with max number of finished tasks'
    };

    var chart = new google.visualization.BarChart(document.getElementById('myChart'));
    chart.draw(data, options);
}

function getTeamsPercentage() {
    var teamMap = new Map();
    teams.forEach(team => teamMap.set(team.teamName, 0));

    employees.forEach(employee => {
        let teamName = employee.team;
        let teamNumber = teamMap.get(teamName);
        teamMap.set(teamName, teamNumber + 1);

    })

    teamsPercentage = [];
    teamsPercentage.push(['Team', 'Number of employees']);
    let iterator_obj = teamMap.entries();
    for (let i=0; i<teams.length; i++) {
        let nextTeam = iterator_obj.next().value;
        teamsPercentage.push(nextTeam);
    }
}

function showTeamsPercentage() {
    var data = google.visualization.arrayToDataTable(teamsPercentage);

    var options = {
        title: 'Teams Percentage'
    };

    var chart = new google.visualization.PieChart(document.getElementById('myChart2'));
    chart.draw(data, options);
}

document.querySelector('.hamburger-menu').addEventListener("click", () =>{
    document.querySelector(".container").classList.toggle("change");
});


