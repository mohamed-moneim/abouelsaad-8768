import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { PageShell } from '@/components/site-pages'

type Article = { slug: string; title: string; excerpt: string; content: string; image_url?: string | null; created_at?: string }
type ArticlesResponse = Article[] | { articles?: Article[] }
const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const requestHeaders = await headers()
  const origin = apiBase || `${requestHeaders.get('x-forwarded-proto') ?? 'https'}://${requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host')}`
  const response = await fetch(`${origin}/api/articles?limit=50`, { cache: 'no-store' })
  if (!response.ok) notFound()
  const payload = await response.json() as ArticlesResponse
  const articles = Array.isArray(payload) ? payload : payload.articles ?? []
  const article = articles.find((item) => item.slug === slug)
  if (!article) notFound()
  return <PageShell><article className="article-page section-wrap"><Link href="/blog" className="article-back">← Back to Blog</Link><img src={article.image_url ?? '/header.png'} alt={article.title} /><p className="muted mono">{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Published article'}</p><h1>{article.title}</h1><p className="mono article-body">{article.content}</p></article></PageShell>
}
