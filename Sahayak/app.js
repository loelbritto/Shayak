// Global state management for navigation history
const navigationHistory = {
    currentPage: 'index',
    previousPage: null,
    modalHistory: [],
    sectionProgress: {}
};

// Service Modal Functionality
function showServiceModal(service, customContent = null) {
    // Add to modal history
    navigationHistory.modalHistory.push(service);
    
    // Check if it's one of our features that has a dedicated page
    if (service === 'Health Metrics' || service === 'Medicine Basket' || 
        service === 'Farmer Health' || service === 'Outbreak Heatmap' ||
        service === 'QR Scanner' || service === 'Medicine Finder' ||
        service === 'Body Map' || service === 'Consult a Doctor') {
        
        if (service === 'Health Metrics') {
            showHealthMetricsModal();
            return;
        }
        if (service === 'Medicine Basket') {
            showMedicineBasketModal();
            return;
        }
        if (service === 'Farmer Health') {
            showFarmerHealthModal();
            return;
        }
        if (service === 'Outbreak Heatmap') {
            showOutbreakHeatmapModal();
            return;
        }
        if (service === 'QR Scanner') {
            showQRScannerModal();
            return;
        }
        if (service === 'Medicine Finder') {
            showMedicineFinderModal();
            return;
        }
        if (service === 'Body Map') {
            showBodyMapModal();
            return;
        }
        if (service === 'Consult a Doctor') {
            showDoctorConsultationModal();
            return;
        }
    }
    
    const modal = document.getElementById('serviceModal');
    const modalContent = document.getElementById('modalContent');
    
    let content = '';
    
    if (customContent) {
        content = customContent;
    } else {
        // Default modal content for services without dedicated pages
        content = `
            <div class="modal-header">
                <h2>${service}</h2>
            </div>
            <div class="modal-body">
                <div class="service-icon">
                    <i class="fas fa-${getServiceIcon(service)}"></i>
                </div>
                <p>This feature is currently under development. We're working hard to bring you the best healthcare experience.</p>
                <div class="modal-actions">
                    <button onclick="closeModal()" class="btn-secondary">Close</button>
                    <button onclick="notifyMe('${service}')" class="btn-primary">Notify Me When Ready</button>
                </div>
            </div>
        `;
    }
    
    modalContent.innerHTML = content;
    modal.style.display = 'block';
    
    // Add animation
    modal.classList.add('modal-show');
    
    // Update browser history for modal navigation
    window.history.pushState({ 
        type: 'modal', 
        service: service,
        timestamp: Date.now()
    }, '', `#${service.replace(/\s+/g, '-').toLowerCase()}`);
}

function closeModal() {
    const modal = document.getElementById('serviceModal');
    modal.classList.remove('modal-show');
    
    // Remove from modal history
    if (navigationHistory.modalHistory.length > 0) {
        navigationHistory.modalHistory.pop();
    }
    
    setTimeout(() => {
        modal.style.display = 'none';
        // Go back in history when closing modal
        if (window.history.state && window.history.state.type === 'modal') {
            window.history.back();
        }
    }, 300);
}

function getServiceIcon(service) {
    const iconMap = {
        'Consult a Doctor': 'user-tie',
        'Body Map': 'user-md',
        'QR Scanner': 'qrcode',
        'Symptom Checker': 'diagnoses',
        'Medicine Finder': 'pills',
        'Outbreak Heatmap': 'map-marked-alt',
        'Farmer Health': 'tractor',
        'Medicine Basket': 'shopping-basket',
        'Health Metrics': 'heartbeat',
        'Health Check-Up': 'stethoscope'
    };
    
    return iconMap[service] || 'heart';
}

function notifyMe(service) {
    alert(`We'll notify you when ${service} is available!`);
    closeModal();
}

