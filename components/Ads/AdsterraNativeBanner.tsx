import React, { useEffect, useRef } from 'react';

export const AdsterraNativeBanner: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Prevent duplicate script injection
        if (containerRef.current && !containerRef.current.hasChildNodes()) {
            const script = document.createElement('script');
            script.async = true;
            script.dataset.cfasync = "false";
            script.src = "//pl28265079.effectivegatecpm.com/e7ffd2a6f227e6dbeb7bf2757cdd4489/invoke.js";

            const div = document.createElement('div');
            div.id = "container-e7ffd2a6f227e6dbeb7bf2757cdd4489";

            containerRef.current.appendChild(script);
            containerRef.current.appendChild(div);
        }
    }, []);

    // Also check if we are on localhost to show a placeholder
    const isLocalhost = typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (isLocalhost) {
        return (
            <div className="w-full bg-gray-900 border border-orange-500/50 p-4 rounded-lg flex flex-col items-center justify-center min-h-[150px]">
                <span className="text-orange-400 font-bold font-cyber mb-2">ADSTERRA NATIVE BANNER</span>
                <span className="text-gray-500 text-xs">ID: container-e7ffd2a6f227e6dbeb7bf2757cdd4489</span>
                <div className="flex gap-2 mt-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-16 h-16 bg-gray-800 rounded border border-gray-700"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full flex justify-center my-4 overflow-hidden" />
    );
};
