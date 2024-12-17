const startBtn = document.querySelector('.start_btn button');
const quizContainer = document.querySelector('#quizContainer'); // Use appropriate selector
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

const countdownElement = document.querySelector('.countdown .numbers');

const infoBox = document.querySelector('.info_box');
const info_restartBtn = document.querySelector('.info_box .restart');
const info_quitBtn = document.querySelector('.info_box .quit');

const quizTopicInput = document.getElementById('quizTopic');
const quizDifficulty = document.getElementById('quizDifficulty');
const numQuestions = document.getElementById('numQuestions');

const fileInput = document.getElementById('fileInput');
const generateQuizBtn = document.getElementById('generateQuizBtn');
const quizOutput = document.getElementById('quiz-output');
const quizQuestions = document.getElementById('quiz-questions');
const resultsContainer = document.getElementById('quiz-results');

// Hide explanation
const explanationContainer = document.querySelector('.explanation-container');

// const questions = [
//     { question: 'The mammogram classification process using BI-RADS standards helps assess breast cancer risk', answers: ['True', 'False'], correct: [0] },
//     { question: 'Which of the following are common deep learning models used for image classification?', answers: ['ResNet', 'VGGNet', 'LSTM', 'Inception'], correct: [0, 1, 3] },
//     { question: 'What is the capital of France?', answers: ['Berlin', 'Madrid', 'Paris', 'Rome'], correct: [2] },
//     { question: 'Which planet is known as the Red Planet?', answers: ['Earth', 'Mars', 'Venus', 'Jupiter'], correct: [1] },
//     { question: 'What is the largest mammal?', answers: ['Elephant', 'Blue Whale', 'Great White Shark', 'Giraffe'], correct: [1] },
//     { question: 'Which language is primarily used for web development?', answers: ['JavaScript', 'Python', 'C++', 'Java'], correct: [0] },
//     { question: 'What is the square root of 64?', answers: ['6', '8', '10', '12'], correct: [1] }
// ];

const quizResult = {
    topic: "Topic Name",
    score: 80,          // Score percentage
    totalQuestions: 10,
    correctAnswers: 8,
    date: new Date().toLocaleDateString(),
    timeSpent: "5m"     // Example duration
  };

let quizData = []; // Global variable to hold quiz questions dynamically

let quizStartTime;
let currentTopic = "No Topic";

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timerLeft = 15;

// Sound Related
let isMuted = false;

document.getElementById('sound-toggle-btn').addEventListener('click', () => {
    isMuted = !isMuted;
    const icon = isMuted ? '🔇' : '🔊';
    document.getElementById('sound-toggle-btn').textContent = icon;
});

function playSound(soundId) {
    if (!isMuted) {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0; // Restart the sound
            sound.play();
        }
    }
}

function saveQuizResult(score, totalQuestions, topic, timeSpentSeconds) {
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    results.push({
        topic: topic || "No Topic", // Default if topic is not provided
        score: Math.round((score / totalQuestions) * 100),
        totalQuestions: totalQuestions,
        correctAnswers: score,
        timeSpent: timeSpentSeconds, // Keep time as raw seconds
        date: new Date().toLocaleDateString()
    });
    localStorage.setItem('quizResults', JSON.stringify(results));
    console.log("Saved Results:", results); // Debugging log
}

function startCountdown() {
    const countdownElement = document.querySelector('.countdown');
    const numbers = ['3', '2', '1', 'Go!'];
    let index = 0;

    // Show the countdown container
    countdownElement.style.display = 'flex';

    const interval = setInterval(() => {
        if (index < numbers.length) {
            countdownElement.textContent = numbers[index];
            index++;
        } else {
            clearInterval(interval);
            countdownElement.style.display = 'none'; // Hide the countdown
            startQuiz(); // Call your desired function directly
        }
    }, 1000); // Update every second
}

function showLoading() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.style.zIndex = '1000';
    loadingOverlay.innerHTML = '<div class="spinner"></div>';

    document.body.appendChild(loadingOverlay);
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        document.body.removeChild(loadingOverlay);
    }
}

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
    const currentQuestion = quizData[currentQuestionIndex];
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

// Function to read content from a file
function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file); // Read the file as text
    });
}

async function startQuiz() {
    quizStartTime = new Date();

    const topic = quizTopicInput.value.trim(); // Retrieve topic from input
    currentTopic = topic || "No Topic"; // Save to global variable with a fallback

    const file = fileInput.files[0];
    const diff = quizDifficulty.value; // Get the selected difficulty
    const numq = numQuestions.value; // Get the number of questions

    // Validation: Ensure either topic or file is provided
    if (!topic && !file) {
        alert('Please enter a quiz topic or upload a file to proceed.');
        return; // Stop further execution
    }

    quizContainer.style.display = 'none';
    quizBox.style.display = 'block';

    let content = '';

    if (file) {
        // Read content from the uploaded file
        content = await readFileContent(file);
    } else {
        // Use the entered topic
        content = topic;
    }

    // Generate the quiz only once and store it globally
    quizData = await generateQuiz(diff, numq, content);

    if (quizData && quizData.length > 0) {
        showQuestion(); // Show the first question
    } else {
        alert('Failed to load quiz data.');
    }
}


function showQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
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