// Health Metrics Modal (redirects to dedicated page)
function showHealthMetricsModal() {
    showServiceModal('Health Metrics', `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;">
                <i class="fas fa-heartbeat"></i>
            </div>
            <h3 style="margin-bottom: 1rem;">Health Metrics Tracker</h3>
            <p style="margin-bottom: 2rem; color: #6b7280;">
                Track your vital signs including heart rate, blood pressure, temperature, and more. Monitor your health data over time.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="closeModal()" style="padding: 0.75rem 1.5rem; border: 2px solid #d1d5db; background: white; border-radius: 8px; cursor: pointer;">
                    Learn More
                </button>
                <a href="health-metrics.html" class="navigation-link" onclick="trackNavigation('health-metrics')" style="padding: 0.75rem 1.5rem; background: #ef4444; color: white; border: none; border-radius: 8px; text-decoration: none; cursor: pointer;">
                    Track Metrics
                </a>
            </div>
        </div>
    `);
}

// Medicine Basket Modal (redirects to dedicated page)
function showMedicineBasketModal() {
    showServiceModal('Medicine Basket', `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;">
                <i class="fas fa-shopping-basket"></i>
            </div>
            <h3 style="margin-bottom: 1rem;">Medicine Basket</h3>
            <p style="margin-bottom: 2rem; color: #6b7280;">
                Pool medicine orders with your community to get better prices and ensure availability. Join forces with neighbors for bulk purchasing.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="closeModal()" style="padding: 0.75rem 1.5rem; border: 2px solid #d1d5db; background: white; border-radius: 8px; cursor: pointer;">
                    Learn More
                </button>
                <a href="medicine-basket.html" class="navigation-link" onclick="trackNavigation('medicine-basket')" style="padding: 0.75rem 1.5rem; background: #10b981; color: white; border: none; border-radius: 8px; text-decoration: none; cursor: pointer;">
                    Start Pooling
                </a>
            </div>
        </div>
    `);
}

// Farmer Health Modal (redirects to dedicated page)
function showFarmerHealthModal() {
    showServiceModal('Farmer Health', `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; color: #f59e0b; margin-bottom: 1rem;">
                <i class="fas fa-tractor"></i>
            </div>
            <h3 style="margin-bottom: 1rem;">Farmer Health</h3>
            <p style="margin-bottom: 2rem; color: #6b7280;">
                Get seasonal advisories, weather-based precautions, and essential first-aid information tailored for farmers in Nabha, Punjab.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="closeModal()" style="padding: 0.75rem 1.5rem; border: 2px solid #d1d5db; background: white; border-radius: 8px; cursor: pointer;">
                    Learn More
                </button>
                <a href="farmer-health.html" class="navigation-link" onclick="trackNavigation('farmer-health')" style="padding: 0.75rem 1.5rem; background: #f59e0b; color: white; border: none; border-radius: 8px; text-decoration: none; cursor: pointer;">
                    View Advisories
                </a>
            </div>
        </div>
    `);
}

// Outbreak Heatmap Modal (redirects to dedicated page)
function showOutbreakHeatmapModal() {
    showServiceModal('Outbreak Heatmap', `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; color: #dc2626; margin-bottom: 1rem;">
                <i class="fas fa-map-marked-alt"></i>
            </div>
            <h3 style="margin-bottom: 1rem;">Outbreak Heatmap</h3>
            <p style="margin-bottom: 2rem; color: #6b7280;">
                View predictive outbreak maps for Nabha and nearby villages. Track disease spread and get prevention recommendations.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="closeModal()" style="padding: 0.75rem 1.5rem; border: 2px solid #d1d5db; background: white; border-radius: 8px; cursor: pointer;">
                    Learn More
                </button>
                <a href="outbreak-heatmap.html" class="navigation-link" onclick="trackNavigation('outbreak-heatmap')" style="padding: 0.75rem 1.5rem; background: #dc2626; color: white; border: none; border-radius: 8px; text-decoration: none; cursor: pointer;">
                    View Heatmap
                </a>
            </div>
        </div>
    `);
}

// QR Scanner Modal (redirects to dedicated page)
function showQRScannerModal() {
    showServiceModal('QR Scanner', `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; color: #3b82f6; margin-bottom: 1rem;">
                <i class="fas fa-qrcode"></i>
            </div>
            <h3 style="margin-bottom: 1rem;">QR Scanner</h3>
            <p style="margin-bottom: 2rem; color: #6b7280;">
                Scan QR codes to access patient records instantly. Quick and secure access to medical history and prescriptions.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="closeModal()" style="padding: 0.75rem 1.5rem; border: 2px solid #d1d5db; background: white; border-radius: 8px; cursor: pointer;">
                    Learn More
                </button>
                <a href="qr-scanner.html" class="navigation-link" onclick="trackNavigation('qr-scanner')" style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 8px; text-decoration: none; cursor: pointer;">
                    Start Scanning
                </a>
            </div>
        </div>
    `);
}

