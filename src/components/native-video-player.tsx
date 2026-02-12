"use client";

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface NativeVideoPlayerProps {
    url: string;
    playing: boolean;
    playbackRate?: number;
    volume?: number;
    muted?: boolean;
    width?: string | number;
    height?: string | number;
    controls?: boolean;
    onReady?: () => void;
    onStart?: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onError?: (error: any) => void;
    onDuration?: (duration: number) => void;
    onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
    className?: string;
    config?: any; // To maintain compatibility with ReactPlayer props, though we might not use all
}

export interface NativeVideoPlayerRef {
    seekTo: (amount: number, type?: 'seconds' | 'fraction') => void;
    getCurrentTime: () => number;
    getDuration: () => number;
    getInternalPlayer: () => HTMLVideoElement | null;
}

const NativeVideoPlayer = forwardRef<NativeVideoPlayerRef, NativeVideoPlayerProps>((props, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const {
        url,
        playing,
        playbackRate = 1,
        controls = false,
        width = '100%',
        height = '100%',
        onReady,
        onStart,
        onPlay,
        onPause,
        onEnded,
        onError,
        onDuration,
        onProgress
    } = props;

    useImperativeHandle(ref, () => ({
        seekTo: (amount: number, type: 'seconds' | 'fraction' = 'seconds') => {
            const video = videoRef.current;
            if (!video) return;

            let seconds = amount;
            if (type === 'fraction') {
                const duration = video.duration;
                if (!Number.isFinite(duration)) return;
                seconds = duration * amount;
            }

            video.currentTime = seconds;
        },
        getCurrentTime: () => videoRef.current?.currentTime || 0,
        getDuration: () => videoRef.current?.duration || 0,
        getInternalPlayer: () => videoRef.current
    }));

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (playing) {
            video.play().catch(e => {
                // Auto-play might be blocked
                console.warn("NativeVideoPlayer: Autoplay prevented", e);
            });
        } else {
            video.pause();
        }
    }, [playing]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    useEffect(() => {
        if (onReady) {
            // Simulate onReady
            onReady();
        }
    }, [onReady]);

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video || !onProgress) return;

        const duration = video.duration || 0;
        const currentTime = video.currentTime || 0;

        // Mocking loaded/buffered roughly
        let loaded = 0;
        let loadedSeconds = 0;
        if (video.buffered.length > 0) {
            loadedSeconds = video.buffered.end(video.buffered.length - 1);
            loaded = duration > 0 ? loadedSeconds / duration : 0;
        }

        onProgress({
            played: duration > 0 ? currentTime / duration : 0,
            playedSeconds: currentTime,
            loaded,
            loadedSeconds
        });
    };

    const handleLoadedMetadata = () => {
        const video = videoRef.current;
        if (!video) return;

        if (onDuration) {
            onDuration(video.duration);
        }
        if (onStart) {
            onStart();
        }
    };

    return (
        <video
            ref={videoRef}
            src={url}
            width={width}
            height={height}
            controls={controls}
            className={props.className}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onTimeUpdate={handleTimeUpdate}
            onPlay={onPlay}
            onPause={onPause}
            onEnded={onEnded}
            onError={(e: any) => {
                if (onError) onError(e);
            }}
            onLoadedMetadata={handleLoadedMetadata}
            playsInline
        />
    );
});

NativeVideoPlayer.displayName = 'NativeVideoPlayer';

export default NativeVideoPlayer;
