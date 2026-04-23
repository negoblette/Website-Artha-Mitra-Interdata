import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getContent } from '@/lib/content';

export const runtime = 'nodejs';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = (body?.name || '').trim();
    const company = (body?.company || '').trim();
    const email = (body?.email || '').trim();
    const phone = (body?.phone || '').trim();
    const message = (body?.message || '').trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    const global = getContent('global');
    const recipient = global?.contact?.formRecipient || global?.contact?.email;

    if (!recipient) {
      return NextResponse.json({ error: 'Recipient email is not configured in CMS.' }, { status: 500 });
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
    });

    const fromName = process.env.CONTACT_FROM_NAME || 'AMI Website';
    const fromAddress = process.env.CONTACT_FROM_EMAIL || user;

    const subject = `New Contact Form Submission - ${name}`;
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company || '-'}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || '-'}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br />')}</p>
    `;

    await transporter.sendMail({
      from: `${fromName} <${fromAddress}>`,
      to: recipient,
      subject,
      html,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
