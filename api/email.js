/**
 * api/email.js — Vercel Serverless Function
 * Handles: newsletter subscriptions + contact form submissions
 *
 * Environment variables required (set in Vercel dashboard → Settings → Environment Variables):
 *   SMTP_HOST       e.g. smtp.gmail.com
 *   SMTP_PORT       e.g. 465
 *   SMTP_USER       your Gmail address  e.g. uthmanmutiullahiadedokun@gmail.com
 *   SMTP_PASS       Gmail App Password  (NOT your normal password — see README below)
 *   NOTIFY_TO       where to receive notifications e.g. uthmanmutiullahiadedokun@gmail.com
 */

const nodemailer = require('nodemailer');

// ─── Simple in-memory rate limiter (per IP, resets on cold start) ────────────
const rateLimitMap = new Map();
const RATE_LIMIT    = 3;   // max requests
const RATE_WINDOW   = 60 * 60 * 1000; // per 1 hour (ms)

function isRateLimited(ip) {
  const now  = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };

  if (now - entry.start > RATE_WINDOW) {
    // Window expired — reset
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;

  entry.count++;
  rateLimitMap.set(ip, entry);
  return false;
}

// ─── Email validation ────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

// ─── Nodemailer transporter ──────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT || '465', 10),
    secure: parseInt(process.env.SMTP_PORT || '465', 10) === 465, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ─── Email templates ─────────────────────────────────────────────────────────

/** Notification email sent TO you when someone subscribes */
function newsletterNotifyHtml(subscriberEmail) {
  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;color:#111;">
      <div style="background:#111;padding:28px 32px;border-radius:8px 8px 0 0;">
        <p style="color:#C8B89A;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">DakulTech Portfolio</p>
        <h2 style="color:#F2EDE4;margin:0;font-size:22px;font-weight:700;">📬 New Newsletter Subscriber</h2>
      </div>
      <div style="background:#FDFAF6;padding:28px 32px;border-radius:0 0 8px 8px;border:1px solid #D8D2C8;border-top:none;">
        <p style="margin:0 0 16px;font-size:14px;color:#555550;">Someone just subscribed to your newsletter:</p>
        <div style="background:#F2EDE4;border:1px solid #D8D2C8;border-radius:4px;padding:14px 18px;margin-bottom:20px;">
          <strong style="font-size:15px;color:#111;">${subscriberEmail}</strong>
        </div>
        <p style="margin:0;font-size:12px;color:#999;">Received via mutiullahi-uthman-portfolio.vercel.app</p>
      </div>
    </div>
  `;
}

/** Confirmation email sent TO the subscriber */
function newsletterConfirmHtml(subscriberEmail) {
  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;color:#111;">
      <div style="background:#111;padding:28px 32px;border-radius:8px 8px 0 0;">
        <p style="color:#C8B89A;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">Mutiullahi Uthman</p>
        <h2 style="color:#F2EDE4;margin:0;font-size:22px;font-weight:700;">You're subscribed ✦</h2>
      </div>
      <div style="background:#FDFAF6;padding:28px 32px;border-radius:0 0 8px 8px;border:1px solid #D8D2C8;border-top:none;">
        <p style="margin:0 0 14px;font-size:14px;color:#555550;">Hey there,</p>
        <p style="margin:0 0 14px;font-size:14px;color:#555550;">
          Thanks for subscribing! You'll hear from me when I publish new articles,
          share project updates, or have something worth reading.
        </p>
        <p style="margin:0 0 24px;font-size:14px;color:#555550;">No spam — ever. Unsubscribe any time by replying to this email.</p>
        <a href="https://mutiullahi-uthman-portfolio.vercel.app"
           style="display:inline-block;background:#111;color:#F2EDE4;padding:12px 24px;border-radius:4px;font-size:13px;font-weight:700;letter-spacing:1px;text-decoration:none;text-transform:uppercase;">
          Visit Portfolio →
        </a>
        <p style="margin:24px 0 0;font-size:12px;color:#999;">— Mutiullahi Uthman · DakulTech</p>
      </div>
    </div>
  `;
}

