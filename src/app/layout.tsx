import type { Metadata, Viewport } from "next";
import { Inter, Danfo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

import { PWARegistration } from "@/components/pwa-registration";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const danfo = Danfo({ subsets: ["latin"], weight: "400", variable: "--font-danfo" });

export const metadata: Metadata = {
  title: {
    default: "vmhPHIM - Xem Phim Online Miễn Phí",
    template: "%s | vmhphim"
  },
  description: "Trang web xem phim online miễn phí chất lượng cao, cập nhật phim mới nhất, xem phim nhanh full HD.",
  keywords: ["xem phim", "phim online", "phim moi", "vmhPHIM"],
  authors: [{ name: "vmhPHIM" }],
  creator: "vmhPHIM",
  publisher: "vmhPHIM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://phim.minhqnd.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "vmhPHIM - Xem Phim Online Miễn Phí",
    description: "Trang web xem phim online miễn phí chất lượng cao, cập nhật phim mới nhất, xem phim nhanh full HD.",
    url: "https://phim.minhqnd.com",
    siteName: "vmhPHIM",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "vmhPHIM - Xem Phim Online Miễn Phí",
    description: "Trang web xem phim online miễn phí chất lượng cao, cập nhật phim mới nhất, xem phim nhanh full HD.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Increased for accessibility
  userScalable: true, // Enabled for accessibility
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable, danfo.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PWARegistration />
          <SiteHeader />
          <main className="container mx-auto px-4 md:px-8 py-6 has-[#hero-carousel]:p-0 has-[#hero-carousel]:max-w-none has-[#movie-details-hero]:p-0 has-[#movie-details-hero]:max-w-none has-[#watch-movie-page]:p-0 has-[#watch-movie-page]:max-w-none">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}


