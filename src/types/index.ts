export interface TMBDEntity {
  type: 'tv' | 'movie' | string;
  id: string;
  season?: number | null;
  vote_average: number;
  vote_count: number;
}

export interface IMDBEntity {
  id: string;
  vote_average: number;
  vote_count: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface MovieItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  tmdb: TMBDEntity;
  imdb: IMDBEntity;
  modified: {
    time: string;
  };
  descriptionHead?: string;
  quality?: string;
  lang?: string;
  episode_current?: string;
  time?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  }[];
  country?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface MovieListResponse {
  status: boolean;
  items: MovieItem[];
  pathImage: string;
  pagination: Pagination;
}

export interface MovieDetails extends MovieItem {
  content: string;
  type: 'series' | 'single' | 'hoathinh' | 'tvshows';
  status: string;
  thumb_url: string;
  poster_url: string;
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  view: number;
  actor: string[];
  director: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  }[];
  country: {
    id: string;
    name: string;
    slug: string;
  }[];
  episodes: {
    server_name: string;
    server_data: {
      name: string;
      slug: string;
      filename: string;
      link_embed: string;
      link_m3u8: string;
    }[];
  }[];
}

export interface MovieDetailsResponse {
  status: boolean;
  msg?: string;
  movie: MovieDetails;
  episodes?: {
    server_name: string;
    server_data: {
      name: string;
      slug: string;
      filename: string;
      link_embed: string;
      link_m3u8: string;
    }[];
  }[];
}

export interface CastMember {
  tmdb_people_id: number;
  name: string;
  original_name: string;
  character: string;
  known_for_department: string;
  profile_path: string | null;
}

export interface MoviePeoplesResponse {
  success: boolean;
  data: {
    peoples: CastMember[];
  };
}

export interface MovieKeywordsResponse {
  success: boolean;
  data: {
    keywords: {
      name: string;
      slug: string;
    }[];
  };
}

export interface ImageItem {
  width: number;
  height: number;
  aspect_ratio: number;
  type: 'backdrop' | 'poster';
  file_path: string;
  iso_639_1?: string;
}

export interface MovieImagesResponse {
  success: boolean;
  data: {
    tmdb_id: number;
    images: ImageItem[];
    image_sizes: {
      backdrop: Record<string, string>;
      poster: Record<string, string>;
    };
  };
}
