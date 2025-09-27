// Outbreak Heatmap functionality
class OutbreakHeatmap {
    constructor() {
        this.map = null;
        this.heatmapLayer = null;
        this.villageData = [];
        this.currentDisease = 'all';
        this.markers = [];
        this.init();
    }

    init() {
        this.loadVillageData();
        this.initMap();
        this.bindEvents();
        this.renderVillageList();
        this.updateStats();
        this.setUpdateTime();
    }

    // Enhanced sample village data for Nabha region with proper risk categorization
    loadVillageData() {
        this.villageData = [
            // High Risk (6+ cases) - Red/Outbreak
            {
                id: 1,
                name: 'Nabha City Center',
                lat: 30.3753,
                lng: 76.1522,
                cases: 8,
                disease: 'malaria',
                risk: 'high',
                population: 45000,
                lastUpdate: '2024-01-15'
            },
            {
                id: 2,
                name: 'Jhansla',
                lat: 30.3956,
                lng: 76.1721,
                cases: 7,
                disease: 'dengue',
                risk: 'high',
                population: 1100,
                lastUpdate: '2024-01-14'
            },
            {
                id: 3,
                name: 'Bhadson',
                lat: 30.3628,
                lng: 76.1421,
                cases: 6,
                disease: 'waterborne',
                risk: 'high',
                population: 3200,
                lastUpdate: '2024-01-15'
            },
            {
                id: 4,
                name: 'Kotla',
                lat: 30.3889,
                lng: 76.1623,
                cases: 9,
                disease: 'malaria',
                risk: 'high',
                population: 1800,
                lastUpdate: '2024-01-13'
            },
            
            // Medium Risk (3-5 cases) - Yellow/Rising
            {
                id: 5,
                name: 'Rampura Village',
                lat: 30.3912,
                lng: 76.1387,
                cases: 4,
                disease: 'dengue',
                risk: 'medium',
                population: 1200,
                lastUpdate: '2024-01-14'
            },
            {
                id: 6,
                name: 'Santpura',
                lat: 30.3689,
                lng: 76.1623,
                cases: 3,
                disease: 'waterborne',
                risk: 'medium',
                population: 900,
                lastUpdate: '2024-01-15'
            },
            {
                id: 7,
                name: 'Bhankharpur',
                lat: 30.3821,
                lng: 76.1489,
                cases: 5,
                disease: 'flu',
                risk: 'medium',
                population: 2100,
                lastUpdate: '2024-01-14'
            },
            
            // Low Risk (1-2 cases) - Green/Normal
            {
                id: 8,
                name: 'Kisan Nagar',
                lat: 30.3621,
                lng: 76.1456,
                cases: 2,
                disease: 'flu',
                risk: 'low',
                population: 800,
                lastUpdate: '2024-01-15'
            },
            {
                id: 9,
                name: 'Gursagar',
                lat: 30.3723,
                lng: 76.1587,
                cases: 1,
                disease: 'malaria',
                risk: 'low',
                population: 1500,
                lastUpdate: '2024-01-13'
            },
            
            // No cases - Normal
            {
                id: 10,
                name: 'Gobindpura',
                lat: 30.3854,
                lng: 76.1289,
                cases: 0,
                disease: 'none',
                risk: 'normal',
                population: 1500,
                lastUpdate: '2024-01-15'
            },
            {
                id: 11,
                name: 'Rurka',
                lat: 30.3789,
                lng: 76.1321,
                cases: 0,
                disease: 'none',
                risk: 'normal',
                population: 1200,
                lastUpdate: '2024-01-14'
            }
        ];
    }

    initMap() {
        // Initialize map centered on Nabha
        this.map = L.map('heatmap').setView([30.3753, 76.1522], 12);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);

