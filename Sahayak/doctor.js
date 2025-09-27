// Simulated WebRTC connection (in a real app, you'd use a signaling server)
class ConsultationPlatform {
    constructor() {
        this.isVideoOn = true;
        this.isAudioOn = true;
        this.chatOpen = true;
        this.messages = [];
        this.sharedFiles = [];
        
        this.initializeEventListeners();
        this.simulateConnection();
        this.loadSampleData();
    }
    
    initializeEventListeners() {
        // Toggle video
        document.getElementById('videoToggle').addEventListener('click', () => {
            this.toggleVideo();
        });
        
        // Toggle audio
        document.getElementById('audioToggle').addEventListener('click', () => {
            this.toggleAudio();
        });
        
        // End call
        document.getElementById('endCall').addEventListener('click', () => {
            this.endCall();
        });
        
        // Toggle chat
        document.getElementById('toggleChat').addEventListener('click', () => {
            this.toggleChat();
        });
        
        // Send message
        document.getElementById('sendMessage').addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Send message on Enter key
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Medical tools
        document.getElementById('prescriptionTool').addEventListener('click', () => {
            this.openPrescriptionModal();
        });
        
        document.getElementById('labTool').addEventListener('click', () => {
            this.requestLabTest();
        });
        
        document.getElementById('notesTool').addEventListener('click', () => {
            this.takeNotes();
        });
        
        document.getElementById('vitalsTool').addEventListener('click', () => {
            this.recordVitals();
        });
        
        // File upload
        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });
        
        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });
        
        // Prescription form
        document.getElementById('prescriptionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendPrescription();
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            document.querySelectorAll('.modal').forEach(modal => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }
    
    toggleVideo() {
        this.isVideoOn = !this.isVideoOn;
        const videoBtn = document.getElementById('videoToggle');
        const localVideo = document.getElementById('localVideo');
        
        if (this.isVideoOn) {
            videoBtn.innerHTML = '📹';
            videoBtn.style.background = '#ecf0f1';
            localVideo.style.display = 'block';
            this.addSystemMessage('Video turned on');
        } else {
            videoBtn.innerHTML = '📹❌';
            videoBtn.style.background = '#e74c3c';
            localVideo.style.display = 'none';
            this.addSystemMessage('Video turned off');
        }
    }
    
    toggleAudio() {
        this.isAudioOn = !this.isAudioOn;
        const audioBtn = document.getElementById('audioToggle');
        
        if (this.isAudioOn) {
            audioBtn.innerHTML = '🎤';
            audioBtn.style.background = '#ecf0f1';
            this.addSystemMessage('Audio turned on');
        } else {
            audioBtn.innerHTML = '🎤❌';
            audioBtn.style.background = '#e74c3c';
            this.addSystemMessage('Audio turned off');
        }
    }
    
    endCall() {
        if (confirm('Are you sure you want to end the consultation?')) {
            // In a real app, you would disconnect from the WebRTC peer connection
            this.addSystemMessage('Consultation ended');
            
            // Redirect or show end screen in a real application
            setTimeout(() => {
                alert('Consultation has ended. Thank you!');
                // In a real app: window.location.href = 'consultation-end.html';
            }, 1000);
        }
    }
    
    toggleChat() {
        this.chatOpen = !this.chatOpen;
        const chatSection = document.querySelector('.chat-section');
        const toggleBtn = document.getElementById('toggleChat');
        
        if (this.chatOpen) {
            chatSection.style.display = 'flex';
            toggleBtn.innerHTML = '−';
        } else {
            chatSection.style.display = 'none';
            toggleBtn.innerHTML = '+';
        }
    }
    
    sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'sent');
            input.value = '';
            
            // Simulate patient response after a short delay
            setTimeout(() => {
                this.simulatePatientResponse(message);
            }, 1000 + Math.random() * 2000);
        }
    }
    
    addMessage(text, type) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = text;
        
        // Add timestamp
        const timestamp = document.createElement('div');
        timestamp.style.fontSize = '0.7em';
        timestamp.style.opacity = '0.7';
        timestamp.style.marginTop = '5px';
        timestamp.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        messageElement.appendChild(timestamp);
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store message
        this.messages.push({
            text,
            type,
            timestamp: new Date()
        });
    }
    
    addSystemMessage(text) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message system';
        messageElement.style.alignSelf = 'center';
        messageElement.style.background = '#f39c12';
        messageElement.style.color = 'white';
        messageElement.style.fontSize = '0.9em';
        messageElement.textContent = text;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    simulatePatientResponse(doctorMessage) {
        // Simple AI-like responses based on keywords in the doctor's message
        let response = "I understand.";
        
        if (doctorMessage.toLowerCase().includes('pain')) {
            response = "The pain is mostly in my chest, and it comes and goes.";
        } else if (doctorMessage.toLowerCase().includes('medication')) {
            response = "I'm currently taking blood pressure medication as prescribed.";
        } else if (doctorMessage.toLowerCase().includes('symptom')) {
            response = "I've been feeling dizzy and short of breath occasionally.";
        } else if (doctorMessage.toLowerCase().includes('how are you')) {
            response = "I'm feeling a bit better today, thank you for asking.";
        }
        
        this.addMessage(response, 'received');
    }
    
    openPrescriptionModal() {
        document.getElementById('prescriptionModal').style.display = 'block';
    }
    
    sendPrescription() {
        // In a real app, this would send the prescription to the patient
        alert('Prescription sent to patient successfully!');
        document.getElementById('prescriptionModal').style.display = 'none';
        this.addSystemMessage('Prescription sent to patient');
    }
    
    requestLabTest() {
        // In a real app, this would open a lab test request form
        this.addSystemMessage('Lab test request form opened');
        setTimeout(() => {
            this.addMessage("I've requested blood work and an ECG for you. The lab will contact you to schedule.", 'sent');
        }, 500);
    }
    
    takeNotes() {
        // In a real app, this would open a notes panel
        const note = prompt("Enter clinical notes:");
        if (note) {
            this.addSystemMessage('Note saved: ' + note);
        }
    }
    
    recordVitals() {
        // In a real app, this would connect to medical devices or input vitals
        this.addSystemMessage('Vitals recording tool opened');
        setTimeout(() => {
            this.addMessage("Please use your home monitoring device to record your blood pressure and heart rate.", 'sent');
        }, 500);
    }
    
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // In a real app, you would upload the file to a server
            this.sharedFiles.push({
                name: file.name,
                type: file.type,
                size: this.formatFileSize(file.size),
                date: new Date()
            });
            
            this.updateFilesList();
            this.addSystemMessage(`File "${file.name}" uploaded`);
            
            // Simulate patient uploading a file in response
            setTimeout(() => {
                this.simulatePatientFileUpload();
            }, 2000);
        }
    }
    
    simulatePatientFileUpload() {
        const patientFiles = [
            { name: 'blood_test_results.pdf', type: 'application/pdf', size: '245 KB' },
            { name: 'ecg_report.jpg', type: 'image/jpeg', size: '1.2 MB' },
            { name: 'symptoms_log.docx', type: 'application/msword', size: '78 KB' }
        ];
        
        const randomFile = patientFiles[Math.floor(Math.random() * patientFiles.length)];
        this.sharedFiles.push({
            ...randomFile,
            date: new Date(),
            fromPatient: true
        });
        
        this.updateFilesList();
        this.addSystemMessage(`Patient uploaded "${randomFile.name}"`);
    }
    
    updateFilesList() {
        const filesList = document.getElementById('filesList');
        filesList.innerHTML = '';
        
        this.sharedFiles.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileIcon = file.type.includes('image') ? '🖼️' : 
                            file.type.includes('pdf') ? '📄' : '📎';
            
            fileItem.innerHTML = `
                <span>${fileIcon} ${file.name}</span>
                <span>${file.size}</span>
            `;
            
            if (file.fromPatient) {
                fileItem.style.background = '#e8f4fd';
            }
            
            filesList.appendChild(fileItem);
        });
    }
    
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }
    
    simulateConnection() {
        // Simulate WebRTC connection process
        setTimeout(() => {
            this.addSystemMessage('Connecting to patient...');
        }, 500);
        
        setTimeout(() => {
            this.addSystemMessage('Connection established. Consultation started.');
            
            // Simulate initial patient message
            setTimeout(() => {
                this.addMessage("Hello Doctor, thank you for seeing me today.", 'received');
            }, 1000);
        }, 2000);
    }
    
    loadSampleData() {
        // Load sample patient data
        const patientData = {
            name: "John Doe",
            age: "45",
            condition: "Hypertension"
        };
        
        document.getElementById('patientName').textContent = patientData.name;
        document.getElementById('patientAge').textContent = patientData.age;
        document.getElementById('patientCondition').textContent = patientData.condition;
    }
}

// Initialize the consultation platform when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ConsultationPlatform();
});

// Simulate WebRTC video streams (in a real app, these would be actual media streams)
window.addEventListener('load', () => {
    // In a real application, you would get actual media streams
    // For demo purposes, we'll just show placeholder videos
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    
    // These would be replaced with actual media streams in a real WebRTC application
    localVideo.src = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
    remoteVideo.src = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";
    
    localVideo.loop = true;
    remoteVideo.loop = true;
});