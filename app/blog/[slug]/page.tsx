import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageShell } from '@/components/site-pages'

const articles = [
  { slug: 'ai-will-transform-education', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=85', title: 'AI will Transform Education', body: 'Artificial intelligence is changing how people learn by making education more personal, accessible, and responsive. The best tools support teachers and learners without replacing the human connection at the heart of education.' },
  { slug: 'new-features-in-latest-release-of-nodejs', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=85', title: 'New Features in Latest Release of Node.js', body: 'Node.js continues to evolve with improvements to performance, developer experience, and modern JavaScript support. These changes help teams ship reliable server-side applications with less friction.' },
  { slug: 'top-skills-for-software-engineers', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=85', title: 'Top Skills should be adopted by Software Engineers', body: 'Strong software engineers combine technical depth with communication, product thinking, testing discipline, and continuous learning. These skills make teams more effective and products more resilient.' },
] as const

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })) }

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles.find((item) => item.slug === slug)
  if (!article) notFound()
  return <PageShell><article className="article-page section-wrap"><Link href="/blog" className="article-back">← Back to Blog</Link><img src={article.image} alt="" /><p className="muted mono">Featured article</p><h1>{article.title}</h1><p className="mono article-body">{article.body}</p></article></PageShell>
}
