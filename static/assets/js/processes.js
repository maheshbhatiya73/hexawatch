const processWs = new WebSocket('ws://' + window.location.host + '/processes');

function initProcesses() {
    processWs.onmessage = function(event) {
        const processes = JSON.parse(event.data);
        const processList = document.getElementById('process-list');
        processList.innerHTML = '';
        processes.forEach(proc => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${proc.pid}</td>
                <td>${proc.name}</td>
                <td>${proc.cpu.toFixed(2)}%</td>
                <td>${(proc.memory / 1024 / 1024).toFixed(2)} MB</td>
                <td><button class="kill-btn" onclick="killProcess(${proc.pid})">Kill</button></td>
            `;
            processList.appendChild(row);
        });
    };
}

function killProcess(pid) {
    fetch('/kill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pid: pid })
    }).then(response => {
        if (!response.ok) console.error('Failed to kill process');
    });
}   