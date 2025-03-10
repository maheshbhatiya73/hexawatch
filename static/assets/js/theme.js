function toggleTheme() {
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const header = document.querySelector('.header');
    const cards = document.querySelectorAll('.card');
    const chartContainers = document.querySelectorAll('.chart-container');
    const logs = document.querySelector('.logs');
    const processes = document.querySelector('.processes');

    if (body.classList.contains('dark')) {
        body.classList.remove('dark');
        body.classList.add('light');
        sidebar.classList.remove('dark');
        sidebar.classList.add('light');
        header.classList.remove('dark');
        header.classList.add('light');
        cards.forEach(card => {
            card.classList.remove('dark');
            card.classList.add('light');
        });
        chartContainers.forEach(chart => {
            chart.classList.remove('dark');
            chart.classList.add('light');
        });
        logs.classList.remove('dark');
        logs.classList.add('light');
        processes.classList.remove('dark');
        processes.classList.add('light');
    } else {
        body.classList.remove('light');
        body.classList.add('dark');
        sidebar.classList.remove('light');
        sidebar.classList.add('dark');
        header.classList.remove('light');
        header.classList.add('dark');
        cards.forEach(card => {
            card.classList.remove('light');
            card.classList.add('dark');
        });
        chartContainers.forEach(chart => {
            chart.classList.remove('light');
            chart.classList.add('dark');
        });
        logs.classList.remove('light');
        logs.classList.add('dark');
        processes.classList.remove('light');
        processes.classList.add('dark');
    }
}