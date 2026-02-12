'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MovieItem } from '@/types';
import { getImageUrl } from '@/lib/api';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroCarouselProps {
    movies: MovieItem[];
    autoPlayInterval?: number; // in milliseconds, default 5000 (5 seconds)
}

export function HeroCarousel({ movies, autoPlayInterval = 5000 }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const changeSlide = useCallback((newIndex: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        // Wait for fade out, then change index (content updates via currentIndex), then fade in
        setTimeout(() => {
            setCurrentIndex(newIndex);
            setIsTransitioning(false);
        }, 300); // 300ms fade out
    }, [isTransitioning]);

    const handleNext = useCallback(() => {
        changeSlide((currentIndex + 1) % movies.length);
    }, [changeSlide, currentIndex, movies.length]);

    const handlePrev = useCallback(() => {
        changeSlide((currentIndex - 1 + movies.length) % movies.length);
    }, [changeSlide, currentIndex, movies.length]);

    const goToSlide = useCallback((index: number) => {
        if (index === currentIndex) return;
        changeSlide(index);
    }, [changeSlide, currentIndex]);

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null); // Reset
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }
    };

    // Auto-play functionality
    useEffect(() => {
        if (movies.length <= 1) return;

        const interval = setInterval(() => {
            handleNext();
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [handleNext, movies.length, autoPlayInterval]);

    if (movies.length === 0) return null;

    const displayMovie = movies[currentIndex];

    return (
        <div
            id="hero-carousel"
            className="relative w-full min-h-[70vh] md:min-h-[85vh] flex flex-col justify-end pt-64 md:pt-32 pb-20 md:pb-28 overflow-hidden group touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Background Images with Crossfade - Optimized to only render visible and neighbor slides */}
            {movies.map((movie, index) => {
                const isActive = index === currentIndex;
                const isNeighbor = Math.abs(index - currentIndex) === 1 ||
                                  (currentIndex === 0 && index === movies.length - 1) ||
                                  (currentIndex === movies.length - 1 && index === 0);

                if (!isActive && !isNeighbor) return null;

                return (
                    <div
                        key={movie._id}
                        className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Image
                            src={getImageUrl(movie.poster_url || movie.thumb_url)}
                            alt={movie.name}
                            fill
                            className="object-cover object-top"
                            priority={index === 0}
                            loading={index === 0 ? undefined : 'lazy'}
                            sizes="100vw"
                        />
                    </div>
                );
            })}

            {/* Gradient Overlays — deep cinematic feel */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/5 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />

            {/* Navigation Arrows */}
            {movies.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        aria-label="Previous movie"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        aria-label="Next movie"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </>
            )}

            {/* Content Area */}
            <div className="relative z-10 w-full max-w-2xl px-4 md:ml-32 md:px-0">
                {/* Animated content — fades on slide change */}
                <div
                    className={`flex flex-col justify-end min-h-[300px] md:min-h-[400px] transition-all duration-500 ease-out ${isTransitioning ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}
                >
                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-5">

                        {/* Type (Movie/TV) & Season */}
                        {displayMovie.tmdb?.type === 'tv' ? (
                            <>
                                <span className="px-2.5 py-1 text-xs font-semibold tracking-wider text-red-400 border border-red-400/20 rounded uppercase bg-red-400/5">
                                    Phim Bộ
                                </span>
                                {displayMovie.tmdb?.season && (
                                    <span className="px-2.5 py-1 text-xs font-medium tracking-wider text-white/70 border border-white/10 rounded">
                                        Mùa {displayMovie.tmdb.season}
                                    </span>
                                )}
                            </>
                        ) : displayMovie.tmdb?.type === 'movie' ? (
                            <span className="px-2.5 py-1 text-xs font-semibold tracking-wider text-blue-400 border border-blue-400/20 rounded uppercase bg-blue-400/5">
                                Phim Lẻ
                            </span>
                        ) : null}


                        {/* Year */}
                        {/* {displayMovie.year && (
                            <span className="px-2.5 py-1 text-xs font-medium tracking-wider text-white/70 border border-white/10 rounded">
                                {displayMovie.year}
                            </span>
                        )} */}

                        {/* Star Rating */}
                        {/* {displayMovie.tmdb?.vote_average > 0 && (
                            <span className="px-2.5 py-1 text-xs font-semibold tracking-wider text-white/90 border border-white/20 rounded bg-white/5">
                                ★ {displayMovie.tmdb.vote_average.toFixed(1)}
                            </span>
                        )} */}

                        {/* Other Quality/Lang (Fallback) */}
                        {/* {(displayMovie as any).quality && (
                            <span className="px-2.5 py-1 text-xs font-semibold tracking-widest text-white/90 border border-white/20 rounded uppercase">
                                {(displayMovie as any).quality}
                            </span>
                        )} */}
                        {/* {(displayMovie as any).lang && (
                            <span className="px-2.5 py-1 text-xs font-medium tracking-wider text-white/70 border border-white/10 rounded">
                                {(displayMovie as any).lang}
                            </span>
                        )} */}
                        {(displayMovie as any).episode_current && (
                            <span className="px-2.5 py-1 text-xs font-medium tracking-wider text-white/70 border border-white/10 rounded">
                                {(displayMovie as any).episode_current}
                            </span>
                        )}

                        {/* Category (Fallback) */}
                        {/*displayMovie.category && displayMovie.category.length > 0 && (
                            <span className="px-2.5 py-1 text-xs font-medium tracking-wider text-white/70 border border-white/10 rounded">
                                {displayMovie.category.map((c: any) => c.name).join(' · ')}
                            </span>
                        )*/}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.3] py-2 text-white mb-3 line-clamp-3 text-balance">
                        {displayMovie.name}
                    </h1>
                    <p className="text-base md:text-lg text-white/50 mb-5 font-normal tracking-wide">
                        {displayMovie.origin_name} ({displayMovie.year})
                    </p>

                    {/* Country */}
                    {/* {(displayMovie as any).country && (displayMovie as any).country.length > 0 && (
                        <p className="text-sm text-white/40 mb-6 font-light tracking-wide">
                            {(displayMovie as any).country.map((c: any) => c.name).join(', ')}
                        </p>
                    )} */}
                </div>

                {/* CTA Buttons — static, never fade */}
                <div className="flex gap-3">
                    {(() => {
                        const status = displayMovie.episode_current?.toLowerCase();
                        if (status !== 'đang cập nhật' && status !== 'trailer') {
                            return (
                                <Link
                                    href={`/xem-phim/${displayMovie.slug}`}
                                    className="inline-flex items-center gap-2 px-7 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all duration-200 text-sm"
                                >
                                    <Play className="h-4 w-4 fill-black" />
                                    Xem ngay
                                </Link>
                            );
                        }
                        return null;
                    })()}
                    <Link
                        href={`/phim/${displayMovie.slug}`}
                        className="inline-flex items-center gap-2 px-7 py-3 border border-white/20 text-white/90 font-medium rounded-lg hover:bg-white/10 hover:border-white/30 transition-all duration-200 text-sm"
                    >
                        {/* <Info className="h-4 w-4" /> */}
                        Chi tiết
                    </Link>
                </div>
            </div>

            {/* Pagination Dots */}
            {movies.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {movies.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-[3px] rounded-full transition-all duration-500 ${index === currentIndex
                                ? 'w-8 bg-white'
                                : 'w-2 bg-white/30 hover:bg-white/50'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
