import { Inter } from 'next/font/google'
import { ThemeRegistry } from '@/shared/components/ThemeRegistry'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MBTI Test',
  description: 'Khám phá tính cách của bạn với bài kiểm tra MBTI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
} 