// Medicine Finder Modal (redirects to dedicated page)
function showMedicineFinderModal() {
    showServiceModal('Medicine Finder', `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; color: #8b5cf6; margin-bottom: 1rem;">
                <i class="fas fa-pills"></i>
            </div>
            <h3 style="margin-bottom: 1rem;">Medicine Finder</h3>
            <p style="margin-bottom: 2rem; color: #6b7280;">
                Find medicines at local pharmacies. Check availability, compare prices, and get directions to nearby pharmacies.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="closeModal()" style="padding: 0.75rem 1.5rem; border: 2px solid #d1d5db; background: white; border-radius: 8px; cursor: pointer;">
                    Learn More
                </button>
                <a href="medicine-finder.html" class="navigation-link" onclick="trackNavigation('medicine-finder')" style="padding: 0.75rem 1.5rem; background: #8b5cf6; color: white; border: none; border-radius: 8px; text-decoration: none; cursor: pointer;">
                    Find Medicines
                </a>
            </div>
        </div>
    `);
}

// Body Map Modal (redirects to dedicated page)
function showBodyMapModal() {
    showServiceModal('Body Map', `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; color: #3b82f6; margin-bottom: 1rem;">
                <i class="fas fa-user-md"></i>
            </div>
            <h3 style="margin-bottom: 1rem;">Body Map</h3>
            <p style="margin-bottom: 2rem; color: #6b7280;">
                Identify pain points by tapping on interactive body diagrams. Get medical advice based on your symptoms from trusted sources.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="closeModal()" style="padding: 0.75rem 1.5rem; border: 2px solid #d1d5db; background: white; border-radius: 8px; cursor: pointer;">
                    Learn More
                </button>
                <a href="body-map.html" class="navigation-link" onclick="trackNavigation('body-map')" style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 8px; text-decoration: none; cursor: pointer;">
                    Start Mapping
                </a>
            </div>
        </div>
    `);
}

// Doctor Consultation Modal (redirects to dedicated page)
function showDoctorConsultationModal() {
    showServiceModal('Consult a Doctor', `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;">
                <i class="fas fa-user-tie"></i>
            </div>
            <h3 style="margin-bottom: 1rem;">Consult a Doctor</h3>
            <p style="margin-bottom: 2rem; color: #6b7280;">
                Connect with certified healthcare professionals through secure video consultation. Get medical advice from the comfort of your home.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="closeModal()" style="padding: 0.75rem 1.5rem; border: 2px solid #d1d5db; background: white; border-radius: 8px; cursor: pointer;">
                    Learn More
                </button>
                <a href="doctor.html" class="navigation-link" onclick="trackNavigation('doctor')" style="padding: 0.75rem 1.5rem; background: #10b981; color: white; border: none; border-radius: 8px; text-decoration: none; cursor: pointer;">
                    Start Consultation
                </a>
            </div>
        </div>
    `);
}

// Navigation tracking function
function trackNavigation(section) {
    // Save current progress before navigating
    saveSectionProgress(section);
    
    // Show loading indicator
    showBackProgress();
    
    // Add to navigation history
    navigationHistory.previousPage = navigationHistory.currentPage;
    navigationHistory.currentPage = section;
    
    // Store in session storage for cross-page navigation
    sessionStorage.setItem('sahayakNavigation', JSON.stringify(navigationHistory));
}

// Save section progress
function saveSectionProgress(section) {
    // Get any existing progress for the current section
    const currentProgress = getCurrentSectionProgress();
    
    if (currentProgress) {
        navigationHistory.sectionProgress[navigationHistory.currentPage] = currentProgress;
    }
    
    // Store in session storage
    sessionStorage.setItem('sahayakSectionProgress', JSON.stringify(navigationHistory.sectionProgress));
}

