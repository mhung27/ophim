"use client"

import { useState } from 'react';
import { VideoPlayer } from '@/components/video-player';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MovieDetails } from '@/types';
import { getImageUrl } from '@/lib/api';

interface MoviePlayerSectionProps {
    movie: MovieDetails;
}

export function MoviePlayerSection({ movie }: MoviePlayerSectionProps) {
    const [currentServerIndex, setCurrentServerIndex] = useState(0);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

    // If no episodes, return null or message
    if (!movie.episodes || movie.episodes.length === 0) {
        return <div className="p-10 text-center text-white/50 rounded-2xl bg-white/[0.03] border border-white/[0.06]">Chưa có tập phim nào.</div>;
    }

    const currentServer = movie.episodes[currentServerIndex];
    const currentEpisode = currentServer?.server_data[currentEpisodeIndex];

    if (!currentEpisode) return null;

    return (
        <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-black aspect-video shadow-2xl shadow-black/50">
                <VideoPlayer
                    key={currentEpisode.link_m3u8} // Force remount on change
                    src={currentEpisode.link_m3u8}
                    poster={getImageUrl(movie.poster_url)}
                    title={`${movie.name} - ${currentEpisode.name}`}
                />
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
                <div className="mb-5">
                    <h3 className="font-semibold mb-3 text-white/80 text-sm">Chọn Server</h3>
                    <div className="flex flex-wrap gap-2">
                        {movie.episodes.map((server, idx) => (
                            <button
                                key={server.server_name}
                                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${currentServerIndex === idx
                                        ? 'bg-white text-black shadow-lg shadow-white/10'
                                        : 'bg-white/[0.06] text-white/60 hover:bg-white/10 hover:text-white/80 border border-white/[0.06]'
                                    }`}
                                onClick={() => {
                                    setCurrentServerIndex(idx);
                                    setCurrentEpisodeIndex(0);
                                }}
                            >
                                {server.server_name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-3 text-white/80 text-sm">Danh sách tập</h3>
                    <ScrollArea className="h-[200px] w-full rounded-xl bg-white/[0.02] border border-white/[0.04] p-3">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                            {currentServer.server_data.map((ep, idx) => (
                                <button
                                    key={ep.filename}
                                    className={`px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${currentEpisodeIndex === idx
                                            ? 'bg-white text-black shadow-lg shadow-white/10'
                                            : 'text-white/50 hover:bg-white/[0.06] hover:text-white/80'
                                        }`}
                                    onClick={() => setCurrentEpisodeIndex(idx)}
                                >
                                    {ep.name}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
