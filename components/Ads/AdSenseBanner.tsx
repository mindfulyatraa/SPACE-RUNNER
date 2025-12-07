import React, { useEffect } from 'react';

interface AdSenseBannerProps {
    className?: string;
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    responsive?: boolean;
    style?: React.CSSProperties;
    testMode?: boolean; // Enable test ads
}

// Google's official test ad client (always shows test ads)
const TEST_AD_CLIENT = 'ca-pub-3940256099942544';
const PRODUCTION_AD_CLIENT = 'ca-pub-4312395541510047';

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
    className,
    slot,
    format = 'auto',
    responsive = true,
    style,
    testMode = true // Default to test mode for now
}) => {
    useEffect(() => {
        try {
            // Load AdSense script if not already loaded
            if (typeof window !== 'undefined') {
                // Initialize adsbygoogle array
                // @ts-ignore
                window.adsbygoogle = window.adsbygoogle || [];

                // Push ad configuration
                try {
                    // @ts-ignore
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {
                    console.error('AdSense push error:', e);
                }
            }
        } catch (e) {
            console.error('AdSense initialization error:', e);
        }
    }, []);

    const isLocalhost = typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    // Show placeholder only in development
    if (isLocalhost) {
        return (
            <div className={`bg-gray-800 border-2 border-dashed border-cyan-500 flex flex-col items-center justify-center text-gray-300 font-mono text-xs p-6 ${className}`} style={{ minHeight: '100px', ...style }}>
                <div className="text-cyan-400 font-bold mb-2">🧪 ADSENSE TEST MODE</div>
                <div className="text-gray-400">Slot: {slot}</div>
                <div className="text-green-400 mt-2">✓ Test ads enabled on production</div>
                <div className="text-xs text-gray-500 mt-1">Using Google's test client</div>
            </div>
        );
    }

    // Use test ad client or production client
    const adClient = testMode ? TEST_AD_CLIENT : PRODUCTION_AD_CLIENT;

    return (
        <div className={`adsense-container ${className || ''}`} style={style}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block', ...style }}
                data-ad-client={adClient}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
            />
        </div>
    );
};
