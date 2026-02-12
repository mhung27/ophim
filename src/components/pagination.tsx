import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    searchParams?: Record<string, string | number | undefined>;
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
    if (totalPages <= 1) return null;

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value !== undefined) {
                params.set(key, String(value));
            }
        });
        params.set('page', String(page));
        return `${baseUrl}?${params.toString()}`;
    };

    const getPageNumbers = () => {
        const pages = [];
        const siblingCount = 1;
        const totalNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipses

        if (totalPages <= totalNumbers) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
            const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

            const shouldShowLeftDots = leftSiblingIndex > 2;
            const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

            if (!shouldShowLeftDots && shouldShowRightDots) {
                const itemCount = 3 + 2 * siblingCount;
                for (let i = 1; i <= itemCount; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (shouldShowLeftDots && !shouldShowRightDots) {
                const itemCount = 3 + 2 * siblingCount;
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - itemCount + 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex flex-col items-center gap-6 mt-12 pb-12">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={currentPage <= 1}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary hover:text-white disabled:opacity-20 transition-all duration-300"
                    asChild={currentPage > 1}
                >
                    {currentPage > 1 ? (
                        <Link href={createPageUrl(currentPage - 1)}>
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    ) : (
                        <span><ChevronLeft className="h-5 w-5" /></span>
                    )}
                </Button>

                <div className="flex items-center gap-1.5">
                    {pages.map((page, index) => (
                        page === '...' ? (
                            <span key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-white/40">
                                ...
                            </span>
                        ) : (
                            <Button
                                key={`page-${page}`}
                                variant={currentPage === page ? "default" : "ghost"}
                                size="icon"
                                className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${currentPage === page
                                    ? "bg-primary text-black shadow-lg shadow-primary/20 scale-110"
                                    : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                                    }`}
                                asChild={currentPage !== page}
                            >
                                {currentPage !== page ? (
                                    <Link href={createPageUrl(page as number)}>
                                        {page}
                                    </Link>
                                ) : (
                                    <span>{page}</span>
                                )}
                            </Button>
                        )
                    ))}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    disabled={currentPage >= totalPages}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary hover:text-white disabled:opacity-20 transition-all duration-300"
                    asChild={currentPage < totalPages}
                >
                    {currentPage < totalPages ? (
                        <Link href={createPageUrl(currentPage + 1)}>
                            <ChevronRight className="h-5 w-5" />
                        </Link>
                    ) : (
                        <span><ChevronRight className="h-5 w-5" /></span>
                    )}
                </Button>
            </div>

            <div className="text-white/40 text-sm font-medium tracking-wide bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                Trang <span className="text-white">{currentPage}</span> trên <span className="text-white">{totalPages}</span>
            </div>
        </div>
    );
}
