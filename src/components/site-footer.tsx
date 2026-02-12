import Link from 'next/link';

const footerLinks = [
    {
        title: 'Thể loại',
        links: [
            { label: 'Phim Lẻ', href: '/danh-sach/phim-le' },
            { label: 'Phim Bộ', href: '/danh-sach/phim-bo' },
            { label: 'Hoạt Hình', href: '/danh-sach/hoat-hinh' },
            { label: 'TV Shows', href: '/danh-sach/tv-shows' },
        ],
    },
    {
        title: 'Hỗ trợ',
        links: [
            { label: 'Câu hỏi thường gặp', href: '#faq' },
            { label: 'Liên hệ', href: '#' },
            { label: 'Báo lỗi phim', href: '#' },
        ],
    },
    {
        title: 'Thông tin',
        links: [
            { label: 'Giới thiệu', href: '#' },
            { label: 'Điều khoản sử dụng', href: '#' },
            { label: 'Chính sách bảo mật', href: '#' },
        ],
    },
];

export function SiteFooter() {
    return (
        <footer className="border-t border-white/[0.06] bg-black/20 py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div>
                        <Link href="/phim" className="flex items-center space-x-2 group flex-shrink-0">
                            <span className="text-xl md:text-2xl font-normal text-white transition-opacity group-hover:opacity-80 uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] font-[family-name:var(--font-danfo)]">
                                MOIPHIM.
                            </span>
                        </Link>
                        <p className="text-sm text-white/30 mt-3 leading-relaxed">
                            Nền tảng xem phim trực tuyến miễn phí với hàng ngàn bộ phim chất lượng cao.
                        </p>
                    </div>

                    {/* Link columns */}
                    {footerLinks.map((group) => (
                        <div key={group.title}>
                            <h4 className="font-semibold text-sm mb-3 text-white/60">{group.title}</h4>
                            <ul className="space-y-2.5">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white/30 hover:text-white/70 transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/25">
                        © {new Date().getFullYear()} moiPhim. Dữ liệu phim được cung cấp bởi OPhim.
                    </p>
                    {/* <p className="text-xs text-white/25">
                        Được xây dựng với Next.js & Tailwind CSS
                    </p> */}
                </div>
            </div>
        </footer>
    );
}
