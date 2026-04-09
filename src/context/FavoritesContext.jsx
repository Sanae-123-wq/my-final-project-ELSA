import React, { createContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('elsa_favorites');
        if (!saved) return [];
        try {
            const parsed = JSON.parse(saved);
            // Filter out any non-id values (null, undefined, empty strings)
            return Array.isArray(parsed) ? parsed.filter(id => !!id) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('elsa_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (productId) => {
        if (!productId) return;
        setFavorites(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    const clearOrphans = (validIds) => {
        setFavorites(prev => prev.filter(id => validIds.includes(id)));
    };

    const isFavorite = (productId) => favorites.includes(productId);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearOrphans }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export default FavoritesContext;
