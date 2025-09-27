// Symptom checker questions
const questions = [
    {
        question: "What type of symptoms are you experiencing?",
        options: [
            { text: "General (fever, headache, fatigue, body ache)", severity: 1 },
            { text: "Musculoskeletal (back pain, joint pain, muscle pain, neck pain)", severity: 2 },
            { text: "Dental (tooth pain, gum swelling, mouth ulcers, jaw pain)", severity: 2 },
            { text: "Mental Health (anxiety, depression, stress, sleep problems)", severity: 3 },
            { text: "Eyes Ears (eye pain, vision problems, ear pain, hearing issues)", severity: 2 }
        ]
    },
    {
        question: "How severe are your symptoms?",
        options: [
            { text: "Mild - symptoms are noticeable but don't interfere with daily activities", severity: 1 },
            { text: "Moderate - symptoms interfere with some daily activities", severity: 2 },
            { text: "Severe - symptoms make it difficult to perform daily activities", severity: 3 },
            { text: "Critical - symptoms are debilitating and require immediate attention", severity: 4 }
        ]
    },
    {
        question: "How long have you been experiencing these symptoms?",
        options: [
            { text: "Less than 24 hours", severity: 1 },
            { text: "1-3 days", severity: 2 },
            { text: "4-7 days", severity: 3 },
            { text: "More than a week", severity: 4 }
        ]
    },
    {
        question: "Do you have any pre-existing medical conditions?",
        options: [
            { text: "No", severity: 1 },
            { text: "Yes, but they are well-managed", severity: 2 },
            { text: "Yes, and they may be related to current symptoms", severity: 3 },
            { text: "Yes, multiple conditions that complicate current symptoms", severity: 4 }
        ]
    },
    {
        question: "Are you experiencing any of these emergency symptoms?",
        options: [
            { text: "Difficulty breathing or shortness of breath", severity: 5 },
            { text: "Chest pain or pressure", severity: 5 },
            { text: "Severe bleeding that won't stop", severity: 5 },
            { text: "Sudden weakness or numbness in face, arm, or leg", severity: 5 },
            { text: "None of the above", severity: 1 }
        ]
    }
];

// Initialize variables
let currentQuestion = 0;
let selectedOptions = [];
let totalSeverity = 0;
let callTimer = 0;
let callTimerInterval;
let isMuted = false;
let isVideoOn = true;

// DOM elements
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const videoCallContainer = document.getElementById('video-call-container');
const queueContainer = document.getElementById('queue-container');
const progressBar = document.getElementById('progress-bar');
const muteBtn = document.getElementById('mute-btn');
const videoBtn = document.getElementById('video-btn');
const endCallBtn = document.getElementById('end-call-btn');
const callTimerElement = document.getElementById('call-timer');
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');

// Initialize the symptom checker
function initSymptomChecker() {
    showQuestion();
    
    // Add event listeners for call controls
    muteBtn.addEventListener('click', toggleMute);
    videoBtn.addEventListener('click', toggleVideo);
    endCallBtn.addEventListener('click', endVideoCall);
}

// Display current question
function showQuestion() {
    // Update progress bar
    progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
    
    const question = questions[currentQuestion];
    let optionsHTML = '';
    
    question.options.forEach((option, index) => {
        optionsHTML += `
            <div class="option" onclick="selectOption(${index})">
                ${option.text}
            </div>
        `;
    });
    
    questionContainer.innerHTML = `
        <div class="question">
            <h2>${question.question}</h2>
            <div class="options">
                ${optionsHTML}
            </div>
        </div>
        <div class="buttons">
            <button id="prev-btn" ${currentQuestion === 0 ? 'disabled style="opacity:0.5"' : ''} onclick="previousQuestion()">Previous</button>
            <button id="next-btn" ${currentQuestion === questions.length - 1 ? 'onclick="showResults()"' : 'onclick="nextQuestion()"'}">
                ${currentQuestion === questions.length - 1 ? 'See Results' : 'Next Step'}
            </button>
        </div>
    `;
    
    // Highlight previously selected option if exists
    if (selectedOptions[currentQuestion] !== undefined) {
        const options = document.querySelectorAll('.option');
        options[selectedOptions[currentQuestion]].classList.add('selected');
    }
}

// Select an option
function selectOption(index) {
    const options = document.querySelectorAll('.option');
    
    // Remove selected class from all options
    options.forEach(option => option.classList.remove('selected'));
    
    // Add selected class to clicked option
    options[index].classList.add('selected');
    
    // Store selected option
    selectedOptions[currentQuestion] = index;
}

// Move to next question
function nextQuestion() {
    if (selectedOptions[currentQuestion] === undefined) {
        alert('Please select an option before proceeding.');
        return;
    }
    
    currentQuestion++;
    showQuestion();
}

// Move to previous question
function previousQuestion() {
    currentQuestion--;
    showQuestion();
}

