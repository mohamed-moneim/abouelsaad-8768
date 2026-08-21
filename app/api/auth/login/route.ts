import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
async function ensureSchema() { await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto'); await pool.query(`CREATE TABLE IF NOT EXISTS admin_users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text UNIQUE NOT NULL, name text NOT NULL, password_hash text NOT NULL, role text NOT NULL CHECK (role IN ('admin', 'editor', 'author')), created_at timestamptz NOT NULL DEFAULT now())`) }
export async function POST(request: NextRequest) { await ensureSchema(); const input = z.object({ email: z.string().email(), password: z.string().min(8) }).parse(await request.json()); const result = await pool.query('SELECT id, role, password_hash FROM admin_users WHERE email = $1', [input.email.toLowerCase()]); const admin = result.rows[0]; const secret = process.env.BETTER_AUTH_SECRET ?? process.env.JWT_SECRET; if (!secret || !admin || !(await bcrypt.compare(input.password, admin.password_hash))) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }); return NextResponse.json({ token: jwt.sign({ id: admin.id, role: admin.role }, secret, { expiresIn: '7d' }), role: admin.role }) }
