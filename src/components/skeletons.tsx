
export function HeroSkeleton() {
    return (
        <div className="w-full h-[70vh] md:h-[85vh] bg-gray-900 animate-pulse relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </div>
    );
}

export function MovieRowSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <div className="h-7 w-48 bg-white/5 rounded-md animate-pulse" />
                <div className="h-5 w-20 bg-white/5 rounded-md animate-pulse" />
            </div>
            <div className="flex gap-4 overflow-hidden px-1">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] aspect-[2/3] bg-white/5 rounded-xl animate-pulse border border-white/5"
                    />
                ))}
            </div>
        </div>
    );
}

export function GenreRowSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-7 w-32 bg-white/5 rounded-md animate-pulse px-1" />
            <div className="flex gap-3 overflow-hidden px-1 pb-4">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 w-24 h-10 bg-white/5 rounded-xl animate-pulse border border-white/5"
                    />
                ))}
            </div>
        </div>
    );
}

export function FeatureRowSkeleton() {
    return (
        <div className="w-full h-80 rounded-3xl bg-white/5 animate-pulse relative overflow-hidden border border-white/5">
            <div className="flex flex-col md:flex-row h-full p-6 md:p-8 gap-6">
                {/* Left Header Skeleton */}
                <div className="w-full md:w-64 flex-shrink-0 flex flex-col justify-center gap-4">
                    <div className="h-10 w-3/4 bg-white/10 rounded-lg" />
                    <div className="h-4 w-1/2 bg-white/10 rounded" />
                    <div className="h-8 w-24 bg-white/10 rounded-full mt-2" />
                </div>

                {/* Right List Skeleton */}
                <div className="flex-1 flex gap-4 overflow-hidden items-center">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-[200px] sm:w-[240px] aspect-video bg-white/10 rounded-xl"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function TVShowsHighlightSkeleton() {
    return (
        <div className="w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.5/1] rounded-3xl bg-white/5 animate-pulse relative overflow-hidden my-12 border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-4">
                <div className="h-8 w-1/3 bg-white/10 rounded-lg" />
                <div className="h-4 w-1/4 bg-white/10 rounded" />
                <div className="flex gap-2 mt-4">
                    <div className="h-24 w-16 bg-white/10 rounded-lg" />
                    <div className="h-24 w-16 bg-white/10 rounded-lg" />
                    <div className="h-24 w-16 bg-white/10 rounded-lg" />
                    <div className="h-24 w-16 bg-white/10 rounded-lg" />
                    <div className="h-24 w-16 bg-white/10 rounded-lg" />
                </div>
            </div>
        </div>
    );
}
