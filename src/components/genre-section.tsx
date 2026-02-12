
import { fetchGenres } from '@/lib/api';
import { GenreRow } from '@/components/genre-row';

export async function GenreSection() {
    const { items } = await fetchGenres();

    if (!items || items.length === 0) return null;

    // Take top 12 genres
    const featuredGenres = items.slice(0, 12);

    return <GenreRow genres={featuredGenres} />;
}
