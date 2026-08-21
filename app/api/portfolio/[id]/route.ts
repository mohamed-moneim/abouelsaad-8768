import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import jwt from 'jsonwebtoken'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) { const secret = process.env.BETTER_AUTH_SECRET ?? process.env.JWT_SECRET; const token = request.headers.get('authorization')?.replace('Bearer ', ''); if (!secret || !token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 }); try { const current = jwt.verify(token, secret) as { role: string }; if (!['admin', 'editor'].includes(current.role)) return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 }); const { id } = await params; await pool.query('DELETE FROM portfolio_projects WHERE id = $1', [id]); return new NextResponse(null, { status: 204 }) } catch { return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 }) } }
