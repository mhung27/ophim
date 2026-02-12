"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
    {
        q: "moiPhim là gì?",
        a: "Không phải Phim Mới hay Mới Phim - moiPhim là nền tảng xem phim trực tuyến miễn phí, cung cấp hàng ngàn bộ phim lẻ, phim bộ, hoạt hình và TV shows từ nhiều quốc gia khác nhau. Tất cả nội dung đều được cập nhật liên tục và hoàn toàn miễn phí."
    },
    {
        q: "Tôi có cần đăng ký tài khoản không?",
        a: "Không, bạn không cần đăng ký hay tạo tài khoản. Chỉ cần truy cập moiPhim và bắt đầu xem phim ngay lập tức mà không cần bất kỳ thông tin cá nhân nào."
    },
    {
        q: "moiPhim có những thể loại phim nào?",
        a: "moiPhim cung cấp đa dạng thể loại bao gồm: Phim Hành Động, Tình Cảm, Hài Hước, Kinh Dị, Khoa Học Viễn Tưởng, Hoạt Hình, Phim Tài Liệu, Phim Bộ Hàn Quốc, Trung Quốc, Nhật Bản, Mỹ và nhiều hơn nữa."
    },
    {
        q: "Tôi có thể xem phim trên thiết bị nào?",
        a: "Bạn có thể xem phim trên mọi thiết bị có trình duyệt web, bao gồm máy tính, laptop, điện thoại di động, máy tính bảng và TV thông minh. Giao diện được tối ưu cho mọi kích thước màn hình."
    },
    {
        q: "Phim có Vietsub không?",
        a: "Có, đa số phim trên moiPhim đều có phụ đề Tiếng Việt (Vietsub). Ngoài ra, nhiều bộ phim còn có bản Thuyết Minh tiếng Việt để bạn lựa chọn."
    },
    {
        q: "Phim mới được cập nhật như thế nào?",
        a: "Phim mới được cập nhật hàng ngày. Các phim bộ đang chiếu sẽ được cập nhật tập mới trong thời gian sớm nhất sau khi phát sóng. Bạn có thể theo dõi mục \"Phim Mới Cập Nhật\" để không bỏ lỡ bất kỳ nội dung nào."
    },
];

export function FAQSection() {
    return (
        <Accordion type="single" collapsible className="w-full space-y-3">
            {faqItems.map((item, index) => (
                <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-6 data-[state=open]:bg-white/[0.05] data-[state=open]:border-white/10 transition-all duration-200"
                >
                    <AccordionTrigger className="text-left text-base font-medium hover:no-underline py-5 text-white/90">
                        {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/40 leading-relaxed pb-5">
                        {item.a}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
