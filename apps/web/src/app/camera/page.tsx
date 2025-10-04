'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface CapturedPhoto {
    id: string;
    dataUrl: string;
    timestamp: Date;
    filename: string;
}

export default function CameraPage() {
    const [isStreaming, setIsStreaming] = useState(false);
    const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
    const [currentPhoto, setCurrentPhoto] = useState<CapturedPhoto | null>(null);
    const [error, setError] = useState<string>('');
    const [cameraMode, setCameraMode] = useState<'photo' | 'selfie'>('photo');

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        // Load saved photos from localStorage
        loadSavedPhotos();
        return () => {
            // Cleanup stream on unmount
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const loadSavedPhotos = () => {
        try {
            const saved = localStorage.getItem('stemphone-photos');
            if (saved) {
                const parsedPhotos = JSON.parse(saved);
                setPhotos(parsedPhotos.map((p: any) => ({
                    ...p,
                    timestamp: new Date(p.timestamp)
                })));
            }
        } catch (error) {
            console.error('Error loading saved photos:', error);
        }
    };

    const savePhotos = (newPhotos: CapturedPhoto[]) => {
        try {
            localStorage.setItem('stemphone-photos', JSON.stringify(newPhotos));
        } catch (error) {
            console.error('Error saving photos:', error);
        }
    };

    const startCamera = async () => {
        try {
            setError('');
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: cameraMode === 'selfie' ? 'user' : 'environment'
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setIsStreaming(true);
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setError('Unable to access camera. Please check permissions.');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsStreaming(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

        // Create photo object
        const newPhoto: CapturedPhoto = {
            id: Date.now().toString(),
            dataUrl,
            timestamp: new Date(),
            filename: `stemphone-${Date.now()}.jpg`
        };

        // Add to photos array
        const updatedPhotos = [newPhoto, ...photos];
        setPhotos(updatedPhotos);
        savePhotos(updatedPhotos);
        setCurrentPhoto(newPhoto);

        // Flash effect
        const flash = document.createElement('div');
        flash.className = 'fixed inset-0 bg-white z-50 pointer-events-none';
        document.body.appendChild(flash);
        setTimeout(() => document.body.removeChild(flash), 100);

        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    };

    const deletePhoto = (photoId: string) => {
        const updatedPhotos = photos.filter(p => p.id !== photoId);
        setPhotos(updatedPhotos);
        savePhotos(updatedPhotos);
        if (currentPhoto?.id === photoId) {
            setCurrentPhoto(null);
        }
    };

    const switchCamera = () => {
        setCameraMode(prev => prev === 'photo' ? 'selfie' : 'photo');
        if (isStreaming) {
            stopCamera();
            setTimeout(startCamera, 100);
        }
    };

    if (currentPhoto) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
                    <button
                        onClick={() => setCurrentPhoto(null)}
                        className="text-2xl p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        ←
                    </button>
                    <h1 className="text-lg font-semibold">Photo Preview</h1>
                    <button
                        onClick={() => deletePhoto(currentPhoto.id)}
                        className="text-red-400 p-2 hover:bg-red-400/10 rounded-full transition-colors"
                    >
                        🗑️
                    </button>
                </div>

                {/* Photo Display */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <img
                        src={currentPhoto.dataUrl}
                        alt="Captured photo"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                </div>

                {/* Photo Info */}
                <div className="p-4 bg-black/50 backdrop-blur-sm">
                    <p className="text-center text-gray-300">
                        Taken on {currentPhoto.timestamp.toLocaleString()}
                    </p>
                    <p className="text-center text-sm text-gray-400 mt-1">
                        {currentPhoto.filename}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
                <Link href="/home" className="text-2xl p-2 hover:bg-white/10 rounded-full transition-colors">
                    ←
                </Link>
                <h1 className="text-lg font-semibold">Camera</h1>
                <button
                    onClick={switchCamera}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    disabled={isStreaming}
                >
                    🔄
                </button>
            </div>

            {/* Camera View */}
            <div className="flex-1 relative">
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                        <div className="text-center p-6">
                            <div className="text-6xl mb-4">📷</div>
                            <p className="text-red-400 mb-4">{error}</p>
                            <button
                                onClick={startCamera}
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {!isStreaming && !error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <div className="text-center">
                            <div className="text-8xl mb-6">📷</div>
                            <h2 className="text-2xl font-bold mb-4">Museum Camera</h2>
                            <p className="text-gray-400 mb-8 max-w-sm">
                                Capture your STEM learning moments and museum memories!
                            </p>
                            <button
                                onClick={startCamera}
                                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full text-lg font-semibold transition-colors"
                            >
                                Start Camera
                            </button>
                        </div>
                    </div>
                )}

                {/* Video Stream */}
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                />

                {/* Camera Controls */}
                {isStreaming && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center justify-center space-x-8">
                            {/* Recent Photos */}
                            <button
                                onClick={() => photos.length > 0 && setCurrentPhoto(photos[0])}
                                className="w-12 h-12 rounded-full border-2 border-white/50 overflow-hidden hover:border-white transition-colors"
                                disabled={photos.length === 0}
                            >
                                {photos.length > 0 ? (
                                    <img
                                        src={photos[0].dataUrl}
                                        alt="Recent"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-600 flex items-center justify-center text-xs">
                                        📷
                                    </div>
                                )}
                            </button>

                            {/* Capture Button */}
                            <button
                                onClick={capturePhoto}
                                className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-white shadow-inner"></div>
                            </button>

                            {/* Stop Camera */}
                            <button
                                onClick={stopCamera}
                                className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center"
                            >
                                ⏹️
                            </button>
                        </div>

                        {/* Camera Mode Indicator */}
                        <div className="text-center mt-4">
                            <span className="text-sm text-gray-300">
                                {cameraMode === 'selfie' ? 'Front Camera' : 'Back Camera'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden Canvas for Photo Capture */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
