
import { MovieListResponse } from '@/types';
import { HeroCarousel } from '@/components/hero-carousel';
import { MovieItem } from '@/types';

interface HeroSectionProps {
    data: MovieListResponse;
}

export function HeroSection({ data }: HeroSectionProps) {
    // Pick top 5 featured movies for the carousel (highest rated from new movies)
    const featuredMovies = (data.items || [])
        .filter((m: MovieItem) => m.poster_url || m.thumb_url)
        .sort((a: MovieItem, b: MovieItem) => (b.tmdb?.vote_average || 0) - (a.tmdb?.vote_average || 0))
        .slice(0, 8);

    if (featuredMovies.length === 0) return null;

    return (
        <section className="relative w-full">
            {/* Top-down shadow for navigation visibility */}
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black via-black/40 to-transparent z-40 pointer-events-none" />
            <HeroCarousel movies={featuredMovies} autoPlayInterval={6000} />
        </section>
    );
}