        // Add heatmap layer
        this.updateHeatmap();
    }

    updateHeatmap() {
        // Clear existing heatmap and markers
        if (this.heatmapLayer) {
            this.map.removeLayer(this.heatmapLayer);
        }
        
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        // Filter data based on current disease selection
        const filteredData = this.currentDisease === 'all' 
            ? this.villageData 
            : this.villageData.filter(village => village.disease === this.currentDisease);

        // Create heatmap points with intensity based on cases
        const points = filteredData
            .filter(village => village.cases > 0) // Only include villages with cases
            .map(village => {
                // Normalize intensity based on cases (0-1 scale)
                let intensity;
                if (village.cases >= 6) {
                    intensity = 1.0; // Outbreak
                } else if (village.cases >= 3) {
                    intensity = 0.6; // Rising
                } else {
                    intensity = 0.4; // Normal
                }
                return [village.lat, village.lng, intensity];
            });

        // Create heatmap layer with gradient matching the legend
        this.heatmapLayer = L.heatLayer(points, {
            radius: 35,
            blur: 20,
            maxZoom: 17,
            gradient: {
                0.4: '#10b981',  // Normal - Green
                0.6: '#f59e0b',  // Rising - Yellow
                1.0: '#ef4444'   // Outbreak - Red
            }
        }).addTo(this.map);

        // Add village markers with popups
        filteredData.forEach(village => {
            const color = this.getRiskColor(village.risk);
            const radius = this.getMarkerRadius(village.cases);
            
            const marker = L.circleMarker([village.lat, village.lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.7,
                radius: radius,
                weight: 2
            }).addTo(this.map);

            marker.bindPopup(this.createPopupContent(village));
            this.markers.push(marker);
        });
    }

    getRiskColor(risk) {
        const colors = {
            'high': '#ef4444',    // Red
            'medium': '#f59e0b',  // Yellow
            'low': '#10b981',     // Green
            'normal': '#6b7280'   // Gray
        };
        return colors[risk] || '#6b7280';
    }

    getMarkerRadius(cases) {
        if (cases >= 6) return 12;   // Large for outbreak
        if (cases >= 3) return 9;    // Medium for rising
        if (cases >= 1) return 6;    // Small for low risk
        return 4;                    // Very small for no cases
    }

    createPopupContent(village) {
        return `
            <div style="min-width: 200px;">
                <h4 style="margin: 0 0 10px 0; color: #1f2937;">${village.name}</h4>
                <div style="margin-bottom: 8px;">
                    <strong>Cases:</strong> ${village.cases}
                </div>
                <div style="margin-bottom: 8px;">
                    <strong>Disease:</strong> ${this.formatDisease(village.disease)}
                </div>
                <div style="margin-bottom: 8px;">
                    <strong>Risk Level:</strong> 
                    <span style="color: ${this.getRiskColor(village.risk)}; font-weight: 600;">
                        ${village.risk.toUpperCase()}
                    </span>
                </div>
                <div style="margin-bottom: 8px;">
                    <strong>Population:</strong> ${village.population.toLocaleString()}
                </div>
                <div style="font-size: 0.8em; color: #6b7280;">
                    Updated: ${new Date(village.lastUpdate).toLocaleDateString()}
                </div>
            </div>
        `;
    }

    formatDisease(disease) {
        const names = {
            'malaria': 'Malaria',
            'dengue': 'Dengue Fever',
            'flu': 'Seasonal Flu',
            'waterborne': 'Waterborne Diseases',
            'none': 'No Active Cases'
        };
        return names[disease] || disease;
    }

    bindEvents() {
        // Disease filter
        document.getElementById('disease-filter').addEventListener('change', (e) => {
            this.currentDisease = e.target.value;
            this.updateHeatmap();
            this.renderVillageList();
            this.updateStats();
        });

        // Time filter
        document.getElementById('time-filter').addEventListener('change', (e) => {
            this.showTimeFilterNotification(e.target.value);
        });

        // Emergency buttons
        document.querySelectorAll('.emergency-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const number = e.target.textContent.includes('104') ? '104' : '108';
                this.confirmEmergencyCall(number);
            });
        });
    }

    renderVillageList() {
        const villageList = document.getElementById('villageList');
        const filteredData = this.currentDisease === 'all' 
            ? this.villageData 
            : this.villageData.filter(village => village.disease === this.currentDisease);

        // Sort by cases (highest first)
        const sortedData = filteredData.sort((a, b) => b.cases - a.cases);

        if (sortedData.length === 0) {
            villageList.innerHTML = '<div class="loading">No villages found for selected disease filter</div>';
            return;
        }

        villageList.innerHTML = sortedData.map(village => `
            <div class="village-item ${village.risk}-risk">
                <div class="village-info">
                    <h4>${village.name}</h4>
                    <p>${village.cases} reported cases • ${this.formatDisease(village.disease)}</p>
                    <small>Population: ${village.population.toLocaleString()} • Updated: ${new Date(village.lastUpdate).toLocaleDateString()}</small>
                </div>
                <div class="risk-badge ${village.risk}">
                    ${village.risk.charAt(0).toUpperCase() + village.risk.slice(1)} Risk
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const filteredData = this.currentDisease === 'all' 
            ? this.villageData 
            : this.villageData.filter(village => village.disease === this.currentDisease);

        const totalCases = filteredData.reduce((sum, village) => sum + village.cases, 0);
        const highRiskAreas = filteredData.filter(village => village.risk === 'high').length;
        const affectedVillages = filteredData.filter(village => village.cases > 0).length;

        document.getElementById('totalCases').textContent = totalCases;
        document.getElementById('highRiskAreas').textContent = highRiskAreas;
        document.getElementById('affectedVillages').textContent = affectedVillages;
    }

    setUpdateTime() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.getElementById('updateTime').textContent = now.toLocaleDateString('en-IN', options);
    }

    showTimeFilterNotification(timeframe) {
        const messages = {
            'current': 'Showing current outbreak data',
            '7d': 'Showing 7-day outbreak prediction',
            '14d': 'Showing 14-day outbreak forecast'
        };

        this.showNotification(messages[timeframe], 'info');
    }

    confirmEmergencyCall(number) {
        if (confirm(`Call emergency number ${number}? This will redirect to your phone app.`)) {
            window.location.href = `tel:${number}`;
        }
    }

    showNotification(message, type) {
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
`;

document.head.appendChild(notificationStyles);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    new OutbreakHeatmap();
});

// PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('../sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}