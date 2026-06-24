let timerSeconds = 0;
let timerInterval = null;
let totalSteps = parseInt(localStorage.getItem('tiny_steps')) || 0;

window.onload = function() {
    loadChores();
    addSoundCloudButton();
};

function addSoundCloudButton() {
    if (document.getElementById('sc-btn')) return;
    const radioSection = document.querySelector('.radio-buttons');
    if (radioSection) {
        const scBtn = document.createElement('button');
        scBtn.id = 'sc-btn';
        scBtn.className = 'btn dark';
        scBtn.style.background = '#ff5500'; 
        scBtn.style.flex = '1';
        scBtn.innerText = 'JUICE WRLD (SC)';
        scBtn.onclick = function() {
            window.open('https://soundcloud.com', '_blank');
        };
        radioSection.appendChild(scBtn);
    }
}


function logToConsole(text) {
    const out = document.getElementById('console-output');
    out.innerText = text;
    out.scrollTop = out.scrollHeight;
}

function logGym() {
    const ex = document.getElementById('input1').value.trim();
    const wr = document.getElementById('input2').value.trim();
    const note = document.getElementById('input3').value.trim();
    if (!ex || !wr) return;
    let records = JSON.parse(localStorage.getItem('tiny_gym')) || [];
    records.push({ date: getTimestamp(), ex, wr, note });
    localStorage.setItem('tiny_gym', JSON.stringify(records));
    logToConsole(`[SUCCESS] Lift Saved!\n${ex}: ${wr}\nFuel: ${note}\nCleared engine for next set.`);
    clearInputs();
}

function logCalories() {
    const food = document.getElementById('input1').value.trim();
    const cals = document.getElementById('input2').value.trim();
    const note = document.getElementById('input3').value.trim();
    if (!food || !cals) return;
    let records = JSON.parse(localStorage.getItem('tiny_calories')) || [];
    records.push({ date: getTimestamp(), food, cals, note });
    localStorage.setItem('tiny_calories', JSON.stringify(records));
    logToConsole(`[SUCCESS] Nutrition Logged!\n${food} (${cals} kcal)\nKeep the engine running strong.`);
    clearInputs();
}

// REST OF SCRIPT RE-ORGANIZED
function logDusty() {
    const status = document.getElementById('input1').value.trim();
    const behavior = document.getElementById('input2').value.trim();
    const note = document.getElementById('input3').value.trim();
    if (!status) return;
    let records = JSON.parse(localStorage.getItem('tiny_dusty')) || [];
    records.push({ date: getTimestamp(), status, behavior, note });
    localStorage.setItem('tiny_dusty', JSON.stringify(records));
    logToConsole(`[SUCCESS] Dusty Update Secured!\nStatus: ${status}\nKeep holding down the homestead.`);
    clearInputs();
}

function addSteps() {
    totalSteps += 1000;
    localStorage.setItem('tiny_steps', totalSteps);
    logToConsole(`[STEPS UPDATED] Smashed 1,000 steps!\nTotal Today: ${totalSteps.toLocaleString()} steps.`);
}

function toggleTimer() {
    const btn = document.getElementById('timer-toggle-btn');
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        btn.innerText = "START RUN";
        btn.className = "btn green";
        let mins = Math.floor(timerSeconds / 60);
        let secs = timerSeconds % 60;
        logToConsole(`[RUN RECORDED] Sprinted for ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.\nIron Sharpens Iron.`);
    } else {
        btn.innerText = "STOP RUN";
        btn.className = "btn red";
        timerInterval = setInterval(() => {
            timerSeconds++;
            let mins = Math.floor(timerSeconds / 60);
            let secs = timerSeconds % 60;
            document.getElementById('timer-display').innerText = `RUN TIMER: {mins:02d}:{secs:02d}`;
            document.getElementById('timer-display').innerText = `RUN TIMER: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }
}

function resetTimer() {
    if (timerInterval) toggleTimer();
    timerSeconds = 0;
    document.getElementById('timer-display').innerText = "RUN TIMER: 00:00";
}

function saveChores() {
    let state = {
        c1: document.getElementById('chore1').checked,
        c2: document.getElementById('chore2').checked,
        c3: document.getElementById('chore3').checked
    };
    localStorage.setItem('tiny_chores', JSON.stringify(state));
    logToConsole("[DATABASE] Herd task metrics updated.");
}

function loadChores() {
    let state = JSON.parse(localStorage.getItem('tiny_chores'));
    if (state) {
        document.getElementById('chore1').checked = state.c1;
        document.getElementById('chore2').checked = state.c2;
        document.getElementById('chore3').checked = state.c3;
    }
}

function launchRadio(url) {
    logToConsole(`[LAUNCHING] Opening secure web audio container tab...`);
    window.open(url, '_blank');
}

function viewHistory(type) {
    if (type === 'steps') {
        logToConsole(`--- TRACKED RUNNING MILESTONES ---\nTotal Step Volume: ${totalSteps.toLocaleString()} steps.`);
        return;
    }
    let data = JSON.parse(localStorage.getItem(`tiny_${type}`)) || [];
    if (data.length === 0) {
        logToConsole(`--- HISTORY LEDGER EMPTY ---\nNo entry fields populated yet.`);
        return;
    }
    let output = `--- HISTORICAL ${type.toUpperCase()} RECORDS ---\n`;
    data.forEach(item => {
        if (type === 'gym') output += `[${item.date}] ${item.ex}: ${item.wr} | ${item.note}\n`;
        if (type === 'calories') output += `[${item.date}] ${item.food}: ${item.cals}kcal | ${item.note}\n`;
        if (type === 'dusty') output += `[${item.date}] Status: ${item.status} | Behave: ${item.behavior}\n`;
    });
    logToConsole(output);
}

function getTimestamp() {
    let d = new Date();
    return `${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function clearInputs() {
    document.getElementById('input1').value = "";
    document.getElementById('input2').value = "";
    document.getElementById('input3').value = "";
}
