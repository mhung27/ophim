
import { fetchMoviesByCountry } from '@/lib/api';
import { FeatureRow } from '@/components/feature-row';

interface CountrySectionProps {
    countrySlug: string;
    title: string;
    color?: 'blue' | 'purple' | 'emerald' | 'rose' | 'amber';
    limit?: number;
}

export async function CountrySection({ countrySlug, title, color, limit = 12 }: CountrySectionProps) {
    const { items } = await fetchMoviesByCountry(countrySlug, 1, limit);

    if (!items || items.length === 0) return null;

    return (
        <FeatureRow
            title={title}
            movies={items}
            href={`/quoc-gia/${countrySlug}`}
            color={color}
        />
    );
}
