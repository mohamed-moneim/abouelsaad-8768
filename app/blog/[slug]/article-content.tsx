'use client'

import Link from 'next/link'
import useSWR from 'swr'

type Article = { slug: string; title: string; excerpt: string; content: string; image_url?: string | null; created_at?: string }
const fetcher = (url: string) => fetch(url).then((response) => {
  if (!response.ok) throw new Error(response.status === 404 ? 'Article not found' : 'Unable to load article')
  return response.json() as Promise<Article>
})

export function ArticleContent({ slug }: { slug: string }) {
  const { data: article, error, isLoading } = useSWR(`/api/articles/${encodeURIComponent(slug)}`, fetcher)

  if (isLoading) return <article className="article-page section-wrap"><Link href="/blog" className="article-back">← Back to Blog</Link><p className="mono portfolio-status">Loading article...</p></article>
  if (error || !article) return <article className="article-page section-wrap"><Link href="/blog" className="article-back">← Back to Blog</Link><h1>Article not found</h1><p className="mono article-body">This article may have been unpublished or its link may be outdated.</p></article>

  return <article className="article-page section-wrap"><Link href="/blog" className="article-back">← Back to Blog</Link><img src={article.image_url ?? '/header.png'} alt={article.title} /><p className="muted mono">{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Published article'}</p><h1>{article.title}</h1><p className="mono article-body">{article.content}</p></article>
}
