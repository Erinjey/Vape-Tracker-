/* app.js */
const logButton = document.getElementById('logButton');
const logList = document.getElementById('logList');
const goalInput = document.getElementById('goalInput');
const setGoalButton = document.getElementById('setGoalButton');
const goalDisplay = document.getElementById('goalDisplay');
const motivationBox = document.getElementById('motivation');
const progressChartCanvas = document.getElementById('progressChart');

let logs = JSON.parse(localStorage.getItem('logs')) || {};
let goal = localStorage.getItem('goal') || "No goal set.";

// Keep only last 2 days of logs in the UI but retain full data for the graph
function pruneLogs() {
    const sortedDates = Object.keys(logs).sort((a, b) => new Date(b) - new Date(a));
    const recentLogs = sortedDates.slice(0, 2).reduce((acc, date) => {
        acc[date] = logs[date];
        return acc;
    }, {});
    return recentLogs;
}

// Update UI
function updateUI() {
    const recentLogs = pruneLogs();
    logList.innerHTML = Object.keys(recentLogs).map(date => 
        `<li>✅ ${date}: ${recentLogs[date]} puffs</li>`).join('');
    goalDisplay.textContent = `🎯 Your Goal: ${goal}`;
    updateChart();
    showMotivation();
}

// Log vape session
logButton.addEventListener('click', () => {
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
    logs[today] = (logs[today] || 0) + 1;
    localStorage.setItem('logs', JSON.stringify(logs));
    updateUI();
});

// Set goal
setGoalButton.addEventListener('click', () => {
    goal = goalInput.value;
    localStorage.setItem('goal', goal);
    updateUI();
});

// Show motivation
function showMotivation() {
    const quotes = [
        "Every vape skipped is a step towards a healthier you!", 
        "Your lungs thank you for every break you take!", 
        "You're stronger than your cravings. Keep going!"
    ];
    motivationBox.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

// Update chart
function updateChart() {
    const ctx = progressChartCanvas.getContext('2d');
    if (window.myChart) window.myChart.destroy();
    const dates = Object.keys(logs);
    const puffs = Object.values(logs);

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Puffs per Day',
                data: puffs,
                borderColor: '#007bff',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Puffs' }, beginAtZero: true }
            }
        }
    });
}

// Initialize UI update
updateUI();
