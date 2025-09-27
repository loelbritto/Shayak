// Farmer Health Management
class FarmerHealth {
    constructor() {
        this.weatherData = null;
        this.userFollowing = null;
        this.init();
    }

    init() {
        this.fetchWeatherData();
        this.setupEventListeners();
        this.displayPrecautions();
    }

    setupEventListeners() {
        document.getElementById('yesBtn').addEventListener('click', () => this.handleAnswer(true));
        document.getElementById('noBtn').addEventListener('click', () => this.handleAnswer(false));
    }

    async fetchWeatherData() {
        // Mock weather data for Nabha, Punjab
        // In real implementation, you would use a weather API
        const mockWeatherData = {
            temperature: 30,
            description: "Partly Cloudy",
            humidity: 65,
            windSpeed: 12,
            condition: "partly-cloudy", // sunny, rainy, cloudy, partly-cloudy
            location: "Nabha, Punjab"
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.weatherData = mockWeatherData;
        this.displayWeatherData();
        this.displayPrecautions();
    }

    displayWeatherData() {
        if (!this.weatherData) return;

        const weatherIconMap = {
            'sunny': 'fa-sun',
            'rainy': 'fa-cloud-rain',
            'cloudy': 'fa-cloud',
            'partly-cloudy': 'fa-cloud-sun'
        };

        document.getElementById('temperature').textContent = `${this.weatherData.temperature}°C`;
        document.getElementById('weatherDesc').textContent = this.weatherData.description;
        document.getElementById('windSpeed').textContent = `${this.weatherData.windSpeed} km/h`;
        document.getElementById('humidity').textContent = `${this.weatherData.humidity}%`;
        
        const iconElement = document.getElementById('weatherIcon');
        iconElement.className = `fas ${weatherIconMap[this.weatherData.condition] || 'fa-sun'}`;
    }

    displayPrecautions() {
        const precautionsGrid = document.getElementById('precautionsGrid');
        if (!this.weatherData) {
            precautionsGrid.innerHTML = '<div class="loading">Loading precautions...</div>';
            return;
        }

        const precautions = this.getPrecautionsBasedOnWeather();
        precautionsGrid.innerHTML = precautions.map(precaution => this.createPrecautionCard(precaution)).join('');
    }

    getPrecautionsBasedOnWeather() {
        const basePrecautions = [
            {
                icon: 'fa-seedling',
                title: 'Crop Management',
                items: [
                    'Rotate crops to maintain soil health',
                    'Use organic fertilizers when possible',
                    'Monitor for pest infestations regularly'
                ]
            },
            {
                icon: 'fa-tint',
                title: 'Water Management',
                items: [
                    'Implement drip irrigation for efficiency',
                    'Water during early morning or late evening',
                    'Check soil moisture before irrigation'
                ]
            },
            {
                icon: 'fa-user-shield',
                title: 'Personal Safety',
                items: [
                    'Wear protective gear during pesticide application',
                    'Take breaks during extreme weather conditions',
                    'Stay hydrated throughout the day'
                ]
            }
        ];

        const weatherSpecific = this.getWeatherSpecificPrecautions();
        return [...basePrecautions, ...weatherSpecific];
    }

    getWeatherSpecificPrecautions() {
        if (!this.weatherData) return [];

        const temp = this.weatherData.temperature;
        const condition = this.weatherData.condition;

        let precautions = [];

        // Temperature-based precautions
        if (temp > 35) {
            precautions.push({
                icon: 'fa-sun',
                title: 'Heat Management',
                items: [
                    'Schedule work during cooler hours (6-10 AM, 4-7 PM)',
                    'Provide shade for sensitive crops',
                    'Increase irrigation frequency'
                ]
            });
        } else if (temp < 15) {
            precautions.push({
                icon: 'fa-temperature-low',
                title: 'Cold Protection',
                items: [
                    'Use mulch to protect soil temperature',
                    'Cover sensitive plants during night',
                    'Delay sowing of temperature-sensitive crops'
                ]
            });
        }

        // Weather condition-based precautions
        if (condition === 'rainy') {
            precautions.push({
                icon: 'fa-cloud-rain',
                title: 'Rain Preparedness',
                items: [
                    'Ensure proper drainage in fields',
                    'Postpone fertilizer application',
                    'Harvest ripe crops to avoid damage'
                ]
            });
        } else if (condition === 'sunny') {
            precautions.push({
                icon: 'fa-sun',
                title: 'Sun Protection',
                items: [
                    'Apply sun-protective coatings if needed',
                    'Increase watering frequency',
                    'Monitor for sunburn on fruits'
                ]
            });
        }

        return precautions;
    }

    getAdditionalPrecautions() {
        return [
            {
                title: 'Advanced Soil Testing',
                content: 'Conduct detailed soil analysis for micronutrient levels and adjust fertilization accordingly.'
            },
            {
                title: 'Precision Agriculture',
                content: 'Consider using GPS-guided equipment for optimal resource utilization and reduced waste.'
            },
            {
                title: 'Integrated Pest Management',
                content: 'Implement biological control methods alongside chemical treatments for sustainable pest control.'
            },
            {
                title: 'Crop Diversification',
                content: 'Explore intercropping with legumes to naturally enhance soil nitrogen content.'
            },
            {
                title: 'Water Conservation Tech',
                content: 'Invest in moisture sensors and automated irrigation systems for optimal water usage.'
            },
            {
                title: 'Market Analysis',
                content: 'Study market trends to plan crop selection for better profitability next season.'
            }
        ];
    }

    createPrecautionCard(precaution) {
        return `
            <div class="precauction-card">
                <div class="precauction-icon">
                    <i class="fas ${precaution.icon}"></i>
                </div>
                <h3>${precaution.title}</h3>
                <ul>
                    ${precaution.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    handleAnswer(isFollowing) {
        this.userFollowing = isFollowing;
        
        if (isFollowing) {
            this.showAdditionalPrecautions();
            this.showNotification('Great! Here are some advanced recommendations for you.', 'success');
        } else {
            this.showNotification('Please focus on implementing the basic precautions first. You can do it!', 'info');
        }

        // Hide the question section
        document.querySelector('.question-section').style.display = 'none';
    }

    showAdditionalPrecautions() {
        const additionalSection = document.getElementById('additionalPrecautions');
        const additionalGrid = document.getElementById('additionalGrid');
        
        const additionalPrecautions = this.getAdditionalPrecautions();
        additionalGrid.innerHTML = additionalPrecautions.map(precaution => `
            <div class="additional-card">
                <h3>${precaution.title}</h3>
                <p>${precaution.content}</p>
            </div>
        `).join('');
        
        additionalSection.style.display = 'block';
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FarmerHealth();
});

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .loading {
        text-align: center;
        padding: 2rem;
        color: #6b7280;
        font-style: italic;
    }
`;
document.head.appendChild(style);