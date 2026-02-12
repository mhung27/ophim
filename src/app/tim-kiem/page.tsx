
import { searchMovies } from '@/lib/api';
import { MovieCard } from '@/components/movie-card';
import { Metadata } from 'next';
import { Pagination } from '@/components/pagination';
import { SiteFooter } from '@/components/site-footer';

interface PageProps {
    searchParams: Promise<{ keyword: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const { keyword } = await searchParams;
    return {
        title: `Tìm kiếm: ${keyword || ''} - moiPhim`,
    };
}

export default async function SearchPage({ searchParams }: PageProps) {
    const { keyword, page } = await searchParams;
    const currentPage = Number(page) || 1;

    if (!keyword) {
        return <div className="text-center py-10">Vui lòng nhập từ khóa tìm kiếm</div>;
    }

    const data = await searchMovies(keyword, currentPage);
    const movies = data.items || [];
    const totalItems = data.pagination?.totalItems || 0;
    const totalPages = Math.ceil(totalItems / (data.pagination?.totalItemsPerPage || 24)); // Calculate total pages if not provided directly

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow container mx-auto px-4 py-8 space-y-8 min-h-[60vh]">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white">Kết quả tìm kiếm cho &quot;{keyword}&quot;</h1>
                    <p className="text-white/40 text-sm">
                        Tìm thấy {totalItems} kết quả
                    </p>
                </div>

                {movies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="text-white/20 text-6xl">🔍</div>
                        <div className="text-white/50 text-xl font-medium">Không tìm thấy phim nào.</div>
                        <p className="text-white/30 text-sm max-w-md text-center">
                            Chúng tôi không tìm thấy kết quả phù hợp với &quot;{keyword}&quot;. Vui lòng thử lại với từ khóa khác.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                            {movies.map((movie) => (
                                <MovieCard key={movie._id} movie={movie} />
                            ))}
                        </div>

                        <div className="mt-12">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                baseUrl="/tim-kiem"
                                searchParams={{ keyword }}
                            />
                        </div>
                    </>
                )}
            </div>

            <SiteFooter />
        </div>
    );
}
