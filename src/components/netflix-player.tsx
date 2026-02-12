"use client"

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Menu, Settings, Maximize2, SkipForward, Info, Layers, Play, RotateCcw, RotateCw, ChevronsRight, ChevronsLeft, FastForward } from 'lucide-react';
import { MovieDetails } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import NativeVideoPlayer from './native-video-player';

const ReactPlayer = dynamic(() => import('react-player'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-black flex items-center justify-center"><Skeleton className="w-[80%] h-[80%] opacity-20" /></div>
}) as any;

interface NetflixPlayerProps {
    movie: MovieDetails;
    initialEpisodeIndex?: number;
    initialServerIndex?: number;
}

export function NetflixPlayer({ movie, initialEpisodeIndex = 0, initialServerIndex = 0 }: NetflixPlayerProps) {
    const router = useRouter();
    const [currentServerIndex, setCurrentServerIndex] = useState(initialServerIndex);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(initialEpisodeIndex);
    const [showControls, setShowControls] = useState(true);
    const [showEpisodes, setShowEpisodes] = useState(false);
    const [showServers, setShowServers] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Safe data access
    const episodes = movie.episodes || [];
    const currentServer = episodes[currentServerIndex];
    const serverData = currentServer?.server_data || [];
    const currentEpisode = serverData[currentEpisodeIndex];

    const [showSettings, setShowSettings] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isBuffering, setIsBuffering] = useState(false);
    const [useEmbed, setUseEmbed] = useState(false);
    const [duration, setDuration] = useState(0);
    const [played, setPlayed] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const playerRef = useRef<any>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);

    // Gestures State
    const [isLongPressing, setIsLongPressing] = useState(false);
    const [seekOverlay, setSeekOverlay] = useState<{ side: 'left' | 'right', amount: number } | null>(null);
    const lastTapTime = useRef<number>(0);
    const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
    const singleTapTimeout = useRef<NodeJS.Timeout | null>(null);
    const tapPosition = useRef<{ x: number, y: number } | null>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        // Ignore if clicking on controls or interactive elements
        if ((e.target as HTMLElement).closest('button, [role="slider"], .group\\/seeker')) {
            tapPosition.current = null;
            return;
        }

        tapPosition.current = { x: e.clientX, y: e.clientY };

        longPressTimeout.current = setTimeout(() => {
            setIsLongPressing(true);
            setPlaybackSpeed(2.0);
        }, 500); // 500ms hold to trigger 2x
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (longPressTimeout.current) {
            clearTimeout(longPressTimeout.current);
            longPressTimeout.current = null;
        }

        if (isLongPressing) {
            setIsLongPressing(false);
            setPlaybackSpeed(1.0); // Reset to normal
            return;
        }

        // Tap Logic
        const now = Date.now();
        const timeDiff = now - lastTapTime.current;

        // Check distance to ensure it's a tap and not a drag
        if (tapPosition.current) {
            const dist = Math.sqrt(Math.pow(e.clientX - tapPosition.current.x, 2) + Math.pow(e.clientY - tapPosition.current.y, 2));
            if (dist > 10) return; // Moved too much, ignore as tap
        } else {
            return; // Ignore if no start position (e.g. clicked on button)
        }

        if (timeDiff < 300) {
            // DOUBLE TAP detected
            if (singleTapTimeout.current) {
                clearTimeout(singleTapTimeout.current);
                singleTapTimeout.current = null;
            }

            const screenWidth = window.innerWidth;
            const x = e.clientX;

            if (x < screenWidth * 0.35) {
                // Left Double Tap - Rewind
                handleJump(-10);
                setSeekOverlay(prev => ({ side: 'left', amount: (prev?.side === 'left' ? prev.amount : 0) + 15 }));
                // Reset overlay after animation
                setTimeout(() => setSeekOverlay(null), 800);
            } else if (x > screenWidth * 0.65) {
                // Right Double Tap - Forward
                handleJump(10);
                setSeekOverlay(prev => ({ side: 'right', amount: (prev?.side === 'right' ? prev.amount : 0) + 15 }));
                setTimeout(() => setSeekOverlay(null), 800);
            } else {
                // Center Double Tap - Toggle Play/Pause (optional, or just toggle controls like single tap)
                // For now, let's treat center double tap same as center single tap (toggle controls)
                // Or maybe toggle Play/Pause?
                togglePlay();
            }

            lastTapTime.current = 0; // Reset
        } else {
            // SINGLE TAP Potential
            lastTapTime.current = now;

            singleTapTimeout.current = setTimeout(() => {
                // Execute Single Tap Action used to be onClick
                if (!showEpisodes && !showServers) {
                    if (showControls) {
                        setShowControls(false);
                    } else {
                        resetControlsTimeout();
                    }
                }
            }, 300);
        }
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const toggleFullScreen = () => {
        if (!playerContainerRef.current) return;

        if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
            const el = playerContainerRef.current as any;
            if (el.requestFullscreen) {
                el.requestFullscreen().catch((err: any) => console.error("FS Error:", err));
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            } else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
            } else if (el.msRequestFullscreen) {
                el.msRequestFullscreen();
            } else if (playerRef.current && (playerRef.current as any)?.getInternalPlayer) {
                // Fallback for iOS video element
                const video = (playerRef.current as any).getInternalPlayer() as HTMLVideoElement;
                if (video && (video as any).webkitEnterFullscreen) {
                    (video as any).webkitEnterFullscreen();
                }
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
                (document as any).webkitExitFullscreen();
            } else if ((document as any).mozCancelFullScreen) {
                (document as any).mozCancelFullScreen();
            } else if ((document as any).msExitFullscreen) {
                (document as any).msExitFullscreen();
            }
        }
    };

    const formatTime = (seconds: number) => {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, '0');
        if (hh) {
            return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
        }
        return `${mm}:${ss}`;
    };

    const handleJump = (seconds: number) => {
        if (!playerRef.current) return;
        const currentTime = playerRef.current.getCurrentTime() || 0;
        const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
        playerRef.current.seekTo(newTime, 'seconds');
    };

    const handleSeekChange = (value: number[]) => {
        setPlayed(value[0]);
    };

    const handleSeekMouseDown = () => {
        setSeeking(true);
    };

    const handleSeekMouseUp = (value: number[]) => {
        setSeeking(false);
        playerRef.current?.seekTo(value[0], 'fraction');
    };

    const handleProgress = (state: any) => {
        if (!seeking) {
            setPlayed(state.played);
        }
        if (duration === 0 && playerRef.current) {
            const d = playerRef.current.getDuration();
            if (d) setDuration(d);
        }
    };

    // Reset embed flag when switching episodes
    useEffect(() => {
        setUseEmbed(false);
    }, [currentServerIndex, currentEpisodeIndex]);

    const resetControlsTimeout = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            if (!showEpisodes && !showServers && isPlaying) {
                setShowControls(false);
            }
        }, 3000);
    };

    useEffect(() => {
        const handleMouseMove = () => resetControlsTimeout();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                togglePlay();
                resetControlsTimeout();
            }
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('keydown', handleKeyDown);
        resetControlsTimeout();
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('keydown', handleKeyDown);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, [showEpisodes, showServers, isPlaying]);

    const handleBack = () => {
        router.push(`/phim/${movie.slug}`);
    };

    const nextEpisode = () => {
        if (currentEpisodeIndex < serverData.length - 1) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
            setPlayed(0);
            setIsPlaying(true);
        } else {
            alert("Đây là tập cuối cùng!");
        }
    };

    return (
        <div
            ref={playerContainerRef}
            id="netflix-player-root"
            className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden select-none group/player touch-none"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            style={{ cursor: showControls || useEmbed ? 'auto' : 'none' }}>

            {/* Player Container */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
                {currentEpisode ? (
                    <>
                        {!useEmbed && currentEpisode.link_m3u8 ? (
                            <NativeVideoPlayer
                                ref={playerRef}
                                key={`native-${currentServerIndex}-${currentEpisodeIndex}`}
                                url={currentEpisode.link_m3u8}
                                width="100%"
                                height="100%"
                                playing={isPlaying}
                                playbackRate={playbackSpeed}
                                onEnded={nextEpisode}
                                onProgress={handleProgress}
                                onStart={() => console.log("Native Playback Started")}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onReady={() => {
                                    console.log("Native Player Ready");
                                    if (playerRef.current) {
                                        const d = playerRef.current.getDuration();
                                        if (d) setDuration(d);
                                    }
                                }}
                                onDuration={(d: number) => setDuration(d)}
                                onError={(err: any) => {
                                    console.error("Native Player Error:", err);
                                    // Don't auto-switch to embed immediately, allow one retry or manual trigger
                                    // unless it's a fatal error
                                    // if (err?.fatal) setUseEmbed(true);
                                }}
                            />
                        ) : currentEpisode.link_embed ? (
                            <iframe
                                src={currentEpisode.link_embed}
                                className="w-full h-full border-0"
                                allowFullScreen
                                allow="autoplay; encrypted-media"
                            />
                        ) : (
                            <div className="text-center px-6">
                                <p className="text-white/40 font-bold uppercase tracking-widest text-sm mb-4">Lỗi nguồn phát</p>
                                <Button variant="outline" onClick={() => setUseEmbed(false)} className="border-white/20 text-white rounded-full"> Thử tải lại </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center space-y-4 px-6 max-w-md">
                        <p className="text-white/40 font-bold uppercase tracking-widest text-sm">Lỗi dữ liệu</p>
                        <h2 className="text-2xl font-black text-white uppercase">Không tìm thấy tập phim</h2>
                        <p className="text-white/30 text-sm">Dữ liệu nguồn của phim này có thể đang gặp sự cố. Bạn có thể thử chuyển qua Máy chủ khác bên dưới.</p>
                        <Button variant="outline" onClick={handleBack} className="mt-4 border-white/20 text-white hover:bg-white hover:text-black rounded-full px-8">
                            Quay lại trang chi tiết
                        </Button>
                    </div>
                )}
            </div>

            {/* Immersive Overlay */}
            <div className={cn(
                "absolute inset-0 z-20 transition-all duration-500 flex flex-col justify-between pt-2 pb-2 lg:pt-6 lg:pb-10 px-4 lg:px-12 pointer-events-none",
                showControls ? "opacity-100 bg-black/40" : "opacity-0 pointer-events-none"
            )}>
                {/* Top Header */}
                <div className="grid grid-cols-3 items-center w-full pointer-events-auto">
                    <div className="flex justify-start">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleBack(); }}
                            className="p-2 lg:p-3 hover:bg-white/10 rounded-full transition-all group/back flex items-center gap-2 lg:gap-3"
                        >
                            <ArrowLeft className="w-5 h-5 lg:w-8 lg:h-8 text-white" />
                            <span className="text-sm font-bold text-white tracking-widest opacity-0 -translate-x-2 group-hover/back:opacity-100 group-hover/back:translate-x-0 transition-all hidden lg:block">QUAY LẠI</span>
                        </button>
                    </div>

                    <div className="flex flex-col items-center text-center overflow-hidden">
                        <h1 className="text-xs lg:text-2xl font-bold tracking-tight text-white/90 drop-shadow-lg truncate w-full px-2 max-w-[200px] lg:max-w-none">{movie.name}</h1>
                        {currentEpisode?.name.toLowerCase() !== 'full' && (
                            <p className="text-white/50 font-medium tracking-wide text-[9px] lg:text-xs uppercase mt-0.5 truncate">
                                Tập {currentEpisode?.name || 'Loading...'}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end pr-2">
                        {/* Optional Info Button or Spacer */}
                        <div className="w-10 md:w-16" />
                    </div>
                </div>

                {/* Center Controls */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-6 lg:gap-20 pointer-events-none">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleJump(-15); resetControlsTimeout(); }}
                        className={cn(
                            "flex flex-col items-center gap-1 text-white/60 hover:text-white transition-all scale-75 lg:scale-100 p-4 rounded-full hover:bg-white/10 pointer-events-auto",
                            !showControls && isPlaying && "opacity-0"
                        )}
                    >
                        <RotateCcw className="w-8 h-8 lg:w-10 lg:h-10" />
                        <span className="text-[9px] lg:text-[10px] font-bold">15</span>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); togglePlay(); resetControlsTimeout(); }}
                        className={cn(
                            "w-12 h-12 lg:w-28 lg:h-28 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group/play pointer-events-auto shadow-2xl shadow-black/40",
                            !showControls && isPlaying && "opacity-0 scale-50"
                        )}
                    >
                        {isPlaying ? (
                            <div className="flex gap-1.5 lg:gap-2">
                                <div className="w-1.5 lg:w-3.5 h-6 lg:h-14 bg-white rounded-full" />
                                <div className="w-1.5 lg:w-3.5 h-6 lg:h-14 bg-white rounded-full" />
                            </div>
                        ) : (
                            <Play className="w-6 h-6 lg:w-16 lg:h-16 text-white fill-white" />
                        )}
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleJump(15); resetControlsTimeout(); }}
                        className={cn(
                            "flex flex-col items-center gap-1 text-white/60 hover:text-white transition-all scale-75 lg:scale-100 p-4 rounded-full hover:bg-white/10 pointer-events-auto",
                            !showControls && isPlaying && "opacity-0"
                        )}
                    >
                        <RotateCw className="w-8 h-8 lg:w-10 lg:h-10" />
                        <span className="text-[9px] lg:text-[10px] font-bold">15</span>
                    </button>
                </div>

                {/* Bottom Controls Area */}
                <div className="flex flex-col gap-1 lg:gap-6 pointer-events-auto">
                    {/* Seeker Bar */}
                    {!useEmbed && duration > 0 && (
                        <div className="space-y-0.5 lg:space-y-3 group/seeker px-2">
                            <div className="relative h-0.5 lg:h-1.5 flex items-center cursor-pointer group-hover/seeker:h-2 transition-all">
                                <Slider
                                    value={[played]}
                                    max={1}
                                    step={0.0001}
                                    onValueChange={handleSeekChange}
                                    onPointerDown={handleSeekMouseDown}
                                    onValueCommit={handleSeekMouseUp}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center justify-between text-[9px] lg:text-xs font-medium text-white/40 font-mono tracking-tight">
                                <span>{formatTime(played * duration)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>
                    )}

                    {useEmbed && (
                        <div className="flex justify-center">
                            <p className="text-[9px] lg:text-[10px] font-black tracking-widest text-white/30 uppercase bg-black/40 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full border border-white/5 backdrop-blur-sm">
                                Vui lòng dùng trình phát của máy chủ để điều chỉnh thời gian
                            </p>
                        </div>
                    )}
                    {/* Main Action Bar */}
                    <div className="flex items-center justify-between bg-white/[0.03] backdrop-blur-2xl px-3 py-1.5 lg:px-6 lg:py-4 rounded-xl lg:rounded-2xl border border-white/5 shadow-2xl">
                        <div className="flex items-center gap-2 lg:gap-8">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowEpisodes(!showEpisodes); setShowServers(false); }}
                                className={cn(
                                    "flex items-center gap-1.5 lg:gap-2 px-2 py-1.5 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl transition-all",
                                    showEpisodes ? "bg-white text-black" : "text-white/60 hover:text-white hover:bg-white/10"
                                )}
                            >
                                <Menu className="w-4 h-4 lg:w-5 lg:h-5" />
                                <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider">Tập</span>
                            </button>

                            <button
                                onClick={(e) => { e.stopPropagation(); setShowServers(!showServers); setShowEpisodes(false); }}
                                className={cn(
                                    "flex items-center gap-1.5 lg:gap-2 px-2 py-1.5 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl transition-all",
                                    showServers ? "bg-white text-black" : "text-white/60 hover:text-white hover:bg-white/10"
                                )}
                            >
                                <Layers className="w-4 h-4 lg:w-5 lg:h-5" />
                                <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider">Kênh</span>
                            </button>

                            <button
                                onClick={(e) => { e.stopPropagation(); nextEpisode(); }}
                                className="flex items-center gap-1.5 lg:gap-2 px-2 py-1.5 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-wider"
                            >
                                <SkipForward className="w-4 h-4 lg:w-5 lg:h-5" />
                                <span className="hidden lg:inline">Tập tiếp</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-1 lg:gap-4 relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
                                className={cn(
                                    "p-1.5 lg:p-2 transition-all hover:scale-110",
                                    showSettings ? "text-white" : "text-white/40 hover:text-white"
                                )}
                            >
                                <Settings className="w-4 h-4 lg:w-6 lg:h-6" />
                            </button>

                            {showSettings && (
                                <div className="absolute bottom-full right-0 mb-2 lg:mb-4 bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-xl lg:rounded-2xl p-2 lg:p-4 w-32 lg:w-48 shadow-3xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <h4 className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 lg:mb-3 px-2">Tốc độ phát</h4>
                                    <div className="space-y-0.5 lg:space-y-1">
                                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                                            <button
                                                key={speed}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPlaybackSpeed(speed);
                                                    setShowSettings(false);
                                                }}
                                                className={cn(
                                                    "w-full px-2 py-1.5 lg:px-3 lg:py-2 rounded-lg lg:rounded-xl text-[10px] lg:text-xs font-bold transition-all flex items-center justify-between",
                                                    playbackSpeed === speed
                                                        ? "bg-white text-black"
                                                        : "text-white/50 hover:bg-white/10 hover:text-white"
                                                )}
                                            >
                                                <span>{speed}x</span>
                                                {playbackSpeed === speed && <div className="w-1 h-1 rounded-full bg-black" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={(e) => { e.stopPropagation(); toggleFullScreen(); }}
                                className="p-1.5 lg:p-2 text-white/40 hover:text-white transition-all hover:scale-110"
                            >
                                <Maximize2 className="w-4 h-4 lg:w-6 lg:h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Panels */}
                    {(showEpisodes || showServers) && (
                        <div className="absolute bottom-20 lg:bottom-28 left-0 right-0 animate-in slide-in-from-bottom-4 fade-in duration-300 z-30 flex justify-center px-4 lg:px-0">
                            {showEpisodes && (
                                <div className="bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-2xl lg:rounded-3xl p-4 lg:p-6 w-full max-w-4xl shadow-3xl max-h-[50vh] lg:max-h-[60vh] flex flex-col overflow-hidden">
                                    <div className="flex items-center justify-between mb-2 lg:mb-4 px-2 shrink-0">
                                        <h3 className="text-xs lg:text-sm font-bold uppercase tracking-widest text-white/40">Danh sách tập</h3>
                                        <button onClick={(e) => { e.stopPropagation(); setShowEpisodes(false); }} className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wider text-white/20 hover:text-white">Đóng</button>
                                    </div>
                                    <ScrollArea className="flex-1 -mr-4 pr-4 min-h-0">
                                        <div className="grid grid-cols-4 lg:grid-cols-10 gap-1.5 lg:gap-2 p-1 pb-4">
                                            {serverData.map((ep, idx) => (
                                                <button
                                                    key={ep.slug}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCurrentEpisodeIndex(idx);
                                                        setShowEpisodes(false);
                                                    }}
                                                    className={cn(
                                                        "h-8 lg:h-10 flex items-center justify-center rounded-md lg:rounded-lg font-bold text-[10px] lg:text-xs transition-all border",
                                                        currentEpisodeIndex === idx
                                                            ? "bg-white text-black border-white shadow-lg"
                                                            : "bg-white/5 text-white/50 border-white/5 hover:bg-white/20 hover:text-white"
                                                    )}
                                                >
                                                    {ep.name}
                                                </button>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}

                            {showServers && (
                                <div className="bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-2xl lg:rounded-3xl p-3 lg:p-4 w-full max-w-xs shadow-3xl max-h-[50vh] lg:max-h-[60vh] flex flex-col overflow-hidden">
                                    <div className="mb-2 lg:mb-3 px-2 shrink-0">
                                        <h3 className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-white/40">Chọn kênh phát</h3>
                                    </div>
                                    <ScrollArea className="flex-1 -mr-2 pr-2 min-h-0">
                                        <div className="space-y-1 pb-2">
                                            {episodes.map((server, idx) => (
                                                <button
                                                    key={server.server_name}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCurrentServerIndex(idx);
                                                        setShowServers(false);
                                                    }}
                                                    className={cn(
                                                        "w-full px-3 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl font-bold text-[10px] lg:text-xs transition-all flex items-center justify-between border",
                                                        currentServerIndex === idx
                                                            ? "bg-white text-black border-white"
                                                            : "bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white"
                                                    )}
                                                >
                                                    <span>{server.server_name}</span>
                                                    {currentServerIndex === idx && <div className="w-1 lg:w-1.5 h-1 lg:h-1.5 rounded-full bg-black shadow-lg" />}
                                                </button>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Gesture Overlays */}
            {/* 2x Speed Indicator */}
            {isLongPressing && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 animate-in fade-in zoom-in duration-200 pointer-events-none">
                    <FastForward className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white">2x Tốc độ</span>
                </div>
            )}

            {/* Seek Overlay Left */}
            {seekOverlay?.side === 'left' && (
                <div className="absolute left-0 top-0 bottom-0 w-1/3 z-40 flex items-center justify-center animate-in fade-in duration-200 pointer-events-none">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <ChevronsLeft className="w-12 h-12 text-white/90 drop-shadow-lg" />
                        <span className="text-white font-bold text-lg drop-shadow-lg">-{seekOverlay.amount}s</span>
                    </div>
                </div>
            )}

            {/* Seek Overlay Right */}
            {seekOverlay?.side === 'right' && (
                <div className="absolute right-0 top-0 bottom-0 w-1/3 z-40 flex items-center justify-center animate-in fade-in duration-200 pointer-events-none">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <ChevronsRight className="w-12 h-12 text-white/90 drop-shadow-lg" />
                        <span className="text-white font-bold text-lg drop-shadow-lg">+{seekOverlay.amount}s</span>
                    </div>
                </div>
            )}
        </div>
    );
}
