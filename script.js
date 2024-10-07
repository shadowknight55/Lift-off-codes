// Array to hold the configured sensors
const sensors = [];

// Add an event listener to the password form when it is submitted
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
        messageElement.style.color = "green";
        messageElement.textContent = "Password saved successfully!";
        document.getElementById('sensorForm').classList.remove('hidden');
        document.getElementById('passwordForm').classList.add('hidden'); // Hide the password form
    }
});

// Add an event listener for the sensor submission
document.getElementById('submitSensor').addEventListener('click', function(event) {
    event.preventDefault();
    addSensor();
});

// Function to add a new sensor
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
        document.getElementById('alarmSimulation').classList.remove('hidden'); // Show the alarm section
        updateSensorStatus(); // Update sensor status display
    }
}

// Function to update the sensor status display
function updateSensorStatus() {
    const sensorStatus = document.getElementById('sensorStatus');
    sensorStatus.innerHTML = '<h3>Sensor Status</h3>'; // Heading for the status
    sensors.forEach(sensor => {
        const status = document.createElement('div');
        status.textContent = `Sensor ${sensor.number}: Active`;
        sensorStatus.appendChild(status);
    });
}

// Function to simulate an alarm
function simulateAlarm() {
    if (sensors.length === 0) {
        alert("No sensors configured!");
        return;
    }

    const randomSensor = sensors[Math.floor(Math.random() * sensors.length)];
    const alarmInfo = document.getElementById('alarmInfo');
    alarmInfo.textContent = `ALARM: ${randomSensor.type.toUpperCase()} detected by Sensor ${randomSensor.number}!`;
    console.log(`Alarm information sent: ${randomSensor.type} alarm from Sensor ${randomSensor.number}`);
}

// Function to update flashlight position
document.addEventListener('mousemove', function(e) {
    const flashlight = document.getElementById('flashlight');
    flashlight.style.left = `${e.pageX - flashlight.offsetWidth / 2}px`;
    flashlight.style.top = `${e.pageY - flashlight.offsetHeight / 2}px`;
});
