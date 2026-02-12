"use client"

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { Skeleton } from "@/components/ui/skeleton"

// ReactPlayer needs to be dynamically imported to avoid hydration mismatch
const ReactPlayer = dynamic(() => import('react-player'), {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full aspect-video rounded-lg" />
}) as any;

interface VideoPlayerProps {
    src: string;
    poster?: string;
    title?: string;
}

export function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
    const [hasWindow, setHasWindow] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setHasWindow(true);
        }
    }, []);

    if (!hasWindow) {
        return <Skeleton className="w-full h-full aspect-video rounded-lg bg-black" />;
    }

    return (
        <div className="relative w-full aspect-video overflow-hidden bg-black rounded-lg">
            <ReactPlayer
                url={src}
                controls
                width="100%"
                height="100%"
                light={poster} // Show poster before playing
                playing={true} // Auto play after clicking poster
                config={{
                    file: {
                        attributes: {
                            crossOrigin: 'true',
                        },
                        // Force HLS for m3u8
                        forceHLS: src.endsWith('.m3u8'),
                    }
                }}
            />
        </div>
    );
}
