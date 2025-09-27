// Medicine Finder functionality
class MedicineFinder {
    constructor() {
        this.medicines = [];
        this.filteredMedicines = [];
        this.currentLocation = 'current';
        this.currentMedicine = null;
        this.init();
    }

    init() {
        this.loadMedicineData();
        this.bindEvents();
        this.checkOnlineStatus();
    }

    // Sample medicine data (would come from API in real app)
    loadMedicineData() {
        this.medicines = [
            {
                id: 1,
                name: 'Paracetamol',
                genericName: 'Acetaminophen',
                dosage: 'Tablet',
                strength: '500mg',
                uses: 'Fever, Pain relief',
                availability: 'available',
                pharmacies: [
                    { name: 'Nabha Medical Store', distance: '0.5km', stock: 45, phone: '+91-98765-43210', address: 'Main Road, Nabha' },
                    { name: 'City Pharmacy', distance: '1.2km', stock: 23, phone: '+91-98765-43211', address: 'Market Street, Nabha' },
                    { name: 'Health Plus', distance: '2.1km', stock: 12, phone: '+91-98765-43212', address: 'Hospital Road, Nabha' }
                ],
                alternatives: ['Ibuprofen', 'Aspirin', 'Diclofenac'],
                sideEffects: 'Rare: Skin rash, nausea',
                precautions: 'Do not exceed recommended dosage'
            },
            {
                id: 2,
                name: 'Insulin',
                genericName: 'Human Insulin',
                dosage: 'Injection',
                strength: '100IU/ml',
                uses: 'Diabetes management',
                availability: 'available',
                pharmacies: [
                    { name: 'City Pharmacy', distance: '1.2km', stock: 15, phone: '+91-98765-43211', address: 'Market Street, Nabha' },
                    { name: 'MediCare', distance: '3.5km', stock: 8, phone: '+91-98765-43213', address: 'Gurudwara Road, Nabha' }
                ],
                alternatives: ['Metformin', 'Glimepiride', 'Glibenclamide'],
                sideEffects: 'Hypoglycemia, weight gain',
                precautions: 'Store in refrigerator'
            },
            {
                id: 3,
                name: 'Amoxicillin',
                genericName: 'Amoxicillin Trihydrate',
                dosage: 'Capsule',
                strength: '500mg',
                uses: 'Bacterial infections',
                availability: 'low-stock',
                pharmacies: [
                    { name: 'Nabha Medical Store', distance: '0.5km', stock: 5, phone: '+91-98765-43210', address: 'Main Road, Nabha' }
                ],
                alternatives: ['Azithromycin', 'Ciprofloxacin', 'Doxycycline'],
                sideEffects: 'Diarrhea, nausea, rash',
                precautions: 'Complete full course'
            },
            {
                id: 4,
                name: 'Metformin',
                genericName: 'Metformin Hydrochloride',
                dosage: 'Tablet',
                strength: '500mg',
                uses: 'Type 2 Diabetes',
                availability: 'available',
                pharmacies: [
                    { name: 'Health Plus', distance: '2.1km', stock: 34, phone: '+91-98765-43212', address: 'Hospital Road, Nabha' },
                    { name: 'City Pharmacy', distance: '1.2km', stock: 28, phone: '+91-98765-43211', address: 'Market Street, Nabha' }
                ],
                alternatives: ['Glibenclamide', 'Glimepiride', 'Pioglitazone'],
                sideEffects: 'Nausea, diarrhea, metallic taste',
                precautions: 'Take with food'
            },
            {
                id: 5,
                name: 'Aspirin',
                genericName: 'Acetylsalicylic Acid',
                dosage: 'Tablet',
                strength: '75mg',
                uses: 'Pain relief, Blood thinner',
                availability: 'unavailable',
                pharmacies: [
                    { name: 'MediCare', distance: '3.5km', stock: 0, phone: '+91-98765-43213', address: 'Gurudwara Road, Nabha' }
                ],
                alternatives: ['Clopidogrel', 'Warfarin', 'Paracetamol'],
                sideEffects: 'Stomach irritation, bleeding',
                precautions: 'Avoid in children'
            },
            {
                id: 6,
                name: 'Vitamin C',
                genericName: 'Ascorbic Acid',
                dosage: 'Tablet',
                strength: '500mg',
                uses: 'Immune support',
                availability: 'available',
                pharmacies: [
                    { name: 'Nabha Medical Store', distance: '0.5km', stock: 67, phone: '+91-98765-43210', address: 'Main Road, Nabha' },
                    { name: 'Health Plus', distance: '2.1km', stock: 42, phone: '+91-98765-43212', address: 'Hospital Road, Nabha' },
                    { name: 'City Pharmacy', distance: '1.2km', stock: 38, phone: '+91-98765-43211', address: 'Market Street, Nabha' }
                ],
                alternatives: ['Multivitamin', 'Vitamin D', 'Zinc'],
                sideEffects: 'Mild diarrhea in high doses',
                precautions: 'Take with water'
            },
            {
                id: 7,
                name: 'Ibuprofen',
                genericName: 'Ibuprofen',
                dosage: 'Tablet',
                strength: '400mg',
                uses: 'Pain, Inflammation, Fever',
                availability: 'available',
                pharmacies: [
                    { name: 'City Pharmacy', distance: '1.2km', stock: 32, phone: '+91-98765-43211', address: 'Market Street, Nabha' },
                    { name: 'Nabha Medical Store', distance: '0.5km', stock: 18, phone: '+91-98765-43210', address: 'Main Road, Nabha' }
                ],
                alternatives: ['Paracetamol', 'Naproxen', 'Diclofenac'],
                sideEffects: 'Stomach upset, heartburn',
                precautions: 'Take with food'
            },
            {
                id: 8,
                name: 'Omeprazole',
                genericName: 'Omeprazole',
                dosage: 'Capsule',
                strength: '20mg',
                uses: 'Acid reflux, Ulcer',
                availability: 'available',
                pharmacies: [
                    { name: 'Health Plus', distance: '2.1km', stock: 25, phone: '+91-98765-43212', address: 'Hospital Road, Nabha' }
                ],
                alternatives: ['Pantoprazole', 'Ranitidine', 'Esomeprazole'],
                sideEffects: 'Headache, diarrhea',
                precautions: 'Take before meals'
            }
        ];
    }

