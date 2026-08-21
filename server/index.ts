import 'dotenv/config'
import express, { type NextFunction, type Request, type Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { Pool } from 'pg'
import { z } from 'zod'

const app = express()
const port = Number(process.env.API_PORT ?? 4000)
const jwtSecret = process.env.BETTER_AUTH_SECRET ?? process.env.JWT_SECRET
if (!jwtSecret) throw new Error('BETTER_AUTH_SECRET or JWT_SECRET is required to start the API')
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000', credentials: true }))
app.use(express.json({ limit: '1mb' }))

type Role = 'admin' | 'editor' | 'author'
type AuthRequest = Request & { user?: { id: string; role: Role } }
const tokenFor = (user: { id: string; role: Role }) => jwt.sign(user, jwtSecret, { expiresIn: '7d' })
const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'Authentication required' })
    req.user = jwt.verify(token, jwtSecret) as { id: string; role: Role }
    next()
  } catch { res.status(401).json({ error: 'Invalid or expired session' }) }
}
const allow = (...roles: Role[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: 'Insufficient permissions' })
  next()
}
const asyncRoute = (fn: (req: AuthRequest, res: Response) => Promise<unknown>) => (req: AuthRequest, res: Response, next: NextFunction) => fn(req, res).catch(next)

async function init() {
  await pool.query(`CREATE TABLE IF NOT EXISTS admin_users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text UNIQUE NOT NULL, name text NOT NULL, password_hash text NOT NULL, role text NOT NULL CHECK (role IN ('admin','editor','author')), created_at timestamptz NOT NULL DEFAULT now())`)
  await pool.query(`CREATE TABLE IF NOT EXISTS articles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, slug text UNIQUE NOT NULL, excerpt text NOT NULL, content text NOT NULL, image_url text, author_id uuid NOT NULL, published boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`)
  await pool.query(`CREATE TABLE IF NOT EXISTS portfolio_projects (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, slug text UNIQUE NOT NULL, description text NOT NULL, image_url text, category text NOT NULL CHECK (category IN ('web','mobile','self')), url text, owner_id uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`)
  await pool.query(`CREATE TABLE IF NOT EXISTS contact_messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, email text NOT NULL, message text NOT NULL, status text NOT NULL DEFAULT 'new', created_at timestamptz NOT NULL DEFAULT now())`)
}

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.post('/api/auth/login', asyncRoute(async (req, res) => {
  const input = z.object({ email: z.string().email(), password: z.string().min(8) }).parse(req.body)
  const result = await pool.query('SELECT id, role, password_hash FROM admin_users WHERE email = $1', [input.email.toLowerCase()])
  const user = result.rows[0]
  if (!user || !(await bcrypt.compare(input.password, user.password_hash))) return res.status(401).json({ error: 'Invalid credentials' })
  res.json({ token: tokenFor({ id: user.id, role: user.role }), role: user.role })
}))
app.post('/api/auth/users', auth, allow('admin'), asyncRoute(async (req, res) => {
  const input = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8), role: z.enum(['admin','editor','author']) }).parse(req.body)
  const hash = await bcrypt.hash(input.password, 12)
  const result = await pool.query('INSERT INTO admin_users (name,email,password_hash,role) VALUES ($1,$2,$3,$4) RETURNING id,name,email,role', [input.name, input.email.toLowerCase(), hash, input.role])
  res.status(201).json(result.rows[0])
}))

