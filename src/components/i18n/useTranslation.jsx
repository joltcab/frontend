import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, getTranslation } from './translations';

/**
 * i18n Context
 */
const I18nContext = createContext(null);

/**
 * i18n Provider Component
 */
export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Try to get saved language
    if (typeof window !== 'undefined') {
      return localStorage.getItem('joltcab_language') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    // Save language preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('joltcab_language', language);
    }
  }, [language]);

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLanguage(newLang);
    }
  };

  const t = (path, variables = {}) => {
    return getTranslation(translations[language], path, variables);
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <I18nContext.Provider value={{ language, changeLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to use translations
 */
export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
}