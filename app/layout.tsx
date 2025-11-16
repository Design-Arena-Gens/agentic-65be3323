import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cricket Bowler Analysis - DRS Hawk-Eye',
  description: 'Advanced cricket bowling analysis with 3D ball trajectory visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
