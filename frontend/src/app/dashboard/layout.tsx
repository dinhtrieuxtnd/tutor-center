import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  title: "Dashboard | Tutor Center",
  description:
    "Quản lý lớp học, học sinh, bài tập và theo dõi tiến độ học tập trên hệ thống Tutor Center.",
  openGraph: {
    title: "Dashboard | Tutor Center",
    description:
      "Quản lý lớp học, học sinh, bài tập và theo dõi tiến độ học tập trên hệ thống Tutor Center.",
    url: `${siteUrl}/dashboard`,
    siteName: "Tutor Center",
    locale: "vi_VN",
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/dashboard`,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