// Get current section progress (to be implemented in each section)
function getCurrentSectionProgress() {
    // This function should be overridden by each section's JavaScript
    // For example, in body-map.js, it would return the current pain points selected
    return null;
}

// Restore section progress
function restoreSectionProgress(section) {
    const progress = navigationHistory.sectionProgress[section];
    if (progress) {
        // This function should be implemented in each section's JavaScript
        // For example, in body-map.js, it would restore the pain points
        if (typeof window['restore' + section.replace(/-/g, '') + 'Progress'] === 'function') {
            window['restore' + section.replace(/-/g, '') + 'Progress'](progress);
        }
    }
}

// Show back progress indicator
function showBackProgress() {
    const backProgress = document.getElementById('backProgress');
    backProgress.style.display = 'flex';
    
    setTimeout(() => {
        backProgress.style.display = 'none';
    }, 1500);
}

// Handle browser back button
function setupBackButtonHandler() {
    window.addEventListener('popstate', function(event) {
        // Check if we're going back from a modal
        if (event.state && event.state.type === 'modal') {
            closeModal();
        } else {
            // Handle page navigation back
            if (navigationHistory.previousPage) {
                showBackProgress();
                
                // Restore previous page progress
                setTimeout(() => {
                    restoreSectionProgress(navigationHistory.previousPage);
                    
                    // Update navigation history
                    const temp = navigationHistory.currentPage;
                    navigationHistory.currentPage = navigationHistory.previousPage;
                    navigationHistory.previousPage = temp;
                    
                    // Update session storage
                    sessionStorage.setItem('sahayakNavigation', JSON.stringify(navigationHistory));
                }, 500);
            }
        }
    });
}

// Initialize navigation history from session storage
function initializeNavigationHistory() {
    const savedNavigation = sessionStorage.getItem('sahayakNavigation');
    const savedProgress = sessionStorage.getItem('sahayakSectionProgress');
    
    if (savedNavigation) {
        Object.assign(navigationHistory, JSON.parse(savedNavigation));
    }
    
    if (savedProgress) {
        navigationHistory.sectionProgress = JSON.parse(savedProgress);
    }
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('serviceModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sahayak App initialized successfully');
    
    // Initialize navigation history
    initializeNavigationHistory();
    
    // Setup back button handler
    setupBackButtonHandler();
    
    // Setup emergency contacts
    setupEmergencyContacts();
    
    // Setup offline indicator
    setupOfflineIndicator();
    
    // Check browser compatibility
    checkBrowserCompatibility();
    
    // Add any initialization code here if needed
    window.addEventListener('online', function() {
        console.log('App is online');
    });
    
    window.addEventListener('offline', function() {
        console.log('App is offline - some features may not work');
    });
});

// Emergency contact functionality
function setupEmergencyContacts() {
    const emergencyButtons = document.querySelectorAll('.emergency-btn');
    emergencyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const number = this.textContent.includes('108') ? '108' : '102';
            if (confirm(`Call emergency number ${number}? This will redirect to your phone app.`)) {
                window.location.href = `tel:${number}`;
            }
        });
    });
}

// Feature detection for modern browser features
function checkBrowserCompatibility() {
    const features = {
        'serviceWorker': 'serviceWorker' in navigator,
        'localStorage': 'localStorage' in window,
        'geolocation': 'geolocation' in navigator,
        'vibrate': 'vibrate' in navigator
    };
    
    console.log('Browser compatibility check:', features);
    
    // If service workers aren't supported, show a message
    if (!features.serviceWorker) {
        console.warn('Service Workers not supported - PWA features disabled');
    }
    
    return features;
}

// Add a simple offline indicator
function setupOfflineIndicator() {
    const offlineIndicator = document.getElementById('offlineIndicator');
    
    window.addEventListener('online', function() {
        offlineIndicator.style.display = 'none';
    });
    
    window.addEventListener('offline', function() {
        offlineIndicator.style.display = 'block';
    });
}

// Notification function for user feedback
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    
    const colors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type] || 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation styles if not already present
    if (!document.querySelector('#notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Export function for global use
window.showNotification = showNotification;
window.trackNavigation = trackNavigation;
window.navigationHistory = navigationHistory;