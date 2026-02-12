
import { fetchMovieDetails, fetchMoviePeoples, fetchMovieKeywords, fetchMovieImages } from '@/lib/api';
import { MovieDetailsHero } from '@/components/movie-details-hero';
import { MovieDetailsInfo } from '@/components/movie-details-info';
import { SiteFooter } from '@/components/site-footer';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function MovieDetailsPage({ params }: PageProps) {
    const { slug } = await params;

    // Fetch all data in parallel to reduce load time
    const [data, peoplesData, keywordsData, imagesData] = await Promise.all([
        fetchMovieDetails(slug),
        fetchMoviePeoples(slug).catch(() => ({ success: false, data: { peoples: [] } } as any)),
        fetchMovieKeywords(slug).catch(() => ({ success: false, data: { keywords: [] } })),
        fetchMovieImages(slug).catch(() => ({ success: false, data: { images: [] } }))
    ]);

    // Checks if status is explicitly false
    if (data.status === false || !data.movie) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#101010]">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-white/50">Không tìm thấy phim</h1>
                    <p className="text-white/30">Vui lòng thử lại sau</p>
                </div>
            </div>
        );
    }

    const movie = data.movie;
    const cast = peoplesData.success ? peoplesData.data.peoples : [];
    const keywords = keywordsData.success ? keywordsData.data.keywords : [];
    const images = imagesData.success ? imagesData.data.images : [];

    return (
        <div className="bg-[#101010] min-h-screen">
            {/* Apple TV+ Style Hero */}
            <MovieDetailsHero movie={movie} />

            {/* Content & Cast Section */}
            <MovieDetailsInfo
                content={movie.content}
                cast={cast}
                director={movie.director}
                images={images}
                keywords={keywords}
                movie={movie}
            />

            {/* Spacer for bottom */}
            <div className="h-20" />
            <SiteFooter/>
        </div>
    );
}
