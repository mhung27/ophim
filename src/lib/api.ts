import { MovieListResponse, MovieDetailsResponse, MovieItem, Category, MoviePeoplesResponse, MovieKeywordsResponse, MovieImagesResponse } from '@/types';

const API_BASE_URL = 'https://ophim1.com';

export const fetchNewlyUpdatedMovies = async (page: number = 1, limit?: number): Promise<MovieListResponse> => {
    const res = await fetch(`${API_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) throw new Error('Failed to fetch movies');
    const data = await res.json();
    if (limit && data.items) {
        data.items = data.items.slice(0, limit);
    }
    return data;
};

export const fetchHomeMovies = async (limit?: number): Promise<MovieListResponse> => {
    const res = await fetch(`${API_BASE_URL}/v1/api/home`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Failed to fetch home movies');
    const data = await res.json();

    if (data.data) {
        let items = (data.data.items || []).map((item: any) => ({
            ...item,
            thumb_url: item.thumb_url?.startsWith('http') ? item.thumb_url : item.thumb_url,
            poster_url: item.poster_url?.startsWith('http') ? item.poster_url : item.poster_url,
        }));

        if (limit) {
            items = items.slice(0, limit);
        }

        const pagination = data.data.params?.pagination || { totalItems: 0, totalItemsPerPage: 24, currentPage: 1, totalPages: 1 };
        if (pagination.totalItems && pagination.totalItemsPerPage && !pagination.totalPages) {
            pagination.totalPages = Math.ceil(pagination.totalItems / pagination.totalItemsPerPage);
        }

        return {
            status: data.status === 'success',
            items,
            pathImage: data.data.APP_DOMAIN_CDN_IMAGE ? `${data.data.APP_DOMAIN_CDN_IMAGE}/uploads/movies/` : 'https://img.ophim.live/uploads/movies/',
            pagination,
        };
    }
    return data;
};

export const fetchMovieDetails = async (slug: string): Promise<MovieDetailsResponse> => {
    const res = await fetch(`${API_BASE_URL}/phim/${slug}`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Failed to fetch movie details');
    const data = await res.json();

    // Normalizing data for consistent usage in components
    // Case 1: /phim/slug endpoint (returns movie and episodes separate)
    if (data.movie && data.episodes && !data.movie.episodes) {
        data.movie.episodes = data.episodes;
    }

    // Case 2: /v1/api/phim/slug endpoint (returns data.item with episodes inside)
    if (data.data?.item) {
        return {
            status: data.status === 'success' || data.status === true,
            msg: data.message || '',
            movie: data.data.item,
            episodes: data.data.item.episodes
        } as unknown as MovieDetailsResponse;
    }

    return data;
};

export const searchMovies = async (keyword: string, page: number = 1, limit?: number): Promise<MovieListResponse> => {
    const res = await fetch(`${API_BASE_URL}/v1/api/tim-kiem?keyword=${keyword}&page=${page}`, {
        cache: 'no-store', // Always fresh for search
    });
    if (!res.ok) throw new Error('Failed to search movies');
    const data = await res.json();

    if (data.data) {
        let items = (data.data.items || []).map((item: any) => ({
            ...item,
            thumb_url: item.thumb_url?.startsWith('http') ? item.thumb_url : item.thumb_url,
            poster_url: item.poster_url?.startsWith('http') ? item.poster_url : item.poster_url,
        }));

        if (limit) {
            items = items.slice(0, limit);
        }

        const pagination = data.data.params?.pagination || { totalItems: 0, totalItemsPerPage: 24, currentPage: 1, totalPages: 1 };
        if (pagination.totalItems && pagination.totalItemsPerPage && !pagination.totalPages) {
            pagination.totalPages = Math.ceil(pagination.totalItems / pagination.totalItemsPerPage);
        }

        return {
            status: data.status === 'success',
            items,
            pathImage: data.data.APP_DOMAIN_CDN_IMAGE ? `${data.data.APP_DOMAIN_CDN_IMAGE}/uploads/movies/` : 'https://img.ophim.live/uploads/movies/',
            pagination,
        };
    }

    return data;
};

export const fetchMoviesByType = async (type: string, page: number = 1, limit?: number): Promise<MovieListResponse> => {
    // type examples: 'phim-le', 'phim-bo', 'hoat-hinh', 'tv-shows'
    const res = await fetch(`${API_BASE_URL}/v1/api/danh-sach/${type}?page=${page}`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Failed to fetch ${type} movies`);
    const data = await res.json();

    // Normalize v1 API response to match MovieListResponse
    if (data.data) {
        let items = (data.data.items || []).map((item: any) => ({
            ...item,
            thumb_url: item.thumb_url?.startsWith('http') ? item.thumb_url : item.thumb_url,
            poster_url: item.poster_url?.startsWith('http') ? item.poster_url : item.poster_url,
        }));

        if (limit) {
            items = items.slice(0, limit);
        }

        const pagination = data.data.params?.pagination || { totalItems: 0, totalItemsPerPage: 24, currentPage: 1, totalPages: 1 };
        if (pagination.totalItems && pagination.totalItemsPerPage && !pagination.totalPages) {
            pagination.totalPages = Math.ceil(pagination.totalItems / pagination.totalItemsPerPage);
        }

        return {
            status: data.status === 'success',
            items,
            pathImage: data.data.APP_DOMAIN_CDN_IMAGE ? `${data.data.APP_DOMAIN_CDN_IMAGE}/uploads/movies/` : 'https://img.ophim.live/uploads/movies/',
            pagination,
        };
    }
    return data;
}

