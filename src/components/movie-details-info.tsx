'use client';

import Image from 'next/image';
import { CastMember, ImageItem } from '@/types';
import { getImageUrl } from '@/lib/api';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { MovieDetails } from '@/types';

interface MovieDetailsInfoProps {
    content: string;
    cast?: CastMember[];
    director?: string[];
    images?: ImageItem[];
    keywords?: { name: string; slug: string }[];
    movie?: MovieDetails;
}

export function MovieDetailsInfo({ content, cast, director, images, keywords, movie }: MovieDetailsInfoProps) {
    const backdrops = images?.filter(img => img.type === 'backdrop') || [];

    return (
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-10 md:py-20 space-y-12 md:space-y-24">

            {/* Mobile-only Description & Metadata */}
            <div className="block md:hidden space-y-6">
                {movie && (
                    <>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-white/50 tracking-widest uppercase">
                            {[
                                movie.category?.[0]?.name,
                                movie.year,
                                // movie.time,
                                movie.quality,
                                movie.lang,
                            ].filter(Boolean).map((item, i, arr) => (
                                <span key={i} className="flex items-center">
                                    {item}
                                    {i < arr.length - 1 && <span className="mx-3 opacity-30">•</span>}
                                </span>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {movie.episode_current && (
                                <div>
                                    <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px] font-bold">Tình trạng</span>
                                    <span className="text-white font-semibold">
                                        {movie.episode_current.includes('Tập') ? movie.episode_current : `${movie.episode_current}`}
                                    </span>
                                </div>
                            )}
                            {(movie.imdb?.vote_average > 0 || movie.tmdb?.vote_average > 0) && (
                                <div>
                                    <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px] font-bold">Đánh giá</span>
                                    <div className="flex items-center gap-3">
                                        {movie.imdb?.vote_average > 0 && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="bg-[#f5c518] text-black text-[9px] font-black px-1 py-0.5 rounded-[2px] tracking-tight">IMDb</span>
                                                <span className="text-white font-bold">{movie.imdb.vote_average.toFixed(1)}</span>
                                            </div>
                                        )}
                                        {movie.tmdb?.vote_average > 0 && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-white/80 text-[9px] font-black tracking-widest border border-white/20 px-1.5 py-0.5 rounded-[2px] uppercase">TMDB</span>
                                                <span className="text-white font-bold">{(movie.tmdb.vote_average * 10).toFixed(0)}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div
                            className="text-white/80 leading-relaxed font-medium line-clamp-6 drop-shadow"
                            dangerouslySetInnerHTML={{ __html: movie.content }}
                        />

                        <div className="space-y-4 border-t border-white/5 pt-4">
                            {director && director.length > 0 && (
                                <div>
                                    <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px] font-bold">Đạo diễn</span>
                                    <span className="text-white/90 font-medium leading-relaxed">{director.join(', ')}</span>
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
                    </>
                )}
            </div>

            {/* Gallery Section */}
            {backdrops.length > 0 && (
                <div className="space-y-10">
                    <div className="flex items-end justify-between border-b border-white/10 pb-4">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Thư viện ảnh</h2>
                        <span className="text-white/40 text-sm font-medium uppercase tracking-widest">Gallery</span>
                    </div>

                    <div className="relative px-0 md:px-12">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4">
                                {backdrops.map((img, i) => {
                                    const path = img.file_path.startsWith('/') ? img.file_path : `/${img.file_path}`;
                                    const fullUrl = `https://image.tmdb.org/t/p/original${path}`;
                                    const thumbUrl = `https://image.tmdb.org/t/p/w780${path}`;

                                    return (
                                        <CarouselItem key={i} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 group cursor-pointer">
                                                        <Image
                                                            src={thumbUrl}
                                                            alt="Movie backdrop thumb"
                                                            fill
                                                            unoptimized
                                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-6xl p-0 border-none bg-black/95 overflow-hidden aspect-video">
                                                    <DialogTitle className="sr-only">Xem ảnh từ thư viện</DialogTitle>
                                                    <DialogDescription className="sr-only">Ảnh chất lượng cao từ phim</DialogDescription>
                                                    <div className="relative w-full h-full flex items-center justify-center">
                                                        <Image
                                                            src={fullUrl}
                                                            alt="Movie backdrop full"
                                                            fill
                                                            unoptimized
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </CarouselItem>
                                    );
                                })}
                            </CarouselContent>
                            <CarouselPrevious className="-left-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white hidden md:flex" />
                            <CarouselNext className="-right-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white hidden md:flex" />
                        </Carousel>
                    </div>
                </div>
            )}
            {/* Cast / Starring Section */}
            {cast && cast.length > 0 && (
                <div className="space-y-10">
                    <div className="flex items-end justify-between border-b border-white/10 pb-4">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Diễn viên chính</h2>
                        <span className="text-white/40 text-sm font-medium uppercase tracking-widest">Starring</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 md:gap-6">
                        {cast.slice(0, 12).map((member) => (
                            <div key={member.tmdb_people_id} className="group cursor-pointer">
                                <div className="relative aspect-square overflow-hidden rounded-full border-2 border-transparent group-hover:border-white/20 transition-all duration-500 mb-4 bg-white/5">
                                    {member.profile_path ? (
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w300${member.profile_path}`}
                                            alt={member.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-white/20 font-bold text-2xl uppercase">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="text-center space-y-1">
                                    <h3 className="text-white font-bold text-[10px] md:text-xs tracking-wide group-hover:text-white transition-colors line-clamp-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-white/40 text-[9px] md:text-[10px] font-medium line-clamp-1 italic">
                                        {member.character}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}



            {/* About / Full Description */}
            {/* <div className="max-w-4xl space-y-10">
                <div className="flex items-end justify-between border-b border-white/10 pb-4">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Chi tiết phim</h2>
                    <span className="text-white/40 text-sm font-medium uppercase tracking-widest">About</span>
                </div>

                <div className="space-y-12">
                    <div
                        className="text-white/60 text-lg leading-relaxed font-light"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-4">
                        {director && director.length > 0 && (
                            <div>
                                <h4 className="text-white/30 text-xs font-black uppercase tracking-[0.2em] mb-4">Đạo diễn</h4>
                                <p className="text-white font-medium text-lg">{director.join(', ')}</p>
                            </div>
                        )}
                        {keywords && keywords.length > 0 && (
                            <div>
                                <h4 className="text-white/30 text-xs font-black uppercase tracking-[0.2em] mb-4">Từ khóa</h4>
                                <div className="flex flex-wrap gap-2">
                                    {keywords.map((kw, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/50 hover:text-white/80 hover:bg-white/10 transition-all cursor-pointer">
                                            #{kw.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div> */}
        </section>
    );
}
