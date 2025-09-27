// Health Metrics Management
class HealthMetrics {
    constructor() {
        this.metrics = JSON.parse(localStorage.getItem('healthMetrics')) || [];
        this.currentMetrics = this.getLatestMetrics();
        this.init();
    }

    init() {
        this.displayCurrentMetrics();
        this.setupEventListeners();
        this.loadHistory();
    }

    setupEventListeners() {
        const form = document.getElementById('metricsForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const metrics = {
            heartRate: parseInt(document.getElementById('heartRateInput').value),
            systolic: parseInt(document.getElementById('systolicInput').value),
            diastolic: parseInt(document.getElementById('diastolicInput').value),
            temperature: parseFloat(document.getElementById('temperatureInput').value),
            oxygen: parseInt(document.getElementById('oxygenInput').value),
            weight: parseFloat(document.getElementById('weightInput').value),
            height: parseInt(document.getElementById('heightInput').value),
            timestamp: new Date().toISOString()
        };

        if (this.validateMetrics(metrics)) {
            this.saveMetrics(metrics);
            this.displayCurrentMetrics();
            this.loadHistory();
            this.clearForm();
            this.showNotification('Metrics saved successfully!', 'success');
        }
    }

    validateMetrics(metrics) {
        // Basic validation
        if (!metrics.heartRate || metrics.heartRate < 30 || metrics.heartRate > 200) {
            this.showNotification('Please enter a valid heart rate (30-200 BPM)', 'error');
            return false;
        }

        if (!metrics.systolic || metrics.systolic < 60 || metrics.systolic > 200 ||
            !metrics.diastolic || metrics.diastolic < 40 || metrics.diastolic > 150) {
            this.showNotification('Please enter valid blood pressure values', 'error');
            return false;
        }

        if (!metrics.temperature || metrics.temperature < 35 || metrics.temperature > 42) {
            this.showNotification('Please enter a valid temperature (35-42°C)', 'error');
            return false;
        }

        if (!metrics.oxygen || metrics.oxygen < 70 || metrics.oxygen > 100) {
            this.showNotification('Please enter valid oxygen saturation (70-100%)', 'error');
            return false;
        }

        return true;
    }

    saveMetrics(metrics) {
        this.metrics.push(metrics);
        localStorage.setItem('healthMetrics', JSON.stringify(this.metrics));
        this.currentMetrics = metrics;
    }

    getLatestMetrics() {
        if (this.metrics.length === 0) {
            return null;
        }
        return this.metrics[this.metrics.length - 1];
    }

    displayCurrentMetrics() {
        const metrics = this.currentMetrics;
        
        if (!metrics) {
            this.showPlaceholderMetrics();
            return;
        }

        // Heart Rate
        this.updateMetricDisplay('heartRate', metrics.heartRate, this.getHeartRateStatus(metrics.heartRate));
        
        // Blood Pressure
        const bpValue = `${metrics.systolic}/${metrics.diastolic}`;
        this.updateMetricDisplay('bloodPressure', bpValue, this.getBloodPressureStatus(metrics.systolic, metrics.diastolic));
        
        // Temperature
        this.updateMetricDisplay('temperature', metrics.temperature.toFixed(1), this.getTemperatureStatus(metrics.temperature));
        
        // Oxygen
        this.updateMetricDisplay('oxygen', metrics.oxygen, this.getOxygenStatus(metrics.oxygen));
        
        // Weight
        this.updateMetricDisplay('weight', metrics.weight, 'Normal');
        
        // Height
        this.updateMetricDisplay('height', metrics.height, 'Normal');
    }

    updateMetricDisplay(metricId, value, status) {
        const valueElement = document.getElementById(metricId);
        const statusElement = document.getElementById(metricId + 'Status');
        
        valueElement.textContent = value;
        statusElement.textContent = status;
        statusElement.className = 'metric-status ' + this.getStatusClass(status);
    }

    getHeartRateStatus(rate) {
        if (rate >= 60 && rate <= 100) return 'Normal';
        if (rate >= 50 && rate <= 110) return 'Slightly abnormal';
        return 'Abnormal';
    }

    getBloodPressureStatus(systolic, diastolic) {
        if (systolic < 120 && diastolic < 80) return 'Normal';
        if (systolic < 130 && diastolic < 80) return 'Elevated';
        if (systolic < 140 || diastolic < 90) return 'High (Stage 1)';
        return 'High (Stage 2)';
    }

    getTemperatureStatus(temp) {
        if (temp >= 36.1 && temp <= 37.2) return 'Normal';
        if (temp >= 37.3 && temp <= 38.0) return 'Slight fever';
        return 'Fever';
    }

    getOxygenStatus(oxygen) {
        if (oxygen >= 95) return 'Normal';
        if (oxygen >= 90) return 'Low';
        return 'Very low';
    }

    getStatusClass(status) {
        const statusMap = {
            'Normal': 'status-normal',
            'Slightly abnormal': 'status-warning',
            'Elevated': 'status-warning',
            'Slight fever': 'status-warning',
            'Abnormal': 'status-danger',
            'High (Stage 1)': 'status-danger',
            'High (Stage 2)': 'status-danger',
            'Fever': 'status-danger',
            'Low': 'status-warning',
            'Very low': 'status-danger'
        };
        return statusMap[status] || 'status-normal';
    }

    showPlaceholderMetrics() {
        const metrics = ['heartRate', 'bloodPressure', 'temperature', 'oxygen', 'weight', 'height'];
        metrics.forEach(metric => {
            document.getElementById(metric).textContent = '--';
            document.getElementById(metric + 'Status').textContent = 'No data';
        });
    }

    loadHistory() {
        const historyList = document.getElementById('historyList');
        
        if (this.metrics.length === 0) {
            historyList.innerHTML = '<div class="no-history">No health metrics recorded yet</div>';
            return;
        }

        // Show last 5 records
        const recentMetrics = this.metrics.slice(-5).reverse();
        historyList.innerHTML = recentMetrics.map(metric => this.createHistoryItem(metric)).join('');
    }

    createHistoryItem(metric) {
        const date = new Date(metric.timestamp).toLocaleDateString();
        const time = new Date(metric.timestamp).toLocaleTimeString();
        
        return `
            <div class="history-item">
                <div class="history-date">${date} ${time}</div>
                <div class="history-metrics">
                    <span class="history-metric"><i class="fas fa-heart"></i> ${metric.heartRate} BPM</span>
                    <span class="history-metric"><i class="fas fa-tint"></i> ${metric.systolic}/${metric.diastolic}</span>
                    <span class="history-metric"><i class="fas fa-thermometer-half"></i> ${metric.temperature}°C</span>
                </div>
            </div>
        `;
    }

    clearForm() {
        document.getElementById('metricsForm').reset();
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
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
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HealthMetrics();
});

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);