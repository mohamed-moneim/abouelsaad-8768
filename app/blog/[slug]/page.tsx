import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { ArticleContent } from './article-content'
import { PageShell } from '@/components/site-pages'

type Article = { slug: string; title: string; excerpt?: string; content: string; image_url?: string | null; created_at?: string }
type ArticlesResponse = Article[] | { articles?: Article[] }

async function getArticle(slug: string) {
  const requestHeaders = await headers()
  const origin = `${requestHeaders.get('x-forwarded-proto') ?? 'https'}://${requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host')}`
  const response = await fetch(`${origin}/api/articles?limit=50`, { cache: 'no-store' })
  if (!response.ok) return undefined
  const payload = await response.json() as ArticlesResponse
  const articles = Array.isArray(payload) ? payload : payload.articles ?? []
  return articles.find((article) => article.slug === slug)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Article not found' }

  const description = article.excerpt || article.content.slice(0, 160)
  const image = article.image_url || '/header.png'
  const url = `https://abouelsaad.cloud/blog/${encodeURIComponent(article.slug)}`

  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description,
      publishedTime: article.created_at,
      images: [{ url: image, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [image],
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PageShell><ArticleContent slug={slug} /></PageShell>
}
