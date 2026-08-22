'use client'

import Link from 'next/link'
import { useState } from 'react'
import useSWR from 'swr'
import { usePathname } from 'next/navigation'
import { GitBranch, Mail, Menu, X } from 'lucide-react'

const navItems = [['Home', '/'], ['Services', '/services'], ['About me', '/about'], ['Portfolio', '/portfolio'], ['Contact Me', '/contact'], ['Blog', '/blog']] as const

export function SiteHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  return <header className="site-header"><Link className="brand" href="/" aria-label="Mohamed Abouelsaad home" onClick={() => setIsOpen(false)}><img src="/abouelsaad-logo.png" alt="Mohamed Abouelsaad" /></Link><nav className={`nav ${isOpen ? 'open' : ''}`} aria-label="Primary navigation">{navItems.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined} className={pathname === href ? 'active' : undefined} onClick={() => setIsOpen(false)}>{label}</Link>)}</nav><Link href="/contact" className="button button-primary hire" onClick={() => setIsOpen(false)}>Hire Me</Link><button type="button" className="menu-toggle" aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>{isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}</button></header>
}

export function SiteFooter() {
  return <footer className="footer"><div className="footer-brand"><img src="/abouelsaad-logo.png" alt="Mohamed Abouelsaad" /><p className="mono">Mohamed is a Full-Stack &amp; Mobile Software Engineer specializing in Node.js, and robust cloud ecosystems.</p></div><div><h3>Links</h3>{navItems.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div><div><h3>Subscribe to My Newsletter</h3><input placeholder="Your Email" /><Link href="/blog" className="button button-primary">Subscribe</Link></div><div><h3>My Social Media Channels</h3><div className="social-icons"><a href="/contact" aria-label="LinkedIn"><GitBranch /></a><a href="/contact" aria-label="GitHub"><GitBranch /></a><a href="mailto:Mohamed@Abouelsaad.Cloud" aria-label="Email"><Mail /></a></div><Link className="button button-cyan" href="/contact">Download my Cv</Link></div></footer>
}

export function PageShell({ children }: { children: React.ReactNode }) { return <main><SiteHeader />{children}<SiteFooter /></main> }

export function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) { return <div className="section-heading">{eyebrow && <p>{eyebrow}</p>}<h2><span />{title}</h2></div> }

type PortfolioProject = { id: string; title: string; description: string; image_url?: string | null; category: 'web' | 'mobile' | 'self'; url?: string | null }
type Article = { id: string; slug: string; title: string; excerpt: string; content: string; image_url?: string | null; created_at?: string }
const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''
const fetcher = (path: string) => fetch(`${apiBase}${path}`).then((response) => { if (!response.ok) throw new Error('Content service unavailable'); return response.json() })

function PortfolioCard({ project }: { project: PortfolioProject }) {
  return <article className="portfolio-card"><img src={project.image_url ?? '/header.png'} alt={project.title} /><div className="portfolio-overlay"><p className="mono">{project.title}</p><Link href={project.url ?? '/contact'} target={project.url ? '_blank' : undefined} rel={project.url ? 'noreferrer' : undefined} className="button button-cyan">Visit Project</Link></div></article>
}

function PortfolioGrid({ category }: { category: PortfolioProject['category'] }) {
  const { data, error, isLoading } = useSWR(`/api/portfolio?category=${category}`, fetcher)
  if (isLoading) return <p className="mono portfolio-status">Loading projects...</p>
  if (error) return <p className="mono portfolio-status">Portfolio projects are temporarily unavailable.</p>
  if (!data?.length) return <p className="mono portfolio-status">No projects in this category yet.</p>
  return <div className="portfolio-grid">{data.map((project) => <PortfolioCard key={project.id} project={project} />)}</div>
}

