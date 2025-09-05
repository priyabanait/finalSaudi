'use client'
import React, { useState, useCallback, useMemo } from 'react';
import { translateText } from '../utils/translationApi';

const Translator = () => {
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ar');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('AIzaSyDX7R7IWMpq6qI1HefOpI8auw0nQFFvgYw');

  const languages = useMemo(() => [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' }
  ], []);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to translate');
      return;
    }

    if (sourceLang === targetLang) {
      setError('Source and target languages cannot be the same');
      return;
    }

    if (!apiKey || apiKey.trim() === '') {
      setError('Please enter your Google Cloud Translation API key');
      return;
    }

    setIsLoading(true);
    setError('');
    setTranslatedText('');

    try {
      const translated = await translateText(inputText, targetLang, sourceLang, apiKey);
      setTranslatedText(translated);
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.message || 'Failed to translate text. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, sourceLang, targetLang, apiKey]);

  const handleSwapLanguages = useCallback(() => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText('');
  }, [targetLang, sourceLang, translatedText]);

  // Get language direction
  const getLanguageDirection = useCallback((langCode) => {
    const lang = languages.find(l => l.code === langCode);
    return lang ? lang.dir : 'ltr';
  }, [languages]);

  const handleClear = useCallback(() => {
    setInputText('');
    setTranslatedText('');
    setError('');
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Language Translator</h1>
        <p className="text-gray-600">Translate text between different languages using Google Cloud Translation API</p>
      </div>

      {/* API Key Input */}
      <div className="mb-6">
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
          Google Cloud Translation API Key
        </label>
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Google Cloud Translation API key"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Get your API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a>
        </p>
      </div>

      {/* Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="sourceLang" className="block text-sm font-medium text-gray-700 mb-2">
            Source Language
          </label>
          <select
            id="sourceLang"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {languages.map((lang) => (
              <option key={`source-${lang.code}`} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end justify-center">
          <button
            onClick={handleSwapLanguages}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            title="Swap languages"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>

        <div>
          <label htmlFor="targetLang" className="block text-sm font-medium text-gray-700 mb-2">
            Target Language
          </label>
          <select
            id="targetLang"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {languages.map((lang) => (
              <option key={`target-${lang.code}`} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Text Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-2">
            Input Text
          </label>
          <textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to translate..."
            dir={getLanguageDirection(sourceLang)}
            style={{ 
              textAlign: getLanguageDirection(sourceLang) === 'rtl' ? 'right' : 'left',
              fontFamily: getLanguageDirection(sourceLang) === 'rtl' ? '"Segoe UI", Tahoma, Arial, Helvetica, sans-serif' : 'inherit'
            }}
            className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        <div>
          <label htmlFor="translatedText" className="block text-sm font-medium text-gray-700 mb-2">
            Translated Text
          </label>
          <textarea
            id="translatedText"
            value={translatedText}
            readOnly
            placeholder="Translation will appear here..."
            dir={getLanguageDirection(targetLang)}
            style={{ 
              textAlign: getLanguageDirection(targetLang) === 'rtl' ? 'right' : 'left',
              fontFamily: getLanguageDirection(targetLang) === 'rtl' ? '"Segoe UI", Tahoma, Arial, Helvetica, sans-serif' : 'inherit'
            }}
            className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 resize-none"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleTranslate}
          disabled={isLoading || !inputText.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Translating...
            </div>
          ) : (
            'Translate'
          )}
        </button>

        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Clear
        </button>

        <button
          onClick={handleSwapLanguages}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          Swap Languages
        </button>
      </div>
    </div>
  );
};

export default React.memo(Translator);
