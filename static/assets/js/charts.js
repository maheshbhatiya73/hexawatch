let cpuChart, ramChart;

function initCharts() {
    cpuChart = new Chart(document.getElementById('cpuChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'CPU Usage (%)',
                data: [],
                borderColor: '#00d4ff',
                fill: false,
                tension: 0.1
            }]
        },
        options: { responsive: true, scales: { y: { min: 0, max: 100 } } }
    });

    ramChart = new Chart(document.getElementById('ramChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'RAM Usage (%)',
                data: [],
                borderColor: '#ff4444',
                fill: false,
                tension: 0.1
            }]
        },
        options: { responsive: true, scales: { y: { min: 0, max: 100 } } }
    });
}