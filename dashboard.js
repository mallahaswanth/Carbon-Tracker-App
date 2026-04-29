// 1. Identify User Session
const user = sessionStorage.getItem('currentUser');
if (!user) {
    window.location.href = 'index.html';
} else {
    document.getElementById('welcomeMsg').innerText = `Dashboard: ${user}`;
}

// 2. Emission Factors (mtCO2e per mile)
const FACTORS = {
    car: 0.00041,  // Average passenger car
    bus: 0.00012,  // Average transit bus
    walk: 0        // Non-emitting
};

// 3. Load user-specific history on startup
displayUserHistory();

function calculateAndSave() {
    const car = parseFloat(document.getElementById('carInput').value) || 0;
    const bus = parseFloat(document.getElementById('busInput').value) || 0;
    const walk = parseFloat(document.getElementById('walkInput').value) || 0;

    if (car < 0 || bus < 0 || walk < 0) {
        alert("Please enter positive values.");
        return;
    }

    // Engineering Calculation
    const total = (car * FACTORS.car) + (bus * FACTORS.bus) + (walk * FACTORS.walk);
    const timestamp = new Date().toLocaleString();

    // 4. Data Partitioning: Use a user-keyed LocalStorage item
    const storageKey = `history_${user}`;
    let history = JSON.parse(localStorage.getItem(storageKey)) || [];

    // Unshift adds the newest entry to the top of the array
    history.unshift({
        total: total.toFixed(5),
        date: timestamp,
        miles: `Car: ${car} | Bus: ${bus} | Walk: ${walk}`
    });

    localStorage.setItem(storageKey, JSON.stringify(history));

    // UI Updates
    displayUserHistory();
    clearInputs();
}

function displayUserHistory() {
    const container = document.getElementById('historyList');
    const storageKey = `history_${user}`;
    const history = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (history.length === 0) {
        container.innerHTML = '<p style="color: #888; text-align: center;">No activity recorded for ' + user + '.</p>';
        return;
    }

    container.innerHTML = history.map(item => `
        <div class="history-item">
            <div>
                <strong>${item.total} mtCO2e</strong><br>
                <span class="stat-label">${item.miles}</span>
            </div>
            <div style="font-size: 0.75rem; color: #999; text-align: right;">${item.date}</div>
        </div>
    `).join('');
}

function clearInputs() {
    document.getElementById('carInput').value = '';
    document.getElementById('busInput').value = '';
    document.getElementById('walkInput').value = '';
}