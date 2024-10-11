// Array to hold the configured sensors
const sensors = [];

// Add an event listener to the password form when it is submitted
document.getElementById('submitPassword').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Retrieve password and confirmation input values
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageElement = document.getElementById('message'); // Element to display messages

    // Regex to validate password: at least 16 characters, 1 uppercase letter, 1 special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{16,})/;

    // Check if passwords match
    if (password !== confirmPassword) {
        messageElement.textContent = "Passwords do not match."; // Display error message
    } 
    // Check if the password meets the regex criteria
    else if (!passwordRegex.test(password)) {
        messageElement.textContent = "Password must be 16 characters long, contain a capital letter and a special character.";
    } else {
        // Save the password in localStorage
        localStorage.setItem('userPassword', password);
        messageElement.style.color = "green"; // Change message color to green
        messageElement.textContent = "Password saved successfully!";
        
        // Show the sensor form and hide the password form
        document.getElementById('sensorForm').classList.remove('hidden');
        document.getElementById('passwordForm').classList.add('hidden');
    }
});

// Add an event listener for the sensor submission
document.getElementById('submitSensor').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission
    addSensor(); // Call the function to add a sensor
});

// Function to add a new sensor
function addSensor() {
    // Retrieve values for sensor number, type, and delay
    const number = document.getElementById('sensorNumber').value;
    const type = document.getElementById('sensorType').value;
    const delay = document.getElementById('delayTime').value;

    // Check if all fields are filled
    if (!number || !type || !delay) {
        alert("Please fill in all fields!"); // Alert if fields are missing
        return; // Exit the function
    }

    // Create a sensor object with the input values
    const sensor = { number, type, delay };
    sensors.push(sensor); // Add the sensor object to the sensors array
    updateSensorList(); // Update the displayed list of sensors
}

// Function to update the displayed list of configured sensors
function updateSensorList() {
    const sensorList = document.getElementById('sensors'); // Get the sensor list element
    sensorList.innerHTML = ''; // Clear existing list items

    // Loop through each sensor and create list items
    sensors.forEach(sensor => {
        const li = document.createElement('li'); // Create a new list item
        li.textContent = `Sensor ${sensor.number}: ${sensor.type} (Delay: ${sensor.delay}s)`; // Set text content
        sensorList.appendChild(li); // Append list item to the sensor list
    });

    // If there are sensors, update the visibility of certain elements
    if (sensors.length > 0) {
        document.getElementById('sensorList').classList.remove('hidden');
        document.getElementById('simulateAlarmButton').classList.remove('hidden');
        document.getElementById('alarmSimulation').classList.remove('hidden'); // Show the alarm section
        updateSensorStatus(); // Update sensor status display
    }
}

// Function to update the sensor status display
function updateSensorStatus() {
    const sensorStatus = document.getElementById('sensorStatus'); // Get the sensor status element
    sensorStatus.innerHTML = '<h3>Sensor Status</h3>'; // Heading for the status
    sensors.forEach(sensor => {
        const status = document.createElement('div'); // Create a new div for each sensor's status
        status.textContent = `Sensor ${sensor.number}: Active`; // Set status text
        sensorStatus.appendChild(status); // Append status to the sensor status element
    });
}

// Function to simulate an alarm
function simulateAlarm() {
    // Check if there are any configured sensors
    if (sensors.length === 0) {
        alert("No sensors configured!"); // Alert if no sensors are present
        return; // Exit the function
    }

    // Select a random sensor from the configured sensors
    const randomSensor = sensors[Math.floor(Math.random() * sensors.length)];
    const alarmInfo = document.getElementById('alarmInfo'); // Get the element for alarm information
    alarmInfo.textContent = `ALARM: ${randomSensor.type.toUpperCase()} detected by Sensor ${randomSensor.number}!`; // Set alarm message
    console.log(`Alarm information sent: ${randomSensor.type} alarm from Sensor ${randomSensor.number}`); // Log alarm info to console
}

// Function to update flashlight position based on mouse movement
document.addEventListener('mousemove', function(e) {
    const flashlight = document.getElementById('flashlight'); // Get the flashlight element
    // Update flashlight position based on mouse coordinates
    flashlight.style.left = `${e.pageX - flashlight.offsetWidth / 2}px`;
    flashlight.style.top = `${e.pageY - flashlight.offsetHeight / 2}px`;
});
