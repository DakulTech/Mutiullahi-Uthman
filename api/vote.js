/**
 * api/votes.js — Vercel Serverless Function
 * Handles live portfolio voting with Neon Serverless PostgreSQL
 *
 * ─── Setup ───────────────────────────────────────────────────────────────────
 * 1. Neon is already connected — Vercel auto-injected DATABASE_URL ✓
 * 2. Add the Neon driver: npm install @neondatabase/serverless
 * 3. On first deploy, the table is created automatically (see initTable below)
 *
 * Environment variables (auto-added by Neon + Vercel integration):
 *   DATABASE_URL   — pooled connection string (use this one)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { neon } from '@neondatabase/serverless';

const VALID_IDS   = ['fire', 'sparkle', 'rocket', 'bulb', 'clap'];
const RATE_LIMIT  = new Map(); // in-memory per cold-start
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_MAX    = 1; // 1 vote per IP per window

function isRateLimited(ip) {
  const now   = Date.now();
  const entry = RATE_LIMIT.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_WINDOW) {
    RATE_LIMIT.set(ip, { count: 1, start: now });
    return false;
  }
  if (entry.count >= RATE_MAX) return true;
  entry.count++;
  RATE_LIMIT.set(ip, entry);
  return false;
}

// ── Ensure the votes table exists (runs on every cold-start, idempotent) ──
async function initTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_votes (
      reaction_id TEXT PRIMARY KEY,
      count       INTEGER NOT NULL DEFAULT 0
    )
  `;

  // Seed rows for all valid reactions (do nothing if already exist)
  for (const id of VALID_IDS) {
    await sql`
      INSERT INTO portfolio_votes (reaction_id, count)
      VALUES (${id}, 0)
      ON CONFLICT (reaction_id) DO NOTHING
    `;
  }
}

// ── Read all vote counts into a plain object ──
async function getAllVotes(sql) {
  const rows = await sql`SELECT reaction_id, count FROM portfolio_votes`;
  const result = { fire: 0, sparkle: 0, rocket: 0, bulb: 0, clap: 0 };
  rows.forEach(row => {
    if (VALID_IDS.includes(row.reaction_id)) {
      result[row.reaction_id] = parseInt(row.count, 10);
    }
  });
  return result;
}

export default async function handler(req, res) {
  // ── CORS ──
  res.setHeader('Access-Control-Allow-Origin', 'https://mutiullahi-uthman.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── Connect to Neon ──
  const sql = neon(process.env.DATABASE_URL);

  try {
    await initTable(sql);
  } catch (err) {
    console.error('Table init error:', err);
    return res.status(500).json({ error: 'Database setup failed.' });
  }

  // ── GET — return current vote counts ──
  if (req.method === 'GET') {
    try {
      const votes = await getAllVotes(sql);
      return res.status(200).json({ success: true, votes });
    } catch (err) {
      console.error('GET votes error:', err);
      return res.status(500).json({ error: 'Failed to fetch votes.' });
    }
  }

  // ── POST — record a vote ──
  if (req.method === 'POST') {
    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
      .split(',')[0].trim();

    if (isRateLimited(ip)) {
      return res.status(429).json({ error: 'You already voted recently.' });
    }

    const { reactionId } = req.body || {};

    if (!reactionId || !VALID_IDS.includes(reactionId)) {
      return res.status(400).json({ error: 'Invalid reaction ID.' });
    }

    try {
      // Atomically increment the count
      await sql`
        UPDATE portfolio_votes
        SET count = count + 1
        WHERE reaction_id = ${reactionId}
      `;

      const votes = await getAllVotes(sql);
      return res.status(200).json({ success: true, votes });
    } catch (err) {
      console.error('POST vote error:', err);
      return res.status(500).json({ error: 'Failed to record vote.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}