export const fetchMoviesByGenre = async (genreSlug: string, page: number = 1, limit?: number): Promise<MovieListResponse> => {
    const res = await fetch(`${API_BASE_URL}/v1/api/the-loai/${genreSlug}?page=${page}`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Failed to fetch movies for genre ${genreSlug}`);
    const data = await res.json();

    if (data.data) {
        let items = (data.data.items || []).map((item: any) => ({
            ...item,
            thumb_url: item.thumb_url?.startsWith('http') ? item.thumb_url : item.thumb_url,
            poster_url: item.poster_url?.startsWith('http') ? item.poster_url : item.poster_url,
        }));

        if (limit) {
            items = items.slice(0, limit);
        }

        const pagination = data.data.params?.pagination || { totalItems: 0, totalItemsPerPage: 24, currentPage: 1, totalPages: 1 };
        if (pagination.totalItems && pagination.totalItemsPerPage && !pagination.totalPages) {
            pagination.totalPages = Math.ceil(pagination.totalItems / pagination.totalItemsPerPage);
        }

        return {
            status: data.status === 'success',
            items,
            pathImage: data.data.APP_DOMAIN_CDN_IMAGE ? `${data.data.APP_DOMAIN_CDN_IMAGE}/uploads/movies/` : 'https://img.ophim.live/uploads/movies/',
            pagination,
        };
    }
    return data;
}

export const fetchMoviesByCountry = async (countrySlug: string, page: number = 1, limit?: number): Promise<MovieListResponse> => {
    const res = await fetch(`${API_BASE_URL}/v1/api/quoc-gia/${countrySlug}?page=${page}`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Failed to fetch movies for country ${countrySlug}`);
    const data = await res.json();

    if (data.data) {
        let items = (data.data.items || []).map((item: any) => ({
            ...item,
            thumb_url: item.thumb_url?.startsWith('http') ? item.thumb_url : item.thumb_url,
            poster_url: item.poster_url?.startsWith('http') ? item.poster_url : item.poster_url,
        }));

        if (limit) {
            items = items.slice(0, limit);
        }

        const pagination = data.data.params?.pagination || { totalItems: 0, totalItemsPerPage: 24, currentPage: 1, totalPages: 1 };
        if (pagination.totalItems && pagination.totalItemsPerPage && !pagination.totalPages) {
            pagination.totalPages = Math.ceil(pagination.totalItems / pagination.totalItemsPerPage);
        }

        return {
            status: data.status === 'success',
            items,
            pathImage: data.data.APP_DOMAIN_CDN_IMAGE ? `${data.data.APP_DOMAIN_CDN_IMAGE}/uploads/movies/` : 'https://img.ophim.live/uploads/movies/',
            pagination,
        };
    }

    return data;
}

export const fetchGenres = async (): Promise<{ status: boolean; items: Category[] }> => {
    const res = await fetch(`${API_BASE_URL}/v1/api/the-loai`, {
        next: { revalidate: 86400 }, // Cache for 24 hours
    });
    if (!res.ok) throw new Error('Failed to fetch genres');
    const data = await res.json();
    return {
        status: data.status === 'success',
        items: data.data?.items || []
    };
}

export const fetchMoviePeoples = async (slug: string): Promise<MoviePeoplesResponse> => {
    const res = await fetch(`${API_BASE_URL}/v1/api/phim/${slug}/peoples`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Failed to fetch movie peoples');
    return res.json();
};

export const fetchMovieKeywords = async (slug: string): Promise<MovieKeywordsResponse> => {
    const res = await fetch(`${API_BASE_URL}/v1/api/phim/${slug}/keywords`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Failed to fetch movie keywords');
    return res.json();
};

export const fetchMovieImages = async (slug: string): Promise<MovieImagesResponse> => {
    const res = await fetch(`${API_BASE_URL}/v1/api/phim/${slug}/images`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Failed to fetch movie images');
    return res.json();
};

export const getImageUrl = (posterUrl: string) => {
    // OPhim images often just return the filename, we need the base path.
    // However, the API response includes `pathImage`, but individual items usually have `thumb_url` and `poster_url` as filenames.
    // We should probably rely on the `pathImage` from the list response, but since we are iterating items, we might need to hardcode or pass it down.
    // Based on `api_response.json`: "pathImage":"https://img.ophim.live/uploads/movies/"
    // So let's use that base URL.
    if (posterUrl.startsWith('http')) return posterUrl;
    return `https://img.ophim.live/uploads/movies/${posterUrl}`;
}
