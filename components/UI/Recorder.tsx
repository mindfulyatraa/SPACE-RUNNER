import React, { useState, useRef, useEffect } from 'react';
import { Video, Download, Settings, Monitor, Smartphone, X, Circle, Square } from 'lucide-react';
import { useStore } from '../../store';

interface RecorderProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const Recorder: React.FC<RecorderProps> = ({ canvasRef }) => {
    const { isRecording, setIsRecording, setRecordingDpr } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [resolution, setResolution] = useState<'1080p' | '2k' | '4k'>('1080p');
    const [aspectRatio, setAspectRatio] = useState<'landscape' | 'portrait'>('landscape');
    const [recordingTime, setRecordingTime] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<any>(null);

    // Resolution configs
    const configs = {
        '1080p': { dpr: 1, bitrate: 8000000, label: 'FHD (1080p)' },
        '2k': { dpr: 1.5, bitrate: 16000000, label: '2K (1440p)' },
        '4k': { dpr: 2, bitrate: 25000000, label: '4K (2160p)' }
    };

    useEffect(() => {
        // Update store DPR based on selection
        setRecordingDpr(configs[resolution].dpr);
    }, [resolution]);

    const startRecording = () => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        const stream = canvas.captureStream(60); // 60 FPS
        const options = {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: configs[resolution].bitrate
        };

        try {
            const mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `space-runner-${resolution}-${aspectRatio}-${new Date().getTime()}.webm`;
                a.click();
                URL.revokeObjectURL(url);
                setRecordingTime(0);
            };

            mediaRecorder.start();
            setIsRecording(true);

            // Start Timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error starting recording:", err);
            alert("Recording not supported in this browser or configuration.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen && !isRecording) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-[200] p-3 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg transition-all hover:scale-110 group"
                title="Open Studio Recorder"
            >
                <Video className="w-6 h-6" />
                <span className="absolute right-full mr-2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Studio Mode
                </span>
            </button>
        );
    }

    return (
        <div className={`fixed z-[200] transition-all duration-300 ${isRecording ? 'top-4 right-4' : 'bottom-4 right-4'}`}>
            <div className="bg-black/90 border border-red-500/30 backdrop-blur-md rounded-xl p-4 shadow-2xl w-72">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-red-500 font-bold font-cyber">
                        <Video className="w-5 h-5" />
                        <span>STUDIO RECORDER</span>
                    </div>
                    {!isRecording && (
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Controls */}
                {!isRecording ? (
                    <div className="space-y-4">
                        {/* Resolution Selector */}
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">RESOLUTION (QUALITY)</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(Object.keys(configs) as Array<keyof typeof configs>).map((res) => (
                                    <button
                                        key={res}
                                        onClick={() => setResolution(res)}
                                        className={`px-2 py-1 text-xs font-bold rounded border ${resolution === res
                                                ? 'bg-red-600 border-red-500 text-white'
                                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                                            }`}
                                    >
                                        {configs[res].label.split(' ')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Aspect Ratio Selector */}
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">ASPECT RATIO</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setAspectRatio('landscape')}
                                    className={`flex items-center justify-center gap-2 px-2 py-1 text-xs font-bold rounded border ${aspectRatio === 'landscape'
                                            ? 'bg-blue-600 border-blue-500 text-white'
                                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    <Monitor className="w-3 h-3" /> LANDSCAPE
                                </button>
                                <button
                                    onClick={() => setAspectRatio('portrait')}
                                    className={`flex items-center justify-center gap-2 px-2 py-1 text-xs font-bold rounded border ${aspectRatio === 'portrait'
                                            ? 'bg-blue-600 border-blue-500 text-white'
                                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    <Smartphone className="w-3 h-3" /> PORTRAIT
                                </button>
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 italic text-center">
                            * Higher resolution may affect performance during recording.
                        </div>

                        <button
                            onClick={startRecording}
                            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                        >
                            <Circle className="w-4 h-4 fill-white" /> START RECORDING
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-white font-mono text-xl">{formatTime(recordingTime)}</span>
                        </div>

                        <div className="text-xs text-gray-400 mb-4">
                            Recording at {configs[resolution].label}<br />
                            {aspectRatio.toUpperCase()} Mode
                        </div>

                        <button
                            onClick={stopRecording}
                            className="w-full py-3 bg-gray-800 hover:bg-gray-700 border border-red-500/50 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all"
                        >
                            <Square className="w-4 h-4 fill-white" /> STOP & SAVE
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
