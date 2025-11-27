import React, { useEffect } from 'react';

interface AdSenseBannerProps {
    className?: string;
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    responsive?: boolean;
    style?: React.CSSProperties;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
    className,
    slot,
    format = 'auto',
    responsive = true,
    style
}) => {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    // Show placeholder only in development
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return (
            <div className={`bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-400 font-mono text-xs p-4 ${className}`} style={{ minHeight: '100px', ...style }}>
                [ADSENSE BANNER PLACEHOLDER]
                <br />
                Slot: {slot}
            </div>
        );
    }

    return (
        <div className={`adsense-container ${className || ''}`} style={style}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block', ...style }}
                data-ad-client="ca-pub-4312395541510047"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
            />
        </div>
    );
};
