"use client"

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GenreRowProps {
    genres: Category[];
}

export function GenreRow({ genres }: GenreRowProps) {
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
        const scrollAmount = rowRef.current.clientWidth * 0.5;
        rowRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="relative group/row">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4 px-1">Xem theo thể loại</h2>

            <div className="relative -mx-4 md:-mx-8">
                {/* Left Indicators */}
                <div className={`absolute left-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-r from-background via-background/80 to-transparent transition-opacity duration-300 pointer-events-none ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
                <button
                    onClick={() => scroll('left')}
                    className={`absolute left-0 top-0 bottom-0 z-30 w-12 flex items-center justify-center transition-all duration-300 ${canScrollLeft ? 'opacity-0 group-hover/row:opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <ChevronLeft className="h-6 w-6 text-white" />
                </button>

                {/* Right Indicators */}
                <div className={`absolute right-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-l from-background via-background/80 to-transparent transition-opacity duration-300 pointer-events-none ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />
                <button
                    onClick={() => scroll('right')}
                    className={`absolute right-0 top-0 bottom-0 z-30 w-12 flex items-center justify-center transition-all duration-300 ${canScrollRight ? 'opacity-0 group-hover/row:opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <ChevronRight className="h-6 w-6 text-white" />
                </button>

                <div
                    ref={rowRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 scroll-smooth pb-4"
                >
                    <div ref={leftSentinelRef} className="w-1 h-1 flex-shrink-0 pointer-events-none" />
                    {genres.map((genre, index) => (
                        <Link
                            key={genre._id}
                            href={`/the-loai/${genre.slug}`}
                            className={`flex-shrink-0 w-36 h-20 md:w-48 md:h-24 rounded-xl flex items-center justify-center text-center p-2 relative overflow-hidden group/card transition-all duration-300 hover:scale-105 transform-gpu border border-white/10 ${index % 3 === 0 ? 'bg-gradient-to-br from-blue-900/40 to-slate-900/40' :
                                index % 3 === 1 ? 'bg-gradient-to-br from-purple-900/40 to-slate-900/40' :
                                    'bg-gradient-to-br from-emerald-900/40 to-slate-900/40'
                                }`}
                        >
                            <div className="absolute inset-0 bg-white/0 group-hover/card:bg-white/10 transition-colors duration-300" />
                            <span className="relative z-10 font-bold text-white/90 group-hover/card:text-white transition-colors text-sm md:text-base">
                                {genre.name}
                            </span>
                        </Link>
                    ))}
                    <div ref={rightSentinelRef} className="w-1 h-1 flex-shrink-0 pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
