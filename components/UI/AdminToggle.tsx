import React, { useEffect, useState } from 'react';
import { useStore } from '../../store';
import { Shield, ShieldOff } from 'lucide-react';

/**
 * Admin Toggle Component
 * Secret key combination: Press 'A', 'D', 'M', 'I', 'N' in sequence to toggle admin mode
 * Or click the hidden shield icon (only visible when hovering top-left corner)
 */
export const AdminToggle: React.FC = () => {
    const { isAdmin, setIsAdmin } = useStore();
    const [keySequence, setKeySequence] = useState<string[]>([]);
    const [showToggle, setShowToggle] = useState(false);
    const SECRET_SEQUENCE = ['a', 'd', 'm', 'i', 'n'];

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const newSequence = [...keySequence, key].slice(-5); // Keep last 5 keys
            setKeySequence(newSequence);

            // Check if secret sequence matches
            if (newSequence.join('') === SECRET_SEQUENCE.join('')) {
                setIsAdmin(!isAdmin);
                setKeySequence([]); // Reset sequence

                // Show notification
                const msg = !isAdmin ? '🔓 Admin Mode Activated' : '🔒 Admin Mode Deactivated';
                console.log(msg);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [keySequence, isAdmin, setIsAdmin]);

    return (
        <div
            className="fixed top-4 left-4 z-[300]"
            onMouseEnter={() => setShowToggle(true)}
            onMouseLeave={() => setShowToggle(false)}
        >
            {showToggle && (
                <button
                    onClick={() => setIsAdmin(!isAdmin)}
                    className={`p-2 rounded-lg transition-all ${isAdmin
                            ? 'bg-green-600 hover:bg-green-500 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                    title={isAdmin ? 'Admin Mode: ON (Click to disable)' : 'Admin Mode: OFF (Click to enable)'}
                >
                    {isAdmin ? <Shield className="w-5 h-5" /> : <ShieldOff className="w-5 h-5" />}
                </button>
            )}

            {/* Admin status indicator (always visible when admin) */}
            {isAdmin && (
                <div className="absolute top-12 left-0 bg-green-600/90 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                    ADMIN MODE
                </div>
            )}
        </div>
    );
};
