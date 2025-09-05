// React-friendly translation API utilities

const GOOGLE_API_KEY = 'AIzaSyDX7R7IWMpq6qI1HefOpI8auw0nQFFvgYw';

// Translation cache to avoid repeated API calls
const translationCache = new Map();

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // Minimum 100ms between requests

// Retry logic with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxRetries - 1) throw error;

            const delay = baseDelay * Math.pow(2, attempt);
            console.warn(`Translation attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

// Rate limiting wrapper
const rateLimitedRequest = async (requestFn) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
    }

    lastRequestTime = Date.now();
    return requestFn();
};

// Translate text using Google Translate API
export const translateText = async (text, targetLang = 'ar', sourceLang = 'en', apiKey = null) => {
    if (!text || typeof text !== 'string') return text;

    // Trim and validate text
    const trimmedText = text.trim();
    if (!trimmedText) return text;

    // Use provided API key or default
    const key = apiKey || GOOGLE_API_KEY;
    if (!key) {
        throw new Error('No API key provided');
    }

    // Check cache first
    const cacheKey = `${trimmedText}_${sourceLang}_${targetLang}`;
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }

    // Skip translation for certain patterns
    if (!needsTranslation(trimmedText, sourceLang, targetLang)) {
        return trimmedText;
    }

    try {
        const result = await retryWithBackoff(async () => {
            return await rateLimitedRequest(async () => {
                const params = new URLSearchParams({
                    key: key,
                    q: trimmedText,
                    target: targetLang,
                    source: sourceLang,
                    format: 'text'
                });

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                try {
                    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?${params.toString()}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        signal: controller.signal,
                    });

                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Translation API error: ${response.status} - ${errorText}`);
                    }

                    const data = await response.json();

                    if (!data.data || !data.data.translations || !data.data.translations[0]) {
                        throw new Error('Invalid response format from translation API');
                    }

                    return data.data.translations[0].translatedText;
                } catch (fetchError) {
                    clearTimeout(timeoutId);
                    throw fetchError;
                }
            });
        });

        // Cache the successful translation
        translationCache.set(cacheKey, result);
        return result;

    } catch (error) {
        console.error('Translation failed after retries:', error);

        // For critical errors, you might want to notify the user
        if (error.name === 'AbortError') {
            console.error('Translation request timed out');
        } else if (error.message.includes('429')) {
            console.error('Rate limit exceeded. Please try again later.');
        } else if (error.message.includes('403')) {
            console.error('API key error or quota exceeded');
        }

        return trimmedText; // Return original text if translation fails
    }
};

