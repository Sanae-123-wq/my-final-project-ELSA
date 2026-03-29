import { mockProducts, mockUsers, mockOrders } from '../data/mockData';

// Activity log storage
let activityLog = [
    { action: 'Admin logged in', type: 'login', time: '2 min ago', by: 'ELSA Admin' },
    { action: 'Product "Classic Croissant" updated', type: 'product', time: '15 min ago', by: 'ELSA Admin' },
    { action: 'New order #ORD_001 received', type: 'order', time: '32 min ago', by: 'System' },
    { action: 'Vendor "Patissier Chef Alex" created', type: 'user', time: '1 hr ago', by: 'ELSA Admin' },
    { action: 'Order #ORD_001 status changed to Processing', type: 'order', time: '1 hr ago', by: 'ELSA Admin' },
    { action: 'Product "Baklava" price updated to $5.50', type: 'product', time: '2 hrs ago', by: 'ELSA Admin' },
    { action: 'Client "Test Client" registered', type: 'user', time: '3 hrs ago', by: 'System' },
    { action: 'Dashboard accessed', type: 'login', time: '3 hrs ago', by: 'ELSA Admin' },
    { action: 'New product "Kunafa" added to catalog', type: 'product', time: '1 day ago', by: 'ELSA Admin' },
    { action: 'Delivery worker "Fast Courier" account created', type: 'user', time: '1 day ago', by: 'ELSA Admin' },
    { action: 'System backup completed', type: 'system', time: '2 days ago', by: 'System' },
];

const addToLog = (action, type, by = 'ELSA Admin') => {
    activityLog.unshift({ action, type, time: 'Just now', by });
};

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    // --- Activity Log ---
    getActivityLog: () => [...activityLog],

    // --- Products ---
    fetchProducts: async () => {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    },

    fetchStores: async () => {
        const response = await fetch('http://localhost:5000/api/stores');
        if (!response.ok) throw new Error('Failed to fetch stores');
        return await response.json();
    },

    fetchProductById: async (id) => {
        await delay(300);
        const product = mockProducts.find((p) => p._id === id);
        if (!product) throw { response: { data: { message: 'Product not found' } } };
        return product;
    },

    addProduct: async (formData) => {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const response = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`
            },
            body: formData // FormData should not have Content-Type header manually set
        });
        if (!response.ok) throw new Error('Failed to add product');
        return await response.json();
    },

    updateProduct: async (id, formData) => {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        if (!response.ok) throw new Error('Failed to update product');
        return await response.json();
    },

    deleteProduct: async (id) => {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return await response.json();
    },

    // --- Reviews ---
    addReview: async (productId, reviewData) => {
        await delay(500);
        const product = mockProducts.find(p => p._id === productId);
        if (!product) throw new Error('Product not found');
        
        const newReview = {
            _id: Math.random().toString(36).substr(2, 9),
            ...reviewData,
            date: new Date().toISOString()
        };
        
        if (!product.reviews) product.reviews = [];
        product.reviews.unshift(newReview);
        
        addToLog(`New review added for product "${product.name}"`, 'product', reviewData.name);
        return newReview;
    },

    // --- Users & Auth ---
    login: async (email, password) => {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }
        return await response.json();
    },

    register: async (name, email, password, role = 'client', extraData = {}) => {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role, ...extraData })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }
        return await response.json();
    },

    fetchUsers: async () => {
        const response = await fetch('http://localhost:5000/api/admins/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    },
    
    approveUser: async (id) => {
        const response = await fetch(`http://localhost:5000/api/admins/approve-user/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to approve user');
        }
        return await response.json();
    },

    createUser: async (userData) => {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create user');
        }
        return await response.json();
    },

    // --- Orders ---
    createOrder: async (orderData) => {
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to place order');
        }
        return await response.json();
    },

    fetchOrders: async () => {
        const response = await fetch('http://localhost:5000/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        return await response.json();
    },

    updateOrderStatus: async (id, status) => {
        await delay(400);
        const order = mockOrders.find(o => o._id === id);
        if (!order) throw new Error('Order not found');
        order.status = status;
        addToLog(`Order #${id.slice(-6).toUpperCase()} status changed to ${status}`, 'order');
        return order;
    },

    // --- AI ---
    generateRecipe: async (prompt) => {
        try {
            const response = await fetch('http://localhost:5000/api/ai/recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate recipe from backend AI');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('AI Generation API Error:', error);
            throw error;
        }
    },

    // --- Reviews ---
    submitReview: async (reviewData) => {
        const response = await fetch('http://localhost:5000/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to submit review');
        }
        return await response.json();
    },

    getReviews: async () => {
        const response = await fetch('http://localhost:5000/api/reviews');
        if (!response.ok) throw new Error('Failed to fetch reviews');
        return await response.json();
    }
};
