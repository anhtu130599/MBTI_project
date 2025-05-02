import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientThemeProvider from '@/components/ClientThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MBTI Quiz - Khám phá tính cách của bạn',
  description: 'Khám phá tính cách của bạn thông qua bài kiểm tra MBTI chuyên nghiệp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ClientThemeProvider>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh'
          }}>
            <Header />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </div>
        </ClientThemeProvider>
      </body>
    </html>
  )
} 