const statsWs = new WebSocket('ws://' + window.location.host + '/ws');

function initDashboard() {
    statsWs.onmessage = function(event) {
        const data = JSON.parse(event.data);
        document.getElementById('cpu').textContent = data.cpu.toFixed(2) + '%';
        const usedMB = (data.used_ram / 1024 / 1024).toFixed(2);
        const totalMB = (data.total_ram / 1024 / 1024).toFixed(2);
        const freeMB = (data.free_ram / 1024 / 1024).toFixed(2);
        document.getElementById('ram').textContent = `${data.ram.toFixed(2)}% (${usedMB} MB)`;
        document.getElementById('total-ram').textContent = totalMB + ' MB';
        document.getElementById('free-ram').textContent = freeMB + ' MB';

        const time = new Date().toLocaleTimeString();
        if (cpuChart && ramChart) {
            cpuChart.data.labels.push(time);
            cpuChart.data.datasets[0].data.push(data.cpu);
            ramChart.data.labels.push(time);
            ramChart.data.datasets[0].data.push(data.ram);

            if (cpuChart.data.labels.length > 60) {
                cpuChart.data.labels.shift();
                cpuChart.data.datasets[0].data.shift();
                ramChart.data.labels.shift();
                ramChart.data.datasets[0].data.shift();
            }
            cpuChart.update();
            ramChart.update();
        }
    };
}