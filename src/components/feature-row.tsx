"use client"

import { useRef, useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { MovieItem } from '@/types';
import { ChevronRight, Play } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/api';

interface FeatureRowProps {
    title: string;
    description?: string;
    movies: MovieItem[];
    href: string;
    color?: 'blue' | 'purple' | 'emerald' | 'rose' | 'amber';
}

export function FeatureRow({ title, description, movies, href, color = 'blue' }: FeatureRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);

    const getGradient = () => {
        switch (color) {
            case 'purple': return 'from-purple-900/20 via-slate-900/50 to-transparent border-purple-500/10';
            case 'emerald': return 'from-emerald-900/20 via-slate-900/50 to-transparent border-emerald-500/10';
            case 'rose': return 'from-rose-900/20 via-slate-900/50 to-transparent border-rose-500/10';
            case 'amber': return 'from-amber-900/20 via-slate-900/50 to-transparent border-amber-500/10';
            default: return 'from-blue-900/20 via-slate-900/50 to-transparent border-blue-500/10';
        }
    };

    const getTitleColor = () => {
        switch (color) {
            case 'purple': return 'text-purple-400';
            case 'emerald': return 'text-emerald-400';
            case 'rose': return 'text-rose-400';
            case 'amber': return 'text-amber-400';
            default: return 'text-blue-400';
        }
    };

    return (
        <section className={`relative rounded-3xl overflow-hidden border ${getGradient()} bg-gradient-to-r`}>
            {/* Background Glow */}
            <div className={`absolute top-0 left-0 w-1/3 h-full bg-${color}-500/5 blur-3xl -z-10`} />

            <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 items-start md:items-center">
                {/* Left Header */}
                <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                            {title.split(' ').map((word, i) => (
                                <span key={i} className={i === 1 ? getTitleColor() : 'text-white'}>
                                    {word} {' '}
                                </span>
                            ))}
                        </h2>
                        {description && (
                            <p className="text-white/40 text-sm mt-2 font-medium">{description}</p>
                        )}
                    </div>

                    <Link
                        href={href}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors group/btn mt-2 md:mt-4"
                    >
                        Xem toàn bộ
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>

                {/* Right Scrollable List */}
                <div className="flex-1 w-full overflow-hidden">
                    <div
                        ref={rowRef}
                        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mr-4 md:-mr-8 pr-4 md:pr-8"
                    >
                        {movies.map((movie) => (
                            <FeatureRowCard key={movie._id} movie={movie} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

const FeatureRowCard = memo(({ movie }: { movie: MovieItem }) => {
    return (
        <Link
            href={`/phim/${movie.slug}`}
            className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[260px] group/card"
        >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06] transition-all duration-300 group-hover/card:shadow-xl group-hover/card:shadow-black/40 group-hover/card:border-white/10">
                <Image
                    src={getImageUrl(movie.poster_url)}
                    alt={movie.name}
                    fill
                    className="object-cover transition-all duration-500 group-hover/card:scale-105 group-hover/card:brightness-[0.7] transform-gpu"
                    sizes="260px"
                    loading="lazy"
                    onError={(e) => {
                        // Fallback to thumb_url if poster fails or is missing
                        // This handles cases where poster_url might be empty or broken
                        const target = e.target as HTMLImageElement;
                        target.srcset = getImageUrl(movie.thumb_url);
                        target.src = getImageUrl(movie.thumb_url);
                    }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex flex-col justify-end p-3.5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-transform group-hover/card:scale-110">
                            <Play className="h-4 w-4 text-white fill-white" />
                        </div>
                    </div>
                </div>

                {/* Quality/Year badges */}
                <div className="absolute top-2 left-2 flex gap-1.5">
                    {movie.year && (
                        <span className="text-[10px] bg-black/60 backdrop-blur-md text-white/90 px-2 py-0.5 rounded-md font-medium">
                            {movie.year}
                        </span>
                    )}
                    <span className="text-[10px] bg-primary/80 backdrop-blur-md text-black/70 px-2 py-0.5 rounded-md font-bold uppercase">
                        {movie.quality || 'HD'}
                    </span>
                </div>
            </div>

            {/* Title below */}
            <div className="mt-2.5 px-0.5">
                <h3 className="font-bold text-sm line-clamp-1 text-white/90 group-hover/card:text-white transition-colors">
                    {movie.name}
                </h3>
                <p className="text-white/40 text-xs line-clamp-1 mt-0.5">
                    {movie.origin_name}
                </p>
            </div>
        </Link>
    );
});

FeatureRowCard.displayName = 'FeatureRowCard';
