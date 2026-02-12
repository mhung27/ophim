
import { MovieListResponse } from '@/types';
import { MovieRow } from '@/components/movie-row';

interface MovieSectionProps {
    title: string;
    promise: Promise<MovieListResponse>;
    href?: string;
}

export async function MovieSection({ title, promise, href }: MovieSectionProps) {
    const data = await promise;

    return (
        <MovieRow
            title={title}
            movies={data.items || []}
            href={href}
        />
    );
}
