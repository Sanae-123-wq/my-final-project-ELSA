import { mockProducts, mockUsers } from '../data/mockData';

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    fetchProducts: async () => {
        await delay(500);
        return mockProducts;
    },

    fetchProductById: async (id) => {
        await delay(300);
        const product = mockProducts.find((p) => p._id === id);
        if (!product) throw { response: { data: { message: 'Product not found' } } };
        return product;
    },

    login: async (email, password) => {
        await delay(800);
        const user = mockUsers.find((u) => u.email === email && u.password === password);
        if (user) {
            return user;
        } else {
            throw { response: { data: { message: 'Invalid credentials' } } };
        }
    },

    register: async (name, email, password) => {
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
            token: `mock-token-${Date.now()}`
        };
        // In a real mock we like to push to session mockUsers? For now just return success.
        return newUser;
    },

    generateRecipe: async (prompt) => {
        await delay(1500);
        // Simple mock response generator
        return {
            name: `${prompt} (Elsa's Special)`,
            ingredients: [
                "2 cups All-purpose Flour",
                "1 cup Sugar",
                "200g Butter",
                "3 Eggs",
                "1 tsp Vanilla Extract",
                `Secret ${prompt} essence`
            ],
            steps: [
                "Preheat oven to 350°F (175°C).",
                "Mix dry ingredients in a bowl.",
                "Cream butter and sugar until fluffy.",
                "Combine all ingredients gently.",
                "Bake for 30-40 minutes.",
                "Let cool and enjoy your delicious creation!"
            ]
        };
    },

    createOrder: async (orderData) => {
        await delay(1000);
        // Simulate order success
        return {
            _id: Math.random().toString(36).substr(2, 9),
            ...orderData,
            createdAt: new Date()
        };
    }
};
