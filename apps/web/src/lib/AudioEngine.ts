import { Howl, Howler } from 'howler';

export class AudioEngine {
    private static instance: AudioEngine;
    private currentHowl: Howl | null = null;
    private isInitialized = false;

    // Callbacks
    public onPlay?: () => void;
    public onPause?: () => void;
    public onStop?: () => void;
    public onTimeUpdate?: (time: number) => void;
    public onTrackEnd?: () => void;
    public onError?: (error: Error | string) => void;

    private timeUpdateInterval: NodeJS.Timeout | null = null;

    private constructor() {
        this.initializeAudio();
    }

    public static getInstance(): AudioEngine {
        if (!AudioEngine.instance) {
            AudioEngine.instance = new AudioEngine();
        }
        return AudioEngine.instance;
    }

    private initializeAudio() {
        if (this.isInitialized) return;

        // Set global Howler settings
        Howler.volume(0.7);
        Howler.html5PoolSize = 10;

        // Enable HTML5 audio for better mobile support
        // Note: html5 property may not be available in newer versions

        this.isInitialized = true;
    }

    public loadAndPlay(src: string, volume: number = 0.7): void {
        // Stop any currently playing audio
        this.stop();

        try {
            this.currentHowl = new Howl({
                src: [src],
                volume: volume,
                html5: true, // Force HTML5 Audio for better mobile support
                preload: true,
                onplay: () => {
                    this.startTimeUpdate();
                    this.onPlay?.();
                },
                onpause: () => {
                    this.stopTimeUpdate();
                    this.onPause?.();
                },
                onstop: () => {
                    this.stopTimeUpdate();
                    this.onStop?.();
                },
                onend: () => {
                    this.stopTimeUpdate();
                    this.onTrackEnd?.();
                },
                onloaderror: (id: number, error: unknown) => {
                    console.error('Audio load error:', error);
                    this.onError?.(error as Error);
                },
                onplayerror: (id: number, error: unknown) => {
                    console.error('Audio play error:', error);
                    this.onError?.(error as Error);

                    // Try to unlock audio context on mobile
                    this.currentHowl?.once('unlock', () => {
                        this.currentHowl?.play();
                    });
                }
            });

            // Play the audio
            this.currentHowl.play();
        } catch (error) {
            console.error('Failed to create Howl instance:', error);
            this.onError?.(error as Error);
        }
    }

    public play(): void {
        if (this.currentHowl && !this.currentHowl.playing()) {
            this.currentHowl.play();
        }
    }

    public pause(): void {
        if (this.currentHowl && this.currentHowl.playing()) {
            this.currentHowl.pause();
        }
    }

    public stop(): void {
        if (this.currentHowl) {
            this.currentHowl.stop();
            this.currentHowl.unload();
            this.currentHowl = null;
        }
        this.stopTimeUpdate();
    }

    public setVolume(volume: number): void {
        if (this.currentHowl) {
            this.currentHowl.volume(volume);
        }
        Howler.volume(volume);
    }

    public getVolume(): number {
        return this.currentHowl ? this.currentHowl.volume() : Howler.volume();
    }

    public getCurrentTime(): number {
        return this.currentHowl ? this.currentHowl.seek() as number : 0;
    }

    public getDuration(): number {
        return this.currentHowl ? this.currentHowl.duration() : 0;
    }

    public isPlaying(): boolean {
        return this.currentHowl ? this.currentHowl.playing() : false;
    }

    public seek(time: number): void {
        if (this.currentHowl) {
            this.currentHowl.seek(time);
        }
    }

    private startTimeUpdate(): void {
        this.stopTimeUpdate();
        this.timeUpdateInterval = setInterval(() => {
            if (this.currentHowl && this.currentHowl.playing()) {
                const currentTime = this.getCurrentTime();
                this.onTimeUpdate?.(currentTime);
            }
        }, 100); // Update every 100ms for smooth progress
    }

    private stopTimeUpdate(): void {
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
            this.timeUpdateInterval = null;
        }
    }

    // Static method to unlock audio on mobile devices
    public static unlockAudio(): Promise<void> {
        return new Promise((resolve) => {
            const unlock = () => {
                // Create a silent audio context to unlock
                const context = Howler.ctx;
                if (context && context.state === 'suspended') {
                    context.resume().then(() => {
                        document.removeEventListener('touchstart', unlock);
                        document.removeEventListener('touchend', unlock);
                        document.removeEventListener('click', unlock);
                        resolve();
                    });
                } else {
                    document.removeEventListener('touchstart', unlock);
                    document.removeEventListener('touchend', unlock);
                    document.removeEventListener('click', unlock);
                    resolve();
                }
            };

            // Add event listeners for user interaction
            document.addEventListener('touchstart', unlock);
            document.addEventListener('touchend', unlock);
            document.addEventListener('click', unlock);
        });
    }

    // Cleanup method
    public destroy(): void {
        this.stop();
        this.stopTimeUpdate();
        AudioEngine.instance = null as unknown as AudioEngine;
    }
}
