// Array to hold the configured sensors
const sensors = [];
let adminPassword = "Launchpad101@"; // Hardcoded admin password for simplicity
let alarmsActive = true; // Track alarm status
let adminLoggedIn = false; // Track admin login state
const userPasswords = {}; // Object to hold user passwords

const locations = ["Living Room", "Kitchen", "Bedroom", "Garage"]; // Define the locations

// Load the admin password from localStorage when the page loads
window.onload = function() {
    const storedAdminPassword = localStorage.getItem('adminPassword');
    if (storedAdminPassword) {
        adminPassword = storedAdminPassword; // Update the adminPassword variable
    }
};

// Admin Login Button Functionality
document.getElementById('adminLoginButton').addEventListener('click', function() {
    showPopup('adminLoginPopup');
});

// Admin Login Popup Logic
document.getElementById('adminLoginPopupButton').addEventListener('click', function() {
    const enteredPassword = document.getElementById('adminPasswordInput').value;
    if (enteredPassword === adminPassword) {
        adminLoggedIn = true; // Set adminLoggedIn to true
        closePopup('adminLoginPopup');
        document.getElementById('passwordForm').classList.add('hidden'); // Hide password form
        document.getElementById('adminMenu').classList.remove('hidden'); // Show admin menu
        alert("Admin access granted! You can now change user passwords and manage settings.");
    } else {
        alert("Incorrect password!");
    }
});

// Access Sensor Menu from Admin Menu
document.getElementById('accessSensorMenu').addEventListener('click', function() {
    if (adminLoggedIn) { // Check if the admin is logged in
        document.getElementById('adminMenu').classList.add('hidden'); // Hide admin menu
        document.getElementById('sensorForm').classList.remove('hidden'); // Show sensor form
    } else {
        alert("Please log in as admin to access the sensor menu.");
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
    const location = locations[number - 1]; // Get the location based on sensor number

    if (!number || !type || !delay) {
        alert("Please fill in all fields!");
        return;
    }

    const sensor = { number, type, delay, location }; // Include location in the sensor object
    sensors.push(sensor);
    updateSensorList();
}

// Function to update the displayed list of configured sensors
function updateSensorList() {
    const sensorList = document.getElementById('sensors');
    sensorList.innerHTML = '';

    sensors.forEach(sensor => {
        const li = document.createElement('li');
        li.textContent = `Sensor ${sensor.number}: ${sensor.type} (Delay: ${sensor.delay}s) in the ${sensor.location}`; // Include location
        sensorList.appendChild(li);
    });

    if (sensors.length > 0) {
        document.getElementById('sensorList').classList.remove('hidden');
        document.getElementById('simulateAlarmButton').classList.remove('hidden');
        document.getElementById('alarmSimulation').classList.remove('hidden');
    }
}

// Simulate Alarm Functionality
function simulateAlarm() {
    if (sensors.length === 0) {
        alert("No sensors configured!");
        return;
    }

    const randomSensor = sensors[Math.floor(Math.random() * sensors.length)];
    const alarmInfo = document.getElementById('alarmInfo');
    alarmInfo.textContent = `ALARM: ${randomSensor.type.toUpperCase()} detected by Sensor ${randomSensor.number} in the ${randomSensor.location}!`; // Include location
    console.log(`Alarm information sent: ${randomSensor.type} alarm from Sensor ${randomSensor.number} in ${randomSensor.location}`); // Log alarm info to console
}

// Function to deactivate a specific sensor alarm
function deactivateSensorAlarm(sensorNumber) {
    const sensorIndex = sensors.findIndex(sensor => sensor.number === sensorNumber.toString());
    if (sensorIndex > -1) {
        alert(`Alarm for Sensor ${sensorNumber} in the ${sensors[sensorIndex].location} has been deactivated.`);
        
        // Clear the alarm message
        const alarmInfo = document.getElementById('alarmInfo');
        alarmInfo.textContent = ''; // Clear alarm info
        alarmInfo.classList.add('hidden'); // Optionally hide the alarm info
        
        sensors.splice(sensorIndex, 1); // Remove the sensor from the array
        updateSensorList(); // Update the sensor list display
    } else {
        alert("No such sensor found!");
    }
}

// Add a button to deactivate alarms
document.getElementById('deactivateAlarmButton').addEventListener('click', function() {
    showPopup('deactivateAlarmPopup');
});

// Deactivate Alarm Popup Logic
document.getElementById('deactivateAlarmButtonPopup').addEventListener('click', function() {
    const sensorNumberInput = parseInt(document.getElementById('sensorNumberInput').value, 10);
    deactivateSensorAlarm(sensorNumberInput);
    closePopup('deactivateAlarmPopup');
});

// Function to show a popup
function showPopup(popupId) {
    document.getElementById(popupId).style.display = 'block';
}

// Function to close a popup
function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}
