// Array to hold the configured sensors
const sensors = [];
let adminPassword = "Launchpad101@344"; // Hardcoded admin password for simplicity
let alarmsActive = true; // Track alarm status
let adminLoggedIn = false; // Track admin login state
const userPasswords = {}; // Object to hold user passwords

// Define locations for the sensors
const locations = ["Living Room", "Kitchen", "Bedroom", "Garage", "Hallway", "Bathroom"];

// Load the admin password from localStorage when the page loads
window.onload = function() {
    const storedAdminPassword = localStorage.getItem('adminPassword');
    if (storedAdminPassword) {
        adminPassword = storedAdminPassword; // Update the adminPassword variable
    }
    displayRandomSensors(); // Display random sensors only on page load
    document.getElementById("backToLoginButton").style.display = "none"; // Hide the button on load
};

// Admin Login Button Functionality
document.getElementById('adminLoginButton').addEventListener('click', function() {
    showPopup('adminLoginPopup'); // Show the admin login popup
});

// Admin Login Popup Logic
document.getElementById('adminLoginPopupButton').addEventListener('click', function() {
    const enteredPassword = document.getElementById('adminPasswordInput').value;
    if (enteredPassword === adminPassword) {
        adminLoggedIn = true; // Set adminLoggedIn to true
        closePopup('adminLoginPopup'); // Close the login popup
        document.getElementById('passwordForm').classList.add('hidden'); // Hide password form
        document.getElementById('adminMenu').classList.remove('hidden'); // Show admin menu
        document.getElementById("backToLoginButton").style.display = "block"; // Show back to login button
        alert("Admin access granted! You can now change user passwords and manage settings.");
    } else {
        alert("Incorrect password!"); // Alert for incorrect password
    }
});

// Access Sensor Menu from Admin Menu
document.getElementById('accessSensorMenu').addEventListener('click', function() {
    if (adminLoggedIn) { // Check if the admin is logged in
        document.getElementById('adminMenu').classList.add('hidden'); // Hide admin menu
        document.getElementById('sensorForm').classList.remove('hidden'); // Show sensor form
        document.getElementById("backToLoginButton").style.display = "block"; // Show back to login button
    } else {
        alert("Please log in as admin to access the sensor menu."); // Alert if not logged in
    }
});

// Admin Password Change Logic
document.getElementById('changeAdminPassword').addEventListener('click', function() {
    const newPassword = document.getElementById('adminPassword').value;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{16,})/; // Regex for password validation

    if (newPassword) {
        if (!passwordRegex.test(newPassword)) {
            alert("Password must be 16 characters long, contain a capital letter and a special character.");
            return; // Exit if password validation fails
        }
        adminPassword = newPassword; // Update local variable
        localStorage.setItem('adminPassword', newPassword); // Save new password to localStorage
        alert("Admin password changed successfully!");
    } else {
        alert("Please enter a new password."); // Alert if no password is entered
    }
});

// Password Submission Logic
document.getElementById('submitPassword').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageElement = document.getElementById('message');

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{16,})/; // Regex for password validation

    if (password !== confirmPassword) {
        messageElement.textContent = "Passwords do not match."; // Alert if passwords don't match
    } else if (!passwordRegex.test(password)) {
        messageElement.textContent = "Password must be 16 characters long, contain a capital letter and a special character."; // Alert for invalid password
    } else {
        localStorage.setItem('userPassword', password); // Store user password in localStorage
        userPasswords['user1'] = password; // Save to userPasswords object
        messageElement.style.color = "green"; // Set success message color
        messageElement.textContent = "Password saved successfully!";
        
        document.getElementById('sensorForm').classList.remove('hidden'); // Show sensor form
        document.getElementById('passwordForm').classList.add('hidden'); // Hide password form
        document.getElementById("backToLoginButton").style.display = "block"; // Show back to login button
    }
});

// Submit Sensor Details Logic
document.getElementById('submitSensor').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission
    addSensor(); // Call addSensor function
});

// Function to add a new sensor
function addSensor() {
    const number = document.getElementById('sensorNumber').value;
    const type = document.getElementById('sensorType').value;
    const delay = document.getElementById('delayTime').value;
    const location = locations[number - 1]; // Get the location based on sensor number

    // Validate that all fields are filled
    if (!number || !type || !delay) {
        alert("Please fill in all fields!");
        return; // Exit if validation fails
    }

    const sensor = { number, type, delay, location }; // Create a sensor object
    sensors.push(sensor); // Add the sensor to the sensors array
    updateSensorList(); // Update the displayed list of sensors
}

