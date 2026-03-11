/**
 * api/votes.js — Vercel Serverless Function
 * Neon PostgreSQL
 *
 * ── How to read the logs ─────────────────────────────────────────────────────
 *  Vercel dashboard → your project → Logs tab → filter by "votes"
 *
 *  [votes] FATAL: DATABASE_URL is not set
 *    → Go to Vercel Settings → Environment Variables → confirm DATABASE_URL exists
 *       and is set for the correct environment (Production / Preview / Development)
 *
 *  [votes] Neon client init error: ...
 *    → DATABASE_URL exists but is malformed. Reconnect Neon in Vercel Integrations.
 *
 *  [votes] initTable error: ...
 *    → Connected to Neon but SQL failed. Usually a permissions issue or wrong DB.
 *
 *  [votes] GET ok: {...}  /  POST ok, totals: {...}
 *    → Everything is working correctly.
 *
 *  [votes] DB connected to: <hostname>
 *    → Confirms which Neon host is being used.
 *
 *  ── Quick debug endpoint ─────────────────────────────────────────────────────
 *  GET /api/votes?debug=1  →  returns JSON with connection status, table existence,
 *                              and env var presence. Remove debug mode before going live.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { neon } from '@neondatabase/serverless';

const VALID_IDS   = ['fire', 'sparkle', 'rocket', 'bulb', 'clap'];
const RATE_LIMIT  = new Map();
const RATE_WINDOW = 60 * 60 * 1000;
const RATE_MAX    = 1;

function isRateLimited(ip) {
  const now   = Date.now();
  const entry = RATE_LIMIT.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_WINDOW) { RATE_LIMIT.set(ip, { count: 1, start: now }); return false; }
  if (entry.count >= RATE_MAX) return true;
  entry.count++;
  RATE_LIMIT.set(ip, entry);
  return false;
}

async function initTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_votes (
      reaction_id TEXT PRIMARY KEY,
      count       INTEGER NOT NULL DEFAULT 0
    )
  `;
  for (const id of VALID_IDS) {
    await sql`
      INSERT INTO portfolio_votes (reaction_id, count)
      VALUES (${id}, 0)
      ON CONFLICT (reaction_id) DO NOTHING
    `;
  }
}

async function getAllVotes(sql) {
  const rows   = await sql`SELECT reaction_id, count FROM portfolio_votes`;
  const result = { fire: 0, sparkle: 0, rocket: 0, bulb: 0, clap: 0 };
  rows.forEach(row => {
    if (VALID_IDS.includes(row.reaction_id)) result[row.reaction_id] = parseInt(row.count, 10);
  });
  return result;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const isDebug = req.method === 'GET' && req.query?.debug === '1';

  // ── Guard: DATABASE_URL must exist ──────────────────────────────────────────
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('[votes] FATAL: DATABASE_URL is not set. Check Vercel → Settings → Environment Variables.');
    return res.status(500).json({
      error: 'DATABASE_URL not configured.',
      fix:   'Go to Vercel dashboard → Settings → Environment Variables → confirm DATABASE_URL exists for this environment.'
    });
  }

  // Log masked hostname so you can confirm which DB is being targeted
  let dbHost = '(unknown)';
  try { dbHost = new URL(dbUrl).hostname; } catch (_) {}
  console.log('[votes] DB target host:', dbHost);

  // ── Connect ──────────────────────────────────────────────────────────────────
  let sql;
  try {
    sql = neon(dbUrl);
    console.log('[votes] Neon client initialised OK');
  } catch (err) {
    console.error('[votes] Neon client init error:', err.message);
    return res.status(500).json({ error: 'DB client init failed.', detail: err.message });
  }

  // ── Init table ───────────────────────────────────────────────────────────────
  try {
    await initTable(sql);
    console.log('[votes] Table ready');
  } catch (err) {
    console.error('[votes] initTable error:', err.message, '\nStack:', err.stack);
    return res.status(500).json({ error: 'DB init failed.', detail: err.message });
  }

  // ── Debug endpoint: GET /api/votes?debug=1 ───────────────────────────────────
  if (isDebug) {
    try {
      const rows  = await sql`SELECT reaction_id, count FROM portfolio_votes`;
      const total = rows.reduce((s, r) => s + parseInt(r.count, 10), 0);
      return res.status(200).json({
        debug:          true,
        db_host:        dbHost,
        table_exists:   true,
        row_count:      rows.length,
        total_votes:    total,
        rows,
        env_vars_found: {
          DATABASE_URL: !!process.env.DATABASE_URL,
        },
      });
    } catch (err) {
      return res.status(500).json({ debug: true, error: err.message, stack: err.stack });
    }
  }

  // ── GET — return current vote counts ─────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const votes = await getAllVotes(sql);
      console.log('[votes] GET ok:', JSON.stringify(votes));
      return res.status(200).json({ success: true, votes });
    } catch (err) {
      console.error('[votes] GET error:', err.message);
      return res.status(500).json({ error: 'Failed to fetch votes.', detail: err.message });
    }
  }

  // ── POST — record a vote ──────────────────────────────────────────────────────
  if (req.method === 'POST') {
    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
      .split(',')[0].trim();

    if (isRateLimited(ip)) {
      console.log('[votes] Rate limited ip:', ip);
      return res.status(429).json({ error: 'Already voted recently.' });
    }

    const { reactionId } = req.body || {};
    console.log('[votes] POST reactionId:', reactionId, '| ip:', ip);

    if (!reactionId || !VALID_IDS.includes(reactionId)) {
      console.warn('[votes] Invalid reactionId received:', reactionId);
      return res.status(400).json({ error: 'Invalid reaction: ' + reactionId });
    }

    try {
      const updated = await sql`
        UPDATE portfolio_votes SET count = count + 1
        WHERE reaction_id = ${reactionId}
        RETURNING count
      `;
      console.log('[votes] Incremented', reactionId, '→ new count:', updated[0]?.count);
      const votes = await getAllVotes(sql);
      console.log('[votes] POST ok, totals:', JSON.stringify(votes));
      return res.status(200).json({ success: true, votes });
    } catch (err) {
      console.error('[votes] POST error:', err.message, '\nStack:', err.stack);
      return res.status(500).json({ error: 'Failed to record vote.', detail: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}