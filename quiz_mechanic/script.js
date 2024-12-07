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
const timerSec = document.querySelector('.timer_sec');

const questions = [
    { question: 'The mammogram classification process using BI-RADS standards helps assess breast cancer risk', answers: ['True', 'False'], correct: [0] },
    { question: 'Which of the following are common deep learning models used for image classification?', answers: ['ResNet', 'VGGNet', 'LSTM', 'Inception'], correct: [0, 1 ,3]},
    { question: 'What is the capital of France?', answers: ['Berlin', 'Madrid', 'Paris', 'Rome'], correct: [2] },
    { question: 'Which planet is known as the Red Planet?', answers: ['Earth', 'Mars', 'Venus', 'Jupiter'], correct: [1] },
    { question: 'What is the largest mammal?', answers: ['Elephant', 'Blue Whale', 'Great White Shark', 'Giraffe'], correct: [1] },
    { question: 'Which language is primarily used for web development?', answers: ['JavaScript', 'Python', 'C++', 'Java'], correct: [0] },
    { question: 'What is the square root of 64?', answers: ['6', '8', '10', '12'], correct: [1] }
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

    // Disable all buttons to prevent further clicks
    buttons.forEach((button) => {
        button.disabled = true; // Disable buttons
        button.classList.add('answered'); // Remove hover effects
    });

    // Highlight the correct answers in yellow (but only if they haven't been highlighted already)
    currentQuestion.correct.forEach((correctIndex) => {
        const button = buttons[correctIndex];
        if (!button.classList.contains('selected')) {
            button.style.backgroundColor = '#FFFF99'; // Highlight the correct answer in yellow
            button.style.color = '#000'; // Ensure text color stays as it is (not white)
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
    answerButtons.innerHTML = ''; // Clear previous buttons

    // Track selected answers for multiple-answer questions
    const selectedAnswers = new Set();

    const isSingleAnswer = currentQuestion.correct.length === 1; // Check if only one correct answer

    // Create buttons dynamically based on the number of answers
    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.classList.add('btn');
        button.textContent = answer;

        if (isSingleAnswer) {
            // Single-answer mode: Immediately evaluate when clicked
            button.addEventListener('click', () => {
                stopTimer();
                evaluateSingleAnswer(index, currentQuestion.correct[0]);
            });
        } else {
            // Multiple-answer mode: Allow toggling selection
            button.addEventListener('click', () => {
                if (selectedAnswers.has(index)) {
                    selectedAnswers.delete(index); // Deselect
                    button.classList.remove('selected'); // Remove highlight
                } else {
                    selectedAnswers.add(index); // Select
                    button.classList.add('selected'); // Highlight selection
                }
            });
        }

        answerButtons.appendChild(button);
    });

    if (!isSingleAnswer) {
        // Add Submit Button for multiple-answer questions
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.classList.add('btn', 'submit');
        submitButton.addEventListener('click', () => evaluateAnswers(selectedAnswers, currentQuestion.correct));
        answerButtons.appendChild(submitButton);
    }

    nextButton.style.display = 'none'; // Hide the Next button initially
    startTimer(); // Start the timer
}

function evaluateSingleAnswer(selectedIndex, correctIndex) {
    const buttons = answerButtons.querySelectorAll('.btn');

    buttons.forEach((button, index) => {
        button.disabled = true; // Disable all buttons
        button.classList.add('disabled'); // Add disabled class to remove hover effects

        if (index === correctIndex) {
            button.style.backgroundColor = '#99F79C'; // Highlight correct answer
        } else if (index === selectedIndex) {
            button.style.backgroundColor = '#F7767F'; // Highlight wrong answer
        }
    });

    if (selectedIndex === correctIndex) {
        score++; // Increment score for a correct answer
    }

    nextButton.style.display = 'block'; // Show the Next button
}

function evaluateAnswers(selectedAnswers, correctAnswers) {
    stopTimer();
    const buttons = answerButtons.querySelectorAll('.btn');

    buttons.forEach((button, index) => {
        button.disabled = true; // Disable buttons
        button.classList.add('disabled'); // Add disabled class to remove hover effects

        // If the button is in the correct answers array, highlight it as correct (green)
        if (correctAnswers.includes(index)) {
            button.style.backgroundColor = '#99F79C'; // Green for correct answers
            button.style.color = '#000'; // Ensure text color stays as it is (not white)
        }

        // If the button is selected by the user but it's wrong, highlight it as wrong (red)
        if (!correctAnswers.includes(index) && selectedAnswers.has(index)) {
            button.style.backgroundColor = '#F7767F'; // Red for wrong answers
            button.style.color = '#000'; // Ensure text color stays as it is (not white)
        }
    });

    // Check if all correct answers were selected and no wrong answers
    const isCorrect =
        [...selectedAnswers].every((ans) => correctAnswers.includes(ans)) &&
        selectedAnswers.size === correctAnswers.length;

    if (isCorrect) {
        score++; // Increment score for correct answers
    }

    nextButton.style.display = 'block'; // Show the Next button
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