// Calculate results and show them
function showResults() {
    if (selectedOptions[currentQuestion] === undefined) {
        alert('Please select an option before proceeding.');
        return;
    }
    
    // Calculate total severity
    totalSeverity = 0;
    selectedOptions.forEach((optionIndex, questionIndex) => {
        totalSeverity += questions[questionIndex].options[optionIndex].severity;
    });
    
    // Determine severity level
    let severityLevel, severityText, severityColor;
    
    if (totalSeverity <= 8) {
        severityLevel = 'low';
        severityText = 'Your symptoms appear to be mild. A regular consultation should be sufficient.';
        severityColor = 'low-severity';
    } else if (totalSeverity <= 15) {
        severityLevel = 'medium';
        severityText = 'Your symptoms are moderate. We recommend speaking with a healthcare professional soon.';
        severityColor = 'medium-severity';
    } else {
        severityLevel = 'high';
        severityText = 'Your symptoms appear serious. We recommend an immediate video consultation with a healthcare professional.';
        severityColor = 'high-severity';
    }
    
    // Show results
    questionContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    progressBar.style.width = '100%';
    
    resultContainer.innerHTML = `
        <h2>Assessment Complete</h2>
        <div class="severity-indicator ${severityColor}">${totalSeverity}</div>
        <p>${severityText}</p>
        <div class="action-buttons">
            ${severityLevel === 'high' ? 
                '<button class="action-btn video-call" onclick="startVideoCall()"><span>📹</span> Start Emergency Video Call</button>' : 
                '<button class="action-btn normal-call" onclick="joinQueue()"><span>📞</span> Join Regular Call Queue</button>'
            }
            <button class="action-btn" onclick="restartChecker()" style="background:#95a5a6; color:white;"><span>🔄</span> Restart Assessment</button>
        </div>
    `;
}

// Join the regular call queue
function joinQueue() {
    resultContainer.style.display = 'none';
    queueContainer.style.display = 'block';
    
    let queuePosition = 5;
    
    queueContainer.innerHTML = `
        <h2>Regular Consultation Queue</h2>
        <div class="queue-info">You are in the queue for a regular consultation.</div>
        <div class="queue-animation">
            <div class="person"></div>
            <div class="person"></div>
            <div class="person"></div>
        </div>
        <p>Your position in queue: <span class="queue-position" id="queue-position">${queuePosition}</span></p>
        <p>Estimated wait time: <span id="wait-time">10-15 minutes</span></p>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
        <button class="action-btn" onclick="cancelQueue()" style="background:#e74c3c; color:white; margin-top:15px;">Cancel</button>
    `;
    
    // Simulate queue movement
    simulateQueue(queuePosition);
}

// Simulate queue movement
function simulateQueue(position) {
    const queueElement = document.getElementById('queue-position');
    const waitTimeElement = document.getElementById('wait-time');
    
    const queueInterval = setInterval(() => {
        position--;
        queueElement.textContent = position;
        
        if (position === 1) {
            waitTimeElement.textContent = 'Connecting you now...';
        } else if (position === 0) {
            clearInterval(queueInterval);
            queueContainer.innerHTML = `
                <h2>Regular Consultation</h2>
                <p style="color:#2ecc71; font-weight:bold; font-size:20px;">You are now connected with a healthcare professional!</p>
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
                <button class="action-btn" onclick="endCall()" style="background:#e74c3c; color:white; margin-top:15px;">End Call</button>
            `;
        } else {
            waitTimeElement.textContent = `${position*2}-${position*2+5} minutes`;
        }
    }, 5000);
}

// Start emergency video call
function startVideoCall() {
    resultContainer.style.display = 'none';
    videoCallContainer.style.display = 'block';
    
    // Start call timer
    callTimer = 0;
    callTimerInterval = setInterval(updateCallTimer, 1000);
    
    // Simulate doctor connecting
    setTimeout(() => {
        remoteVideo.innerHTML = `
            <div class="doctor-avatar">👨‍⚕️</div>
            <p>Dr. Smith</p>
            <p style="font-size:14px; margin-top:5px;">Connected</p>
        `;
    }, 2000);
}

// Update call timer
function updateCallTimer() {
    callTimer++;
    const minutes = Math.floor(callTimer / 60).toString().padStart(2, '0');
    const seconds = (callTimer % 60).toString().padStart(2, '0');
    callTimerElement.textContent = `${minutes}:${seconds}`;
}

// Toggle mute
function toggleMute() {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? '🔊' : '🔇';
    // In a real app, you would mute the audio stream here
}

// Toggle video
function toggleVideo() {
    isVideoOn = !isVideoOn;
    videoBtn.textContent = isVideoOn ? '📹' : '📷';
    localVideo.style.display = isVideoOn ? 'flex' : 'none';
    // In a real app, you would disable the video stream here
}

// End video call
function endVideoCall() {
    clearInterval(callTimerInterval);
    videoCallContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    
    resultContainer.innerHTML = `
        <h2>Consultation Complete</h2>
        <div class="severity-indicator low-severity">✓</div>
        <p>Your video consultation has ended. We hope you feel better soon!</p>
        <p>Call duration: <strong>${callTimerElement.textContent}</strong></p>
        <div class="action-buttons">
            <button class="action-btn" onclick="restartChecker()" style="background:#3498db; color:white;">Start New Assessment</button>
        </div>
    `;
}

// Cancel queue
function cancelQueue() {
    queueContainer.style.display = 'none';
    resultContainer.style.display = 'block';
}

// End call
function endCall() {
    queueContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    
    resultContainer.innerHTML = `
        <h2>Consultation Complete</h2>
        <div class="severity-indicator low-severity">✓</div>
        <p>Your regular consultation has ended. We hope you feel better soon!</p>
        <div class="action-buttons">
            <button class="action-btn" onclick="restartChecker()" style="background:#3498db; color:white;">Start New Assessment</button>
        </div>
    `;
}

// Restart the symptom checker
function restartChecker() {
    currentQuestion = 0;
    selectedOptions = [];
    totalSeverity = 0;
    callTimer = 0;
    
    questionContainer.style.display = 'block';
    resultContainer.style.display = 'none';
    videoCallContainer.style.display = 'none';
    queueContainer.style.display = 'none';
    
    showQuestion();
}

// Initialize the symptom checker when page loads
window.onload = initSymptomChecker;