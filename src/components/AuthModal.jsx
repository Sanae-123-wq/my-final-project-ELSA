import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaLock, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './AuthModal.css';

const AuthModal = () => {
    const { isAuthModalOpen, setIsAuthModalOpen } = useContext(AuthContext);
    const { t } = useLanguage();
    const navigate = useNavigate();

    if (!isAuthModalOpen) return null;

    const handleAction = (path) => {
        setIsAuthModalOpen(false);
        navigate(path);
    };

    return (
        <AnimatePresence>
            <div className="auth-modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="auth-modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="auth-modal-close" onClick={() => setIsAuthModalOpen(false)}>
                        <FaTimes />
                    </button>

                    <div className="auth-modal-header">
                        <div className="auth-modal-icon">
                            <FaLock />
                        </div>
                        <h2>{t.common?.loginRequired || "Login Required"}</h2>
                        <p>{t.common?.loginMessage || "Join the ELSA community to enjoy exclusive features and artisanal sweets."}</p>
                    </div>

                    <div className="auth-modal-actions">
                        <button 
                            className="auth-modal-btn login-btn"
                            onClick={() => handleAction('/login')}
                        >
                            <FaSignInAlt />
                            <span>{t.navbar?.login || "Log In"}</span>
                        </button>
                        
                        <button 
                            className="auth-modal-btn signup-btn"
                            onClick={() => handleAction('/signup')}
                        >
                            <FaUserPlus />
                            <span>{t.navbar?.signup || "Create Account"}</span>
                        </button>
                    </div>

                    <div className="auth-modal-footer">
                        <button onClick={() => setIsAuthModalOpen(false)}>
                            {t.common?.maybeLater || "Maybe Later"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
