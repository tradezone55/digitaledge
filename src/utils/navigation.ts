import { useTranslation } from 'react-i18next';

/**
 * Hook to generate language-aware navigation paths with query parameters
 * @returns Function that creates paths with current language query parameter
 */
export const useLanguageNavigation = () => {
  const { i18n } = useTranslation();
  
  const getLanguagePath = (path: string): string => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    // Add current language as query parameter
    return `/${cleanPath}?lang=${i18n.language}`;
  };
  
  return { getLanguagePath };
};

/**
 * Utility function to get language-aware path with query parameters (for use outside components)
 * @param path - The path to make language-aware
 * @param language - The language code (defaults to 'en')
 * @returns Language-aware path with query parameter
 */
export const getLanguagePath = (path: string, language: string = 'en'): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Add language as query parameter
  return `/${cleanPath}?lang=${language}`;
};