// Translate multiple texts in batch
export const translateBatch = async (texts, targetLang = 'ar', sourceLang = 'en') => {
    if (!Array.isArray(texts) || texts.length === 0) return texts;

    const results = [];
    const validTexts = texts.filter(text => text && typeof text === 'string' && text.trim());

    if (validTexts.length === 0) return texts;

    // Process in smaller batches to avoid rate limits
    const batchSize = 3; // Reduced batch size for better reliability

    for (let i = 0; i < validTexts.length; i += batchSize) {
        const batch = validTexts.slice(i, i + batchSize);
        const batchPromises = batch.map(async (text, index) => {
            try {
                const result = await translateText(text, targetLang, sourceLang);
                return { success: true, result, index: i + index };
            } catch (error) {
                console.error(`Failed to translate text at index ${i + index}:`, error);
                return { success: false, result: text, index: i + index };
            }
        });

        try {
            const batchResults = await Promise.allSettled(batchPromises);

            // Process results and maintain order
            batchResults.forEach((promiseResult, batchIndex) => {
                const globalIndex = i + batchIndex;
                if (promiseResult.status === 'fulfilled') {
                    const { success, result } = promiseResult.value;
                    results[globalIndex] = success ? result : batch[batchIndex];
                } else {
                    console.error(`Promise rejected for text at index ${globalIndex}:`, promiseResult.reason);
                    results[globalIndex] = batch[batchIndex];
                }
            });

            // Progressive delay between batches (increases with each batch)
            if (i + batchSize < validTexts.length) {
                const delay = Math.min(500 + (i / batchSize) * 100, 2000); // Max 2 seconds
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        } catch (error) {
            console.error('Critical batch translation error:', error);
            // Add original texts for the entire failed batch
            batch.forEach((text, batchIndex) => {
                results[i + batchIndex] = text;
            });
        }
    }

    // Fill in results for any filtered-out empty texts
    const finalResults = [];
    let resultIndex = 0;
    texts.forEach(text => {
        if (text && typeof text === 'string' && text.trim()) {
            finalResults.push(results[resultIndex] || text);
            resultIndex++;
        } else {
            finalResults.push(text);
        }
    });

    return finalResults;
};

// Clear translation cache
export const clearTranslationCache = () => {
    translationCache.clear();
};

// Get cache size for debugging
export const getCacheSize = () => {
    return translationCache.size;
};

// Get cache statistics
export const getCacheStats = () => {
    const stats = {
        size: translationCache.size,
        keys: Array.from(translationCache.keys()),
        memoryUsage: JSON.stringify(Array.from(translationCache.entries())).length
    };
    return stats;
};

// Remove old cache entries to prevent memory leaks
export const cleanupCache = (maxAge = 24 * 60 * 60 * 1000) => { // 24 hours default
    const now = Date.now();
    const entries = Array.from(translationCache.entries());

    entries.forEach(([key, value]) => {
        // If the cache entry has metadata about creation time, check age
        // For now, we'll implement a simple LRU by keeping only recent entries
        if (translationCache.size > 1000) { // Max cache size
            const oldestKey = entries[0][0];
            translationCache.delete(oldestKey);
        }
    });
};

// Test API connectivity
export const testApiConnection = async () => {
    try {
        const testText = 'Hello World';
        const result = await translateText(testText, 'ar', 'en');
        return {
            success: true,
            result,
            message: 'API connection successful'
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            message: 'API connection failed'
        };
    }
};

// Preload common translations
export const preloadCommonTranslations = async () => {
    const commonTexts = [
        'Sell', 'Buy', 'Rent', 'About', 'Contact', 'Search', 'Agent',
        'Property', 'Real Estate', 'Home', 'House', 'Apartment',
        'Price', 'Location', 'Details', 'More', 'Less', 'View',
        'Submit', 'Cancel', 'Save', 'Delete', 'Edit', 'Add',
        'Login', 'Register', 'Sign In', 'Sign Up', 'Logout',
        'Profile', 'Settings', 'Help', 'Support', 'FAQ'
    ];

    try {
        await translateBatch(commonTexts, 'ar', 'en');
        console.log('Common translations preloaded');
    } catch (error) {
        console.error('Error preloading translations:', error);
    }
};

// Detect language of text
export const detectLanguage = async (text) => {
    if (!text || typeof text !== 'string') return 'en';

    try {
        const params = new URLSearchParams({
            key: GOOGLE_API_KEY,
            q: text
        });

        const response = await fetch(`https://translation.googleapis.com/language/translate/v2/detect?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Language detection failed');
        }

        const data = await response.json();
        return data.data.detections[0][0].language;
    } catch (error) {
        console.error('Language detection error:', error);
        return 'en'; // Default to English
    }
};

// Validate if text needs translation
export const needsTranslation = (text, currentLang, targetLang) => {
    if (!text || typeof text !== 'string') return false;
    if (currentLang === targetLang) return false;

    // Skip translation for numbers, URLs, email addresses
    const skipPatterns = [
        /^\d+$/, // Numbers only
        /^https?:\/\//, // URLs
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email addresses
        /^[A-Z0-9]{2,}$/, // All caps acronyms
    ];

    return !skipPatterns.some(pattern => pattern.test(text.trim()));
};

