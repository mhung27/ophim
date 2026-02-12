
import { fetchMoviesByType } from '@/lib/api';
import { TVShowsHighlight } from '@/components/tv-shows-highlight';

interface TVShowsSectionProps {
    limit?: number;
}

export async function TVShowsSection({ limit = 12 }: TVShowsSectionProps) {
    const { items } = await fetchMoviesByType('tv-shows', 1, limit);

    if (!items || items.length === 0) return null;

    return (
        <TVShowsHighlight
            title="TV Shows Truyền Hình"
            movies={items}
            href="/danh-sach/tv-shows"
        />
    );
}
