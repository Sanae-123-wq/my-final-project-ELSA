import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [direction, setDirection] = useState('ltr');

    useEffect(() => {
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        setDirection(dir);
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.lang = language;
    }, [language]);

    const value = {
        language,
        changeLanguage: setLanguage,
        t: translations[language],
        direction
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
