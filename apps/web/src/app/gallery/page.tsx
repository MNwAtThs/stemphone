'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CapturedPhoto {
    id: string;
    dataUrl: string;
    timestamp: Date;
    filename: string;
}

export default function GalleryPage() {
    const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<CapturedPhoto | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'slideshow'>('grid');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = () => {
        try {
            const saved = localStorage.getItem('stemphone-photos');
            if (saved) {
                const parsedPhotos = JSON.parse(saved);
                const photosWithDates = parsedPhotos.map((p: any) => ({
                    ...p,
                    timestamp: new Date(p.timestamp)
                }));
                setPhotos(photosWithDates);
            }
        } catch (error) {
            console.error('Error loading photos:', error);
        }
    };

    const savePhotos = (updatedPhotos: CapturedPhoto[]) => {
        try {
            localStorage.setItem('stemphone-photos', JSON.stringify(updatedPhotos));
            setPhotos(updatedPhotos);
        } catch (error) {
            console.error('Error saving photos:', error);
        }
    };

    const deletePhoto = (photoId: string) => {
        const updatedPhotos = photos.filter(p => p.id !== photoId);
        savePhotos(updatedPhotos);

        if (selectedPhoto?.id === photoId) {
            setSelectedPhoto(null);
        }
    };

    const deleteAllPhotos = () => {
        if (confirm('Are you sure you want to delete all photos? This cannot be undone.')) {
            localStorage.removeItem('stemphone-photos');
            setPhotos([]);
            setSelectedPhoto(null);
        }
    };

    const downloadPhoto = (photo: CapturedPhoto) => {
        const link = document.createElement('a');
        link.download = photo.filename;
        link.href = photo.dataUrl;
        link.click();
    };

    const sharePhoto = async (photo: CapturedPhoto) => {
        if (navigator.share) {
            try {
                // Convert data URL to blob for sharing
                const response = await fetch(photo.dataUrl);
                const blob = await response.blob();
                const file = new File([blob], photo.filename, { type: 'image/jpeg' });

                await navigator.share({
                    title: 'Stemphone Photo',
                    text: `Photo taken at SAMSAT on ${photo.timestamp.toLocaleDateString()}`,
                    files: [file]
                });
            } catch (error) {
                console.error('Error sharing photo:', error);
                // Fallback to download
                downloadPhoto(photo);
            }
        } else {
            // Fallback to download
            downloadPhoto(photo);
        }
    };

    const nextPhoto = () => {
        if (photos.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % photos.length);
            setSelectedPhoto(photos[(currentIndex + 1) % photos.length]);
        }
    };

    const prevPhoto = () => {
        if (photos.length > 0) {
            const newIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
            setCurrentIndex(newIndex);
            setSelectedPhoto(photos[newIndex]);
        }
    };

    const startSlideshow = () => {
        if (photos.length > 0) {
            setViewMode('slideshow');
            setCurrentIndex(0);
            setSelectedPhoto(photos[0]);
        }
    };

    // Photo detail view
    if (selectedPhoto) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
                    <button
                        onClick={() => {
                            setSelectedPhoto(null);
                            setViewMode('grid');
                        }}
                        className="text-2xl p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        ←
                    </button>
                    <h1 className="text-lg font-semibold">
                        {currentIndex + 1} of {photos.length}
                    </h1>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => sharePhoto(selectedPhoto)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            📤
                        </button>
                        <button
                            onClick={() => deletePhoto(selectedPhoto.id)}
                            className="text-red-400 p-2 hover:bg-red-400/10 rounded-full transition-colors"
                        >
                            🗑️
                        </button>
                    </div>
                </div>

                {/* Photo Display */}
                <div className="flex-1 relative flex items-center justify-center">
                    {/* Navigation Arrows */}
                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={prevPhoto}
                                className="absolute left-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                            >
                                ←
                            </button>
                            <button
                                onClick={nextPhoto}
                                className="absolute right-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                            >
                                →
                            </button>
                        </>
                    )}

                    <img
                        src={selectedPhoto.dataUrl}
                        alt="Gallery photo"
                        className="max-w-full max-h-full object-contain"
                    />
                </div>

                {/* Photo Info */}
                <div className="p-4 bg-black/50 backdrop-blur-sm">
                    <p className="text-center text-gray-300">
                        {selectedPhoto.timestamp.toLocaleString()}
                    </p>
                    <p className="text-center text-sm text-gray-400 mt-1">
                        {selectedPhoto.filename}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/home" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">Gallery</h1>
                <div className="flex items-center space-x-2">
                    {photos.length > 0 && (
                        <>
                            <button
                                onClick={startSlideshow}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                title="Start slideshow"
                            >
                                ▶️
                            </button>
                            <button
                                onClick={deleteAllPhotos}
                                className="text-red-400 p-2 hover:bg-red-400/10 rounded-full transition-colors"
                                title="Delete all photos"
                            >
                                🗑️
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {photos.length === 0 ? (
                    // Empty State
                    <div className="text-center py-16">
                        <div className="text-8xl mb-6">🖼️</div>
                        <h2 className="text-3xl font-bold mb-4">No Photos Yet</h2>
                        <p className="text-gray-300 mb-8 max-w-md mx-auto">
                            Start capturing your museum memories! Use the Camera app to take photos
                            of your STEM learning experiences.
                        </p>
                        <Link
                            href="/camera"
                            className="inline-block bg-green-600 hover:bg-green-700 px-8 py-4 rounded-full text-lg font-semibold transition-colors"
                        >
                            Open Camera
                        </Link>
                    </div>
                ) : (
                    // Photo Grid
                    <>
                        {/* Stats */}
                        <div className="mb-6 text-center">
                            <p className="text-gray-300">
                                {photos.length} photo{photos.length !== 1 ? 's' : ''} captured
                            </p>
                        </div>

                        {/* Photo Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {photos.map((photo, index) => (
                                <button
                                    key={photo.id}
                                    onClick={() => {
                                        setSelectedPhoto(photo);
                                        setCurrentIndex(index);
                                    }}
                                    className="relative aspect-square rounded-2xl overflow-hidden bg-gray-800 hover:scale-105 transition-transform duration-200 group"
                                >
                                    <img
                                        src={photo.dataUrl}
                                        alt={`Photo ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

                                    {/* Date Badge */}
                                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        {photo.timestamp.toLocaleDateString()}
                                    </div>

                                    {/* Actions on Hover */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                sharePhoto(photo);
                                            }}
                                            className="p-1 bg-black/70 hover:bg-black/90 rounded-full mr-1 transition-colors"
                                        >
                                            📤
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deletePhoto(photo.id);
                                            }}
                                            className="p-1 bg-red-600/70 hover:bg-red-600/90 rounded-full transition-colors"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-8 flex justify-center space-x-4">
                            <Link
                                href="/camera"
                                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-full font-semibold transition-colors flex items-center space-x-2"
                            >
                                <span>📷</span>
                                <span>Take More Photos</span>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
