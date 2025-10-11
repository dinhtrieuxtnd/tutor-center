
import type { Metadata } from "next"
import LoginClient from "./LoginClient"
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  title: "Đăng nhập | Bee",
  description:
    "Đăng nhập Bee để truy cập kho học liệu trực tuyến toàn diện. "
    + "Tham gia lớp học sinh động, luyện thi online các môn Toán, Lý, Hóa, Sinh, Văn, Anh, Sử, Địa, "
    + "làm bài tập theo chương và thi thử THPT Quốc gia với ngân hàng đề phong phú.",
  openGraph: {
    title: "Đăng nhập | Bee",
    description:
      "Đăng nhập Bee để bắt đầu hành trình học tập trực tuyến hiệu quả. "
      + "Khám phá bài tập đa dạng, video bài giảng, lớp học sinh động và thi thử online.",
    url: `${siteUrl}/auth/login`,
    siteName: "Bee",
    images: [
      {
        url: "/images/auth-login.png", // 👈 nên tạo ảnh preview riêng cho login
        width: 1200,
        height: 630,
        alt: "Bee - Đăng nhập học trực tuyến",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Đăng nhập | Bee",
    description:
      "Đăng nhập Bee để học Toán, Lý, Hóa, Sinh, Văn, Anh, Sử, Địa. "
      + "Video bài giảng chi tiết, bài tập đa dạng và thi thử online chuẩn bị cho kỳ thi THPT Quốc gia.",
    images: ["/images/auth-login.png"],
  },
  alternates: {
    canonical: `${siteUrl}/auth/login`,
  },
}

export default function LoginPage() {
  return <LoginClient />
}