/** Notification email sent TO you when someone submits the contact form */
function contactNotifyHtml({ name, email, subject, message, selectedSubject }) {
  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#111;">
      <div style="background:#111;padding:28px 32px;border-radius:8px 8px 0 0;">
        <p style="color:#C8B89A;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">DakulTech Portfolio</p>
        <h2 style="color:#F2EDE4;margin:0;font-size:22px;font-weight:700;">📩 New Contact Form Submission</h2>
      </div>
      <div style="background:#FDFAF6;padding:28px 32px;border-radius:0 0 8px 8px;border:1px solid #D8D2C8;border-top:none;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #D8D2C8;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#C8B89A;width:110px;">Name</td>
            <td style="padding:8px 0;border-bottom:1px solid #D8D2C8;font-size:14px;color:#111;font-weight:600;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #D8D2C8;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#C8B89A;">Email</td>
            <td style="padding:8px 0;border-bottom:1px solid #D8D2C8;font-size:14px;color:#111;">
              <a href="mailto:${escapeHtml(email)}" style="color:#111;">${escapeHtml(email)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #D8D2C8;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#C8B89A;">Category</td>
            <td style="padding:8px 0;border-bottom:1px solid #D8D2C8;font-size:14px;color:#111;">${escapeHtml(selectedSubject || '—')}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#C8B89A;">Subject</td>
            <td style="padding:8px 0;font-size:14px;color:#111;">${escapeHtml(subject || '—')}</td>
          </tr>
        </table>
        <div style="background:#F2EDE4;border:1px solid #D8D2C8;border-radius:4px;padding:16px 18px;margin-bottom:20px;">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#C8B89A;">Message</p>
          <p style="margin:0;font-size:14px;color:#111;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</p>
        </div>
        <a href="mailto:${escapeHtml(email)}?subject=Re: ${encodeURIComponent(subject || 'Your message')}"
           style="display:inline-block;background:#111;color:#F2EDE4;padding:12px 24px;border-radius:4px;font-size:13px;font-weight:700;letter-spacing:1px;text-decoration:none;text-transform:uppercase;">
          Reply to ${escapeHtml(name)} →
        </a>
        <p style="margin:20px 0 0;font-size:12px;color:#999;">Received via mutiullahi-uthman-portfolio.vercel.app</p>
      </div>
    </div>
  `;
}

/** Auto-reply sent TO the person who filled the contact form */
function contactAutoReplyHtml(name) {
  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;color:#111;">
      <div style="background:#111;padding:28px 32px;border-radius:8px 8px 0 0;">
        <p style="color:#C8B89A;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">Mutiullahi Uthman</p>
        <h2 style="color:#F2EDE4;margin:0;font-size:22px;font-weight:700;">Got your message ✦</h2>
      </div>
      <div style="background:#FDFAF6;padding:28px 32px;border-radius:0 0 8px 8px;border:1px solid #D8D2C8;border-top:none;">
        <p style="margin:0 0 14px;font-size:14px;color:#555550;">Hey ${escapeHtml(name)},</p>
        <p style="margin:0 0 14px;font-size:14px;color:#555550;">
          Thanks for reaching out — I've received your message and will get back to you
          within 24 hours.
        </p>
        <p style="margin:0 0 24px;font-size:14px;color:#555550;">
          In the meantime, feel free to check out my latest work or connect with me on LinkedIn.
        </p>
        <a href="https://mutiullahi-uthman-portfolio.vercel.app/projects.html"
           style="display:inline-block;background:#111;color:#F2EDE4;padding:12px 24px;border-radius:4px;font-size:13px;font-weight:700;letter-spacing:1px;text-decoration:none;text-transform:uppercase;">
          View My Projects →
        </a>
        <p style="margin:24px 0 0;font-size:12px;color:#999;">— Mutiullahi Uthman · DakulTech</p>
      </div>
    </div>
  `;
}

// ─── HTML escape helper ──────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── Main handler ─────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  // CORS headers (adjust origin in production if needed)
  res.setHeader('Access-Control-Allow-Origin', 'https://mutiullahi-uthman.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // Env var check
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('Missing SMTP_USER or SMTP_PASS environment variables');
    return res.status(500).json({ error: 'Server misconfiguration. Please try again later.' });
  }

  const { type } = req.body || {};

  // ── Route by type ──────────────────────────────────────────────────────────
  try {
    const transporter = createTransporter();

    // ── 1. Newsletter subscription ──
    if (type === 'newsletter') {
      const { email } = req.body;

      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
      }

      const notifyTo = process.env.NOTIFY_TO || process.env.SMTP_USER;

      await Promise.all([
        // Notify you
        transporter.sendMail({
          from:    `"DakulTech Portfolio" <${process.env.SMTP_USER}>`,
          to:      notifyTo,
          subject: `New newsletter subscriber: ${email}`,
          html:    newsletterNotifyHtml(email),
        }),
        // Confirm to subscriber
        transporter.sendMail({
          from:    `"Mutiullahi Uthman" <${process.env.SMTP_USER}>`,
          to:      email,
          subject: 'You\'re subscribed to DakulTech updates ✦',
          html:    newsletterConfirmHtml(email),
        }),
      ]);

      return res.status(200).json({ success: true, message: 'Subscribed successfully!' });
    }

    // ── 2. Contact form submission ──
    if (type === 'contact') {
      const { name, email, subject, message, selectedSubject } = req.body;

      // Validate required fields
      const errors = {};
      if (!name?.trim())          errors.name    = 'Name is required.';
      if (!isValidEmail(email))   errors.email   = 'Valid email is required.';
      if (!message?.trim())       errors.message = 'Message is required.';

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ error: 'Validation failed.', fields: errors });
      }

      // Basic spam/abuse guard
      if (message.length > 5000) {
        return res.status(400).json({ error: 'Message is too long.' });
      }

      const notifyTo = process.env.NOTIFY_TO || process.env.SMTP_USER;

      await Promise.all([
        // Notify you with full details + one-click reply button
        transporter.sendMail({
          from:    `"DakulTech Portfolio" <${process.env.SMTP_USER}>`,
          to:      notifyTo,
          replyTo: email,
          subject: `[Contact] ${subject || selectedSubject || 'New message'} — from ${name}`,
          html:    contactNotifyHtml({ name, email, subject, message, selectedSubject }),
        }),
        // Auto-reply to sender
        transporter.sendMail({
          from:    `"Mutiullahi Uthman" <${process.env.SMTP_USER}>`,
          to:      email,
          subject: 'Got your message — I\'ll be in touch soon ✦',
          html:    contactAutoReplyHtml(name),
        }),
      ]);

      return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    }

    // Unknown type
    return res.status(400).json({ error: 'Invalid request type. Use "newsletter" or "contact".' });

  } catch (err) {
    console.error('Email API error:', err);
    return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
};