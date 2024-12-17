const sidebar = document.querySelector(".sidebar");
const dashboard = document.querySelector(".dashboard");
const toggleButton = document.querySelector(".sidebar-toggle");

toggleButton.addEventListener("click", () => {
  sidebar.classList.toggle("shrink");
  dashboard.classList.toggle("expand"); // Adjust dashboard layout
});

function loadRevisionResults() {
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    const revisionList = document.querySelector('.revision-list');
    revisionList.innerHTML = '';

    if (results.length === 0) {
        revisionList.innerHTML = '<p>No revision data available. Complete a quiz to see your history!</p>';
        return;
    }

    results.forEach((result, index) => {
        const formattedTime = formatTime(result.timeSpent);
        revisionList.innerHTML += `
            <div class="activity-item">
                <div class="activity-info">
                    <span class="quiz-name">Quiz ${index + 1}: ${result.topic}</span>
                    <span class="date">Date: ${result.date} - ${formattedTime}</span>
                </div>
                <span class="score">${result.score}%</span>
            </div>
        `;
    });
}

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

document.addEventListener("DOMContentLoaded", () => {
  loadRevisionResults();
});
