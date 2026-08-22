import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageShell } from '@/components/site-pages'

type Article = { slug: string; title: string; excerpt: string; content: string; image_url?: string | null; created_at?: string }
const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const response = await fetch(`${apiBase}/api/articles`, { cache: 'no-store' })
  if (!response.ok) notFound()
  const articles = await response.json() as Article[]
  const article = articles.find((item) => item.slug === slug)
  if (!article) notFound()
  return <PageShell><article className="article-page section-wrap"><Link href="/blog" className="article-back">← Back to Blog</Link><img src={article.image_url ?? '/header.png'} alt={article.title} /><p className="muted mono">{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Published article'}</p><h1>{article.title}</h1><p className="mono article-body">{article.content}</p></article></PageShell>
}
