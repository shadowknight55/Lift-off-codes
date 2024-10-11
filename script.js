// Array to hold the configured sensors
const sensors = [];
let adminPassword = "Launchpad101@"; // Hardcoded admin password for simplicity
let alarmsActive = true; // Track alarm status
let adminLoggedIn = false; // Track admin login state
const userPasswords = {}; // Object to hold user passwords

// Load the admin password from localStorage when the page loads
window.onload = function() {
    const storedAdminPassword = localStorage.getItem('adminPassword');
    if (storedAdminPassword) {
        adminPassword = storedAdminPassword; // Update the adminPassword variable
    }
};

// Admin Login Button Functionality
document.getElementById('adminLoginButton').addEventListener('click', function() {
    const enteredPassword = prompt("Enter Admin Password:");
    if (enteredPassword === adminPassword) {
        adminLoggedIn = true; // Set adminLoggedIn to true
        document.getElementById('passwordForm').classList.add('hidden'); // Hide password form
        document.getElementById('adminMenu').classList.remove('hidden'); // Show admin menu
        alert("Admin access granted! You can now change user passwords and manage settings.");
    } else {
        alert("Incorrect password!");
    }
});

// Admin Password Change Logic
document.getElementById('changeAdminPassword').addEventListener('click', function() {
    const newPassword = document.getElementById('adminPassword').value;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{16,})/;

    if (newPassword) {
        if (!passwordRegex.test(newPassword)) {
            alert("Password must be 16 characters long, contain a capital letter and a special character.");
            return;
        }
        adminPassword = newPassword; // Update local variable
        localStorage.setItem('adminPassword', newPassword); // Save new password to localStorage
        alert("Admin password changed successfully!");
    } else {
        alert("Please enter a new password.");
    }
});

// Password Submission Logic
document.getElementById('submitPassword').addEventListener('click', function(event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageElement = document.getElementById('message');

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{16,})/;

    if (password !== confirmPassword) {
        messageElement.textContent = "Passwords do not match.";
    } else if (!passwordRegex.test(password)) {
        messageElement.textContent = "Password must be 16 characters long, contain a capital letter and a special character.";
    } else {
        localStorage.setItem('userPassword', password);
        userPasswords['user1'] = password; // Save to userPasswords
        messageElement.style.color = "green";
        messageElement.textContent = "Password saved successfully!";
        
        document.getElementById('sensorForm').classList.remove('hidden'); // Show sensor form
        document.getElementById('passwordForm').classList.add('hidden'); // Hide password form
    }
});

// Sensor Logic
document.getElementById('submitSensor').addEventListener('click', function(event) {
    event.preventDefault();
    addSensor();
});

function addSensor() {
    const number = document.getElementById('sensorNumber').value;
    const type = document.getElementById('sensorType').value;
    const delay = document.getElementById('delayTime').value;

    if (!number || !type || !delay) {
        alert("Please fill in all fields!");
        return;
    }

    const sensor = { number, type, delay };
    sensors.push(sensor);
    updateSensorList();
}

// Function to update the displayed list of configured sensors
function updateSensorList() {
    const sensorList = document.getElementById('sensors');
    sensorList.innerHTML = '';

    sensors.forEach(sensor => {
        const li = document.createElement('li');
        li.textContent = `Sensor ${sensor.number}: ${sensor.type} (Delay: ${sensor.delay}s)`;
        sensorList.appendChild(li);
    });

    if (sensors.length > 0) {
        document.getElementById('sensorList').classList.remove('hidden');
        document.getElementById('simulateAlarmButton').classList.remove('hidden');
        document.getElementById('alarmSimulation').classList.remove('hidden');
    }
}

// Toggle Alarms Functionality
function toggleAlarms() {
    if (!adminLoggedIn) {
        alert("You must be logged in as admin to toggle alarms.");
        return; // Exit the function if admin is not logged in
    }
    
    alarmsActive = !alarmsActive;
    document.getElementById('toggleAlarms').textContent = alarmsActive ? "Disable Alarms" : "Enable Alarms";
}

// Change User Password Logic
document.getElementById('changeUserPassword').addEventListener('click', function() {
    const selectedUser = document.getElementById('userSelect').value;
    const newUserPassword = document.getElementById('userPassword').value;

    if (selectedUser && newUserPassword) {
        userPasswords[selectedUser] = newUserPassword;
        alert(`Password for ${selectedUser} changed successfully!`);
    } else {
        alert("Please select a user and enter a new password.");
    }
});

// Access Sensor Menu from Admin Menu
document.getElementById('accessSensorMenu').addEventListener('click', function() {
    document.getElementById('adminMenu').classList.add('hidden'); // Hide admin menu
    document.getElementById('sensorForm').classList.remove('hidden'); // Show sensor form
});

// Simulate Alarm Functionality
function simulateAlarm() {
    if (sensors.length === 0) {
        alert("No sensors configured!");
        return;
    }

    const randomSensor = sensors[Math.floor(Math.random() * sensors.length)];
    const alarmInfo = document.getElementById('alarmInfo');
    alarmInfo.textContent = `ALARM: ${randomSensor.type.toUpperCase()} detected by Sensor ${randomSensor.number}!`;
}
