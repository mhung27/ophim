import Link from 'next/link';
import Image from 'next/image';
import { MovieItem } from '@/types';
import { getImageUrl } from '@/lib/api';
import { Play, Info } from 'lucide-react';

interface HeroSpotlightProps {
    movie: MovieItem;
}

export function HeroSpotlight({ movie }: HeroSpotlightProps) {
    return (
        <div id="hero-carousel" className="relative w-full h-[65vh] md:h-[75vh] overflow-hidden">
            {/* Background Image */}
            <Image
                src={getImageUrl(movie.poster_url || movie.thumb_url)}
                alt={movie.name}
                fill
                className="object-cover object-top"
                priority
                sizes="100vw"
            />

            {/* Gradient Overlays - more cinematic */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent h-1/3 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-16 md:bottom-20 left-4 md:left-8 max-w-xl z-10 animate-fade-in">
                {/* Movie Metadata */}
                <div className="flex items-center gap-2.5 mb-4">
                    {movie.tmdb?.vote_average > 0 && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/20 text-amber-300 text-sm font-semibold">
                            ★ {movie.tmdb.vote_average.toFixed(1)} TMDB
                        </span>
                    )}
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/80 text-sm">
                        {movie.year}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 leading-tight drop-shadow-lg">
                    {movie.name}
                </h1>
                <p className="text-base md:text-lg text-white/60 mb-8 drop-shadow">
                    {movie.origin_name}
                </p>

                {/* CTA Buttons */}
                <div className="flex gap-3">
                    {(() => {
                        const status = movie.episode_current?.toLowerCase();
                        if (status !== 'đang cập nhật' && status !== 'trailer') {
                            return (
                                <Link
                                    href={`/phim/${movie.slug}`}
                                    className="inline-flex items-center gap-2 px-7 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 text-sm md:text-base"
                                >
                                    <Play className="h-5 w-5 fill-black" />
                                    Xem ngay
                                </Link>
                            );
                        }
                        return null;
                    })()}
                    <Link
                        href={`/phim/${movie.slug}`}
                        className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 backdrop-blur-md border border-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 text-sm md:text-base"
                    >
                        <Info className="h-5 w-5" />
                        Chi tiết
                    </Link>
                </div>
            </div>
        </div>
    );
}
