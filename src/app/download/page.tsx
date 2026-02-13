import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SiteFooter } from '@/components/site-footer';
import {
    Smartphone,
    Apple,
    Tv,
    Download,
    ChevronRight,
    Monitor,
    CheckCircle2,
    Clock,
    ArrowRight
} from 'lucide-react';

export const metadata = {
    title: 'Tải ứng dụng vmhPHIM - Xem phim miễn phí trên mọi thiết bị',
    description: 'vmhPHIM hỗ trợ đa dạng các nền tảng từ Android, iOS đến Smart TV và Apple TV. Tải ngay để trải nghiệm xem phim tốt nhất.',
};

const platforms = [
    {
        id: 'android',
        name: 'Android',
        description: 'Điện thoại & Máy tính bảng',
        icon: <Smartphone className="h-8 w-8" />,
        status: 'available',
        link: 'comingn-soon',
        version: 'Chưa ra mắt',
        details: 'Hỗ trợ Android 5.0 trở lên',
        color: 'emerald'
    },
    {
        id: 'ios',
        name: 'iOS / iPadOS',
        description: 'iPhone & iPad',
        icon: <Apple className="h-8 w-8" />,
        status: 'coming-soon',
        version: 'Sắp ra mắt',
        details: 'Yêu cầu iOS 13.0+',
        color: 'blue'
    },
    {
        id: 'webos',
        name: 'LG WebOS / Tizen',
        description: 'Smart TV',
        icon: <Tv className="h-8 w-8" />,
        status: 'coming-soon',
        version: 'Sắp ra mắt',
        details: 'Ứng dụng cho TV thông minh',
        color: 'violet'
    },
    {
        id: 'appletv',
        name: 'Apple TV / Android TV',
        description: 'TV Box',
        icon: <Monitor className="h-8 w-8" />,
        status: 'coming-soon',
        version: 'Sắp ra mắt',
        details: 'Trải nghiệm rạp phim tại nhà',
        color: 'orange'
    }
];

