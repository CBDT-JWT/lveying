import type { Metadata } from 'next'
import './globals.css'
import TitleManager from '@/components/TitleManager'

export const metadata: Metadata = {
  title: '掠影-电子系第27届学生节',
  description: '欢迎参加电子系第27届学生节',
  icons: {
    icon: [
      { url: '/favicon-16.png?v=3', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png?v=3', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png?v=3', sizes: '48x48', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=3', sizes: '180x180', type: 'image/png' }
    ]
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body style={{ fontFamily: '"Songti SC", "STSong", "SimSun", serif' }}>
        <TitleManager />
        {children}
      </body>
    </html>
  )
}