const serviceImages = ['https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=85']
function ArticleCard({ article }: { article: Article }) {
  return <Link href={`/blog/${article.slug}`} className="article-card"><img src={article.image_url ?? '/header.png'} alt={article.title} /><div className="article-card-copy"><p className="muted mono">{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Featured article'}</p><h3>{article.title}</h3><p className="mono article-excerpt">{article.excerpt}</p><span className="article-link">Read article</span></div></Link>
}

function BlogCards({ limit }: { limit?: number }) {
  const { data, error, isLoading } = useSWR('/api/articles', fetcher)
  if (isLoading) return <p className="mono portfolio-status">Loading articles...</p>
  if (error) return <p className="mono portfolio-status">Articles are temporarily unavailable.</p>
  const articles = (data as Article[]).slice(0, limit)
  if (!articles.length) return <p className="mono portfolio-status">No articles published yet.</p>
  return <div className="blog-grid">{articles.map((article) => <ArticleCard key={article.id ?? article.slug} article={article} />)}</div>
}

export function HomePage() {
  const [category, setCategory] = useState<PortfolioProject['category']>('web')
  const tabs = [['web', 'Web Apps'], ['mobile', 'Mobile Apps'], ['self', 'Self Projects']] as const
  return <PageShell>
    <section id="home" className="hero section-wrap"><div className="hero-copy"><p className="hero-greeting">Hi, I am Mohamed</p><h1>A Software Engineer Specialized in Full Stack Web &amp; Mobile Development.</h1><p className="hero-text">I build Scalable High Quality Web &amp; Mobile Apps with experience of 10 years.<br />I create apps for both android and ios with flutter cross platform Framework.<br />and I code websites in Node.js, React and Next.js.</p><div className="button-row"><Link href="/contact" className="button button-primary">Let&apos;s Collaborate</Link><Link href="/services" className="button button-outline">Learn More</Link></div></div><img className="hero-image" src="/header.png" alt="Mohamed Abouelsaad" /></section>
    <section className="section-wrap services"><SectionTitle title="My Services" /><p className="mono intro">I build high quality apps as a Full-Stack Developer in Node.js, React, Tailwind. I own high skills in Front End and Back End.</p><div className="service-grid">{serviceImages.map((src, i) => <article key={src}><img src={src} alt="" /><p className="mono">{['Web and UI Design', 'Web Apps Development', 'Mobile Development'][i]}</p></article>)}</div></section>
    <section className="section-wrap portfolio"><p className="muted">Some of my previous work</p><SectionTitle title="Portfolio" /><div className="filter-row" role="tablist" aria-label="Portfolio categories">{tabs.map(([value, label]) => <button key={value} role="tab" aria-selected={category === value} className={`button ${category === value ? 'button-primary' : 'button-outline'}`} onClick={() => setCategory(value)}>{label}</button>)}</div><PortfolioGrid category={category} /></section>
    <section className="section-wrap about"><div><SectionTitle title="About Me" /><p className="mono about-copy">Hi, I am Mohamed, a Software Engineer specializing in Web and SaaS Applications. I have worked in the software development field since 2016, gaining experience at companies across Egypt, India, and Saudi Arabia.</p></div><img src="/about.png" alt="Mohamed outdoors" /></section>
    <section className="section-wrap blog"><p className="muted mono">My Latest Articles</p><SectionTitle title="Blog" /><BlogCards limit={3} /><div className="button-row"><Link href="/blog" className="button button-outline">View all articles</Link></div></section>
  </PageShell>
}

export function ServicesPage() { return <PageShell><section className="section-wrap services page-section"><SectionTitle title="My Services" /><p className="mono intro">I build high quality apps as a Full-Stack Developer in Node.js, React, Tailwind. I own high skills in Front End and Back End. I can create E-commerce Projects, SAAS Projects, Landing Pages.</p><div className="service-grid">{serviceImages.map((src, i) => <article key={src}><img src={src} alt="" /><p className="mono">{['Web and UI Design', 'Web Apps Development', 'Mobile Development'][i]}</p></article>)}</div></section></PageShell> }
export function AboutPage() { return <PageShell><section className="section-wrap about page-section"><div><SectionTitle title="About Me" /><p className="mono about-copy">Hi, I am Mohamed, a Software Engineer specializing in Web and SaaS Applications. I have worked in the software development field since 2016, gaining experience at companies across Egypt, India, and Saudi Arabia. Additionally, I work as a freelancer for both companies and individuals. Beyond web applications, I have extensive experience with Flutter, the cross-platform mobile development framework, alongside foundational knowledge of native Android and ios development using Kotlin and Swift.</p></div><img src="/about.png" alt="Mohamed outdoors" /></section></PageShell> }
export function PortfolioPage() { const [category, setCategory] = useState<PortfolioProject['category']>('web'); const tabs = [['web', 'Web Apps'], ['mobile', 'Mobile Apps'], ['self', 'Self Projects']] as const; return <PageShell><section className="section-wrap portfolio page-section"><p className="muted">Some of my previous work</p><SectionTitle title="Portfolio" /><div className="filter-row" role="tablist" aria-label="Portfolio categories">{tabs.map(([value, label]) => <button key={value} role="tab" aria-selected={category === value} className={`button ${category === value ? 'button-primary' : 'button-outline'}`} onClick={() => setCategory(value)}>{label}</button>)}</div><PortfolioGrid category={category} /></section></PageShell> }
export function BlogPage() { const { data, error, isLoading } = useSWR('/api/articles', fetcher); const [page, setPage] = useState(1); const pageSize = 6; const articles = (data as Article[] | undefined) ?? []; const pageCount = Math.max(1, Math.ceil(articles.length / pageSize)); const visible = articles.slice((page - 1) * pageSize, page * pageSize); return <PageShell><section className="section-wrap blog page-section"><p className="muted mono">The complete archive</p><SectionTitle title="All Articles" /><p className="mono intro">Practical notes on engineering, product development, and the tools shaping modern software.</p>{isLoading && <p className="mono portfolio-status">Loading articles...</p>}{error && <p className="mono portfolio-status">Articles are temporarily unavailable.</p>}{!isLoading && !error && !articles.length && <p className="mono portfolio-status">No articles published yet.</p>}{!isLoading && !error && <><div className="blog-grid">{visible.map((article) => <ArticleCard key={article.id ?? article.slug} article={article} />)}</div>{pageCount > 1 && <div className="pagination" aria-label="Article pagination"><button className="button button-outline" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button><span className="mono">Page {page} of {pageCount}</span><button className="button button-outline" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}>Next</button></div>}</>}</section></PageShell> }
export function ContactPage() { return <PageShell><section className="section-wrap contact page-section"><div className="contact-form"><p className="muted mono">I&apos;d Love to Hear From You</p><SectionTitle title="Contact Me" /><p className="mono contact-copy">Whether you have a project idea, a remote job opportunity, need a consultation, or just want to say hello, feel free to reach out.</p><form><input placeholder="Your Name" /><input type="email" placeholder="Your Email" /><textarea placeholder="Your Message" rows={5} /><button className="button button-primary" type="submit">Send</button></form></div><aside className="social"><h3>My Social Media Channels</h3><div className="social-icons"><a href="/contact" aria-label="LinkedIn"><GitBranch /></a><a href="/contact" aria-label="GitHub"><GitBranch /></a><a href="mailto:Mohamed@Abouelsaad.Cloud" aria-label="Email"><Mail /></a></div><Link className="button button-cyan" href="/contact">Download my Cv</Link></aside></section></PageShell> }

export { serviceImages, blogImages }
