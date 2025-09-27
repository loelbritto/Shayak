// Medicine Basket Management
class MedicineBasket {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('medicineOrders')) || [];
        this.communityMembers = 12; // Static for demo
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCommunityOrders();
        this.updateStats();
    }

    setupEventListeners() {
        const form = document.getElementById('orderForm');
        form.addEventListener('submit', (e) => this.handleOrderSubmit(e));
    }

    handleOrderSubmit(e) {
        e.preventDefault();
        
        const medicineName = document.getElementById('medicineName').value.trim();
        const quantity = document.getElementById('medicineQuantity').value;
        const urgency = document.getElementById('urgencyLevel').value;

        if (medicineName && quantity) {
            this.showAnimation();
            this.saveOrder(medicineName, quantity, urgency);
            setTimeout(() => {
                this.hideFormShowSuccess();
                this.loadCommunityOrders();
                this.updateStats();
            }, 2000);
        }
    }

    showAnimation() {
        const formSection = document.querySelector('.order-section');
        const animationSection = document.getElementById('animationSection');
        const medicinePill = document.getElementById('medicinePill');
        const basket = document.getElementById('basket');

        // Hide form, show animation
        formSection.style.display = 'none';
        animationSection.style.display = 'block';

        // Start animations
        setTimeout(() => {
            medicinePill.classList.add('medicine-drop');
            basket.classList.add('basket-catch');
        }, 100);
    }

    hideFormShowSuccess() {
        const orderStatus = document.getElementById('orderStatus');
        orderStatus.style.display = 'block';
    }

    saveOrder(medicineName, quantity, urgency) {
        const order = {
            id: Date.now(),
            medicineName: medicineName,
            quantity: quantity,
            urgency: urgency,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        this.orders.push(order);
        localStorage.setItem('medicineOrders', JSON.stringify(this.orders));
    }

    loadCommunityOrders() {
        const ordersList = document.getElementById('ordersList');
        
        if (this.orders.length === 0) {
            ordersList.innerHTML = '<div class="no-orders">No community orders yet. Be the first to add medicine!</div>';
            return;
        }

        // Show recent orders (newest first)
        const recentOrders = [...this.orders].reverse();
        ordersList.innerHTML = recentOrders.map(order => this.createOrderItem(order)).join('');
    }

    createOrderItem(order) {
        const date = new Date(order.timestamp).toLocaleDateString();
        const time = new Date(order.timestamp).toLocaleTimeString();
        const urgencyClass = `urgency-${order.urgency}`;
        const urgencyText = this.getUrgencyText(order.urgency);

        return `
            <div class="order-item">
                <div class="order-info">
                    <div class="order-medicine">${order.medicineName}</div>
                    <div class="order-details">
                        <span>Quantity: ${order.quantity}</span>
                        <span>Added: ${date} ${time}</span>
                    </div>
                </div>
                <div class="order-urgency ${urgencyClass}">${urgencyText}</div>
            </div>
        `;
    }

    getUrgencyText(urgency) {
        const urgencyMap = {
            'low': 'Low Urgency',
            'medium': 'Medium Urgency',
            'high': 'High Urgency',
            'critical': 'Critical'
        };
        return urgencyMap[urgency] || 'Low Urgency';
    }

    updateStats() {
        document.getElementById('communityMembers').textContent = this.communityMembers;
        document.getElementById('totalOrders').textContent = this.orders.length;
    }

    resetForm() {
        document.getElementById('orderForm').reset();
        
        // Show form again after success
        setTimeout(() => {
            const formSection = document.querySelector('.order-section');
            const animationSection = document.getElementById('animationSection');
            
            formSection.style.display = 'block';
            animationSection.style.display = 'none';
            
            // Reset animation elements
            const medicinePill = document.getElementById('medicinePill');
            const basket = document.getElementById('basket');
            const orderStatus = document.getElementById('orderStatus');
            
            medicinePill.classList.remove('medicine-drop');
            basket.classList.remove('basket-catch');
            orderStatus.style.display = 'none';
        }, 4000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const medicineBasket = new MedicineBasket();
    
    // Add click handler for the success message to reset the form
    document.addEventListener('click', (e) => {
        if (e.target.closest('.order-status')) {
            medicineBasket.resetForm();
        }
    });
});