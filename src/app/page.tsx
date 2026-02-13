
import { fetchMoviesByType } from '@/lib/api';
import { MovieCard } from '@/components/movie-card';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { Pagination } from '@/components/pagination';

interface PageProps {
    params: Promise<{ type: string }>;
    searchParams: Promise<{ page?: string }>;
}

const TYPE_MAP: Record<string, string> = {
    'phim-le': 'Phim Lẻ',
    'phim-bo': 'Phim Bộ',
    'hoat-hinh': 'Hoạt Hình',
    'tv-shows': 'TV Shows',
    'phim-moi-cap-nhat': 'Phim Mới Cập Nhật',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { type } = await params;
    const title = TYPE_MAP[type] || type;
    return {
        title: `${title} - vmhPhim`,
    };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
    const { type } = await params;
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;
    const title = TYPE_MAP[type];

    // If type is not in our map (and not a valid API endpoint), we might 404
    // But the API supports many types, so we can try fetching.

    let data;
    try {
        if (type === 'phim-moi-cap-nhat') {
            // Special case as the endpoint differs slightly in our helper, 
            // or we can just reuse fetchNewlyUpdatedMovies
            const { fetchNewlyUpdatedMovies } = await import('@/lib/api');
            data = await fetchNewlyUpdatedMovies(currentPage);
        } else {
            data = await fetchMoviesByType(type, currentPage);
        }
    } catch (error) {
        console.error(error);
        notFound();
    }

    const movies = data.items;
    const { totalPages } = data.pagination || { totalPages: 1 };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white capitalize">{title || type.replace(/-/g, ' ')}</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                {movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </div>

            {/* Pagination */}
            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={`/danh-sach/${type}`}
            />
            <div className="-mx-4 md:-mx-8 mt-12">
                <SiteFooter />
            </div>
        </div>
    );
}
