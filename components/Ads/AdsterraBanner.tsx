import React, { useEffect, useRef } from 'react';

export const AdsterraBanner: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && !containerRef.current.hasChildNodes()) {
            const confScript = document.createElement('script');
            confScript.type = "text/javascript";
            confScript.text = `
                atOptions = {
                    'key' : '4b42329564e21f81da9e7d7cf03b203a',
                    'format' : 'iframe',
                    'height' : 60,
                    'width' : 468,
                    'params' : {}
                };
            `;

            const invokeScript = document.createElement('script');
            invokeScript.type = "text/javascript";
            invokeScript.src = "https://www.highperformanceformat.com/4b42329564e21f81da9e7d7cf03b203a/invoke.js";

            containerRef.current.appendChild(confScript);
            containerRef.current.appendChild(invokeScript);
        }
    }, []);

    // Placeholder for localhost development
    const isLocalhost = typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    // On localhost, we can show a placeholder or just let it try to load (Adsterra might block localhost)
    // But for 468x60 iframe, it's safer to just show a box in dev to avoid console errors if key is invalid for invalid Referer
    if (isLocalhost) {
        return (
            <div className="w-[468px] h-[60px] bg-gray-800 border border-yellow-500/50 flex items-center justify-center mx-auto my-4">
                <span className="text-yellow-400 font-bold font-mono text-xs">ADSTERRA 468x60 BANNER</span>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="flex justify-center my-4 overflow-hidden" />
    );
};
