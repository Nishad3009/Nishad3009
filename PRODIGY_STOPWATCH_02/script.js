let startTime;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;

const display = document.querySelector('.display');
const startPauseButton = document.getElementById('startPause');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');
const lapsContainer = document.querySelector('.laps');

function formatTime(milliseconds) {
    let hours = Math.floor(milliseconds / 3600000);
    let minutes = Math.floor((milliseconds % 3600000) / 60000);
    let seconds = Math.floor((milliseconds % 60000) / 1000);
    let ms = Math.floor((milliseconds % 1000) / 10);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

function updateDisplay() {
    display.textContent = formatTime(elapsedTime);
}

function startPause() {
    if (isRunning) {
        clearInterval(timerInterval);
        startPauseButton.textContent = 'Start';
    } else {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 10);
        startPauseButton.textContent = 'Pause';
    }
    isRunning = !isRunning;
}

function reset() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    updateDisplay();
    startPauseButton.textContent = 'Start';
    isRunning = false;
    lapsContainer.innerHTML = '';
}

function lap() {
    if (isRunning) {
        const lapTime = document.createElement('div');
        lapTime.textContent = formatTime(elapsedTime);
        lapsContainer.appendChild(lapTime);
    }
}

startPauseButton.addEventListener('click', startPause);
resetButton.addEventListener('click', reset);
lapButton.addEventListener('click', lap);