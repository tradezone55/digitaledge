import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

interface LanguageSwitchProps {
  className?: string;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (languageCode: string) => {
    // Update i18n language
    i18n.changeLanguage(languageCode);

    // Update URL query parameters to include language
    const currentPath = location.pathname;
    const currentSearch = new URLSearchParams(location.search);

    // Set the language parameter
    currentSearch.set('lang', languageCode);

    // Navigate to new path with query parameters
    const newPath = `${currentPath}?${currentSearch.toString()}`;
    navigate(newPath);

    // Close dropdown
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, languageCode: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      changeLanguage(languageCode);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-600 hover:border-orange-400 hover:bg-gray-800 transition-all duration-200 text-white"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
          <div className="py-1" role="listbox">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                onKeyDown={(e) => handleKeyDown(e, language.code)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors duration-200 ${language.code === i18n.language ? 'bg-orange-500/20 text-orange-400' : 'text-white'
                  }`}
                role="option"
                aria-selected={language.code === i18n.language}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
                {language.code === i18n.language && (
                  <span className="ml-auto text-orange-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitch;
