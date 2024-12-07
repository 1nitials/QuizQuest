const startBtn = document.querySelector('.start_btn button');
const quizBox = document.querySelector('.quiz_box');
const resultBox = document.querySelector('.result_box');
const questionText = document.querySelector('.ques_text');
const answerButtons = document.querySelector('.answer-buttons');
const nextButton = document.querySelector('.next_button button');
const percentageElement = document.querySelector('.percentage');
const correctAnswersElement = document.querySelector('.correct_answers');
const totalQuestionsElement = document.querySelector('.total_questions');
const restartBtn = document.querySelector('.result_box .restart');
const quitBtn = document.querySelector('.result_box .quit');
const progressCircle = document.querySelector('.progress-circle .circle');

const questions = [
    { question: 'What is the capital of France?', answers: ['Berlin', 'Madrid', 'Paris', 'Rome'], correct: 2 },
    { question: 'Which planet is known as the Red Planet?', answers: ['Earth', 'Mars', 'Venus', 'Jupiter'], correct: 1 },
    { question: 'What is the largest mammal?', answers: ['Elephant', 'Blue Whale', 'Great White Shark', 'Giraffe'], correct: 1 },
    { question: 'Which language is primarily used for web development?', answers: ['JavaScript', 'Python', 'C++', 'Java'], correct: 0 },
    { question: 'What is the square root of 64?', answers: ['6', '8', '10', '12'], correct: 1 }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timerLeft = 15;

// Start the timer
function startTimer() {
    const progressBar = document.querySelector('.progress-bar'); // Select the progress bar
    timeLeft = 15; // Reset time for each question
    document.querySelector('.timer_sec').textContent = timeLeft; // Update the timer display

    // Reset progress bar to full width
    progressBar.style.width = '100%';

    timer = setInterval(() => {
        timeLeft--;
        document.querySelector('.timer_sec').textContent = timeLeft;

        // Update progress bar width based on remaining time
        const progressPercentage = (timeLeft / 15) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        if (timeLeft <= 0) {
            clearInterval(timer); // Stop the timer
            timeUp(); // Handle timer expiration
        }
    }, 1000); // Update every second
}

// Stop and clear the timer
function stopTimer() {
    clearInterval(timer);
}

function timeUp() {
    const currentQuestion = questions[currentQuestionIndex];
    const buttons = answerButtons.querySelectorAll('button');

    // Highlight the correct answer and disable all buttons
    buttons.forEach((button, index) => {
        button.disabled = true; // Disable buttons
        button.classList.add('answered'); // Add timeout class to remove hover effects

        if (index === currentQuestion.correct) {
            button.style.backgroundColor = '#FFFF99'; // Highlight the correct answer in yellow
        }
    });

    nextButton.style.display = 'block'; // Show the Next button
}

function startQuiz() {
    startBtn.parentElement.style.display = 'none';
    quizBox.style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    answerButtons.innerHTML = '';
    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.classList.add('btn');
        button.textContent = answer;
        button.addEventListener('click', () => {
            stopTimer(); // Stop the timer on answer selection
            selectAnswer(index);
        });
        answerButtons.appendChild(button);
    });

    nextButton.style.display = 'none'; // Hide the Next button initially
    startTimer(); // Start the timer
}

function selectAnswer(selectedIndex) {
    const currentQuestion = questions[currentQuestionIndex];
    const buttons = answerButtons.querySelectorAll('button');

    // Disable all buttons
    buttons.forEach((button, index) => {
        button.classList.add('answered');
        button.disabled = true;

        if (index === currentQuestion.correct) {
            button.style.backgroundColor = '#99F79C'; // Highlight correct answer
        }
        else if (index === selectedIndex) {
            button.style.backgroundColor = '#F7767F'; // Highlight wrong answer
        }
    });

    // Only increment score if the selected answer is correct
    if (selectedIndex === currentQuestion.correct) {
        score++;
    }

    nextButton.style.display = 'block'; // Show the Next button
}

function showNextQuestion() {
    stopTimer(); // Stop the current timer
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion(); // Show the next question
    } else {
        showResult(); // Show the results if all questions are completed
    }
}

function showResult() {
    quizBox.style.display = 'none';
    resultBox.style.display = 'block';

    const percentage = Math.round((score / questions.length) * 100);

    percentageElement.textContent = `${percentage}%`;
    correctAnswersElement.textContent = score;
    totalQuestionsElement.textContent = questions.length;

    progressCircle.style.background = `conic-gradient(
        #520CF7 ${percentage}%,
        #e0e0e0 ${percentage}%
    )`;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    resultBox.style.display = 'none';
    startBtn.parentElement.style.display = 'flex';
    quizBox.style.display = 'none';
}

startBtn.addEventListener('click', startQuiz);
nextButton.addEventListener('click', showNextQuestion);
restartBtn.addEventListener('click', restartQuiz);
quitBtn.addEventListener('click', () => location.reload());