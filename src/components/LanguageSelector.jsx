import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';

const LanguageSelector = () => {
    const { language, changeLanguage, direction } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
        { code: 'fr', label: 'Français', short: 'FR', flag: '🇫🇷' },
        { code: 'ar', label: 'العربية', short: 'AR', flag: '🇲🇦' }
    ];

    const currentLang = languages.find(l => l.code === language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (code) => {
        changeLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="language-selector" ref={dropdownRef}>
            <button 
                className={`lang-toggle ${isOpen ? 'active' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label="Change Language"
            >
                <FaGlobe className="globe-icon" />
            </button>

            {isOpen && (
                <div className={`lang-dropdown ${direction === 'rtl' ? 'rtl' : ''}`}>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`lang-option ${language === lang.code ? 'selected' : ''}`}
                            onClick={() => handleLanguageChange(lang.code)}
                        >
                            <span className="flag">{lang.flag}</span>
                            <span className="label">{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
