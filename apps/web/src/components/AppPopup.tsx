'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AppTile {
    id: string;
    name: string;
    icon: string;
    href: string;
    gradient: string;
    description: string;
}

interface AppPopupProps {
    isOpen: boolean;
    onClose: () => void;
    apps: AppTile[];
    onItemClick?: (app: AppTile) => void;
    title?: string;
}

export function AppPopup({ isOpen, onClose, apps, onItemClick, title = 'STEM Superstars Apps' }: AppPopupProps) {
    const [pressedApp, setPressedApp] = useState<string | null>(null);

    const handleAppPress = (appId: string) => {
        setPressedApp(appId);
        // Haptic feedback if available
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    };

    const handleAppRelease = () => {
        setPressedApp(null);
    };

    // Close popup when clicking outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Close popup with Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-3xl p-8 max-w-6xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative">
                {/* Close button - Top right of popup */}
                <button
                    onClick={onClose}
                    className="absolute right-8 top-8 rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 transition-colors z-10"
                    aria-label="Close"
                >
                    <svg
                        className="w-7 h-7"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Samsat Logo for Board of Directors - Above the title */}
                {title === 'Board of Directors' && (
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/logos/samsat_logo.png"
                            alt="Samsat Logo"
                            width={200}
                            height={100}
                            className="h-16 w-auto"
                        />
                    </div>
                )}

                {/* Port SA Logo for Port SA Leadership - Above the title */}
                {title === 'Port SA Leadership' && (
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/logos/portsa_logo.png"
                            alt="Port SA Logo"
                            width={200}
                            height={100}
                            className="h-16 w-auto"
                        />
                    </div>
                )}

                {/* DSEC Logo for DSEC Article - Above the title */}
                {title === 'DSEC' && (
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/apps/dsec.png"
                            alt="DSEC Logo"
                            width={200}
                            height={100}
                            className="h-16 w-auto"
                        />
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-5xl font-bold text-gray-900 text-center">{title}</h2>
                </div>

                {/* DSEC Article Content */}
                {title === 'DSEC' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-blue-50 rounded-2xl p-8 mb-6">
                            <div className="text-center mb-6">
                                <div className="text-6xl font-bold text-blue-600 mb-2">53,053</div>
                                <div className="text-lg text-gray-700">students, educators, and other participants engaged in DSEC-funded activities during Option Year Two</div>
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h3>

                            <p className="text-gray-700 mb-4">
                                This Annual Program Review summarizes the activities and outcomes of the Defense Science, Technology, Engineering, and Mathematics (STEM) Education Consortium (DSEC) during Option Year Two, September 1, 2021 – August 31, 2022.
                            </p>

                            <p className="text-gray-700 mb-4">
                                Launched in 2019 by the Department of Defense (DoD), DSEC is a collaborative partnership designed to broaden STEM literacy and develop a diverse and agile workforce for national defense. The consortium is aligned to the Federal STEM Education Strategic Plan and represents DoD's investment in evidence-based approaches to develop the science and technology workforce.
                            </p>

                            <h4 className="text-xl font-semibold text-gray-900 mb-3">Management Elements</h4>
                            <p className="text-gray-700 mb-3">To achieve its goals, DSEC is organized into five management elements:</p>

                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                                <li><strong>Element 1:</strong> Provides leadership and coordination of DSEC, including planning and execution of consortium-wide deliverables</li>
                                <li><strong>Element 2:</strong> Manages data collection, assessment/analysis, and reports for DSEC</li>
                                <li><strong>Element 3:</strong> Promotes DoD STEM and DSEC as a coordinated and cohesive effort offering students and teachers a pathway of STEM education and career opportunities</li>
                                <li><strong>Element 4:</strong> Develops and implements evidence-based STEM education programs and activities</li>
                                <li><strong>Element 5:</strong> Provides technical assistance and professional development for STEM educators</li>
                            </ul>

                            <div className="bg-gray-100 rounded-lg p-4 mt-6">
                                <p className="text-sm text-gray-600 italic">
                                    DSEC continues to make significant progress in advancing STEM education and workforce development through collaborative partnerships and evidence-based programming.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* App Grid */
                    <div className="grid grid-cols-4 gap-4 justify-items-center">
                        {apps.map((app) => (
                            onItemClick && app.href !== '#' ? (
                                <button
                                    key={app.id}
                                    type="button"
                                    className={`
                                    relative group block cursor-pointer pointer-events-auto z-10
                                    transform transition-all duration-150 ease-out
                                    ${pressedApp === app.id ? 'scale-95' : 'hover:scale-105'}
                                    active:scale-95
                                `}
                                    onClick={() => onItemClick(app)}
                                    onTouchStart={() => handleAppPress(app.id)}
                                    onTouchEnd={handleAppRelease}
                                    onMouseDown={() => handleAppPress(app.id)}
                                    onMouseUp={handleAppRelease}
                                    onMouseLeave={handleAppRelease}
                                >
                                    {/* App Icon Container */}
                                    <div className="relative">
                                        {/* Icon Background */}
                                        <div className={`
                                    w-40 h-40 rounded-3xl
                                    flex items-center justify-center
                                    shadow-lg group-hover:shadow-xl
                                    transition-all duration-200
                                    ${pressedApp === app.id ? 'brightness-90' : ''}
                                `}>
                                            {app.icon.startsWith('/') ? (
                                                <Image
                                                    src={app.icon}
                                                    alt={app.name}
                                                    width={160}
                                                    height={160}
                                                    className="w-40 h-40 object-contain rounded-3xl"
                                                />
                                            ) : (
                                                <div className={`w-40 h-40 rounded-3xl bg-gradient-to-br ${app.gradient} flex items-center justify-center`}>
                                                    <span className="text-6xl">{app.icon}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Shine effect */}
                                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>

                                        {/* Press effect */}
                                        {/* Press effect disabled to avoid intercepting clicks */}
                                    </div>

                                    {/* App Name */}
                                    <div className="mt-5 text-center">
                                        <span className="text-gray-800 text-xl font-medium leading-tight block">
                                            {app.name}
                                        </span>
                                    </div>

                                    {/* Tooltip on hover (for desktop) */}
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                        {app.description}
                                    </div>
                                </button>
                            ) : app.href !== '#' ? (
                                <a
                                    key={app.id}
                                    href={app.href}
                                    className={`
                                    relative group block
                                    transform transition-all duration-150 ease-out
                                    cursor-pointer
                                    ${pressedApp === app.id ? 'scale-95' : 'hover:scale-105'}
                                    active:scale-95
                                `}
                                    onTouchStart={() => handleAppPress(app.id)}
                                    onTouchEnd={handleAppRelease}
                                    onMouseDown={() => handleAppPress(app.id)}
                                    onMouseUp={handleAppRelease}
                                    onMouseLeave={handleAppRelease}
                                >
                                    {/* App Icon Container */}
                                    <div className="relative">
                                        {/* Icon Background */}
                                        <div className={`
                                        w-40 h-40 rounded-3xl
                                        flex items-center justify-center
                                        shadow-lg group-hover:shadow-xl
                                        transition-all duration-200
                                        ${pressedApp === app.id ? 'brightness-90' : ''}
                                    `}>
                                            {app.icon.startsWith('/') ? (
                                                <Image
                                                    src={app.icon}
                                                    alt={app.name}
                                                    width={160}
                                                    height={160}
                                                    className="w-40 h-40 object-contain rounded-3xl"
                                                />
                                            ) : (
                                                <div className={`w-40 h-40 rounded-3xl bg-gradient-to-br ${app.gradient} flex items-center justify-center`}>
                                                    <span className="text-6xl">{app.icon}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Shine effect */}
                                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                                        {/* Press effect */}
                                        {pressedApp === app.id && (
                                            <div className="absolute inset-0 rounded-3xl bg-black/20"></div>
                                        )}
                                    </div>

                                    {/* App Name */}
                                    <div className="mt-5 text-center">
                                        <span className="text-gray-800 text-xl font-medium leading-tight block">
                                            {app.name}
                                        </span>
                                    </div>

                                    {/* Tooltip on hover (for desktop) */}
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                        {app.description}
                                    </div>
                                </a>
                            ) : (
                                <div
                                    key={app.id}
                                    className="relative group block cursor-default"
                                >
                                    {/* App Icon Container */}
                                    <div className="relative">
                                        {/* Icon Background */}
                                        <div className="w-40 h-40 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-200">
                                            {app.icon.startsWith('/') ? (
                                                <Image
                                                    src={app.icon}
                                                    alt={app.name}
                                                    width={160}
                                                    height={160}
                                                    className="w-40 h-40 object-contain rounded-3xl"
                                                />
                                            ) : (
                                                <div className={`w-40 h-40 rounded-3xl bg-gradient-to-br ${app.gradient} flex items-center justify-center`}>
                                                    <span className="text-6xl">{app.icon}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* App Name */}
                                    <div className="mt-5 text-center">
                                        <span className="text-gray-800 text-xl font-medium leading-tight block">
                                            {app.name}
                                        </span>
                                    </div>

                                    {/* Tooltip on hover (for desktop) */}
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                        {app.description}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
