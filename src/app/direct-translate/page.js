'use client'
import React from 'react';
import Translator from '../../components/Translator';
import ErrorBoundary from '../../components/ErrorBoundary';

const DirectTranslate = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <ErrorBoundary>
                <Translator />
            </ErrorBoundary>
        </div>
    );
};

export default DirectTranslate;
