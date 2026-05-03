import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body ?? {};

  if (!name || !email || !subject || !message) {
    res.status(400).json({ message: "Semua field wajib diisi." });
    return;
  }

  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPass  = process.env.SMTP_APP_PASSWORD;
  const toEmail   = process.env.CONTACT_TO_EMAIL || smtpEmail;

  if (!smtpEmail || !smtpPass) {
    req.log.warn("SMTP belum dikonfigurasi — SMTP_EMAIL atau SMTP_APP_PASSWORD kosong");
    res.status(503).json({ message: "Layanan email belum dikonfigurasi." });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: smtpEmail, pass: smtpPass },
    });

    await transporter.sendMail({
      from:    `"Portfolio Contact" <${smtpEmail}>`,
      to:      toEmail,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
          <h2 style="border-bottom:2px solid #eee;padding-bottom:10px;margin-bottom:16px">
            📬 Pesan Baru dari Portfolio
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr>
              <td style="padding:6px 0;color:#666;width:80px"><strong>Nama</strong></td>
              <td style="padding:6px 0">${name}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#666"><strong>Email</strong></td>
              <td style="padding:6px 0"><a href="mailto:${email}" style="color:#4f46e5">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#666"><strong>Subject</strong></td>
              <td style="padding:6px 0">${subject}</td>
            </tr>
          </table>
          <h3 style="margin-bottom:8px">Pesan:</h3>
          <div style="background:#f5f5f5;border-left:4px solid #4f46e5;padding:14px 16px;border-radius:4px;line-height:1.6">
            ${String(message).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>")}
          </div>
          <p style="color:#aaa;font-size:12px;margin-top:24px">
            Dikirim dari form kontak portfolio · Balas email ini untuk merespons ${name}.
          </p>
        </div>
      `,
    });

    req.log.info({ from: email, subject }, "Contact email sent");
    res.json({ message: "Pesan berhasil dikirim!" });
  } catch (err) {
    req.log.error({ err }, "Failed to send contact email");
    res.status(500).json({ message: "Gagal mengirim pesan. Coba lagi nanti." });
  }
});

export default router;
