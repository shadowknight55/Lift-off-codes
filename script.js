// Array to hold the configured sensors
const sensors = [];

// Add an event listener to the password form when it is submitted
document.getElementById('submitPassword').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the values from the password and confirm password fields
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageElement = document.getElementById('message'); // Element to display messages

    // Regular expression for password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{16,})/;

    // Check if the passwords do not match
    if (password !== confirmPassword) {
        messageElement.textContent = "Passwords do not match."; // Display an error message
    } 
    // Check if the password does not meet the criteria
    else if (!passwordRegex.test(password)) {
        messageElement.textContent = "Password must be 16 characters long, contain a capital letter and a special character."; // Display an error message
    } 
    // If the password is valid, save it to Local Storage and show the sensor section
    else {
        localStorage.setItem('userPassword', password); // Save the password
        messageElement.style.color = "green"; // Change text color to green for success
        messageElement.textContent = "Password saved successfully!"; // Display a success message
        
        // Show the sensor form
        document.getElementById('sensorForm').classList.remove('hidden');
    }
});

// Add an event listener for the sensor submission
document.getElementById('submitSensor').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default behavior
    addSensor(); // Call the addSensor function
});

// Function to add a new sensor
function addSensor() {
    const number = document.getElementById('sensorNumber').value; // Get sensor number
    const type = document.getElementById('sensorType').value; // Get sensor type
    const delay = document.getElementById('delayTime').value; // Get delay time

    // Validate input fields
    if (!number || !type || !delay) {
        alert("Please fill in all fields!"); // Alert if any field is empty
        return;
    }

    // Create a sensor object and push it to the sensors array
    const sensor = { number, type, delay };
    sensors.push(sensor);
    updateSensorList(); // Call to update the sensor list display
}

// Function to update the displayed list of configured sensors
function updateSensorList() {
    const sensorList = document.getElementById('sensors'); // Get the list element
    sensorList.innerHTML = ''; // Clear the current list
    sensors.forEach(sensor => {
        const li = document.createElement('li'); // Create a new list item
        li.textContent = `Sensor ${sensor.number}: ${sensor.type} (Delay: ${sensor.delay}s)`; // Set text content
        sensorList.appendChild(li); // Append the list item to the sensor list
    });

    // Show the sensor list section and the alarm simulation section if there are sensors
    if (sensors.length > 0) {
        document.getElementById('sensorList').classList.remove('hidden'); // Show the sensor list section
        document.getElementById('simulateAlarmButton').classList.remove('hidden'); // Show the simulate alarm button
        document.getElementById('alarmSimulation').classList.remove('hidden'); // Show the alarm simulation section
    }
}

// Function to simulate an alarm
function simulateAlarm() {
    // Check if any sensors have been configured
    if (sensors.length === 0) {
        alert("No sensors configured!"); // Alert if no sensors are configured
        return;
    }

    // Randomly select a sensor from the configured sensors
    const randomSensor = sensors[Math.floor(Math.random() * sensors.length)];
    const alarmInfo = document.getElementById('alarmInfo'); // Get the alarm info display element
    alarmInfo.textContent = `ALARM: ${randomSensor.type.toUpperCase()} detected by Sensor ${randomSensor.number}!`; // Display alarm information

    // Simulating sending alarm info via console log
    console.log(`Alarm information sent: ${randomSensor.type} alarm from Sensor ${randomSensor.number}`);
}