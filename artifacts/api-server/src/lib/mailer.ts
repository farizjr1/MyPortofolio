import nodemailer, { type Transporter } from "nodemailer";

let _transporter: Transporter | null = null;

/** Returns a cached nodemailer transporter using Gmail SMTP, or null if not configured. */
export function getTransporter(): Transporter | null {
  const user = process.env.SMTP_EMAIL;
  const pass = process.env.SMTP_APP_PASSWORD;
  if (!user || !pass) return null;
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 587,
      secure: false, //TLS
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000, 
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }
  return _transporter;
}

export const smtpFrom    = () => `"Portfolio" <${process.env.SMTP_EMAIL ?? ""}>`;
export const contactTo   = () => process.env.CONTACT_TO_EMAIL ?? process.env.SMTP_EMAIL ?? "";
export const frontendUrl = () => process.env.CORS_ORIGIN ?? "http://localhost:5173";

// ─── Email Templates ──────────────────────────────────────────────────────────

export function verifyEmailHtml(name: string, verifyUrl: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#333">
      <h2 style="color:#4f46e5">Verifikasi Email Kamu</h2>
      <p>Hai <strong>${name}</strong>,</p>
      <p>Klik tombol di bawah untuk memverifikasi email akun portfolio kamu.
         Link ini berlaku selama <strong>24 jam</strong>.</p>
      <div style="text-align:center;margin:32px 0">
        <a href="${verifyUrl}"
           style="background:#4f46e5;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block">
          Verifikasi Email
        </a>
      </div>
      <p style="color:#888;font-size:12px">
        Jika tombol tidak berfungsi, salin link ini ke browser:<br>
        <a href="${verifyUrl}" style="color:#4f46e5">${verifyUrl}</a>
      </p>
      <p style="color:#aaa;font-size:11px;margin-top:24px">
        Jika kamu tidak mendaftar, abaikan email ini.
      </p>
    </div>`;
}

export function resetPasswordHtml(name: string, resetUrl: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#333">
      <h2 style="color:#4f46e5">Reset Password</h2>
      <p>Hai <strong>${name}</strong>,</p>
      <p>Kami menerima permintaan reset password untuk akun kamu.
         Klik tombol di bawah — link berlaku selama <strong>1 jam</strong>.</p>
      <div style="text-align:center;margin:32px 0">
        <a href="${resetUrl}"
           style="background:#4f46e5;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block">
          Reset Password
        </a>
      </div>
      <p style="color:#888;font-size:12px">
        Jika tombol tidak berfungsi, salin link ini ke browser:<br>
        <a href="${resetUrl}" style="color:#4f46e5">${resetUrl}</a>
      </p>
      <p style="color:#aaa;font-size:11px;margin-top:24px">
        Jika kamu tidak meminta reset password, abaikan email ini. Password tidak akan berubah.
      </p>
    </div>`;
}

export function contactEmailHtml(
  name: string, email: string, subject: string, message: string,
) {
  const safeMsg = String(message)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
      <h2 style="border-bottom:2px solid #eee;padding-bottom:10px;margin-bottom:16px">
        📬 Pesan Baru dari Portfolio
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <tr><td style="padding:6px 0;color:#666;width:80px"><strong>Nama</strong></td>
            <td style="padding:6px 0">${name}</td></tr>
        <tr><td style="padding:6px 0;color:#666"><strong>Email</strong></td>
            <td style="padding:6px 0"><a href="mailto:${email}" style="color:#4f46e5">${email}</a></td></tr>
        <tr><td style="padding:6px 0;color:#666"><strong>Subject</strong></td>
            <td style="padding:6px 0">${subject}</td></tr>
      </table>
      <h3 style="margin-bottom:8px">Pesan:</h3>
      <div style="background:#f5f5f5;border-left:4px solid #4f46e5;padding:14px 16px;border-radius:4px;line-height:1.6">
        ${safeMsg}
      </div>
      <p style="color:#aaa;font-size:12px;margin-top:24px">
        Dikirim dari form kontak portfolio · Balas email ini untuk merespons ${name}.
      </p>
    </div>`;
}
