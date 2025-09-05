'use client'

import React, { useEffect } from 'react'

// Expose a helper to switch languages via the Google widget's select
export async function setGoogleTranslateLanguage(targetLanguage) {
    const getCombo = () => document.querySelector('select.goog-te-combo')
    const waitForCombo = async (timeoutMs = 5000) => {
        const start = Date.now()
        while (Date.now() - start < timeoutMs) {
            const el = getCombo()
            if (el) return el
            await new Promise(r => setTimeout(r, 100))
        }
        return null
    }

    try {
        let select = getCombo()
        if (!select) {
            select = await waitForCombo(5000)
        }
        if (!select) return false
        if (select.value === targetLanguage) return true
        select.value = targetLanguage
        select.dispatchEvent(new Event('change'))
        return true
    } catch (_) {
        return false
    }
}

export default function GoogleTranslate() {
    useEffect(() => {
        // Prevent duplicate script injection
        if (!document.getElementById('google-translate-script')) {
            // Define init callback on window
            window.googleTranslateElementInit = function () {
                /* global google */
                try {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: 'en',
                            includedLanguages: 'en,ar',
                            autoDisplay: false,
                        },
                        'google_translate_element'
                    )
                } catch (_) { }
            }

            const script = document.createElement('script')
            script.id = 'google-translate-script'
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
            script.async = true
            document.body.appendChild(script)
        }

        // Aggressively hide any injected Google Translate UI elements
        const hideTranslateUi = () => {
            try {
                const selectors = [
                    '#google_translate_element',
                    '.goog-te-gadget',
                    '.goog-te-gadget-simple',
                    '.goog-te-combo',
                    '.goog-te-menu-frame',
                    '.goog-te-banner-frame',
                    '#goog-gt-tt',
                    '.goog-te-balloon-frame',
                    '.VIpgJd-ZVi9od-ORHb-OEVmcd',
                    '.VIpgJd-ZVi9od-xl07Ob-OEVmcd',
                    '.VIpgJd-ZVi9od-l4eHX-hSRGPd',
                    '.skiptranslate',
                    'iframe.goog-te-banner-frame'
                ]
                selectors.forEach((sel) => {
                    document.querySelectorAll(sel).forEach((el) => {
                        el.style.setProperty('display', 'none', 'important')
                        el.style.setProperty('visibility', 'hidden', 'important')
                        el.style.setProperty('height', '0', 'important')
                        el.style.setProperty('width', '0', 'important')
                        el.style.setProperty('overflow', 'hidden', 'important')
                        el.style.setProperty('pointer-events', 'none', 'important')
                        el.style.setProperty('position', 'fixed', 'important')
                        el.style.setProperty('z-index', '-9999', 'important')
                    })
                })
            } catch (_) { }
        }

        // Initial hide attempt and periodic re-checks
        hideTranslateUi()
        const interval = setInterval(hideTranslateUi, 800)

        // MutationObserver to catch dynamic insertions
        const observer = new MutationObserver(() => hideTranslateUi())
        observer.observe(document.documentElement, { childList: true, subtree: true })

        return () => { clearInterval(interval); observer.disconnect() }
    }, [])

    // Keep a hidden mount point so Google can initialize the widget
    return (
        <div style={{ position: 'absolute', visibility: 'hidden', height: 0, width: 0, overflow: 'hidden' }}>
            <div id="google_translate_element" />
        </div>
    )
}