const articleInput = z.object({ title: z.string().min(2), slug: z.string().regex(/^[a-z0-9-]+$/), excerpt: z.string().min(2), content: z.string().min(2), imageUrl: z.string().url().optional(), published: z.boolean().optional() })
app.get('/api/articles', asyncRoute(async (_req, res) => { const result = await pool.query('SELECT * FROM articles WHERE published = true ORDER BY created_at DESC'); res.json(result.rows) }))
app.post('/api/articles', auth, allow('admin','editor','author'), asyncRoute(async (req, res) => { const i = articleInput.parse(req.body); const r = await pool.query('INSERT INTO articles (title,slug,excerpt,content,image_url,author_id,published) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *', [i.title,i.slug,i.excerpt,i.content,i.imageUrl ?? null,req.user!.id,i.published ?? false]); res.status(201).json(r.rows[0]) }))
app.put('/api/articles/:id', auth, allow('admin','editor','author'), asyncRoute(async (req, res) => { const i = articleInput.partial().parse(req.body); const r = await pool.query('UPDATE articles SET title=COALESCE($1,title),slug=COALESCE($2,slug),excerpt=COALESCE($3,excerpt),content=COALESCE($4,content),image_url=COALESCE($5,image_url),published=COALESCE($6,published),updated_at=now() WHERE id=$7 AND ($8 IN (\'admin\',\'editor\') OR author_id=$9) RETURNING *', [i.title,i.slug,i.excerpt,i.content,i.imageUrl,i.published,req.params.id,req.user!.role,req.user!.id]); if (!r.rowCount) return res.status(404).json({error:'Article not found'}); res.json(r.rows[0]) }))
app.delete('/api/articles/:id', auth, allow('admin','editor'), asyncRoute(async (req, res) => { await pool.query('DELETE FROM articles WHERE id=$1',[req.params.id]); res.status(204).end() }))

const projectInput = z.object({ title:z.string().min(2), slug:z.string().regex(/^[a-z0-9-]+$/), description:z.string().min(2), imageUrl:z.string().url().optional(), category:z.enum(['web','mobile','self']), url:z.string().url().optional() })
app.get('/api/portfolio', asyncRoute(async (req, res) => { const category = req.query.category as string | undefined; const r = await pool.query(category ? 'SELECT * FROM portfolio_projects WHERE category=$1 ORDER BY created_at DESC' : 'SELECT * FROM portfolio_projects ORDER BY created_at DESC', category ? [category] : []); res.json(r.rows) }))
app.post('/api/portfolio', auth, allow('admin','editor'), asyncRoute(async (req,res)=>{const i=projectInput.parse(req.body);const r=await pool.query('INSERT INTO portfolio_projects (title,slug,description,image_url,category,url,owner_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',[i.title,i.slug,i.description,i.imageUrl??null,i.category,i.url??null,req.user!.id]);res.status(201).json(r.rows[0])}))
app.delete('/api/portfolio/:id', auth, allow('admin','editor'), asyncRoute(async (req,res)=>{await pool.query('DELETE FROM portfolio_projects WHERE id=$1',[req.params.id]);res.status(204).end()}))

app.post('/api/contact', asyncRoute(async (req, res) => {
  const input = z.object({ name: z.string().min(2), email: z.string().email(), message: z.string().min(10) }).parse(req.body)
  await pool.query('INSERT INTO contact_messages (name,email,message) VALUES ($1,$2,$3)', [input.name, input.email, input.message])
  if (process.env.SMTP_HOST) {
    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: process.env.SMTP_SECURE === 'true', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } })
    await transporter.sendMail({ from: process.env.SMTP_FROM ?? process.env.SMTP_USER, to: 'mohamed@abouelsaad.cloud', replyTo: input.email, subject: `Portfolio contact from ${input.name}`, text: input.message })
  }
  res.status(201).json({ message: 'Message received' })
}))
app.get('/api/contact', auth, allow('admin', 'editor'), asyncRoute(async (_req, res) => {
  const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC')
  res.json(result.rows)
}))
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => { if (err instanceof z.ZodError) return res.status(400).json({error:'Invalid input', details:err.flatten()}); console.error('[api]',err); res.status(500).json({error:'Internal server error'}) })
init().then(()=>app.listen(port,()=>console.log(`[api] listening on ${port}`))).catch((error)=>{console.error('[api] startup failed',error);process.exit(1)})
