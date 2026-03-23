import { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const cartItemsFromStorage = localStorage.getItem('cartItems');
        if (cartItemsFromStorage) {
            setCartItems(JSON.parse(cartItemsFromStorage));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty) => {
        const existItem = cartItems.find((x) => x._id === product._id);

        if (existItem) {
            setCartItems(
                cartItems.map((x) =>
                    x._id === existItem._id ? { ...x, qty: x.qty + qty } : x
                )
            );
        } else {
            setCartItems([...cartItems, { ...product, qty }]);
        }
        setIsCartOpen(true); // Auto-open cart when adding an item
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((x) => x._id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const updateQty = (id, delta) => {
        setCartItems(prevItems => 
            prevItems.map(item => {
                if (item._id === id) {
                    const newQty = item.qty + delta;
                    return newQty > 0 ? { ...item, qty: newQty } : item;
                }
                return item;
            })
        );
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, isCartOpen, openCart, closeCart, updateQty }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
