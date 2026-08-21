'use client'

import { useState } from 'react'
import { GitBranch, Mail, Menu, X } from 'lucide-react'

const serviceImages = [
  'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=85',
]

const portfolioImages = [
  'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=85',
]

const blogImages = [
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85',
]

function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="section-heading">
      {eyebrow && <p>{eyebrow}</p>}
      <h2><span />{title}</h2>
    </div>
  )
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = [['Home', '/'], ['Services', '/services'], ['About me', '/about'], ['Portfolio', '/portfolio'], ['Contact Me', '/contact'], ['Blog', '/blog']]

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Mohamed Abouelsaad home">
          <img src="/abouelsaad-logo.png" />
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? 'nav open' : 'nav'}>
          {navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <a href="#contact" className="button button-primary hire">Hire Me</a>
      </header>

      <section id="home" className="hero section-wrap">
        <div className="hero-copy">
          <p className="hero-greeting">Hi , I am Mohamed</p>
          <h1>A Software Engineer Specialized in Full Stack Web &amp; Mobile Development.</h1>
          <p className="hero-text">I build Scalable High Quality Web &amp; Mobile Apps with experience of 10 years.<br />I create apps for both android and ios with flutter cross platform Framework.<br />and I code websites in Node.js, React and Next.js.</p>
          <div className="button-row"><a href="#about" className="button button-primary">Learn More</a><a href="#services" className="button button-outline">Learn More</a></div>
        </div>
        <img className="hero-image" src="/header.png" alt="Mohamed Abouelsaad" />
      </section>

      <section id="services" className="section-wrap services"><SectionTitle title="My Services" /><p className="mono intro">I build high quality apps as a Full-Stack Developer in Node.js,<br />React, Tailwind.I own high skills in Front End and Back End.<br />I can create E-commerce Projects,SAAS Projects, Landing Pages.</p><div className="service-grid">{serviceImages.map((src, i) => <article key={src}><img src={src} alt="" /><p className="mono">{['Web and UI Design', 'Web Apps Development', 'Mobile Development'][i]}</p></article>)}</div></section>

      <section id="portfolio" className="section-wrap portfolio"><p className="muted">Some of my previous work</p><SectionTitle title="Portfolio" /><div className="filter-row">{['Web Apps', 'Mobile Apps', 'Personal Projects'].map(x => <button key={x} className="button button-outline">{x}</button>)}</div><div className="portfolio-grid">{portfolioImages.map((src, i) => <img key={src} src={src} alt={['Clinic system project', 'UCard project', 'Tanker project'][i]} />)}</div></section>

      <section id="about" className="section-wrap about"><div><SectionTitle title="About Me" /><p className="mono about-copy">Hi, I am Mohamed, a Software Engineer specializing in Web and SaaS Applications. I have worked in the software development field since 2016, gaining experience at companies across Egypt, India, and Saudi Arabia. Additionally, I work as a freelancer for both companies and individuals. Beyond web applications, I have extensive experience with Flutter, the cross-platform mobile development framework, alongside foundational knowledge of native Android and ios development using Kotlin and Swift.</p></div><img src="about.png" alt="Mohamed outdoors" /></section>

      <section id="contact" className="section-wrap contact"><div className="contact-form"><p className="muted mono">I&apos;d Love to Hear From You</p><SectionTitle title="Contact Me" /><p className="mono contact-copy">Whether you have a project idea, a remote job opportunity,Need a Consultation, or just want to say hello, feel free to reach out. It is always a pleasure to connect with fellow developers and teams worldwide.</p><form><input placeholder="Your Name" /><input type="email" placeholder="Your Email" /><textarea placeholder="Your Message" rows={5} /><button className="button button-primary" type="submit">Send</button></form></div><aside className="social"><h3>My Social Media Channels</h3><div className="social-icons"><a href="#contact" aria-label="LinkedIn"><GitBranch /></a><a href="#contact" aria-label="GitHub"><GitBranch /></a><a href="#contact" aria-label="Email"><Mail /></a></div><a className="button button-cyan" href="#contact">Download my Cv</a><p className="mono email"><Mail /> Mohamed@Abouelsaad.Cloud</p><p className="mono orange-copy">I am based in Egypt but I am fully set up for remote work across global time zones</p></aside></section>

      <section id="blog" className="section-wrap blog"><p className="muted mono">My Latest Articles</p><SectionTitle title="Blog" /><div className="blog-grid">{blogImages.map((src, i) => <article key={src}><img src={src} alt="" /><h3>{['AI will Transform Education', 'New Features in Latest Release of Node.js', 'Top Skills should be adopted by Software Engineers'][i]}</h3></article>)}</div><div className="blog-action"><a href="#blog" className="button button-primary">Read More</a></div></section>

      <footer className="footer"><div className="footer-brand"><img src="/abouelsaad-logo.png" />
<p className="mono">Mohamed is a Full-Stack &amp; Mobile Software Engineer specializing in Node.js, and robust cloud ecosystems.</p></div><div><h3>Links</h3>{navItems.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div><div><h3>Subscribe to My Newsletter</h3><input placeholder="Your Email" /><a href="#blog" className="button button-primary">Subscribe</a></div><div><h3>My Social Media Channels</h3><div className="social-icons"><a href="#contact" aria-label="LinkedIn"><GitBranch /></a><a href="#contact" aria-label="GitHub"><GitBranch /></a><a href="#contact" aria-label="Email"><Mail /></a></div><a className="button button-cyan" href="#contact">Download my Cv</a></div></footer>
    </main>
  )
}
