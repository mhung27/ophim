import { fetchMoviesByGenre } from '@/lib/api';
import { MovieCard } from '@/components/movie-card';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SiteFooter } from '@/components/site-footer';
import { Pagination } from '@/components/pagination';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Phim ${slug.replace(/-/g, ' ')} - moiPhim`,
    };
}

export default async function GenrePage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;

    let data;
    try {
        data = await fetchMoviesByGenre(slug, currentPage);
    } catch (error) {
        console.error(error);
        notFound();
    }

    const movies = data.items || [];
    const { totalPages } = data.pagination || { totalPages: 1 };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow container mx-auto px-4 py-8 space-y-8 min-h-[60vh]">
                <h1 className="text-3xl font-bold text-white capitalize">Phim {slug.replace(/-/g, ' ')}</h1>

                {movies.length === 0 ? (
                    <div className="text-white/50 text-lg text-center py-20">Hiện tại chưa có phim nào thuộc thể loại này.</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                        {movies.map((movie) => (
                            <MovieCard key={movie._id} movie={movie} />
                        ))}
                    </div>
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl={`/the-loai/${slug}`}
                />
            </div>

            <SiteFooter />
        </div>
    );
}
