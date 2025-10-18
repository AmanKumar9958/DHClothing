import nodemailer from 'nodemailer'

let transporter = null;

export const getTransporter = () => {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
};

export const sendOtpMail = async (to, otp) => {
  const from = process.env.SMTP_FROM || 'dhclothing2025@gmail.com';
  const subject = 'Your verification code';
  const html = `<p>Your verification code is:</p><h2>${otp}</h2><p>It expires in 10 minutes.</p>`;

  const tx = getTransporter();
  if (!tx) {
    console.log(`[MAILER] SMTP not configured. Would send to ${to}: OTP=${otp}`);
    return { mocked: true };
  }

  const info = await tx.sendMail({ from, to, subject, html });
  return info;
};
