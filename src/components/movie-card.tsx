
import Link from 'next/link';
import Image from 'next/image';
import { MovieItem } from '@/types';
import { getImageUrl } from '@/lib/api';

interface MovieCardProps {
    movie: MovieItem;
}

export function MovieCard({ movie }: MovieCardProps) {
    return (
        <Link href={`/phim/${movie.slug}`} className="group">
            <div className="relative overflow-hidden rounded-xl bg-white/[0.03] border border-white/[0.06] transition-all duration-300 hover:scale-[1.03] hover:z-10 hover:shadow-xl hover:shadow-black/40 hover:border-white/10 card-glow">
                <div className="aspect-[2/3] relative">
                    <Image
                        src={getImageUrl(movie.thumb_url)}
                        alt={movie.name}
                        fill
                        className="object-cover transition-all duration-500 group-hover:brightness-75"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-white font-bold text-sm line-clamp-2">{movie.name}</h3>
                        <p className="text-white/60 text-xs mt-1">{movie.origin_name}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80">{movie.year}</span>
                            {movie.tmdb?.vote_average > 0 && (
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-sm text-amber-300 font-semibold">
                                    ★ {movie.tmdb.vote_average.toFixed(1)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-2.5 px-0.5">
                <h3 className="font-medium text-sm line-clamp-1 text-white/90 group-hover:text-white transition-colors">{movie.name}</h3>
                <p className="text-white/40 text-xs line-clamp-1 mt-0.5">{movie.origin_name} ({movie.year})</p>
            </div>
        </Link>
    );
}