    bindEvents() {
        // Search button
        document.getElementById('search-btn').addEventListener('click', () => {
            this.performSearch();
        });

        // Enter key in search input
        document.getElementById('medicine-search').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Quick search buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const medicine = e.target.getAttribute('data-medicine');
                document.getElementById('medicine-search').value = medicine;
                this.performSearch();
            });
        });

        // New search button
        document.getElementById('new-search').addEventListener('click', () => {
            this.showSearchSection();
        });

        // Location filter change
        document.getElementById('location-filter').addEventListener('change', (e) => {
            this.currentLocation = e.target.value;
            if (this.filteredMedicines.length > 0) {
                this.displayResults();
            }
        });

        // Availability filter change
        document.getElementById('availability-filter').addEventListener('change', () => {
            if (this.filteredMedicines.length > 0) {
                this.displayResults();
            }
        });

        // Voice search button
        document.getElementById('voice-search').addEventListener('click', () => {
            this.startVoiceSearch();
        });

        // Modal close button
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeMedicineModal();
        });

        // Close modal when clicking outside
        document.getElementById('medicine-modal').addEventListener('click', (e) => {
            if (e.target.id === 'medicine-modal') {
                this.closeMedicineModal();
            }
        });

        // Add event listeners to modal action buttons
        document.querySelector('.modal-actions .primary').addEventListener('click', () => {
            this.callPharmacy();
        });

        document.querySelector('.modal-actions .secondary').addEventListener('click', () => {
            this.getDirections();
        });
    }

    performSearch() {
        const searchTerm = document.getElementById('medicine-search').value.trim();
        const availabilityFilter = document.getElementById('availability-filter').value;
        
        if (!searchTerm) {
            this.showError('Please enter a medicine name to search');
            return;
        }

        this.showLoading();
        
        // Simulate API call delay
        setTimeout(() => {
            this.filterMedicines(searchTerm, availabilityFilter);
            this.displayResults();
            this.showResultsSection();
        }, 800);
    }

    filterMedicines(searchTerm, availabilityFilter) {
        const searchLower = searchTerm.toLowerCase();
        
        this.filteredMedicines = this.medicines.filter(medicine => {
            const nameMatch = medicine.name.toLowerCase().includes(searchLower) ||
                            medicine.genericName.toLowerCase().includes(searchLower);
            
            let availabilityMatch = true;
            if (availabilityFilter === 'available') {
                availabilityMatch = medicine.availability === 'available';
            } else if (availabilityFilter === 'alternative') {
                availabilityMatch = medicine.alternatives.length > 0;
            }
            
            return nameMatch && availabilityMatch;
        });

        // Sort by availability (available first, then low stock, then unavailable)
        this.filteredMedicines.sort((a, b) => {
            const order = { 'available': 1, 'low-stock': 2, 'unavailable': 3 };
            return order[a.availability] - order[b.availability];
        });
    }

    displayResults() {
        const resultsContainer = document.getElementById('medicine-list');
        const resultsCount = document.getElementById('results-count');
        
        resultsCount.textContent = `${this.filteredMedicines.length} medicine${this.filteredMedicines.length !== 1 ? 's' : ''} found`;
        
        if (this.filteredMedicines.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No medicines found</h3>
                    <p>Try searching with a different name or check the spelling</p>
                    <button class="quick-btn" style="margin-top: 1rem;" onclick="medicineFinder.showSearchSuggestions()">Show All Medicines</button>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = this.filteredMedicines.map(medicine => `
            <div class="medicine-card ${medicine.availability}" data-medicine-id="${medicine.id}">
                <div class="medicine-header">
                    <div>
                        <div class="medicine-name">${medicine.name}</div>
                        <div class="medicine-generic">${medicine.genericName}</div>
                    </div>
                    <span class="availability-badge ${medicine.availability}">
                        ${this.getAvailabilityText(medicine.availability)}
                    </span>
                </div>
                
                <div class="medicine-details">
                    <div class="detail-item">
                        <span class="detail-label">Dosage Form:</span>
                        <span class="detail-value">${medicine.dosage}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Strength:</span>
                        <span class="detail-value">${medicine.strength}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Uses:</span>
                        <span class="detail-value">${medicine.uses}</span>
                    </div>
                </div>
                
                <div class="pharmacies-list">
                    ${medicine.pharmacies.slice(0, 2).map(pharmacy => `
                        <div class="pharmacy-item">
                            <div>
                                <div class="pharmacy-name">${pharmacy.name}</div>
                                <div class="pharmacy-distance">${pharmacy.distance} • Stock: ${pharmacy.stock}</div>
                            </div>
                            <button class="view-details-btn" data-medicine-id="${medicine.id}">
                                View Details
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                ${medicine.pharmacies.length > 2 ? 
                    `<div class="more-pharmacies" onclick="medicineFinder.showAllPharmacies(${medicine.id})">
                        + ${medicine.pharmacies.length - 2} more pharmacies
                    </div>` : ''}
                
                ${medicine.alternatives.length > 0 ? `
                    <div class="alternatives-preview">
                        <small><strong>Alternatives:</strong> ${medicine.alternatives.slice(0, 3).join(', ')}</small>
                    </div>
                ` : ''}
            </div>
        `).join('');

        // Add event listeners to view details buttons
        resultsContainer.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const medicineId = parseInt(e.target.getAttribute('data-medicine-id'));
                this.showMedicineDetails(medicineId);
            });
        });

        // Add click event to entire medicine card
        resultsContainer.querySelectorAll('.medicine-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('view-details-btn') && 
                    !e.target.classList.contains('more-pharmacies')) {
                    const medicineId = parseInt(card.getAttribute('data-medicine-id'));
                    this.showMedicineDetails(medicineId);
                }
            });
        });
    }

    getAvailabilityText(availability) {
        const texts = {
            'available': 'In Stock',
            'low-stock': 'Low Stock',
            'unavailable': 'Out of Stock'
        };
        return texts[availability] || 'Unknown';
    }

    showMedicineDetails(medicineId) {
        const medicine = this.medicines.find(m => m.id === medicineId);
        if (!medicine) return;

        this.currentMedicine = medicine;

        // Update modal content
        document.getElementById('modal-medicine-name').textContent = medicine.name;
        document.getElementById('modal-generic-name').textContent = medicine.genericName;
        document.getElementById('modal-dosage').textContent = medicine.dosage;
        document.getElementById('modal-strength').textContent = medicine.strength;
        document.getElementById('modal-uses').textContent = medicine.uses;

        // Update pharmacy list
        const pharmacyList = document.getElementById('pharmacy-list');
        pharmacyList.innerHTML = medicine.pharmacies.map(pharmacy => `
            <div class="pharmacy-list-item" data-pharmacy="${pharmacy.name}">
                <div class="pharmacy-info">
                    <div class="pharmacy-name">${pharmacy.name}</div>
                    <div class="pharmacy-contact">
                        ${pharmacy.distance} • Stock: ${pharmacy.stock}<br>
                        ${pharmacy.phone} • ${pharmacy.address}
                    </div>
                </div>
                <span class="availability-badge ${medicine.availability}">
                    ${this.getAvailabilityText(medicine.availability)}
                </span>
            </div>
        `).join('');

        // Update alternatives list
        const alternativesList = document.getElementById('alternatives-list');
        alternativesList.innerHTML = medicine.alternatives.map(alt => `
            <div class="alternative-item">
                <span>${alt}</span>
                <button class="quick-btn" onclick="medicineFinder.searchAlternative('${alt}')">Search</button>
            </div>
        `).join('');

        // Show modal
        document.getElementById('medicine-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    searchAlternative(medicineName) {
        document.getElementById('medicine-search').value = medicineName;
        this.closeMedicineModal();
        this.performSearch();
    }

    showAllPharmacies(medicineId) {
        const medicine = this.medicines.find(m => m.id === medicineId);
        if (!medicine) return;

        this.showMedicineDetails(medicineId);
    }

    closeMedicineModal() {
        document.getElementById('medicine-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.currentMedicine = null;
    }

    callPharmacy() {
        if (!this.currentMedicine || this.currentMedicine.pharmacies.length === 0) return;
        
        const pharmacy = this.currentMedicine.pharmacies[0];
        this.showNotification(`Calling ${pharmacy.name} at ${pharmacy.phone}`, 'info');
        
        // In a real app, this would initiate a phone call
        setTimeout(() => {
            this.showNotification(`Call initiated to ${pharmacy.name}`, 'success');
        }, 1000);
    }

    getDirections() {
        if (!this.currentMedicine || this.currentMedicine.pharmacies.length === 0) return;
        
        const pharmacy = this.currentMedicine.pharmacies[0];
        this.showNotification(`Opening directions to ${pharmacy.name}`, 'info');
        
        // In a real app, this would open maps
        setTimeout(() => {
            this.showNotification(`Directions to ${pharmacy.name} opened`, 'success');
        }, 1000);
    }

    startVoiceSearch() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showError('Voice search is not supported in your browser');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            document.getElementById('voice-search').innerHTML = '<i class="fas fa-circle"></i>';
            document.getElementById('voice-search').style.background = '#ef4444';
            this.showNotification('Speak now...', 'info');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('medicine-search').value = transcript;
            this.performSearch();
        };

        recognition.onerror = (event) => {
            let errorMessage = 'Voice recognition error. Please try again.';
            if (event.error === 'not-allowed') {
                errorMessage = 'Microphone access denied. Please allow microphone access.';
            } else if (event.error === 'audio-capture') {
                errorMessage = 'No microphone found. Please check your microphone.';
            }
            this.showError(errorMessage);
        };

        recognition.onend = () => {
            document.getElementById('voice-search').innerHTML = '<i class="fas fa-microphone"></i>';
            document.getElementById('voice-search').style.background = '';
        };

        recognition.start();
    }

    showSearchSection() {
        document.querySelector('.search-section').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';
        document.getElementById('medicine-search').value = '';
        document.getElementById('medicine-search').focus();
    }

    showResultsSection() {
        document.querySelector('.search-section').style.display = 'none';
        document.getElementById('results-section').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showSearchSuggestions() {
        document.getElementById('medicine-search').value = '';
        this.filteredMedicines = [...this.medicines];
        this.displayResults();
        this.showResultsSection();
    }

    showLoading() {
        const button = document.getElementById('search-btn');
        const originalText = button.innerHTML;
        button.innerHTML = '<div class="loading"></div> Searching...';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 800);
    }

    checkOnlineStatus() {
        const updateOnlineStatus = () => {
            if (!navigator.onLine) {
                document.getElementById('offline-notice').style.display = 'flex';
                this.showNotification('You are offline. Using cached data.', 'warning');
            } else {
                document.getElementById('offline-notice').style.display = 'none';
            }
        };

        updateOnlineStatus();

        window.addEventListener('online', () => {
            document.getElementById('offline-notice').style.display = 'none';
            this.showNotification('Back online! Real-time data available.', 'success');
        });

        window.addEventListener('offline', () => {
            document.getElementById('offline-notice').style.display = 'flex';
            this.showNotification('You are offline. Using cached data.', 'warning');
        });
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        
        notification.innerHTML = `
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Add styles based on type
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b',
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
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Add keyframe animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
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
    
    .alternatives-preview {
        margin-top: 1rem;
        padding: 0.5rem;
        background: #f8fafc;
        border-radius: 4px;
        border-left: 3px solid var(--primary);
    }
`;

// Add CSS for medicine card click effect
const cardStyles = document.createElement('style');
cardStyles.textContent = `
    .medicine-card {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .medicine-card:active {
        transform: scale(0.98);
    }
    
    .pharmacy-list-item {
        cursor: pointer;
        transition: background 0.2s;
    }
    
    .pharmacy-list-item:hover {
        background: #e2e8f0 !important;
    }
`;

document.head.appendChild(notificationStyles);
document.head.appendChild(cardStyles);

// Initialize Medicine Finder when page loads
let medicineFinder;

document.addEventListener('DOMContentLoaded', function() {
    medicineFinder = new MedicineFinder();
    
    // Focus on search input
    document.getElementById('medicine-search').focus();
    
    // Add some sample data to localStorage for offline use
    if (!localStorage.getItem('medicineData')) {
        localStorage.setItem('medicineData', JSON.stringify(medicineFinder.medicines));
    }
});

// Service Worker Registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}