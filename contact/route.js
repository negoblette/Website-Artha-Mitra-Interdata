import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getContent } from '@/lib/content';
import { checkRateLimit } from '@/lib/rateLimit';
import { readJsonWithLimit, REQUEST_LIMITS } from '@/lib/requestLimits';
import { logRateLimitHit, logApiError } from '@/lib/auditLogger';


export const runtime = 'nodejs';

const MAX_NAME_LENGTH = 100;
const MAX_COMPANY_LENGTH = 120;
const MAX_PHONE_LENGTH = 40;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_SUBJECT_LENGTH = 140;

function normalizeHeaderValue(value) {
    return String(value || '').replace(/[\r\n]+/g, ' ').trim();
}


function escapeHtml(value){
    return String(value || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeHeaderValue(value));
}

export async function POST(request) {
  try {
    const rateLimit = await checkRateLimit(request, 'contact_form', {
      limit: 5,
      windowSeconds: 10 * 60,
      lockoutSeconds: 15 * 60,
    });

    if(!rateLimit.allowed) {
      await logRateLimitHit('/api/contact', request);

      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfter)},
        }
      );
    }

    const parsed = await readJsonWithLimit(request, REQUEST_LIMITS.contact);

    if (!parsed.ok) {
      return parsed.response;
    }

    const body = parsed.body;
    const name = String(body?.name || '').trim();
    const company = String(body?.company || '').trim();
    const email = String(body?.email || '').trim();
    const phone = String(body?.phone || '').trim();
    const message = String(body?.message || '').trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    if(!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    if (
      name.length > MAX_NAME_LENGTH ||
      company.length > MAX_COMPANY_LENGTH ||
      phone.length > MAX_PHONE_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json({ error: 'Invalid input length.' }, { status: 400 });
    }

    const global = getContent('global');
    const recipient = normalizeHeaderValue(
      global?.contact?.formRecipient || global?.contact?.email || ''
    );

    if (!isValidEmail(recipient)) {
      return NextResponse.json(
        { error: 'Mail recipient is not configured' },
        { status: 500 }
      );
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';

    if (!host || !user || !pass) {
      return NextResponse.json(
        { error: 'SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 10_000,
    });

    const safeName = normalizeHeaderValue(name).slice(0, MAX_NAME_LENGTH);
    const safeCompany = normalizeHeaderValue(company).slice(0, MAX_COMPANY_LENGTH);
    const safeEmail = normalizeHeaderValue(email);
    const safePhone = normalizeHeaderValue(phone).slice(0, MAX_PHONE_LENGTH);
    const safeMessage = message.slice(0, MAX_MESSAGE_LENGTH);

    const safeFromName = normalizeHeaderValue(process.env.CONTACT_FROM_NAME || 'AMI Website');
    const safeFromAddress = normalizeHeaderValue(process.env.CONTACT_FROM_EMAIL || user);
    const subject = normalizeHeaderValue(
      `New Contact Form Submission - ${safeName || 'Unknown'}`
    ).slice(0, MAX_SUBJECT_LENGTH);

    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
      <p><strong>Company:</strong> ${escapeHtml(safeCompany || '-')}</p>
      <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(safePhone || '-')}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(safeMessage).replace(/\n/g, '<br />')}</p>
    `;

    const text = [
      'New Contact Form Submission',
      `Name: ${safeName}`,
      `Company: ${safeCompany || '-'}`,
      `Email: ${safeEmail}`,
      `Phone: ${safePhone || '-'}`,
      '',
      `Message: ${safeMessage}`,
    ].join('\n');

    await transporter.sendMail({
      from: `${safeFromName} <${safeFromAddress}>`,
      to: recipient,
      subject,
      text,
      html,
      replyTo: safeEmail,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    await logApiError('/api/contact', 500, error?.message || 'Failed to send contact message.', request);

    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
