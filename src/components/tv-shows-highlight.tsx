"use client"

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MovieItem } from '@/types';
import { getImageUrl } from '@/lib/api';
import { Play, Info, ChevronRight, Star, Calendar, Layers } from 'lucide-react';

interface TVShowsHighlightProps {
    title: string;
    movies: MovieItem[];
    href: string;
}

export function TVShowsHighlight({ title, movies, href }: TVShowsHighlightProps) {
    const [selectedMovie, setSelectedMovie] = useState<MovieItem>(movies[0]);
    const [isAnimating, setIsAnimating] = useState(false);
    const rowRef = useRef<HTMLDivElement>(null);

    const handleSelectMovie = (movie: MovieItem) => {
        if (selectedMovie._id === movie._id) return;
        setIsAnimating(true);
        setTimeout(() => {
            setSelectedMovie(movie);
            setIsAnimating(false);
        }, 300);
    };

    if (!movies || movies.length === 0) return null;

    return (
        <section className="w-full my-12 flex flex-col gap-6 group/tv-highlight">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">{title}</h2>
                <Link href={href} className="text-sm text-white/50 hover:text-white transition-colors duration-200 flex items-center gap-1 group/link">
                    Xem tất cả <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5" />
                </Link>
            </div>

            <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900/50 border border-white/5 shadow-2xl shadow-black/50">
                {/* Featured Area */}
                <div className="relative w-full aspect-[3/4] md:aspect-[21/9] lg:aspect-[2.5/1] overflow-hidden">
                    {/* Background Image */}
                    <div className={`absolute inset-0 transition-opacity duration-500 transform-gpu ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                        <Image
                            src={getImageUrl(selectedMovie.poster_url)}
                            alt={selectedMovie.name}
                            fill
                            className="object-cover"
                            priority
                            key={selectedMovie._id}
                        />
                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className={`absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-16 z-10 transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                        <div className="max-w-2xl mt-8 md:mt-0">
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2 drop-shadow-lg">
                                {selectedMovie.name}
                            </h3>
                            <p className="text-lg text-white/80 font-medium mb-4 drop-shadow-md line-clamp-2 md:line-clamp-none">{selectedMovie.origin_name}</p>

                            {/* Meta Tags */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                {selectedMovie.tmdb?.vote_average > 0 && (
                                    <div className="flex items-center gap-1 bg-amber-500/90 text-black px-2 py-0.5 rounded-md shadow-lg shadow-amber-500/20">
                                        <Star className="w-3 h-3 fill-black" />
                                        <span className="text-xs font-bold">IMDb {selectedMovie.tmdb.vote_average.toFixed(1)}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-md">
                                    <Calendar className="w-3 h-3 text-white" />
                                    <span className="text-xs font-bold text-white">{selectedMovie.year}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-md">
                                    <Layers className="w-3 h-3 text-white" />
                                    <span className="text-xs font-bold text-white">{selectedMovie.episode_current || 'Tập ?'}</span>
                                </div>
                                {/* {selectedMovie.quality && (
                                    <span className="text-xs font-bold text-white bg-primary px-2 py-0.5 rounded-md uppercase shadow-lg shadow-primary/20">
                                        {selectedMovie.quality}
                                    </span>
                                )} */}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/xem-phim/${selectedMovie.slug}`}
                                    className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-primary/20"
                                >
                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                </Link>
                                <Link
                                    href={`/phim/${selectedMovie.slug}`}
                                    className="h-12 w-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10"
                                >
                                    <Info className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* List Selection */}
                <div className="relative -mt-16 md:-mt-20 lg:-mt-24 z-20 pb-6">
                    <div
                        ref={rowRef}
                        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 pt-4 px-6 mask-linear-fade"
                    >
                        {movies.map((movie) => (
                            <div
                                key={movie._id}
                                onClick={() => handleSelectMovie(movie)}
                                className={`flex-shrink-0 cursor-pointer transition-all duration-300 transform-gpu rounded-lg ${selectedMovie._id === movie._id ? 'scale-110 ring-2 ring-primary z-10 shadow-xl shadow-black/50' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                            >
                                <div className="w-[100px] md:w-[120px] aspect-[2/3] rounded-lg overflow-hidden relative shadow-lg bg-black/40">
                                    <Image
                                        src={getImageUrl(movie.thumb_url)}
                                        alt={movie.name}
                                        fill
                                        className="object-cover"
                                        sizes="120px"
                                    />
                                    {selectedMovie._id === movie._id && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent border-2 border-white/20 rounded-lg" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
