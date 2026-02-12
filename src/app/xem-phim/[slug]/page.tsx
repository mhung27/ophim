
import { fetchMovieDetails } from '@/lib/api';
import { NetflixPlayer } from '@/components/netflix-player';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const data = await fetchMovieDetails(slug);

    return {
        title: data.movie ? `Đang xem: ${data.movie.name} - MOIPHIM` : 'Xem Phim - MOIPHIM',
    };
}

export default async function WatchMoviePage({ params }: PageProps) {
    const { slug } = await params;

    // Fetch movie data
    const data = await fetchMovieDetails(slug);

    if (data.status === false || !data.movie) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-white/50">Không tìm thấy phim</h1>
                </div>
            </div>
        );
    }

    return (
        <div id="watch-movie-page" className="bg-black min-h-screen">
            <NetflixPlayer movie={data.movie} />
        </div>
    );
}
