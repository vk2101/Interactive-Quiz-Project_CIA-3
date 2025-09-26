// Quiz Data
const quizData = [
    {
        id: 1,
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        explanation: "Paris is the capital and most populous city of France, located in the north-central part of the country."
    },
    {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        explanation: "Mars is called the Red Planet due to its reddish appearance caused by iron oxide (rust) on its surface."
    },
    {
        id: 3,
        question: "What is the largest mammal in the world?",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Great White Shark"],
        correctAnswer: 1,
        explanation: "The Blue Whale is the largest animal ever known to have lived on Earth, reaching lengths of up to 100 feet."
    },
    {
        id: 4,
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correctAnswer: 1,
        explanation: "World War II ended in 1945 with the surrender of Japan in September, following the atomic bombings and Soviet invasion."
    },
    {
        id: 5,
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2,
        explanation: "Au is the chemical symbol for gold, derived from the Latin word 'aurum' meaning 'shining dawn'."
    },
    {
        id: 6,
        question: "Which programming language is known as the 'language of the web'?",
        options: ["Python", "JavaScript", "Java", "C++"],
        correctAnswer: 1,
        explanation: "JavaScript is widely considered the language of the web, running in all modern browsers and enabling interactive web pages."
    },
    {
        id: 7,
        question: "What is the smallest country in the world?",
        options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
        correctAnswer: 1,
        explanation: "Vatican City is the smallest internationally recognized sovereign state in the world, with an area of just 0.17 square miles."
    },
    {
        id: 8,
        question: "Which element has the atomic number 1?",
        options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
        correctAnswer: 1,
        explanation: "Hydrogen has the atomic number 1, making it the lightest and most abundant element in the universe."
    }
];

// Quiz State
let currentQuestionIndex = 0;
let selectedAnswer = null;
let score = 0;
let timeLeft = 30;
let timerInterval = null;
let userAnswers = new Array(quizData.length).fill(null);
let showingFeedback = false;

// DOM Elements
const elements = {
    timer: document.getElementById('timer'),
    timerInfo: document.getElementById('timerInfo'),
    progressBar: document.getElementById('progressBar'),
    currentQ: document.getElementById('currentQ'),
    totalQ: document.getElementById('totalQ'),
    currentScore: document.getElementById('currentScore'),
    totalScore: document.getElementById('totalScore'),
    questionText: document.getElementById('questionText'),
    optionsContainer: document.getElementById('optionsContainer'),
    explanationBox: document.getElementById('explanationBox'),
    explanationText: document.getElementById('explanationText'),
    submitBtn: document.getElementById('submitBtn'),
    nextBtn: document.getElementById('nextBtn'),
    questionCard: document.getElementById('questionCard'),
    questionNav: document.getElementById('questionNav'),
    resultsScreen: document.getElementById('resultsScreen'),
    resultsMessage: document.getElementById('resultsMessage'),
    finalScore: document.getElementById('finalScore'),
    scorePercentage: document.getElementById('scorePercentage'),
    correctAnswers: document.getElementById('correctAnswers'),
    incorrectAnswers: document.getElementById('incorrectAnswers')
};

// Initialize Quiz
function initializeQuiz() {
    elements.totalQ.textContent = quizData.length;
    elements.totalScore.textContent = quizData.length;
    createNavigationDots();
    loadQuestion();
    startTimer();
}

// Create Navigation Dots
function createNavigationDots() {
    elements.questionNav.innerHTML = '';
    quizData.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'nav-dot pending';
        dot.textContent = index + 1;
        dot.id = `nav-dot-${index}`;
        elements.questionNav.appendChild(dot);
    });
    updateNavigationDots();
}

// Update Navigation Dots
function updateNavigationDots() {
    quizData.forEach((_, index) => {
        const dot = document.getElementById(`nav-dot-${index}`);
        dot.className = 'nav-dot';
        
        if (index < currentQuestionIndex) {
            if (userAnswers[index] === quizData[index].correctAnswer) {
                dot.classList.add('correct');
            } else {
                dot.classList.add('incorrect');
            }
        } else if (index === currentQuestionIndex) {
            dot.classList.add('current');
        } else {
            dot.classList.add('pending');
        }
    });
}

