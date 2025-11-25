import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '掠影-电子系第27届学生节',
  description: '欢迎参加电子系第27届学生节',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body style={{ fontFamily: '"Songti SC", "STSong", "SimSun", serif' }}>{children}</body>
    </html>
  )
}
