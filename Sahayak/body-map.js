// Body Map functionality
class BodyMap {
    constructor() {
        this.selectedBodyType = null;
        this.currentRotation = 0;
        this.currentView = 'front';
        this.selectedBodyParts = [];
        this.painData = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupBodyParts();
    }

    setupEventListeners() {
        // Body type selection
        document.querySelectorAll('.body-type-card').forEach(card => {
            card.addEventListener('click', () => this.selectBodyType(card.dataset.type));
        });

        // Rotation controls
        document.getElementById('rotateLeft').addEventListener('click', () => this.rotateBody(-90));
        document.getElementById('rotateRight').addEventListener('click', () => this.rotateBody(90));
        document.getElementById('resetView').addEventListener('click', () => this.resetView());

        // View controls
        document.getElementById('frontView').addEventListener('click', () => this.switchView('front'));
        document.getElementById('backView').addEventListener('click', () => this.switchView('back'));

        // Pain assessment
        document.getElementById('painSeverity').addEventListener('input', (e) => {
            document.getElementById('severityValue').textContent = e.target.value;
        });

        document.getElementById('nextStepBtn').addEventListener('click', () => this.showPainAssessment());
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeSymptoms());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartAssessment());
        document.getElementById('saveSnippet').addEventListener('click', () => this.saveMedicalSnippet());
    }

    setupBodyParts() {
        // Define body parts with their positions and sizes for different views
        this.bodyParts = {
            front: [
                { id: 'head', name: 'Head', x: 100, y: 20, width: 100, height: 80 },
                { id: 'neck', name: 'Neck', x: 120, y: 100, width: 60, height: 40 },
                { id: 'chest', name: 'Chest', x: 90, y: 140, width: 120, height: 80 },
                { id: 'abdomen', name: 'Abdomen', x: 100, y: 220, width: 100, height: 80 },
                { id: 'left-arm', name: 'Left Arm', x: 30, y: 140, width: 60, height: 160 },
                { id: 'right-arm', name: 'Right Arm', x: 210, y: 140, width: 60, height: 160 },
                { id: 'left-hand', name: 'Left Hand', x: 10, y: 300, width: 40, height: 60 },
                { id: 'right-hand', name: 'Right Hand', x: 250, y: 300, width: 40, height: 60 },
                { id: 'left-leg', name: 'Left Leg', x: 80, y: 300, width: 50, height: 180 },
                { id: 'right-leg', name: 'Right Leg', x: 170, y: 300, width: 50, height: 180 },
                { id: 'left-foot', name: 'Left Foot', x: 70, y: 480, width: 40, height: 40 },
                { id: 'right-foot', name: 'Right Foot', x: 190, y: 480, width: 40, height: 40 }
            ],
            back: [
                { id: 'back-head', name: 'Back of Head', x: 100, y: 20, width: 100, height: 80 },
                { id: 'upper-back', name: 'Upper Back', x: 90, y: 100, width: 120, height: 80 },
                { id: 'lower-back', name: 'Lower Back', x: 100, y: 180, width: 100, height: 80 },
                { id: 'buttocks', name: 'Buttocks', x: 90, y: 260, width: 120, height: 60 },
                { id: 'left-arm-back', name: 'Left Arm', x: 30, y: 100, width: 60, height: 160 },
                { id: 'right-arm-back', name: 'Right Arm', x: 210, y: 100, width: 60, height: 160 },
                { id: 'left-leg-back', name: 'Left Leg', x: 80, y: 320, width: 50, height: 160 },
                { id: 'right-leg-back', name: 'Right Leg', x: 170, y: 320, width: 50, height: 160 }
            ]
        };
    }

    selectBodyType(type) {
        this.selectedBodyType = type;
        
        // Update UI
        document.querySelectorAll('.body-type-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('selected');
        
        // Show body map section
        document.getElementById('bodyMapSection').style.display = 'block';
        document.querySelector('.body-selection').style.display = 'none';
        
        // Render body figure
        this.renderBodyFigure();
    }

    renderBodyFigure() {
        const bodyFigure = document.getElementById('bodyFigure');
        bodyFigure.innerHTML = '';
        
        const parts = this.bodyParts[this.currentView];
        
        parts.forEach(part => {
            const partElement = document.createElement('div');
            partElement.className = 'body-part';
            partElement.id = part.id;
            partElement.style.cssText = `
                left: ${part.x}px;
                top: ${part.y}px;
                width: ${part.width}px;
                height: ${part.height}px;
                background: rgba(59, 130, 246, 0.3);
                border: 2px solid #3b82f6;
            `;
            
            partElement.addEventListener('click', () => this.selectBodyPart(part.id, part.name));
            
            bodyFigure.appendChild(partElement);
        });
        
        // Apply rotation
        this.applyRotation();
    }

    selectBodyPart(partId, partName) {
        const partElement = document.getElementById(partId);
        
        if (this.selectedBodyParts.includes(partId)) {
            // Deselect
            this.selectedBodyParts = this.selectedBodyParts.filter(id => id !== partId);
            partElement.classList.remove('selected');
        } else {
            // Select
            this.selectedBodyParts.push(partId);
            partElement.classList.add('selected');
        }
        
        this.updatePainPointsSummary();
    }

    updatePainPointsSummary() {
        const painPointsList = document.getElementById('painPointsList');
        const summarySection = document.getElementById('painPointsSummary');
        
        if (this.selectedBodyParts.length === 0) {
            summarySection.style.display = 'none';
            return;
        }
        
        summarySection.style.display = 'block';
        
        painPointsList.innerHTML = this.selectedBodyParts.map(partId => {
            const partName = this.getPartName(partId);
            return `
                <div class="pain-point-tag">
                    <span>${partName}</span>
                    <button class="remove-btn" data-part="${partId}">×</button>
                </div>
            `;
        }).join('');
        
        // Add event listeners to remove buttons
        painPointsList.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const partId = btn.dataset.part;
                this.selectedBodyParts = this.selectedBodyParts.filter(id => id !== partId);
                document.getElementById(partId).classList.remove('selected');
                this.updatePainPointsSummary();
            });
        });
    }

    getPartName(partId) {
        const allParts = [...this.bodyParts.front, ...this.bodyParts.back];
        const part = allParts.find(p => p.id === partId);
        return part ? part.name : partId;
    }

    rotateBody(degrees) {
        this.currentRotation += degrees;
        this.applyRotation();
    }

    applyRotation() {
        const bodyFigure = document.getElementById('bodyFigure');
        bodyFigure.style.transform = `rotate(${this.currentRotation}deg)`;
    }

    resetView() {
        this.currentRotation = 0;
        this.applyRotation();
    }

    switchView(view) {
        this.currentView = view;
        
        // Update UI
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${view}View`).classList.add('active');
        
        // Re-render body figure
        this.renderBodyFigure();
        
        // Clear selected parts when switching views
        this.selectedBodyParts = [];
        this.updatePainPointsSummary();
    }

    showPainAssessment() {
        document.getElementById('bodyMapSection').style.display = 'none';
        document.getElementById('painAssessment').style.display = 'block';
    }

    analyzeSymptoms() {
        // Collect pain data
        this.painData = {
            bodyParts: this.selectedBodyParts.map(id => this.getPartName(id)),
            severity: document.getElementById('painSeverity').value,
            type: document.getElementById('painType').value,
            duration: document.getElementById('painDuration').value,
            additionalPain: document.querySelector('input[name="additionalPain"]:checked').value
        };
        
        // Generate results
        this.generateResults();
        
        // Show results section
        document.getElementById('painAssessment').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
    }

    generateResults() {
        // Pain summary
        const painSummary = document.getElementById('painSummary');
        painSummary.innerHTML = `
            <p><strong>Affected Areas:</strong> ${this.painData.bodyParts.join(', ')}</p>
            <p><strong>Pain Severity:</strong> ${this.painData.severity}/10</p>
            <p><strong>Pain Type:</strong> ${this.painData.type}</p>
            <p><strong>Duration:</strong> ${this.painData.duration}</p>
            <p><strong>Additional Pain:</strong> ${this.painData.additionalPain === 'yes' ? 'Yes' : 'No'}</p>
        `;
        
        // Possible conditions based on body parts and symptoms
        const possibleConditions = document.getElementById('possibleConditions');
        const conditions = this.getPossibleConditions();
        possibleConditions.innerHTML = conditions.map(condition => `
            <div class="condition-item">
                <h4>${condition.name}</h4>
                <p>${condition.description}</p>
                <small>Source: ${condition.source}</small>
            </div>
        `).join('');
        
        // Recommended actions
        const recommendedActions = document.getElementById('recommendedActions');
        const actions = this.getRecommendedActions();
        recommendedActions.innerHTML = `
            <ul>
                ${actions.map(action => `<li>${action}</li>`).join('')}
            </ul>
        `;
        
        // Medical snippet
        this.generateMedicalSnippet();
    }

    getPossibleConditions() {
        // Simplified medical database - in a real app, this would be more comprehensive
        const conditions = {
            'head': [
                {
                    name: 'Tension Headache',
                    description: 'Common headache often caused by stress, muscle tension, or fatigue.',
                    source: 'Mayo Clinic'
                },
                {
                    name: 'Migraine',
                    description: 'Severe headache often accompanied by nausea, sensitivity to light and sound.',
                    source: 'NHP India'
                }
            ],
            'chest': [
                {
                    name: 'Muscle Strain',
                    description: 'Pain caused by overuse or injury to chest muscles.',
                    source: 'MedlinePlus'
                },
                {
                    name: 'Acid Reflux',
                    description: 'Burning sensation caused by stomach acid flowing back into esophagus.',
                    source: 'AIIMS'
                }
            ],
            'abdomen': [
                {
                    name: 'Indigestion',
                    description: 'Discomfort in upper abdomen often related to eating.',
                    source: 'NHP India'
                },
                {
                    name: 'Appendicitis',
                    description: 'Serious condition requiring immediate medical attention.',
                    source: 'Mayo Clinic'
                }
            ],
            'back': [
                {
                    name: 'Muscle Strain',
                    description: 'Common back pain from overuse or poor posture.',
                    source: 'MedlinePlus'
                },
                {
                    name: 'Herniated Disc',
                    description: 'More serious condition where spinal disc presses on nerves.',
                    source: 'AIIMS'
                }
            ]
        };
        
        // Return conditions based on selected body parts
        let result = [];
        this.painData.bodyParts.forEach(part => {
            const partKey = part.toLowerCase();
            if (conditions[partKey]) {
                result = result.concat(conditions[partKey]);
            }
        });
        
        // If no specific conditions found, return general advice
        if (result.length === 0) {
            result = [{
                name: 'General Pain Assessment',
                description: 'Based on your symptoms, it is recommended to consult a healthcare professional for proper diagnosis.',
                source: 'Sahayak Medical Advisory'
            }];
        }
        
        return result.slice(0, 3); // Return max 3 conditions
    }

    getRecommendedActions() {
        const severity = parseInt(this.painData.severity);
        const actions = [];
        
        if (severity >= 8) {
            actions.push('Seek immediate medical attention - call emergency services if needed');
            actions.push('Avoid any strenuous activity');
            actions.push('Keep the affected area immobilized if possible');
        } else if (severity >= 5) {
            actions.push('Schedule an appointment with a healthcare provider within 24-48 hours');
            actions.push('Apply ice or heat to the affected area as appropriate');
            actions.push('Consider over-the-counter pain relief if not contraindicated');
        } else {
            actions.push('Monitor symptoms for any changes or worsening');
            actions.push('Practice gentle stretching if appropriate for the area');
            actions.push('Consider conservative self-care measures for 2-3 days');
        }
        
        actions.push('Stay hydrated and maintain a balanced diet');
        actions.push('Get adequate rest and avoid activities that worsen pain');
        
        return actions;
    }

    generateMedicalSnippet() {
        const snippet = document.getElementById('medicalSnippet');
        snippet.innerHTML = `
            <div style="text-align: center; padding: 1rem;">
                <h4 style="color: #3b82f6; margin-bottom: 1rem;">Pain Location Summary</h4>
                <div style="display: inline-block; background: #f8fafc; padding: 1rem; border-radius: 8px;">
                    <div style="font-size: 3rem; color: #ef4444; margin-bottom: 0.5rem;">
                        <i class="fas fa-body"></i>
                    </div>
                    <p style="font-weight: 600; margin-bottom: 0.5rem;">Affected Areas:</p>
                    <p style="color: #6b7280;">${this.painData.bodyParts.join(', ')}</p>
                    <p style="margin-top: 1rem; font-size: 0.9em; color: #9ca3af;">
                        Generated: ${new Date().toLocaleDateString()}
                    </p>
                </div>
                <p style="margin-top: 1rem; font-size: 0.9em; color: #6b7280;">
                    Show this to your healthcare provider
                </p>
            </div>
        `;
    }

    saveMedicalSnippet() {
        // In a real app, this would save the snippet as an image or PDF
        // For this demo, we'll show a confirmation
        this.showNotification('Medical summary saved to your device', 'success');
        
        // Simulate download
        const blob = new Blob([JSON.stringify(this.painData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medical-summary-${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    restartAssessment() {
        // Reset everything
        this.selectedBodyType = null;
        this.currentRotation = 0;
        this.currentView = 'front';
        this.selectedBodyParts = [];
        this.painData = {};
        
        // Reset UI
        document.querySelectorAll('.body-type-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.getElementById('bodyMapSection').style.display = 'none';
        document.getElementById('painAssessment').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
        document.querySelector('.body-selection').style.display = 'block';
        
        // Reset form
        document.getElementById('painSeverity').value = 5;
        document.getElementById('severityValue').textContent = '5';
        document.getElementById('painType').value = 'sharp';
        document.getElementById('painDuration').value = 'hours';
        document.querySelector('input[name="additionalPain"][value="no"]').checked = true;
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'info': 'info-circle'
        };
        
        notification.innerHTML = `
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'info': '#3b82f6'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type] || '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s;
    }
    
    .notification button:hover {
        background: rgba(255,255,255,0.2);
    }
    
    .condition-item {
        background: #f8fafc;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    
    .condition-item h4 {
        color: #1f2937;
        margin-bottom: 0.5rem;
    }
    
    .condition-item p {
        color: #6b7280;
        margin-bottom: 0.5rem;
    }
    
    .condition-item small {
        color: #9ca3af;
    }
`;

document.head.appendChild(notificationStyles);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BodyMap();
});