"use client"

import { useRef, useState, useEffect, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MovieItem } from '@/types';
import { getImageUrl } from '@/lib/api';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface MovieRowProps {
    title: string;
    movies: MovieItem[];
    href?: string;
}

export function MovieRow({ title, movies, href }: MovieRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);
    const leftSentinelRef = useRef<HTMLDivElement>(null);
    const rightSentinelRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        const el = rowRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.target === leftSentinelRef.current) {
                        setCanScrollLeft(!entry.isIntersecting);
                    }
                    if (entry.target === rightSentinelRef.current) {
                        setCanScrollRight(!entry.isIntersecting);
                    }
                });
            },
            { root: el, threshold: 0.1 }
        );

        if (leftSentinelRef.current) observer.observe(leftSentinelRef.current);
        if (rightSentinelRef.current) observer.observe(rightSentinelRef.current);

        return () => observer.disconnect();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (!rowRef.current) return;
        const scrollAmount = rowRef.current.clientWidth * 0.75;
        rowRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <section className="relative group/row">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
                {href && (
                    <Link
                        href={href}
                        className="text-sm text-white/50 hover:text-white transition-colors duration-200 flex items-center gap-1 group/link"
                    >
                        Xem tất cả
                        <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
                    </Link>
                )}
            </div>

            {/* Scroll Container */}
            <div className="relative -mx-4 md:-mx-8">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className={`absolute left-0 top-0 bottom-0 z-20 w-14 bg-gradient-to-r from-background via-background/80 to-transparent hidden md:flex items-center justify-center transition-all duration-300 cursor-pointer ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    aria-label="Scroll left"
                >
                    <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all opacity-100 lg:opacity-0 lg:group-hover/row:opacity-100">
                        <ChevronLeft className="h-5 w-5 text-white" />
                    </div>
                </button>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className={`absolute right-0 top-0 bottom-0 z-20 w-14 bg-gradient-to-l from-background via-background/80 to-transparent hidden md:flex items-center justify-center transition-all duration-300 cursor-pointer ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    aria-label="Scroll right"
                >
                    <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all opacity-100 lg:opacity-0 lg:group-hover/row:opacity-100">
                        <ChevronRight className="h-5 w-5 text-white" />
                    </div>
                </button>

                <div
                    ref={rowRef}
                    className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 scroll-smooth"
                >
                    <div ref={leftSentinelRef} className="w-1 h-1 flex-shrink-0 pointer-events-none" />
                    {movies.map((movie) => (
                        <MovieRowCard key={movie._id} movie={movie} />
                    ))}
                    <div ref={rightSentinelRef} className="w-1 h-1 flex-shrink-0 pointer-events-none" />
                </div>
            </div>
        </section>
    );
}

export const MovieRowCard = memo(({ movie }: { movie: MovieItem }) => {
    return (
        <Link
            href={`/phim/${movie.slug}`}
            className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] group/card"
        >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06] transition-all duration-300 group-hover/card:shadow-xl group-hover/card:shadow-black/40 group-hover/card:border-white/10">
                <Image
                    src={getImageUrl(movie.thumb_url)}
                    alt={movie.name}
                    fill
                    className="object-cover transition-all duration-500 group-hover/card:scale-105 group-hover/card:brightness-[0.7] transform-gpu"
                    sizes="200px"
                    loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex flex-col justify-end p-3.5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center transition-transform group-hover/card:scale-110">
                            <Info className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-xs text-white/70 font-medium">Xem chi tiết</span>
                    </div>
                    <h3 className="text-white font-semibold text-xs line-clamp-2 leading-tight">{movie.name}</h3>
                    <p className="text-white/40 text-[10px] mt-0.5 line-clamp-1">{movie.origin_name}</p>
                </div>

                {/* Quality/Year badges - always visible */}
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    {movie.year && (
                        <span className="text-[10px] bg-black/50 backdrop-blur-md text-white/90 px-2 py-0.5 rounded-full font-medium">
                            {movie.year}
                        </span>
                    )}
                </div>

                {/* TMDB rating */}
                {movie.tmdb?.vote_average > 0 && (
                    <div className="absolute top-1.5 right-2.5">
                        <span className="text-[10px] bg-amber-500/20 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-full font-semibold border border-amber-400/20">
                            ★ {movie.tmdb.vote_average.toFixed(1)}
                        </span>
                    </div>
                )}
            </div>

            {/* Title below */}
            <div className="mt-2.5 px-0.5">
                <h3 className="font-medium text-sm line-clamp-1 text-white/90 group-hover/card:text-white transition-colors">
                    {movie.name}
                </h3>
                <p className="text-white/40 text-xs line-clamp-1 mt-0.5">
                    {movie.origin_name} ({movie.year})
                </p>
            </div>
        </Link>
    );
});

MovieRowCard.displayName = 'MovieRowCard';
