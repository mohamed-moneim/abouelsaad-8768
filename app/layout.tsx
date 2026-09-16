import type { Metadata, Viewport } from 'next'
import './globals.css'
import { GoogleAnalytics } from '@/components/google-analytics'

export const metadata: Metadata = {
  metadataBase: new URL('https://mohamedabouelsaad.cloud'),
  title: {
    default: 'Mohamed Abouelsaad — Full Stack Developer',
    template: '%s | Mohamed Abouelsaad',
  },
  description: 'Portfolio of Mohamed Abouelsaad, a full-stack web and mobile developer specializing in Node.js, React, Next.js, and Flutter.',
  keywords: [
    'Mohamed Abouelsaad',
    'full stack developer',
    'software engineer',
    'Node.js developer',
    'React developer',
    'Next.js developer',
    'Flutter developer',
    'web development',
    'mobile development',
  ],
  authors: [{ name: 'Mohamed Abouelsaad', url: 'https://mohamedabouelsaad.cloud' }],
  creator: 'Mohamed Abouelsaad',
  publisher: 'Mohamed Abouelsaad',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mohamedabouelsaad.cloud',
    siteName: 'Mohamed Abouelsaad',
    title: 'Mohamed Abouelsaad — Full Stack Developer',
    description: 'Portfolio of Mohamed Abouelsaad, a full-stack web and mobile developer.',
    images: [
      {
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/me%20office-oIu3jIEQOZ3WUZkEFHF21PT42WP7jn.jpg',
        width: 1024,
        height: 753,
        alt: 'Mohamed Abouelsaad seated at his office desk',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohamed Abouelsaad — Full Stack Developer',
    description: 'Portfolio of Mohamed Abouelsaad, a full-stack web and mobile developer.',
    images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/me%20office-oIu3jIEQOZ3WUZkEFHF21PT42WP7jn.jpg'],
    creator: '@mohamedabouelsaad',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  generator: 'Next.js',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#071a35',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-mono antialiased">
        {children}
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ''} />
      </body>
    </html>
  )
}
