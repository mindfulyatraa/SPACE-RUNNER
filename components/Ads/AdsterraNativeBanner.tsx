import React, { useEffect, useRef } from 'react';

export const AdsterraNativeBanner: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Prevent duplicate script injection
        if (containerRef.current && !containerRef.current.hasChildNodes()) {
            const script = document.createElement('script');
            script.async = true;
            script.dataset.cfasync = "false";
            // Use explicit https to ensure it works on Android/Capacitor
            script.src = "https://pl28265079.effectivegatecpm.com/e7ffd2a6f227e6dbeb7bf2757cdd4489/invoke.js";

            const div = document.createElement('div');
            div.id = "container-e7ffd2a6f227e6dbeb7bf2757cdd4489";

            containerRef.current.appendChild(script);
            containerRef.current.appendChild(div);
        }
    }, []);

    // Removed localhost check to ensure ads try to load on Android/Mobile devices
    return (
        <div ref={containerRef} className="w-full flex justify-center my-4 overflow-hidden min-h-[100px]" />
    );
};
