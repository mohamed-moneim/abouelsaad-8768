import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number(searchParams.get('page') || 1))
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 6)))
    const offset = (page - 1) * limit
    const result = await pool.query('SELECT id, title, slug, excerpt, content, image_url, created_at FROM articles WHERE published = true ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset])
    const count = await pool.query('SELECT COUNT(*)::int AS total FROM articles WHERE published = true')
    return NextResponse.json({ articles: result.rows, total: count.rows[0].total, page, limit })
  } catch {
    return NextResponse.json({ error: 'Could not load articles' }, { status: 500 })
  }
}
