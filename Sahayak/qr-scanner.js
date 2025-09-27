// QR Scanner functionality with fallbacks
class QRScanner {
    constructor() {
        this.isScanning = false;
        this.cameraAvailable = false;
        this.html5QrCode = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkCameraSupport();
    }

    async checkCameraSupport() {
        this.updateScannerStatus('Checking camera support...', 'info');
        
        // Check basic camera support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.showCameraError('Camera API not supported in this browser');
            return;
        }

        try {
            // Test camera access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            
            stream.getTracks().forEach(track => track.stop());
            
            this.cameraAvailable = true;
            this.updateScannerStatus('Camera ready! Click "Start Camera" to begin scanning', 'success');
            
        } catch (error) {
            console.log('Camera access test failed:', error);
            this.handleCameraError(error);
        }
    }

    handleCameraError(error) {
        this.cameraAvailable = false;
        
        let errorMessage = 'Camera access unavailable. ';
        let detailedMessage = '';

        if (error.name === 'NotAllowedError') {
            detailedMessage = 'Camera permission was denied. Please allow camera access in your browser settings.';
        } else if (error.name === 'NotFoundError') {
            detailedMessage = 'No camera found on this device.';
        } else if (error.name === 'NotSupportedError') {
            detailedMessage = 'Camera not supported by your browser.';
        } else if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            detailedMessage = 'Camera requires HTTPS for security. Please use HTTPS or localhost.';
        } else {
            detailedMessage = error.message;
        }

        errorMessage += detailedMessage;
        this.showCameraError(errorMessage);
    }

    showCameraError(message) {
        const errorElement = document.getElementById('camera-error');
        const errorMessage = document.getElementById('error-message');
        
        errorMessage.textContent = message;
        errorElement.style.display = 'block';
        
        this.updateScannerStatus('Camera unavailable - Use manual input or simulate scan', 'warning');
        this.disableCameraButtons();
    }

    disableCameraButtons() {
        document.getElementById('start-camera').disabled = true;
        document.getElementById('stop-camera').disabled = true;
        document.getElementById('start-camera').innerHTML = '<i class="fas fa-camera-slash"></i> Camera Unavailable';
    }

    bindEvents() {
        // Start camera button
        document.getElementById('start-camera').addEventListener('click', () => {
            this.startScanner();
        });

        // Stop camera button
        document.getElementById('stop-camera').addEventListener('click', () => {
            this.stopScanner();
        });

        // Simulate scan button
        document.getElementById('simulate-scan').addEventListener('click', () => {
            this.simulateQRScan();
        });

        // Manual code submission
        document.getElementById('submit-manual').addEventListener('click', () => {
            this.submitManualCode();
        });

        // Enter key for manual input
        document.getElementById('manual-code').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitManualCode();
            }
        });

        // Scan again button
        document.getElementById('scan-again').addEventListener('click', () => {
            this.showScannerSection();
        });
    }

    async startScanner() {
        if (!this.cameraAvailable) {
            this.showError('Camera is not available. Please use manual input or simulate scan.');
            return;
        }

        this.updateScannerStatus('Loading QR scanner library...', 'info');
        
        try {
            // Dynamically load the QR scanner library
            await this.loadQrScannerLibrary();
            
            this.updateScannerStatus('Starting camera...', 'info');
            
            this.html5QrCode = new Html5Qrcode("qr-reader");
            
            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };

            await this.html5QrCode.start(
                { facingMode: "environment" },
                config,
                this.onScanSuccess.bind(this),
                this.onScanFailure.bind(this)
            );

            this.isScanning = true;
            this.updateUIForScanning(true);
            this.updateScannerStatus('Scanning... Point camera at QR code', 'success');

        } catch (error) {
            console.error('Scanner startup error:', error);
            this.handleScannerStartError(error);
        }
    }

    async loadQrScannerLibrary() {
        return new Promise((resolve, reject) => {
            if (typeof Html5Qrcode !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/html5-qrcode@2.3.8/minified/html5-qrcode.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load QR scanner library'));
            document.head.appendChild(script);
        });
    }

    handleScannerStartError(error) {
        let errorMessage = 'Failed to start QR scanner: ';
        
        if (error.message.includes('Permission')) {
            errorMessage += 'Camera permission required. Please allow camera access.';
        } else if (error.message.includes('NotFoundError')) {
            errorMessage += 'No camera found.';
        } else if (error.message.includes('NotSupportedError')) {
            errorMessage += 'QR scanning not supported.';
        } else {
            errorMessage += error.message;
        }
        
        this.showError(errorMessage);
        this.updateScannerStatus('Scanner failed to start', 'error');
    }

    async stopScanner() {
        if (this.html5QrCode && this.isScanning) {
            try {
                await this.html5QrCode.stop();
                this.html5QrCode.clear();
                this.isScanning = false;
                this.updateUIForScanning(false);
                this.updateScannerStatus('Scanner stopped', 'info');
            } catch (error) {
                console.error('Error stopping scanner:', error);
            }
        }
    }

    onScanSuccess(decodedText, decodedResult) {
        console.log('QR Code scanned:', decodedText);
        this.stopScanner();
        this.processQRCode(decodedText);
    }

    onScanFailure(error) {
        // Normal operation - no QR code detected yet
    }

    simulateQRScan() {
        this.updateScannerStatus('Simulating QR scan...', 'info');
        
        // Simulate scanning delay
        setTimeout(() => {
            const simulatedData = JSON.stringify({
                id: 'PAT' + Math.random().toString(36).substr(2, 8).toUpperCase(),
                name: 'Simulated Patient',
                type: 'medical_record',
                timestamp: Date.now()
            });
            
            this.processQRCode(simulatedData);
            this.updateScannerStatus('Simulated scan successful!', 'success');
        }, 2000);
    }

    processQRCode(qrData) {
        try {
            const patientData = this.parseQRData(qrData);
            this.displayPatientResults(patientData);
            this.showResultsSection();
            this.showNotification('Patient records loaded successfully!', 'success');
        } catch (error) {
            console.error('Error processing QR code:', error);
            this.showError('Invalid QR code format. Please try a different code.');
        }
    }

    parseQRData(qrData) {
        // Sample patient data structure
        const samplePatients = [
            {
                id: 'PAT001',
                name: 'Rajesh Kumar',
                age: 45,
                gender: 'Male',
                bloodGroup: 'B+',
                lastVisit: '2024-01-15',
                medicalHistory: [
                    'Diabetes management - Ongoing',
                    'Blood pressure check - 2024-01-15',
                    'Seasonal flu vaccination - 2023-12-10'
                ]
            },
            {
                id: 'PAT002', 
                name: 'Priya Sharma',
                age: 32,
                gender: 'Female',
                bloodGroup: 'O+',
                lastVisit: '2024-01-10',
                medicalHistory: [
                    'Prenatal care - Ongoing',
                    'Nutrition counseling - 2024-01-10',
                    'Vitamin supplements prescribed'
                ]
            },
            {
                id: 'PAT003',
                name: 'Amit Patel',
                age: 68,
                gender: 'Male', 
                bloodGroup: 'A+',
                lastVisit: '2024-01-08',
                medicalHistory: [
                    'Arthritis treatment - Ongoing',
                    'Physical therapy - Weekly',
                    'Cardiac checkup - 2023-12-20'
                ]
            }
        ];

        // Try to parse as JSON or use sample data
        try {
            const parsed = JSON.parse(qrData);
            if (parsed.id) {
                // Find matching patient or use first sample
                const patient = samplePatients.find(p => p.id === parsed.id) || samplePatients[0];
                return { ...patient, ...parsed };
            }
        } catch (e) {
            // Not JSON, use as ID or default
            const patientId = qrData.trim();
            const patient = samplePatients.find(p => p.id === patientId) || samplePatients[0];
            return patient;
        }
    }

    submitManualCode() {
        const manualCode = document.getElementById('manual-code').value.trim();
        if (manualCode) {
            this.processQRCode(manualCode);
            document.getElementById('manual-code').value = '';
        } else {
            this.showError('Please enter a patient ID');
        }
    }

    displayPatientResults(patientData) {
        document.getElementById('patient-name').textContent = patientData.name;
        document.getElementById('patient-id').textContent = `ID: ${patientData.id}`;
        document.getElementById('patient-age').textContent = patientData.age;
        document.getElementById('patient-gender').textContent = patientData.gender;
        document.getElementById('patient-blood').textContent = patientData.bloodGroup;
        document.getElementById('patient-last-visit').textContent = patientData.lastVisit;

        const historyContainer = document.getElementById('medical-history');
        historyContainer.innerHTML = patientData.medicalHistory
            .map(record => `<div class="history-item">• ${record}</div>`)
            .join('');
    }

    showResultsSection() {
        document.querySelector('.scanner-section').style.display = 'none';
        document.getElementById('results-section').style.display = 'block';
    }

    showScannerSection() {
        document.querySelector('.scanner-section').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';
        this.updateScannerStatus('Ready to scan', 'info');
    }

    updateUIForScanning(scanning) {
        const startBtn = document.getElementById('start-camera');
        const stopBtn = document.getElementById('stop-camera');

        startBtn.disabled = scanning;
        stopBtn.disabled = !scanning;
    }

    updateScannerStatus(message, type) {
        const statusElement = document.getElementById('scanner-status-text');
        const statusIcon = document.querySelector('.scanner-status i');
        
        statusElement.textContent = message;
        statusElement.className = `status-${type}`;
        
        // Update icon based on status
        const icons = {
            error: 'exclamation-triangle',
            success: 'check-circle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        
        statusIcon.className = `fas fa-${icons[type] || 'info-circle'}`;
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    new QRScanner();
});

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        animation: slideIn 0.3s ease;
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(notificationStyles);