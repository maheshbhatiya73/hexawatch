const logsWs = new WebSocket('ws://' + window.location.host + '/logs');

function initLogs() {
    logsWs.onmessage = function(event) {
        const log = document.createElement('p');
        log.textContent = event.data;
        const logList = document.getElementById('log-list');
        logList.appendChild(log);
        logList.scrollTop = logList.scrollHeight;
    };
}