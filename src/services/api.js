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
        await delay(500);
        return [...mockProducts];
    },

    fetchProductById: async (id) => {
        await delay(300);
        const product = mockProducts.find((p) => p._id === id);
        if (!product) throw { response: { data: { message: 'Product not found' } } };
        return product;
    },

    addProduct: async (productData) => {
        await delay(500);
        const newProduct = {
            _id: Math.random().toString(36).substr(2, 9),
            ...productData
        };
        mockProducts.push(newProduct);
        addToLog(`Product "${productData.name}" added to catalog`, 'product');
        return newProduct;
    },

    updateProduct: async (id, updates) => {
        await delay(500);
        const index = mockProducts.findIndex(p => p._id === id);
        if (index === -1) throw new Error('Product not found');
        mockProducts[index] = { ...mockProducts[index], ...updates };
        addToLog(`Product "${updates.name || mockProducts[index].name}" updated`, 'product');
        return mockProducts[index];
    },

    deleteProduct: async (id) => {
        await delay(500);
        const index = mockProducts.findIndex(p => p._id === id);
        if (index === -1) throw new Error('Product not found');
        const name = mockProducts[index].name;
        mockProducts.splice(index, 1);
        addToLog(`Product "${name}" deleted from catalog`, 'product');
        return { success: true };
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
        await delay(800);
        const user = mockUsers.find((u) => u.email === email && u.password === password);
        if (user) {
            if (user.role === 'admin') addToLog('Admin logged in', 'login', user.name);
            return user;
        } else {
            throw { response: { data: { message: 'Invalid credentials' } } };
        }
    },

    register: async (name, email, password, role = 'client') => {
        await delay(800);
        const exists = mockUsers.find((u) => u.email === email);
        if (exists) {
            throw { response: { data: { message: 'User already exists' } } };
        }
        const newUser = {
            _id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            password,
            role,
            token: `mock-token-${Date.now()}`
        };
        mockUsers.push(newUser);
        addToLog(`New client "${name}" registered`, 'user', 'System');
        return newUser;
    },

    fetchUsers: async () => {
        await delay(400);
        return [...mockUsers];
    },
    
    createUser: async (userData) => {
        await delay(500);
        const exists = mockUsers.find((u) => u.email === userData.email);
        if (exists) throw new Error('Email already in use');
        
        const newUser = {
            _id: Math.random().toString(36).substr(2, 9),
            ...userData,
            token: `mock-token-${Date.now()}`
        };
        mockUsers.push(newUser);
        addToLog(`${userData.role === 'vendor' ? 'Vendor' : 'Delivery worker'} "${userData.name}" created`, 'user');
        return newUser;
    },

    // --- Orders ---
    createOrder: async (orderData) => {
        await delay(1000);
        const newOrder = {
            _id: Math.random().toString(36).substr(2, 9),
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        mockOrders.push(newOrder);
        addToLog(`New order received from ${orderData.user?.name || 'client'}`, 'order', 'System');
        return newOrder;
    },

    fetchOrders: async () => {
        await delay(400);
        return [...mockOrders];
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
    }
};
