"use client"

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function SiteHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const pathname = usePathname();
    const isWatchPage = pathname?.startsWith('/xem-phim/');
    const isHeroPage = pathname === '/' || pathname === '/phim' || (pathname?.startsWith('/phim/') && !isWatchPage);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If the sentinel is not intersecting, it means we've scrolled down
                setIsScrolled(!entry.isIntersecting);
            },
            { threshold: 0 }
        );

        if (sentinelRef.current) observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, []);

    if (isWatchPage) return null;

    return (
        <>
        <div ref={sentinelRef} className="absolute top-0 left-0 w-full h-px pointer-events-none" />
        <header className={cn(
            "top-0 z-50 w-full transition-all duration-500 ease-out pt-[env(safe-area-inset-top)]",
            isHeroPage ? "fixed" : "sticky",
            isScrolled
                ? "md:bg-black/30 md:backdrop-blur-2xl md:border-b md:border-white/[0.06] md:shadow-lg md:shadow-black/20"
                : "bg-transparent border-transparent"
        )}>
            <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between gap-4">
                {/* Logo - Always visible */}
                <Link href="/phim" className="flex items-center space-x-2 group flex-shrink-0">
                    <span className="text-2xl md:text-3xl font-normal text-white transition-opacity group-hover:opacity-80 uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] font-[family-name:var(--font-danfo)]">
                        vmhPHIM.
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
                    {[
                        { href: '/phim', label: 'Khám phá' },
                        { href: '/danh-sach/phim-le', label: 'Phim Lẻ' },
                        { href: '/danh-sach/phim-bo', label: 'Phim Bộ' },
                        { href: '/danh-sach/hoat-hinh', label: 'Hoạt Hình' },
                        { href: '/danh-sach/tv-shows', label: 'TV Shows' },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative px-3 py-2 text-white/70 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/[0.06]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Search Bar */}
                <div className="flex flex-1 items-center justify-end max-w-sm md:max-w-none">
                    <div className="w-full md:w-auto">
                        <form action="/tim-kiem" method="GET">
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 z-10" />
                                <Input
                                    type="search"
                                    name="keyword"
                                    placeholder="Tìm kiếm phim..."
                                    className="pl-10 pr-4 h-10 sm:w-[300px] md:w-[220px] lg:w-[300px] rounded-full bg-white/[0.08] backdrop-blur-sm border-white/[0.08] text-white placeholder:text-white/40 focus:bg-white/[0.12] focus:border-white/20 transition-all duration-300"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </header>
        </>
    );
}
