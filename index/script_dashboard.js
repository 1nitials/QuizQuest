const sidebar = document.querySelector('.sidebar');
const dashboard = document.querySelector('.dashboard');
const toggleButton = document.querySelector('.sidebar-toggle');

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('shrink');
    dashboard.classList.toggle('expand'); // Adjust dashboard layout
});

function formatTime(seconds) {
    if (seconds >= 3600) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    } else {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }
}

function loadQuizResults() {
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];

    // Update Total Quizzes
    document.querySelector('.box_box1 .number').textContent = results.length;

    // Calculate Total Time Spent
    const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0);
    document.querySelector('.box_box2 .number').textContent = formatTime(totalTime);

    // Update Average Score
    const avgScore =
        results.length > 0
            ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
            : 0;
    document.querySelector('.box_box3 .number').textContent = `${avgScore}%`;

    // Populate Recent Activity
    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = ''; // Clear previous content
    results.slice(-5).forEach((result) => {
        const formattedTime = formatTime(result.timeSpent);
        activityList.innerHTML += `
            <div class="activity-item">
                <div class="activity-info">
                    <span class="quiz-name">${result.topic}</span>
                    <span class="date">${result.date} - ${formattedTime}</span>
                </div>
                <span class="score">${result.score}%</span>
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuizResults();
});