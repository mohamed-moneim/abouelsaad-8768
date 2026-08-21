'use client'

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { GitBranch, Mail } from 'lucide-react'

const navItems = [['Home', '/'], ['Services', '/services'], ['About me', '/about'], ['Portfolio', '/portfolio'], ['Contact Me', '/contact'], ['Blog', '/blog']] as const

export function SiteHeader() {
  return <header className="site-header"><Link className="brand" href="/" aria-label="Mohamed Abouelsaad home"><img src="/abouelsaad-logo.png" alt="Mohamed Abouelsaad" /></Link><nav className="nav">{navItems.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav><Link href="/contact" className="button button-primary hire">Hire Me</Link></header>
}

export function SiteFooter() {
  return <footer className="footer"><div className="footer-brand"><img src="/abouelsaad-logo.png" alt="Mohamed Abouelsaad" /><p className="mono">Mohamed is a Full-Stack &amp; Mobile Software Engineer specializing in Node.js, and robust cloud ecosystems.</p></div><div><h3>Links</h3>{navItems.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div><div><h3>Subscribe to My Newsletter</h3><input placeholder="Your Email" /><Link href="/blog" className="button button-primary">Subscribe</Link></div><div><h3>My Social Media Channels</h3><div className="social-icons"><a href="/contact" aria-label="LinkedIn"><GitBranch /></a><a href="/contact" aria-label="GitHub"><GitBranch /></a><a href="mailto:Mohamed@Abouelsaad.Cloud" aria-label="Email"><Mail /></a></div><Link className="button button-cyan" href="/contact">Download my Cv</Link></div></footer>
}

export function PageShell({ children }: { children: React.ReactNode }) { return <main><SiteHeader />{children}<SiteFooter /></main> }

export function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) { return <div className="section-heading">{eyebrow && <p>{eyebrow}</p>}<h2><span />{title}</h2></div> }

function PortfolioCard({ src, title }: { src: string; title: string }) {
  return <article className="portfolio-card"><img src={src} alt={title} /><div className="portfolio-overlay"><p className="mono">{title}</p><Link href="/contact" className="button button-cyan">Visit Project</Link></div></article>
}

function PortfolioGrid({ projects }: { projects: readonly (readonly [string, string])[] }) {
  return <div className="portfolio-grid">{projects.map(([src, title]) => <PortfolioCard key={src} src={src} title={title} />)}</div>
}

const serviceImages = ['https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=85']
const portfolioProjects = {
  web: [['https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=85', 'Clinic management web platform'], ['https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=85', 'Tanker logistics dashboard'], ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85', 'SaaS analytics workspace']],
  mobile: [['https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=85', 'UCard mobile experience'], ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=85', 'Flutter commerce app'], ['https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=1200&q=85', 'Cross-platform travel app']],
  self: [['https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85', 'Personal productivity toolkit'], ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85', 'Developer learning hub'], ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85', 'Open-source starter kit']],
} as const
const articles = [
  { slug: 'ai-will-transform-education', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=85', title: 'AI will Transform Education', excerpt: 'How thoughtful AI tools can make learning more personal, accessible, and effective.' },
  { slug: 'new-features-in-latest-release-of-nodejs', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85', title: 'New Features in Latest Release of Node.js', excerpt: 'A practical look at the improvements shaping modern Node.js development.' },
  { slug: 'top-skills-for-software-engineers', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85', title: 'Top Skills should be adopted by Software Engineers', excerpt: 'The habits and technical skills that help engineers build better products.' },
] as const
const blogImages = articles.map((article) => article.image)

function ArticleCard({ article }: { article: (typeof articles)[number] }) {
  return <Link href={`/blog/${article.slug}`} className="article-card"><img src={article.image} alt={article.title} /><h3>{article.title}</h3><span className="article-link">Read article</span></Link>
}

export function HomePage() {
  const [category, setCategory] = useState<keyof typeof portfolioProjects>('web')
  const tabs = [['web', 'Web Apps'], ['mobile', 'Mobile Apps'], ['self', 'Self Projects']] as const
  return <PageShell>
    <section id="home" className="hero section-wrap"><div className="hero-copy"><p className="hero-greeting">Hi, I am Mohamed</p><h1>A Software Engineer Specialized in Full Stack Web &amp; Mobile Development.</h1><p className="hero-text">I build Scalable High Quality Web &amp; Mobile Apps with experience of 10 years.<br />I create apps for both android and ios with flutter cross platform Framework.<br />and I code websites in Node.js, React and Next.js.</p><div className="button-row"><Link href="/contact" className="button button-primary">Let&apos;s Collaborate</Link><Link href="/services" className="button button-outline">Learn More</Link></div></div><img className="hero-image" src="/header.png" alt="Mohamed Abouelsaad" /></section>
    <section className="section-wrap services"><SectionTitle title="My Services" /><p className="mono intro">I build high quality apps as a Full-Stack Developer in Node.js, React, Tailwind. I own high skills in Front End and Back End.</p><div className="service-grid">{serviceImages.map((src, i) => <article key={src}><img src={src} alt="" /><p className="mono">{['Web and UI Design', 'Web Apps Development', 'Mobile Development'][i]}</p></article>)}</div></section>
    <section className="section-wrap portfolio"><p className="muted">Some of my previous work</p><SectionTitle title="Portfolio" /><div className="filter-row" role="tablist" aria-label="Portfolio categories">{tabs.map(([value, label]) => <button key={value} role="tab" aria-selected={category === value} className={`button ${category === value ? 'button-primary' : 'button-outline'}`} onClick={() => setCategory(value)}>{label}</button>)}</div><PortfolioGrid projects={portfolioProjects[category]} /></section>
    <section className="section-wrap about"><div><SectionTitle title="About Me" /><p className="mono about-copy">Hi, I am Mohamed, a Software Engineer specializing in Web and SaaS Applications. I have worked in the software development field since 2016, gaining experience at companies across Egypt, India, and Saudi Arabia.</p></div><img src="/about.png" alt="Mohamed outdoors" /></section>
    <section className="section-wrap blog"><p className="muted mono">My Latest Articles</p><SectionTitle title="Blog" /><div className="blog-grid">{articles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div></section>
  </PageShell>
}

export function ServicesPage() { return <PageShell><section className="section-wrap services page-section"><SectionTitle title="My Services" /><p className="mono intro">I build high quality apps as a Full-Stack Developer in Node.js, React, Tailwind. I own high skills in Front End and Back End. I can create E-commerce Projects, SAAS Projects, Landing Pages.</p><div className="service-grid">{serviceImages.map((src, i) => <article key={src}><img src={src} alt="" /><p className="mono">{['Web and UI Design', 'Web Apps Development', 'Mobile Development'][i]}</p></article>)}</div></section></PageShell> }
export function AboutPage() { return <PageShell><section className="section-wrap about page-section"><div><SectionTitle title="About Me" /><p className="mono about-copy">Hi, I am Mohamed, a Software Engineer specializing in Web and SaaS Applications. I have worked in the software development field since 2016, gaining experience at companies across Egypt, India, and Saudi Arabia. Additionally, I work as a freelancer for both companies and individuals. Beyond web applications, I have extensive experience with Flutter, the cross-platform mobile development framework, alongside foundational knowledge of native Android and ios development using Kotlin and Swift.</p></div><img src="/about.png" alt="Mohamed outdoors" /></section></PageShell> }
export function PortfolioPage() { const [category, setCategory] = useState<keyof typeof portfolioProjects>('web'); const tabs = [['web', 'Web Apps'], ['mobile', 'Mobile Apps'], ['self', 'Self Projects']] as const; return <PageShell><section className="section-wrap portfolio page-section"><p className="muted">Some of my previous work</p><SectionTitle title="Portfolio" /><div className="filter-row" role="tablist" aria-label="Portfolio categories">{tabs.map(([value, label]) => <button key={value} role="tab" aria-selected={category === value} className={`button ${category === value ? 'button-primary' : 'button-outline'}`} onClick={() => setCategory(value)}>{label}</button>)}</div><PortfolioGrid projects={portfolioProjects[category]} /></section></PageShell> }
export function BlogPage() { return <PageShell><section className="section-wrap blog page-section"><p className="muted mono">My Latest Articles</p><SectionTitle title="Blog" /><div className="blog-grid">{articles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div></section></PageShell> }
export function ContactPage() { return <PageShell><section className="section-wrap contact page-section"><div className="contact-form"><p className="muted mono">I&apos;d Love to Hear From You</p><SectionTitle title="Contact Me" /><p className="mono contact-copy">Whether you have a project idea, a remote job opportunity, need a consultation, or just want to say hello, feel free to reach out.</p><form><input placeholder="Your Name" /><input type="email" placeholder="Your Email" /><textarea placeholder="Your Message" rows={5} /><button className="button button-primary" type="submit">Send</button></form></div><aside className="social"><h3>My Social Media Channels</h3><div className="social-icons"><a href="/contact" aria-label="LinkedIn"><GitBranch /></a><a href="/contact" aria-label="GitHub"><GitBranch /></a><a href="mailto:Mohamed@Abouelsaad.Cloud" aria-label="Email"><Mail /></a></div><Link className="button button-cyan" href="/contact">Download my Cv</Link></aside></section></PageShell> }

export { serviceImages, portfolioProjects, blogImages }
