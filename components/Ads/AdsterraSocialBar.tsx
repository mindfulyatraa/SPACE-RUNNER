import React, { useEffect } from 'react';

export const AdsterraSocialBar: React.FC = () => {

    useEffect(() => {
        // Only load if not already loaded to avoid duplicates
        // Adsterra Social Bar is usually a global script that injects itself
        const scriptId = 'adsterra-social-bar';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.type = 'text/javascript';
            script.src = '//pl28265478.effectivegatecpm.com/5e/14/02/5e1402163becafb21f71d1c670d8b08a.js';
            // Force https for better compatibility if needed, though usually protocol-relative is fine for social bar.
            // But consistent with previous fix, let's use https:
            script.src = 'https://pl28265478.effectivegatecpm.com/5e/14/02/5e1402163becafb21f71d1c670d8b08a.js';

            document.body.appendChild(script);
        }
    }, []);

    return null; // Social Bar renders itself outside the React tree usually
};
