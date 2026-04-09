import { resolveImageUrl } from '../utils/imageUrl.js';

// Activity log - local in-memory log (no backend endpoint yet)
let activityLog = [
    { action: 'Admin logged in', type: 'login', time: '2 min ago', by: 'ELSA Admin' },
    { action: 'New order received', type: 'order', time: '32 min ago', by: 'System' },
    { action: 'Product catalog updated', type: 'product', time: '1 hr ago', by: 'ELSA Admin' },
    { action: 'Dashboard accessed', type: 'login', time: '3 hrs ago', by: 'ELSA Admin' },
];

const addToLog = (action, type, by = 'ELSA Admin') => {
    activityLog.unshift({ action, type, time: 'Just now', by });
};

// Simulate network delay (legacy, kept for compatibility)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Dynamic API URL for environment compatibility (handles localhost vs IP)
const API_BASE = `${window.location.protocol}//${window.location.hostname}:5000/api`;

const fetchWithAuth = async (url, options = {}) => {
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };
    const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
    if (!response.ok) {
        // Log deep error for diagnostics
        console.error(`[API Error] ${response.status} ${response.statusText} on ${url}`);
        throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
};

export const api = {
    // --- Activity Log ---
    getActivityLog: () => [...activityLog],

    // --- Products ---
    fetchProducts: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const url = `/products${query ? `?${query}` : ''}`;
        const data = await fetchWithAuth(url, { method: 'GET', headers: {} });
        // Ensure images have full URL if they are relative
        return data.map(p => {
            try {
                return {
                    ...p,
                    image: resolveImageUrl(p.image)
                };
            } catch (err) {
                console.error('Error resolving image for product:', p._id, err);
                return { ...p, image: p.image || '' };
            }
        });
    },

    fetchStores: async () => {
        const response = await fetch('http://localhost:5000/api/stores');
        if (!response.ok) throw new Error('Failed to fetch stores');
        return await response.json();
    },

    fetchStoreById: async (id) => {
        const response = await fetch(`http://localhost:5000/api/stores/${id}`);
        if (!response.ok) throw new Error('Store not found');
        return await response.json();
    },

    fetchProductById: async (id) => {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const p = await response.json();
        return {
            ...p,
            image: resolveImageUrl(p.image)
        };
    },

    addProduct: async (formData) => {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const response = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        if (!response.ok) throw new Error('Failed to add product');
        return await response.json();
    },

    updateProduct: async (id, formData) => {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
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
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return await response.json();
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
        const data = await response.json();
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    },

    register: async (name, email, password, role = 'client', extraData = {}) => {
        let body;
        let headers = {};

        if (name instanceof FormData) {
            body = name;
            // Fetch will automatically set Multipart/Form-Data boundary
        } else {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify({ name, email, password, role, ...extraData });
        }

        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: headers,
            body: body
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }
        const data = await response.json();
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    },

    fetchUsers: async () => {
        const response = await fetch('http://localhost:5000/api/admins/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    },

    deleteVendor: async (id) => {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const response = await fetch(`http://localhost:5000/api/admins/vendors/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete vendor');
        }
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

    // --- Orders ---
    createOrder: async (orderData) => {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
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
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update order status');
        return await response.json();
    },

    // --- AI ---
    generateRecipe: async (prompt) => {
        const response = await fetch('http://localhost:5000/api/ai/recipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to generate recipe');
        }
        return await response.json();
    },

    // Fetch all saved recipe history (most recent first)
    fetchRecipeHistory: async () => {
        const response = await fetch('http://localhost:5000/api/ai/history');
        if (!response.ok) throw new Error('Failed to fetch recipe history');
        return await response.json();
    },

    // Delete a single recipe from history by ID
    deleteRecipeHistoryItem: async (id) => {
        const response = await fetch(`http://localhost:5000/api/ai/history/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete recipe');
        return await response.json();
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
    },

    // --- Admin Moderation (Reclamations & Reviews) ---
    fetchReclamations: async () => {
        return await fetchWithAuth('/reclamations');
    },

    replyToReclamation: async (id, adminReply) => {
        return await fetchWithAuth(`/reclamations/${id}/reply`, {
            method: 'PATCH',
            body: JSON.stringify({ adminReply })
        });
    },

    fetchAdminReviews: async () => {
        return await fetchWithAuth('/admins/reviews');
    },

    softDeleteReview: async (id) => {
        return await fetchWithAuth(`/admins/reviews/${id}/soft-delete`, {
            method: 'PATCH'
        });
    }
};