// Load Current Question
function loadQuestion() {
    const question = quizData[currentQuestionIndex];
    
    // Add slide animation
    elements.questionCard.classList.add('slide-in');
    
    // Update question info
    elements.currentQ.textContent = currentQuestionIndex + 1;
    elements.questionText.textContent = question.question;
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    elements.progressBar.style.width = `${progress}%`;
    
    // Create options
    elements.optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.onclick = () => selectAnswer(index);
        
        optionBtn.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            ${option}
        `;
        
        elements.optionsContainer.appendChild(optionBtn);
    });
    
    // Reset state
    selectedAnswer = null;
    showingFeedback = false;
    elements.explanationBox.style.display = 'none';
    elements.submitBtn.style.display = 'inline-block';
    elements.nextBtn.style.display = 'none';
    elements.submitBtn.disabled = true;
    
    // Update navigation
    updateNavigationDots();
    
    // Remove animation class after animation completes
    setTimeout(() => {
        elements.questionCard.classList.remove('slide-in');
    }, 500);
}

// Select Answer
function selectAnswer(answerIndex) {
    if (showingFeedback) return;
    
    selectedAnswer = answerIndex;
    
    // Update option buttons
    const optionBtns = elements.optionsContainer.querySelectorAll('.option-btn');
    optionBtns.forEach((btn, index) => {
        btn.classList.remove('selected');
        if (index === answerIndex) {
            btn.classList.add('selected');
        }
    });
    
    // Enable submit button
    elements.submitBtn.disabled = false;
}

// Submit Answer
function submitAnswer() {
    if (selectedAnswer === null || showingFeedback) return;
    
    showingFeedback = true;
    clearInterval(timerInterval);
    
    // Store user answer
    userAnswers[currentQuestionIndex] = selectedAnswer;
    
    // Update score
    const isCorrect = selectedAnswer === quizData[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
        score++;
        elements.currentScore.textContent = score;
    }
    
    // Show feedback on options
    const optionBtns = elements.optionsContainer.querySelectorAll('.option-btn');
    optionBtns.forEach((btn, index) => {
        btn.classList.add('disabled');
        if (index === quizData[currentQuestionIndex].correctAnswer) {
            btn.classList.add('correct');
        } else if (index === selectedAnswer && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    // Show explanation
    if (quizData[currentQuestionIndex].explanation) {
        elements.explanationText.textContent = quizData[currentQuestionIndex].explanation;
        elements.explanationBox.style.display = 'block';
    }
    
    // Update buttons
    elements.submitBtn.style.display = 'none';
    elements.nextBtn.style.display = 'inline-block';
    
    // Update next button text
    if (currentQuestionIndex < quizData.length - 1) {
        elements.nextBtn.innerHTML = '<i class="fas fa-arrow-right me-2"></i>Next Question';
    } else {
        elements.nextBtn.innerHTML = '<i class="fas fa-flag-checkered me-2"></i>View Results';
    }
    
    // Update timer info
    elements.timerInfo.textContent = 'Question completed';
}

// Next Question
function nextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        timeLeft = 30;
        loadQuestion();
        startTimer();
    } else {
        showResults();
    }
}

// Start Timer
function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            handleTimeUp();
        }
    }, 1000);
}

// Update Timer Display
function updateTimerDisplay() {
    elements.timer.textContent = timeLeft;
    elements.timerInfo.textContent = timeLeft > 0 ? `${timeLeft} seconds remaining` : 'Time is up!';
    
    // Update timer color based on time left
    const timerDisplay = document.querySelector('.timer-display');
    timerDisplay.classList.remove('warning', 'danger');
    
    if (timeLeft <= 5) {
        timerDisplay.classList.add('danger');
    } else if (timeLeft <= 10) {
        timerDisplay.classList.add('warning');
    }
}

// Handle Time Up
function handleTimeUp() {
    if (!showingFeedback) {
        clearInterval(timerInterval);
        userAnswers[currentQuestionIndex] = null;
        
        // Show correct answer
        const optionBtns = elements.optionsContainer.querySelectorAll('.option-btn');
        optionBtns.forEach((btn, index) => {
            btn.classList.add('disabled');
            if (index === quizData[currentQuestionIndex].correctAnswer) {
                btn.classList.add('correct');
            }
        });
        
        // Show explanation
        if (quizData[currentQuestionIndex].explanation) {
            elements.explanationText.textContent = quizData[currentQuestionIndex].explanation;
            elements.explanationBox.style.display = 'block';
        }
        
        showingFeedback = true;
        elements.submitBtn.style.display = 'none';
        elements.nextBtn.style.display = 'inline-block';
        
        // Update next button text
        if (currentQuestionIndex < quizData.length - 1) {
            elements.nextBtn.innerHTML = '<i class="fas fa-arrow-right me-2"></i>Next Question';
        } else {
            elements.nextBtn.innerHTML = '<i class="fas fa-flag-checkered me-2"></i>View Results';
        }
        
        elements.timerInfo.textContent = 'Time is up!';
    }
}

// Show Results
function showResults() {
    clearInterval(timerInterval);
    
    // Hide quiz elements
    document.querySelector('.quiz-header').style.display = 'none';
    elements.questionCard.style.display = 'none';
    document.querySelector('.navigation-card').style.display = 'none';
    
    // Show results screen
    elements.resultsScreen.style.display = 'block';
    
    // Calculate results
    const percentage = Math.round((score / quizData.length) * 100);
    const correctCount = score;
    const incorrectCount = quizData.length - score;
    
    // Update results display
    elements.finalScore.textContent = `${score}/${quizData.length}`;
    elements.scorePercentage.textContent = `${percentage}%`;
    elements.correctAnswers.textContent = correctCount;
    elements.incorrectAnswers.textContent = incorrectCount;
    
    // Set results message based on performance
    let message = '';
    if (percentage >= 80) {
        message = "Excellent! Outstanding performance! 🎉";
    } else if (percentage >= 60) {
        message = "Great job! Well done! 👏";
    } else if (percentage >= 40) {
        message = "Good effort! Keep practicing! 💪";
    } else {
        message = "Keep learning and try again! 📚";
    }
    
    elements.resultsMessage.textContent = message;
}

// Reset Quiz
function resetQuiz() {
    // Reset state
    currentQuestionIndex = 0;
    selectedAnswer = null;
    score = 0;
    timeLeft = 30;
    userAnswers = new Array(quizData.length).fill(null);
    showingFeedback = false;
    
    // Reset score display
    elements.currentScore.textContent = '0';
    
    // Show quiz elements
    document.querySelector('.quiz-header').style.display = 'block';
    elements.questionCard.style.display = 'block';
    document.querySelector('.navigation-card').style.display = 'block';
    
    // Hide results screen
    elements.resultsScreen.style.display = 'none';
    
    // Restart quiz
    loadQuestion();
    startTimer();
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (elements.resultsScreen.style.display !== 'none') return;
    
    // Number keys 1-4 for selecting answers
    if (e.key >= '1' && e.key <= '4') {
        const answerIndex = parseInt(e.key) - 1;
        if (answerIndex < quizData[currentQuestionIndex].options.length && !showingFeedback) {
            selectAnswer(answerIndex);
        }
    }
    
    // Enter key to submit answer or go to next question
    if (e.key === 'Enter') {
        if (!showingFeedback && selectedAnswer !== null) {
            submitAnswer();
        } else if (showingFeedback) {
            nextQuestion();
        }
    }
    
    // Space key to submit answer or go to next question
    if (e.key === ' ') {
        e.preventDefault();
        if (!showingFeedback && selectedAnswer !== null) {
            submitAnswer();
        } else if (showingFeedback) {
            nextQuestion();
        }
    }
});

// Prevent context menu on options (optional)
document.addEventListener('contextmenu', (e) => {
    if (e.target.classList.contains('option-btn')) {
        e.preventDefault();
    }
});

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', initializeQuiz);

// Handle page visibility change (pause timer when tab is not active)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (timerInterval && !showingFeedback) {
            clearInterval(timerInterval);
        }
    } else {
        if (!showingFeedback && timeLeft > 0) {
            startTimer();
        }
    }
});

// Add smooth scrolling for better UX
function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Call smooth scroll when moving to next question
const originalNextQuestion = nextQuestion;
nextQuestion = function() {
    smoothScrollToTop();
    setTimeout(originalNextQuestion, 300);
};

// Add loading states for better UX
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Enhanced error handling
window.addEventListener('error', (e) => {
    console.error('Quiz Error:', e.error);
    // Could show user-friendly error message here
});

// Performance optimization: Preload next question
function preloadNextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        // Preload any resources for next question if needed
        // This is a placeholder for future enhancements
    }
}

// Add this to the nextQuestion function
const originalLoadQuestion = loadQuestion;
loadQuestion = function() {
    originalLoadQuestion();
    preloadNextQuestion();
};