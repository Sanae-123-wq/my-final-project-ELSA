import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user) {
            const newSocket = io('http://localhost:5000');
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('🔌 Connected to socket server');
                newSocket.emit('register', user._id);
            });

            newSocket.on('notification', (data) => {
                setNotifications(prev => [data, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Optional: Browser notification or toast
                if (Notification.permission === 'granted') {
                    new Notification('ELSA Patisserie', { body: data.message });
                }
            });

            return () => newSocket.close();
        }
    }, [user]);

    // Fetch initial notifications and unread count
    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const res = await fetch('http://localhost:5000/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, notifications, unreadCount, markAsRead, fetchNotifications }}>
            {children}
        </SocketContext.Provider>
    );
};
