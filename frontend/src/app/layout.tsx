import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/store/Provider";
import { HomepageHeader, NotificationContainer } from "@/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // tuỳ chọn
  variable: "--font-poppins",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // tuỳ chọn giống Poppins
  variable: "--font-open-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "Bee - Nền tảng học tập trực tuyến",
    template: "%s | Bee",
  },
  description:
    "Bee là trung tâm học tập trực tuyến toàn diện, cung cấp môi trường học tập hiệu quả cho học sinh THPT. " +
    "Nền tảng hỗ trợ đầy đủ các môn Toán, Lý, Hóa, Sinh, Văn, Anh, Sử, Địa với hệ thống bài tập đa dạng, " +
    "video bài giảng chi tiết, lớp học sinh động và ngân hàng đề thi phong phú. " +
    "Học sinh có thể luyện thi trực tuyến, làm bài tập theo chương, kiểm tra kiến thức, " +
    "và tham gia thi thử online chuẩn bị cho kỳ thi quan trọng.",
  keywords: [
    "Bee",
    "học trực tuyến",
    "học thêm",
    "luyện thi HSA",
    "luyện thi đánh giá năng lực",
    "luyện thi TSA",
    "luyện thi đánh giá tư duy",
    "luyện thi online",
    "luyện thi trung học phổ thông quốc gia",
    "thi thử THPT Quốc gia",
    "bài tập Toán",
    "bài tập Lý",
    "bài tập Hóa",
    "bài tập Sinh",
    "bài tập Văn",
    "bài tập Anh",
    "bài tập Sử",
    "bài tập Địa",
    "ôn tập",
    "trung tâm học tập",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Bee - Nền tảng học tập trực tuyến",
    description:
      "Bee mang đến trải nghiệm học tập trực tuyến toàn diện: từ video bài giảng, bài tập đa dạng, " +
      "lớp học sinh động đến hệ thống thi thử online chuẩn. " +
      "Phù hợp với học sinh THPT chuẩn bị cho kỳ thi quan trọng.",
    url: siteUrl,
    siteName: "Bee",
    images: [
      {
        url: "/images/bee-og.png",
        width: 1200,
        height: 630,
        alt: "Bee - Nền tảng học tập trực tuyến",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bee - Nền tảng học tập trực tuyến",
    description:
      "Trải nghiệm học tập hiệu quả cùng Bee: Toán, Lý, Hóa, Sinh, Văn, Anh, Sử, Địa. " +
      "Video bài giảng, bài tập đa dạng, thi cử online chuẩn.",
    images: ["/images/bee-og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "vi-VN": siteUrl,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${openSans.variable} antialiased`}
      >
        <Providers>
          {/* nội dung trang */}
          {
            <div className="min-h-screen bg-gray-100">
              {/* <HomepageHeader /> */}
              <main className="flex flex-col flex-1">{children}</main>
              {/* <HomepageFooter /> */}
            </div>
          }

          {/* 🔔 Notification luôn nằm trên tất cả các trang */}
          <NotificationContainer />
        </Providers>
      </body>
    </html>
  );
}
