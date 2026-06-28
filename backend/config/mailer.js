/**
 * Mailer – uses Resend HTTP API for transactional emails.
 *
 * Why Resend?
 *   • Simple HTTP API over HTTPS (port 443) – works everywhere.
 *   • No SMTP port issues on any hosting platform.
 *   • Instant account activation, no waiting for approval.
 *   • Free tier: 100 emails/day, 3000/month.
 *
 * Required env vars:
 *   RESEND_API_KEY  – from Resend dashboard → API Keys
 *   SENDER_EMAIL    – verified domain email (e.g. dhclothi@dhclothing.in)
 *   SENDER_NAME     – display name for outgoing emails (e.g. DH Clothing)
 */

const RESEND_API_URL = 'https://api.resend.com/emails';

export const sendOtpMail = async (to, otp) => {
  const apiKey = process.env.RESEND_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL || 'dhclothi@dhclothing.in';
  const senderName = process.env.SENDER_NAME || 'DH Clothing';

  if (!apiKey) {
    // Graceful fallback for local dev when API key is not set
    console.log(`[MAILER] RESEND_API_KEY not configured. Would send to ${to}: OTP=${otp}`);
    return { mocked: true };
  }

  const payload = {
    from: `${senderName} <${senderEmail}>`,
    to: [to],
    subject: 'Your verification code',
    html: `<p>Your verification code is:</p><h2>${otp}</h2><p>It expires in 10 minutes.</p>`,
  };

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('[MAILER] Resend API error:', response.status, errorBody);
    throw new Error(`Email sending failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  console.log(`[MAILER] OTP email sent to ${to}, id: ${data.id}`);
  return data;
};
