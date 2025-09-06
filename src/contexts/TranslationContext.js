'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translateText, translateBatch, needsTranslation } from '../utils/translationApi';

const TranslationContext = createContext();

export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
};

export const TranslationProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [isTranslating, setIsTranslating] = useState(false);
    const [translationCache, setTranslationCache] = useState(new Map());
    const [translatedElements, setTranslatedElements] = useState(new Set());
    const [translationProgress, setTranslationProgress] = useState({ current: 0, total: 0 });
    const [translationErrors, setTranslationErrors] = useState([]);

    // Load saved language preference from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLanguage = localStorage.getItem('preferred-language');
            if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
                setLanguage(savedLanguage);
            }
        }
    }, []);

    // Save language preference and update document direction
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('preferred-language', language);

            // Update document direction and text alignment
            const html = document.documentElement;
            const body = document.body;

        if (language === 'ar') {
            html.setAttribute('dir', 'rtl');
            html.setAttribute('lang', 'ar');
            html.style.direction = 'rtl';
            body.style.direction = 'rtl';
            body.style.textAlign = 'right';
            body.classList.add('rtl');
            body.classList.remove('ltr');
            document.title = 'كيلر ويليامز السعودية - العقارات';

            // Add RTL styles to body
            body.style.fontFamily = '"Segoe UI", Tahoma, Arial, Helvetica, sans-serif';
        } else {
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', 'en');
            html.style.direction = 'ltr';
            body.style.direction = 'ltr';
            body.style.textAlign = 'left';
            body.classList.add('ltr');
            body.classList.remove('rtl');
            document.title = 'KW Saudi Arabia - Real Estate';

            // Reset font family for English
            body.style.fontFamily = '';
        }

            // Force re-render of components that depend on language
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
        }
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ar' : 'en');
    };

    const switchToLanguage = useCallback(async (lang, options = {}) => {
        const { skipTranslate = false } = options;
        if (lang === 'en' || lang === 'ar') {
            setLanguage(lang);

            if (skipTranslate) {
                // Only update language state and direction; do not run in-app translation
                return;
            }

            // If switching to Arabic, trigger translation
            if (lang === 'ar') {
                await translatePage();
            } else {
                // If switching to English, restore original texts
                restoreOriginalTexts();
            }
        }
    }, []);

    // Safe DOM manipulation with error handling
    const safeTranslateElement = useCallback(async (element, translateFunction) => {
        if (!element || !element.textContent) return;

        try {
            const originalText = element.textContent.trim();
            if (!originalText) return;

            // Determine source and target languages
            const sourceLang = language === 'ar' ? 'en' : language;
            const targetLang = language === 'ar' ? 'ar' : 'en';

            if (!needsTranslation(originalText, sourceLang, targetLang)) return;

            const translatedText = await translateFunction(originalText, targetLang, sourceLang);
            if (translatedText && translatedText !== originalText) {
                element.textContent = translatedText;
                // Store original text for restoration
                element.setAttribute('data-original-text', originalText);
                element.setAttribute('data-translated', 'true');
                element.setAttribute('data-source-lang', sourceLang);
                element.setAttribute('data-target-lang', targetLang);
                setTranslatedElements(prev => new Set(prev).add(element));
            }
        } catch (error) {
            console.error('Error translating element:', error);
        }
    }, [language]);

    // Translate all text elements on the page safely
    const translatePage = useCallback(async () => {
        // Skip if no translation needed or not on client side
        if (language === 'en' || typeof window === 'undefined') {
            restoreOriginalTexts();
            return;
        }

        setIsTranslating(true);
        setTranslationErrors([]);
        setTranslationProgress({ current: 0, total: 0 });

        try {
            // Wait for DOM to be ready
            await new Promise(resolve => setTimeout(resolve, 100));

            // Get all text elements safely
            const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, a, label, li');

            // Filter out elements that shouldn't be translated
            const translatableElements = Array.from(textElements).filter(el => {
                return el.textContent &&
                    el.textContent.trim() &&
                    !el.hasAttribute('data-no-translate') &&
                    !el.closest('[data-no-translate]') &&
                    !el.hasAttribute('data-translated') &&
                    needsTranslation(el.textContent.trim(), 'en', 'ar') &&
                    el.offsetParent !== null; // Only visible elements
            });

            setTranslationProgress({ current: 0, total: translatableElements.length });

            if (translatableElements.length === 0) {
                setIsTranslating(false);
                return;
            }

            // Translate elements in smaller batches for better performance
            const batchSize = 3;
            let processedCount = 0;
            const errors = [];

            for (let i = 0; i < translatableElements.length; i += batchSize) {
                const batch = translatableElements.slice(i, i + batchSize);

                try {
                    await Promise.all(batch.map(async (el) => {
                        try {
                            await safeTranslateElement(el, translateText);
                            processedCount++;
                            setTranslationProgress(prev => ({ ...prev, current: processedCount }));
                        } catch (elementError) {
                            console.error('Element translation error:', elementError);
                            errors.push({
                                element: el,
                                error: elementError.message,
                                text: el.textContent
                            });
                            processedCount++;
                            setTranslationProgress(prev => ({ ...prev, current: processedCount }));
                        }
                    }));

                    // Progressive delay between batches
                    if (i + batchSize < translatableElements.length) {
                        const delay = Math.min(300 + (i / batchSize) * 50, 1000);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                } catch (batchError) {
                    console.error('Batch translation error:', batchError);
                    errors.push({
                        batch: i,
                        error: batchError.message,
                        elements: batch.length
                    });
                }
            }

            setTranslationErrors(errors);

            // Log translation summary
            console.log(`Translation completed: ${processedCount}/${translatableElements.length} elements processed`);
            if (errors.length > 0) {
                console.warn(`${errors.length} translation errors occurred`);
            }

        } catch (error) {
            console.error('Page translation error:', error);
            setTranslationErrors([{
                type: 'critical',
                error: error.message,
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsTranslating(false);
            setTranslationProgress({ current: 0, total: 0 });
        }
    }, [language, safeTranslateElement]);

    // Restore original texts when switching back to English
    const restoreOriginalTexts = useCallback(() => {
        try {
            if (typeof window === 'undefined') return;
            const translatedElements = document.querySelectorAll('[data-translated]');
            translatedElements.forEach(element => {
                const originalText = element.getAttribute('data-original-text');
                if (originalText) {
                    element.textContent = originalText;
                    element.removeAttribute('data-translated');
                    element.removeAttribute('data-original-text');
                }
            });
            setTranslatedElements(new Set());
        } catch (error) {
            console.error('Error restoring original texts:', error);
        }
    }, []);

    // Helper function to get translated text with fallback
    const t = useCallback((text, fallbackText = text) => {
        if (language === 'en') return text;

        // Try to get cached translation
        const cacheKey = `${text}_en_ar`;
        const cached = translationCache.get(cacheKey);
        if (cached) return cached;

        // If no cached translation, return fallback
        return fallbackText;
    }, [language, translationCache]);

    // Translate specific text and cache it
    const translateTextAndCache = useCallback(async (text, targetLang = null) => {
        if (!text || typeof text !== 'string') return text;

        // Determine target language if not specified
        const actualTargetLang = targetLang || (language === 'en' ? 'ar' : 'en');
        const sourceLang = language === 'ar' ? 'en' : language;

        // If already in target language, return as is
        if (language === actualTargetLang) return text;

        // Check cache first
        const cacheKey = `${text}_${sourceLang}_${actualTargetLang}`;
        if (translationCache.has(cacheKey)) {
            return translationCache.get(cacheKey);
        }

        try {
            const translatedText = await translateText(text, actualTargetLang, sourceLang);
            if (translatedText && translatedText !== text) {
                setTranslationCache(prev => new Map(prev).set(cacheKey, translatedText));
                return translatedText;
            }
            return text;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    }, [language, translationCache]);

    const value = {
        language,
        isRTL: language === 'ar',
        isTranslating,
        toggleLanguage,
        switchToLanguage,
        translateText: translateTextAndCache,
        translatePage,
        t,
        translationCache,
        restoreOriginalTexts,
        translatedElements,
        translationProgress,
        translationErrors,
        clearTranslationErrors: () => setTranslationErrors([])
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
};