// Function to generate the quiz using OpenAI API
async function generateQuiz(diff, numq, content) {
    const apiKey = ''; // Replace with your OpenAI API key
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const body = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'user',
                content: `
                    Generate a quiz with ${numq} multiple-choice questions about ${content} with the difficulty of ${diff}.
                    Each question should have:
                    - "question": a string representing the question text.
                    - "answers": an array of four strings, each representing an answer option.
                    - "correct": an array of indices (0-based) of the correct answer(s).
                    - "explanation": a string explaining why the correct answer(s) is/are correct.
                    Return the data as a JSON array in the following format:
    
                    [
                    { "question": "Question 1 text", "answers": ["Option A", "Option B", "Option C", "Option D"], "correct": [0], "explanation": "Explanation for question 1." },
                    { "question": "Question 2 text", "answers": ["Option A", "Option B", "Option C", "Option D"], "correct": [2], "explanation": "Explanation for question 2." },
                    ...
                    ]`
            }
        ],
        temperature: 0.7
    });

    // Log the content sent to the API
    console.log('Request Body:', body);

    try {
        showLoading(); // Start loading
        const response = await fetch(url, { method: 'POST', headers, body });
        const data = await response.json();

        console.log('GPT Raw Response:', data.choices[0].message.content);

        // Parse the JSON response
        quizData = JSON.parse(data.choices[0].message.content.trim()); // Populate the global variable
        return quizData;
    } catch (error) {
        console.error('Error generating quiz:', error);
        alert('Failed to generate quiz. Check your API key or input.');
    } finally {
        hideLoading(); // End loading
    }
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
        playSound('correct-sound'); // Play correct answer sound
    } else {
        const wrongSound = document.getElementById('wrong-sound');
        wrongSound.volume = 0.1; // Set volume to 50% for wrong answers
        playSound('wrong-sound'); // Play wrong answer sound
    }

    // Show explanation
    const explanationContainer = document.querySelector('.explanation-container');
    const explanationText = document.getElementById('explanation-text');
    explanationText.textContent = quizData[currentQuestionIndex].explanation;
    explanationContainer.style.display = 'block';

    nextButton.style.display = 'block'; // Show the Next button
}

function evaluateAnswers(selectedAnswers, correctAnswers) {
    stopTimer();
    const buttons = answerButtons.querySelectorAll('.btn');

    buttons.forEach((button, index) => {
        button.disabled = true; // Disable buttons
        button.classList.add('disabled'); // Add disabled class to remove hover effects

        if (correctAnswers.includes(index)) {
            button.style.backgroundColor = '#99F79C'; // Highlight correct answers
        } else if (selectedAnswers.has(index)) {
            button.style.backgroundColor = '#F7767F'; // Highlight wrong answers
        }
    });

    // Show explanation
    const explanationContainer = document.querySelector('.explanation-container');
    const explanationText = document.getElementById('explanation-text');
    explanationText.textContent = quizData[currentQuestionIndex].explanation;
    explanationContainer.style.display = 'block';

    nextButton.style.display = 'block'; // Show the Next button
}

function selectAnswer(selectedIndex) {
    const currentQuestion = quizData[currentQuestionIndex];
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

    if (currentQuestionIndex < quizData.length) {
        showQuestion(); // Show the next question

        explanationContainer.style.display = 'none';
    } else {
        showResult(); // Show the results if all questions are completed
    }
}

function showResult() {
    quizBox.style.display = 'none';
    explanationContainer.style.display = 'none';
    resultBox.style.display = 'block';

    const quizEndTime = new Date();
    const timeSpentSeconds = Math.round((quizEndTime - quizStartTime) / 1000);

    const percentage = Math.round((score / quizData.length) * 100);

    percentageElement.textContent = `${percentage}%`;
    correctAnswersElement.textContent = score;
    totalQuestionsElement.textContent = quizData.length;

    progressCircle.style.background = `conic-gradient(
        #520CF7 ${percentage}%,
        #e0e0e0 ${percentage}%
    )`;

    saveQuizResult(score, quizData.length, currentTopic, timeSpentSeconds);
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    resultBox.style.display = 'none';
    quizContainer.style.display = 'block';
    quizBox.style.display = 'none';
}

nextButton.addEventListener('click', () => {
    playSound('click-sound');
});

// Function to show the info box
function showInfoBox() {
    quizContainer.style.display = 'none'; // Hide the quiz container
    infoBox.style.display = 'block'; // Show the info box
}
  
// Function to start the quiz after info box
function startQuizAfterInfo() {
    infoBox.style.display = 'none'; // Hide the info box
    //quizBox.style.display = 'block'; // Show the quiz box
    startCountdown();
}
  
// Function to quit the quiz
function quitQuiz() {
    infoBox.style.display = 'none'; // Hide the info box
    quizContainer.style.display = 'block'; // Return to the main menu
}

// Event Listeners
startBtn.addEventListener('click', showInfoBox); // Show the info box on start
info_restartBtn.addEventListener('click', startQuizAfterInfo); // Start the quiz from the info box
info_quitBtn.addEventListener('click', quitQuiz); // Return to the main menu
//startBtn.addEventListener('click', startQuiz);
nextButton.addEventListener('click', showNextQuestion);
restartBtn.addEventListener('click', restartQuiz);
quitBtn.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
});