import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureSchema() {
  await pool.query(`CREATE TABLE IF NOT EXISTS articles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, slug text UNIQUE NOT NULL, excerpt text NOT NULL, content text NOT NULL, image_url text, author_id uuid NOT NULL, published boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`)
}

export async function GET() {
  try {
    await ensureSchema()
    const result = await pool.query('SELECT id, title, slug, excerpt, content, image_url, created_at FROM articles WHERE published = true ORDER BY created_at DESC')
    return NextResponse.json(result.rows)
  } catch {
    return NextResponse.json({ error: 'Could not load articles' }, { status: 500 })
  }
}
