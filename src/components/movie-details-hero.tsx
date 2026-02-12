'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Plus, Check, Info } from 'lucide-react';
import { MovieDetails } from '@/types';
import { getImageUrl } from '@/lib/api';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

function getYouTubeEmbedUrl(url: string) {
    if (!url) return '';
    let videoId = '';

    if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('embed/')) {
        videoId = url.split('embed/')[1].split('?')[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
}

interface MovieDetailsHeroProps {
    movie: MovieDetails;
}

export function MovieDetailsHero({ movie }: MovieDetailsHeroProps) {
    const [isAdded, setIsAdded] = useState(false);

    // Apple TV+ style metadata icons/badges
    const metadata = [
        movie.category?.[0]?.name,
        movie.year,
        // movie.time,
        movie.quality,
        movie.lang,
    ].filter(Boolean);

    return (
        <div id="movie-details-hero" className="relative w-full min-h-0 md:min-h-[85vh] flex flex-col justify-end pb-12 overflow-hidden">
            {/* Backdrop Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={getImageUrl(movie.poster_url || movie.thumb_url)}
                    alt={movie.name}
                    fill
                    className="object-cover object-top"
                    priority
                />
                {/* Complex Overlays for Apple TV+ feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#101010]/80 via-transparent to-transparent" />
                {/* Enhanced top-down shadow for navigation visibility */}
                <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black via-black/40 to-transparent z-10" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 pt-80 md:pt-32">
                <div className="max-w-4xl md:space-y-8">
                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.3] py-2 text-white md:mb-3 line-clamp-4 text-balance">
                        {movie.name}
                    </h1>
                    {movie.origin_name && (
                        <p className="text-lg md:text-xl text-white/60 font-medium tracking-wide drop-shadow-md">
                            {movie.origin_name}
                        </p>
                    )}


                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                        {(() => {
                            const hasEpisodes = movie.episodes && movie.episodes.length > 0;
                            const hasLinks = hasEpisodes && movie.episodes[0].server_data?.some(item => item.link_m3u8 || item.link_embed);
                            const isTrailer = movie.episode_current?.toLowerCase() === 'trailer';
                            const isUpdating = movie.episode_current?.toLowerCase() === 'đang cập nhật';

                            if (hasLinks && !isTrailer && !isUpdating) {
                                return (
                                    <Link
                                        href={`/xem-phim/${movie.slug}`}
                                        className="flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-xl w-full md:w-auto text-sm md:text-base"
                                    >
                                        <Play className="w-5 h-5 fill-current" />
                                        <span>Xem ngay</span>
                                    </Link>
                                );
                            }
                            return null;
                        })()}

                        {movie.trailer_url && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button
                                        className="flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 shadow-xl w-full md:w-auto text-sm md:text-base"
                                    >
                                        <Play className="w-5 h-5" />
                                        <span>Trailer</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-4xl p-0 border-none bg-black/90 overflow-hidden aspect-video">
                                    <DialogTitle className="sr-only">Trailer phim: {movie.name}</DialogTitle>
                                    <DialogDescription className="sr-only">
                                        Xem trailer cho phim {movie.name} ({movie.origin_name})
                                    </DialogDescription>
                                    <iframe
                                        className="w-full h-full"
                                        src={getYouTubeEmbedUrl(movie.trailer_url)}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </DialogContent>
                            </Dialog>
                        )}

                        <button
                            onClick={() => setIsAdded(!isAdded)}
                            className="flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 shadow-xl w-full md:w-auto text-sm md:text-base"
                        >
                            {isAdded ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    <span>Đã thêm</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    <span>Thêm vào danh sách</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Description & Bottom Metadata Segment */}
                    <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/10">
                        <div className="md:col-span-2 space-y-4">
                            <div
                                className="text-lg text-white/80 leading-relaxed font-medium line-clamp-3 md:line-clamp-4 drop-shadow"
                                dangerouslySetInnerHTML={{ __html: movie.content }}
                            />

                            <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-white/50 tracking-widest uppercase">
                                {metadata.map((item, i) => (
                                    <span key={i} className="flex items-center">
                                        {item}
                                        {i < metadata.length - 1 && <span className="mx-3 opacity-30">•</span>}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Side details (Status/Director/Country/Scores) */}
                        <div className="block space-y-6 text-sm tabular-nums border-t border-white/5 pt-8 md:border-t-0 md:pt-0">
                            <div className="grid grid-cols-2 gap-4">
                                {movie.episode_current && (
                                    <div>
                                        <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px] font-bold">Tình trạng</span>
                                        <span className="text-white font-semibold text-base">
                                            {movie.episode_current.includes('Tập') ? movie.episode_current : `${movie.episode_current}`}
                                        </span>
                                    </div>
                                )}
                                {(movie.imdb?.vote_average > 0 || movie.tmdb?.vote_average > 0) && (
                                    <div>
                                        <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px] font-bold">Đánh giá</span>
                                        <div className="flex flex-col gap-2">
                                            {movie.imdb?.vote_average > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-[#f5c518] text-black text-[9px] font-black px-1 py-0.5 rounded-[2px] tracking-tight">IMDb</span>
                                                    <span className="text-white font-bold text-sm">{movie.imdb.vote_average.toFixed(1)}</span>
                                                </div>
                                            )}
                                            {movie.tmdb?.vote_average > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white/80 text-[9px] font-black tracking-widest border border-white/20 px-1.5 py-0.5 rounded-[2px] uppercase">TMDB</span>
                                                    <span className="text-white font-bold text-sm">{(movie.tmdb.vote_average * 10).toFixed(0)}%</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 border-t border-white/5 pt-4">
                                {movie.director && movie.director.length > 0 && (
                                    <div>
                                        <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px] font-bold">Đạo diễn</span>
                                        <span className="text-white/90 font-medium leading-relaxed">{movie.director.join(', ')}</span>
                                    </div>
                                )}
                                {movie.country && movie.country.length > 0 && (
                                    <div>
                                        <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px] font-bold">Quốc gia</span>
                                        <span className="text-white/90 font-medium leading-relaxed">
                                            {movie.country.map(c => c.name).join(', ')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
