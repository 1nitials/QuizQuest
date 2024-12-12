const sidebar = document.querySelector('.sidebar');
const dashboard = document.querySelector('.dashboard');
const toggleButton = document.querySelector('.sidebar-toggle');

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('shrink');
    dashboard.classList.toggle('expand'); // Adjust dashboard layout
});