export default function DownloadPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-white/10 selection:text-white">
            {/* ───────────────────────────────────────────────────────────────────────── */}
            {/* HERO SECTION */}
            {/* ───────────────────────────────────────────────────────────────────────── */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Abstract background blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="absolute top-40 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] -z-10 animate-pulse [animation-delay:1s]" />

                <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 mb-4 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Ứng dụng đã sẵn sàng cho Android
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white animate-slide-up">
                        vmhPHIM cho mọi<br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Thiết bị của bạn</span>
                    </h1>

                    <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed animate-slide-up [animation-delay:100ms]">
                        Mang cả thế giới điện ảnh vào túi áo hoặc phòng khách của bạn.
                        Trải nghiệm mượt mà, không quảng cáo và hoàn toàn miễn phí.
                    </p>
                </div>
            </section>

            {/* ───────────────────────────────────────────────────────────────────────── */}
            {/* PLATFORMS GRID */}
            {/* ───────────────────────────────────────────────────────────────────────── */}
            <section className="pb-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {platforms.map((platform, index) => (
                            <div
                                key={platform.id}
                                className={`group relative rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 animate-slide-up`}
                                style={{ animationDelay: `${(index + 2) * 100}ms` }}
                            >
                                {/* Background Glass */}
                                <div className="absolute inset-0 rounded-3xl bg-white/[0.03] border border-white/[0.06] group-hover:bg-white/[0.05] group-hover:border-white/10 transition-all duration-500 -z-10" />

                                {/* Corner Glow */}
                                <div className={`absolute -top-12 -right-12 w-24 h-24 blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10 ${platform.color === 'emerald' ? 'bg-emerald-500' :
                                    platform.color === 'blue' ? 'bg-blue-500' :
                                        platform.color === 'violet' ? 'bg-violet-500' : 'bg-orange-500'
                                    }`} />

                                <div className="space-y-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${platform.status === 'available'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-white/5 text-white/30 border border-white/10'
                                        }`}>
                                        {platform.icon}
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">{platform.name}</h3>
                                        <p className="text-sm text-white/40">{platform.description}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-medium">
                                            {platform.status === 'available' ? (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                    <span className="text-emerald-500">Sẵn sàng tải về</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="h-4 w-4 text-white/20" />
                                                    <span className="text-white/30 italic">Đang cập nhật...</span>
                                                </>
                                            )}
                                        </div>

                                        <div className="text-xs text-white/30">
                                            Phiên bản: <span className="text-white/60">{platform.version}</span>
                                        </div>
                                    </div>

                                    {platform.status === 'available' ? (
                                        <Button
                                            className="w-full bg-white text-black hover:bg-emerald-400 hover:text-black font-bold h-12 rounded-2xl transition-all duration-300 shadow-lg shadow-black/20"
                                            asChild
                                        >
                                            <a href={platform.link} download>
                                                <Download className="mr-2 h-5 w-5" /> Tải về ngay
                                            </a>
                                        </Button>
                                    ) : (
                                        <Button
                                            disabled
                                            className="w-full bg-white/5 text-white/20 border border-white/10 h-12 rounded-2xl font-semibold cursor-not-allowed"
                                        >
                                            Sắp ra mắt
                                        </Button>
                                    )}

                                    <p className="text-[10px] text-center text-white/20 uppercase tracking-widest font-bold">
                                        {platform.details}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────────────────────────────────────────────────────────────────── */}
            {/* FEATURES / WHY APP SECTION */}
            {/* ───────────────────────────────────────────────────────────────────────── */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="glass rounded-[2rem] p-8 md:p-16 relative overflow-hidden">
                        {/* Decorative lines */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.02] to-transparent -z-10" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                    Tại sao nên cài đặt<br /> ứng dụng vmhPHIM?
                                </h2>

                                <div className="space-y-6">
                                    {[
                                        { title: 'Tốc độ nhanh hơn', desc: 'Trải nghiệm mượt mà hơn 30% so với trình duyệt web.' },
                                        { title: 'Thông báo phim mới', desc: 'Nhận thông báo ngay khi có tập phim mới từ bộ phim bạn đang theo dõi.' },
                                        { title: 'Tiết kiệm dữ liệu', desc: 'Công nghệ nén video tiên tiến giúp xem HD tốn ít dung lượng hơn.' },
                                        { title: 'Hỗ trợ TV Box', desc: 'Giao diện thân thiện khi sử dụng với Remote trên các thiết bị TV.' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 group">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors duration-300">
                                                <CheckCircle2 className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                                <p className="text-sm text-white/40">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                {/* Mockup or Image representation */}
                                <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 rotate-2 group-hover:rotate-0 transition-transform duration-700">
                                    <Image
                                        src="https://assets.nflxext.com/ffe/siteui/vlv3/e49aba81-ee7c-4f19-baef-7c54bbab003e/web/VN-vi-20260202-TRIFECTA-perspective_87884993-f9be-4b65-bedd-0589f913b40e_large.jpg"
                                        alt="App Preview"
                                        width={600}
                                        height={400}
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="glass-strong p-4 rounded-2xl flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-white/40 mb-1">Đang phát</p>
                                                <p className="font-bold text-white">Trải nghiệm đỉnh cao</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                                                <ArrowRight className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating elements for visual pop */}
                                <div className="absolute -bottom-6 -left-6 w-32 h-32 glass-strong rounded-2xl p-4 flex flex-col justify-between -rotate-12 animate-bounce [animation-duration:4s]">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                        <Smartphone className="h-4 w-4" />
                                    </div>
                                    <div className="text-[10px] font-bold text-white/60">IOS SOON</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────────────────────────────────────────────────────────────────────── */}
            {/* FINAL CTA */}
            {/* ───────────────────────────────────────────────────────────────────────── */}
            <section className="py-20 text-center">
                <div className="max-w-2xl mx-auto px-4 space-y-8">
                    <div className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 mb-2">
                        <Download className="h-10 w-10 text-white/20" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Sẵn sàng trải nghiệm?</h2>
                    <p className="text-white/40 text-lg">Tải ứng dụng vmhPHIM ngay hôm nay để bắt đầu hành trình điện ảnh của bạn.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-10 py-7 text-lg font-black" asChild>
                            <Link href="/vmhPHIM.apk">Cài đặt Android</Link>
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-full px-10 py-7 text-lg font-bold border-white/15 hover:bg-white/5" asChild>
                            <Link href="/phim">Xem trên Web trước</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
