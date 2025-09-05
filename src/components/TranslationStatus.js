'use client'
import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

const TranslationStatus = ({ showDetails = false }) => {
    const {
        isTranslating,
        translationProgress,
        translationErrors,
        clearTranslationErrors,
        language,
        isRTL
    } = useTranslation();

    if (!isTranslating && translationErrors.length === 0 && !showDetails) {
        return null;
    }

    return (
        <div className={`fixed bottom-4 ${isRTL ? 'left-4' : 'right-4'} z-50 max-w-sm`}>
            {/* Translation Progress */}
            {isTranslating && (
                <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg mb-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Translating...</span>
                        <span className="text-sm">
                            {translationProgress.current}/{translationProgress.total}
                        </span>
                    </div>
                    <div className="w-full bg-blue-300 rounded-full h-2">
                        <div
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{
                                width: translationProgress.total > 0
                                    ? `${(translationProgress.current / translationProgress.total) * 100}%`
                                    : '0%'
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Translation Errors */}
            {translationErrors.length > 0 && (
                <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Translation Issues</span>
                        <button
                            onClick={clearTranslationErrors}
                            className="text-white hover:text-red-200 text-lg"
                        >
                            ×
                        </button>
                    </div>
                    <p className="text-sm mb-2">
                        {translationErrors.length} issue(s) occurred
                    </p>
                    {showDetails && (
                        <details className="text-xs">
                            <summary className="cursor-pointer hover:text-red-200">
                                Show details
                            </summary>
                            <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                                {translationErrors.map((error, index) => (
                                    <div key={index} className="bg-red-600 p-2 rounded text-xs">
                                        {error.error || error.message}
                                    </div>
                                ))}
                            </div>
                        </details>
                    )}
                </div>
            )}

            {/* Debug Info (only in development) */}
            {showDetails && process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg text-xs mt-2">
                    <div className="space-y-1">
                        <div>Language: {language}</div>
                        <div>RTL: {isRTL ? 'Yes' : 'No'}</div>
                        <div>Translating: {isTranslating ? 'Yes' : 'No'}</div>
                        <div>Errors: {translationErrors.length}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TranslationStatus;
