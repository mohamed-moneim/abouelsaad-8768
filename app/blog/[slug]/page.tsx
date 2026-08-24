import { ArticleContent } from './article-content'
import { PageShell } from '@/components/site-pages'

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PageShell><ArticleContent slug={slug} /></PageShell>
}