// Function to update the displayed list of configured sensors
function updateSensorList() {
    const sensorList = document.getElementById('sensors');
    sensorList.innerHTML = ''; // Clear current list

    sensors.forEach(sensor => {
        const li = document.createElement('li'); // Create a new list item for each sensor
        li.textContent = `Sensor ${sensor.number}: ${sensor.type} (Delay: ${sensor.delay}s) in the ${sensor.location}`; // Set text content
        sensorList.appendChild(li); // Append the list item to the sensor list

        // Create a deactivate button
        const deactivateButton = document.createElement('button');
        deactivateButton.textContent = 'Deactivate';
        deactivateButton.addEventListener('click', function() {
            deactivateSensorAlarm(sensor.number); // Call deactivate function
            li.remove(); // Remove the sensor from the displayed list
        });
        li.appendChild(deactivateButton); // Append the button to the list item
    });

    // Show sensor list and alarm simulation button if there are any sensors
    if (sensors.length > 0) {
        document.getElementById('sensorList').classList.remove('hidden');
        document.getElementById('simulateAlarmButton').classList.remove('hidden');
        document.getElementById('alarmSimulation').classList.remove('hidden');
    }
}

// Function to deactivate a sensor alarm
function deactivateSensorAlarm(sensorNumber) {
    const index = sensors.findIndex(sensor => sensor.number === sensorNumber);
    if (index !== -1) {
        sensors.splice(index, 1); // Remove the sensor from the array
        alert(`Sensor ${sensorNumber} has been deactivated.`); // Notify user
        updateSensorList(); // Update the sensor list display
    } else {
        alert(`Sensor ${sensorNumber} not found.`); // Notify if sensor is not found
    }
}

// Function to generate random sensors
function generateRandomSensors() {
    const sensorTypes = ["heat", "fire", "smoke"]; // Types of sensors
    const randomSensors = [];

    // Generate 5 random sensors
    for (let i = 0; i < 5; i++) {
        const type = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        randomSensors.push({ type, location, status: true }); // Add random sensor to array
    }

    return randomSensors; // Return the array of random sensors
}

// Function to display random sensors
function displayRandomSensors() {
    const randomSensors = generateRandomSensors(); // Generate random sensors
    const randomSensorList = document.getElementById('randomSensorList');
    randomSensorList.innerHTML = ''; // Clear current list

    randomSensors.forEach((sensor, index) => {
        const li = document.createElement('li'); // Create a new list item for each random sensor
        li.textContent = `Sensor ${index + 1}: ${sensor.type} in the ${sensor.location} - Status: Active`; // Set text content

        // Button to toggle sensor status
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Deactivate'; // Initial button text
        toggleButton.addEventListener('click', function() {
            sensor.status = !sensor.status; // Toggle status
            li.textContent = `Sensor ${index + 1}: ${sensor.type} in the ${sensor.location} - Status: ${sensor.status ? 'Active' : 'Inactive'}`; // Update text
            toggleButton.textContent = sensor.status ? 'Deactivate' : 'Activate'; // Update button text
        });

        li.appendChild(toggleButton); // Append the toggle button to the list item
        randomSensorList.appendChild(li); // Append the list item to the random sensor list
    });
}

// Simulate Alarm Functionality
document.getElementById('simulateAlarmButton').addEventListener('click', function() {
    simulateAlarm(); // Call the simulateAlarm function when button is clicked
});

// Function to simulate an alarm
function simulateAlarm() {
    if (sensors.length === 0) {
        alert("No sensors configured to simulate an alarm!"); // Alert if no sensors
        return; // Exit if no sensors
    }

    const activeSensor = sensors[Math.floor(Math.random() * sensors.length)]; // Randomly select an active sensor
    const alarmInfo = document.getElementById('alarmInfo');

    alarmInfo.textContent = `ALARM! Sensor ${activeSensor.number} triggered: ${activeSensor.type} in the ${activeSensor.location}.`; // Show alarm message

    // Show sensor status
    const sensorStatus = document.getElementById('sensorStatus');
    sensorStatus.innerHTML = `Active Sensors: ${sensors.map(sensor => sensor.type).join(', ')}`; // List active sensors
    document.getElementById('deactivateAlarmButton').classList.remove('hidden'); // Show deactivate button
}

// Deactivate Alarm Functionality
document.getElementById('deactivateAlarmButton').addEventListener('click', function() {
    alarmsActive = false; // Set alarmsActive to false
    document.getElementById('alarmInfo').textContent = 'Alarm has been deactivated.'; // Show deactivation message
    document.getElementById('sensorStatus').innerHTML = ''; // Clear sensor status
    document.getElementById('deactivateAlarmButton').classList.add('hidden'); // Hide deactivate button
});

// Popup Close Functionality
function closePopup(popupId) {
    document.getElementById(popupId).style.display = "none"; // Close the popup by changing display style
}

// Show Popup Functionality
function showPopup(popupId) {
    document.getElementById(popupId).style.display = "block"; // Show the popup by changing display style
}

document.getElementById("backToLoginButton").addEventListener("click", function() {
    document.getElementById('passwordForm').classList.remove('hidden'); // Show the password form
    document.getElementById('sensorForm').classList.add('hidden'); // Hide the sensor form
    document.getElementById('sensorList').classList.add('hidden'); // Hide the sensor list
    document.getElementById('alarmSimulation').classList.add('hidden'); // Hide alarm simulation
    document.getElementById('adminMenu').classList.add('hidden'); // Hide admin menu
    document.getElementById("backToLoginButton").style.display = "none"; // Hide the back to login button
});
