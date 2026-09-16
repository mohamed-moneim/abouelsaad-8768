'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

// Only these hostnames are allowed to send data to Google Analytics.
// This prevents the v0 preview iframe, Vercel preview URLs, and localhost
// from polluting the production analytics property.
const ALLOWED_HOSTS = ['abouelsaad.cloud', 'www.abouelsaad.cloud']

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setEnabled(ALLOWED_HOSTS.includes(window.location.hostname))
  }, [])

  if (!measurementId || !enabled) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}
