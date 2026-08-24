import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const result = await pool.query(
      'SELECT id, title, slug, excerpt, content, image_url, created_at FROM articles WHERE slug = $1 AND published = true LIMIT 1',
      [slug],
    )
    if (!result.rows[0]) return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    return NextResponse.json(result.rows[0])
  } catch {
    return NextResponse.json({ error: 'Could not load article' }, { status: 500 })
  }
}
