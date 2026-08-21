'use client'

import { FormEvent, useState } from 'react'
import useSWR from 'swr'

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''
type Project = { id: string; title: string; slug: string; description: string; image_url?: string | null; category: 'web' | 'mobile' | 'self'; url?: string | null }
const fetchProjects = (token: string) => fetch(`${apiBase}/api/portfolio`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json() as Promise<Project[]>)

export default function AdminPortfolioPage() {
  const [token, setToken] = useState('')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [form, setForm] = useState({ title: '', slug: '', description: '', imageUrl: '', category: 'web', url: '' })
  const [message, setMessage] = useState('')
  const { data: projects, mutate } = useSWR(token ? ['admin-portfolio', token] : null, ([, authToken]) => fetchProjects(authToken))

  async function login(event: FormEvent) {
    event.preventDefault()
    const response = await fetch(`${apiBase}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) })
    const result = await response.json()
    if (!response.ok) return setMessage(result.error ?? 'Login failed')
    setToken(result.token)
    setMessage('')
  }

  async function createProject(event: FormEvent) {
    event.preventDefault()
    const response = await fetch(`${apiBase}/api/portfolio`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...form, imageUrl: form.imageUrl || undefined, url: form.url || undefined }) })
    const result = await response.json()
    if (!response.ok) return setMessage(result.error ?? 'Could not create project')
    setForm({ title: '', slug: '', description: '', imageUrl: '', category: 'web', url: '' })
    setMessage('Project created')
    mutate()
  }

  async function removeProject(id: string) {
    await fetch(`${apiBase}/api/portfolio/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    mutate()
  }

  if (!token) return <main className="admin-shell"><section className="admin-panel"><p className="muted mono">Portfolio administration</p><h1>Sign in to manage projects</h1><form onSubmit={login} className="admin-form"><input type="email" placeholder="Email" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} required /><input type="password" placeholder="Password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} required minLength={8} /><button className="button button-primary" type="submit">Sign in</button></form>{message && <p className="form-message">{message}</p>}</section></main>

  return <main className="admin-shell"><section className="admin-panel"><div className="admin-heading"><div><p className="muted mono">Portfolio administration</p><h1>Manage projects</h1></div><button className="button button-outline" onClick={() => setToken('')}>Sign out</button></div><form onSubmit={createProject} className="admin-form"><input placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /><input placeholder="Slug (e.g. clinic-platform)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required pattern="[a-z0-9-]+" /><textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} /><input placeholder="Image URL (optional)" type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="web">Web Apps</option><option value="mobile">Mobile Apps</option><option value="self">Self Projects</option></select><input placeholder="Project URL (optional)" type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /><button className="button button-primary" type="submit">Add project</button></form>{message && <p className="form-message">{message}</p>}<div className="admin-projects">{projects?.map((project) => <article key={project.id}><div><strong>{project.title}</strong><p className="mono">{project.category} · {project.slug}</p></div><button className="button button-outline" onClick={() => removeProject(project.id)}>Delete</button></article>)}</div></section></main>
}
